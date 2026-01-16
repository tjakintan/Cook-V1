const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Client } = require("pg");
const { INSERT_POST } = require("./sql.js");
const multer = require("multer"); // for parsing multipart/form-data

const {
  S3_BUCKET_NAME,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  
} = process.env;

const s3 = new S3Client({ region: "us-east-2" });
const upload = multer(); // store files in memory

// Upload a file buffer to S3 and return public URL
const uploadToS3 = async (fileBuffer, fileName, contentType) => {
  const s3Key = `posts/${Date.now()}-${fileName}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: "public-read"
    })
  );
  return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
};

// Default nutrition keys
const defaultNutrition = {
  servings: 1,
  calories_per_serving: 0,
  protein_g: 0,
  carbs_g: 0,
  sugar_g: 0,
  fat_g: 0,
  saturated_fat_g: 0,
  fiber_g: 0,
  cholesterol_mg: 0,
  sodium_mg: 0,
  calories_per_100g: 0,
  water_g: 0
};

// FDC Nutrition API
const FDC_API_KEY = "9JZq0cbl3c6PQoLLwyCyB3dVtq8SdfyqpaUuiAyO";

const fetchNutritionInfo = async (ingredients) => {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
        ingredients
      )}&pageSize=1&api_key=${FDC_API_KEY}`
    );
    const data = await response.json();
    if (!data.foods || data.foods.length === 0) return null;

    const nutrients = {};
    const food = data.foods[0];

    for (const n of food.foodNutrients) {
      switch (n.nutrientName) {
        case "Energy":
          nutrients.calories_per_100g = n.value;
          break;
        case "Protein":
          nutrients.protein_per_100g = n.value;
          break;
        case "Carbohydrate, by difference":
          nutrients.carbs_per_100g = n.value;
          break;
        case "Sugars, total including NLEA":
        case "Sugars, total":
          nutrients.sugar_per_100g = n.value;
          break;
        case "Total lipid (fat)":
          nutrients.fat_per_100g = n.value;
          break;
        case "Fatty acids, total saturated":
          nutrients.saturated_fat_g = n.value;
          break;
        case "Fiber, total dietary":
          nutrients.fiber_g = n.value;
          break;
        case "Cholesterol":
          nutrients.cholesterol_mg = n.value;
          break;
        case "Sodium, Na":
          nutrients.sodium_mg = n.value;
          break;
        case "Water":
          nutrients.water_g = n.value;
          break;
      }
    }
    return nutrients;
  } catch (err) {
    console.error("Error fetching nutrition info:", err);
    return null;
  }
};

// Express-style handler (expects multipart/form-data with files)
exports.handler = upload.any(); // parse files in memory

exports.handler = async (req, res) => {
  let client;
  try {
    const body = req.body;
    const files = req.files; // multer gives you the actual file objects

    const {
      dish_name,
      description,
      difficulty,
      user_sub,
      ingredients,
      steps,
      nutrition,
      dietary,
      autoCalculateNutrition
    } = body;

    if (autoCalculateNutrition) {
      try {
        const finalIngredients = ingredients ? JSON.parse(ingredients) : [];
    
        // Fetch nutrition info for each ingredient individually
        const nutritionResults = await Promise.all(
          finalIngredients.map(async (ing) => {
            if (!ing.name) return null;
            const nutritionData = await fetchNutritionInfo(ing.name);
            return {
              ...ing,
              nutrition: nutritionData || {}
            };
          })
        );
    
        // Return JSON directly with 200 status
        return res.status(200).json({ autoCalculatedNutrition: nutritionResults.filter(Boolean) });
      } catch (err) {
        console.error("Error fetching nutrition info:", err);
        return res.status(500).json({ error: "Failed to fetch nutrition info", details: err.message });
      }
    }    

    // Upload main image
    const mainFile = files.find(f => f.fieldname === "mainFile");
    const image_url = mainFile
      ? await uploadToS3(mainFile.buffer, mainFile.originalname, mainFile.mimetype)
      : "";

    // Parse steps array
    let parsedSteps = steps ? JSON.parse(steps) : [];
    // Upload step images
    parsedSteps = await Promise.all(
      parsedSteps.map(async (step, index) => {
        const stepFile = files.find(f => f.fieldname === `stepFile_${index}`);
        if (stepFile) {
          step.image_url = await uploadToS3(stepFile.buffer, stepFile.originalname, stepFile.mimetype);
        }
        return step;
      })
    );

    // Ensure ingredients array
    const finalIngredients = ingredients ? JSON.parse(ingredients) : [{ quantity: "", unit: "", name: "" }];
    // Nutrition
    let finalNutrition = { ...defaultNutrition, ...(nutrition ? JSON.parse(nutrition) : {}) };

    // Dietary
    const parsedDietary = dietary ? JSON.parse(dietary) : {};
    const finalDietary = {
      vegetarian: parsedDietary.vegetarian || false,
      vegan: parsedDietary.vegan || false,
      gluten_free: parsedDietary.gluten_free || false,
      dairy_free: parsedDietary.dairy_free || false,
      nut_free: parsedDietary.nut_free || false,
      keto: parsedDietary.keto || false,
      halal: parsedDietary.halal || false,
      pescatarian: parsedDietary.pescatarian || false,
      kosher: parsedDietary.kosher || false,
      other: parsedDietary.other || ""
    };

    client = new Client({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT || 5432,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    const result = await client.query(
      INSERT_POST,
      [
        dish_name,
        description,
        difficulty,
        image_url,
        new Date().toISOString(),
        user_sub,
        "active",
        new Date().toISOString(),
        JSON.stringify(finalIngredients),
        JSON.stringify(parsedSteps),
        JSON.stringify(finalNutrition),
        JSON.stringify(finalDietary)
      ]
    );

    return res.json({ status: "success", post: result.rows[0] });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  } finally {
    if (client) await client.end();
  }
};
