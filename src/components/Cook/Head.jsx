import React, { useEffect, useState } from "react";
import { DishInfo, Ingredients, Steps, Nutrition, Dietary } from "./index.js";
import { motion, AnimatePresence } from "framer-motion";
import "./cook_style.css";

export default function Head() {

    const [step, setStep] = useState(0);
    const isActive = (index) => step === index;
    const [dishInfoData, setDishInfoData] = useState({
        dish_image_url: "",
        dish_name: "",
        dish_description: "",
        dish_difficulty: "",
    });
    const [dishIngredientsData, setDishIngredientsData] = useState([]);
    const [dishStepsData, setDishStepsData] = useState([]);
    const [dishDietaryData, setDishDietaryData] = useState([]);
    const [nutritionResults, setNutritionResults] = useState([]);
    const [dishNutritionData, setDishNutritionData] = useState([]);

    const handleDishInfoChange = (data) => {
        setDishInfoData(data);
        setStep(1);
    };

    const handleDishIngredientsChange = (data) => {
        setDishIngredientsData(data.dish_ingredients);
        setStep(2);
    };

    const handleDishStepsChange = (data) => {
        setDishStepsData(data.dish_steps);
        setStep(3);
    }

    const handleDishDietaryChange = (data) => {
        setDishDietaryData(data.dish_dietary); 
        setStep(4);
    };

    useEffect(() => {

        const handleAutoCalculateNutrition = async () => {

            if (!dishIngredientsData || dishIngredientsData.length === 0) return;

            try {
                const payload = {
                    autoCalculateNutrition: true,
                    ingredients: dishIngredientsData || []
                };
                console.log("Sending ingredients:", payload);
                const response = await fetch(" https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/upload", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (response.ok) {
                    console.log("Nutrition results:", data.autoCalculatedNutrition);
                    setNutritionResults(data.autoCalculatedNutrition);
                } else {
                    console.log("Error calculating")
                }
            }   catch (err){
                console.error("network");
            }

        };

        handleAutoCalculateNutrition();
  
    }, [dishIngredientsData]);

    const handleDishNutritionChange = (data) => {
        setStep(5);
        setDishNutritionData(data)
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center">

            <div className={`w-full h-screen overflow-auto flex flex-col scrollbar-hide ${step === 5 ? "" : "gap-10 pb-20"} pt-20`}>

                <AnimatePresence mode="wait">

                    {step >= 0 && (
                        <motion.div
                            key="dish-info"
                            className={`w-full flex items-center justify-center ${
                                isActive(0) ? "pointer-events-auto" : ""
                            }`}
                        >
                            <DishInfo
                                value={dishInfoData}
                                onPassToHead={handleDishInfoChange}
                            />
                        </motion.div>
                    )}

                    {step >= 1 && (
                        <motion.div
                            key="ingredients"
                            className={`w-full flex items-center justify-center ${
                                isActive(1) ? "pointer-events-auto" : ""
                            }`}
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Ingredients
                                value={dishIngredientsData}
                                onPassToHead={handleDishIngredientsChange}
                            />
                        </motion.div>
                    )}

                    {step >= 2 && (
                        <motion.div
                            key="steps"
                            className={`w-full flex items-center justify-center ${
                                isActive(2) ? "pointer-events-auto" : ""
                            }`}
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Steps 
                                value={dishStepsData}
                                onPassToHead={handleDishStepsChange}
                            />
                        </motion.div>
                    )}

                    {step >= 3 && (
                        <motion.div
                            key="nutrition"
                            className={`flex items-center justify-center bg-gradient-to-b from-white to-white/80 ${
                                isActive(3) ? "pointer-events-auto" : ""
                            }`}
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Dietary 
                                value={dishDietaryData}
                                onPassToHead={handleDishDietaryChange}
                            />
                        </motion.div>
                    )}

                    {step >= 4 && (
                        <motion.div
                            key="dietary"
                            className={`w-full flex items-center justify-center bg-gradient-to-b from-white/80 to-black/90 ${
                                isActive(4) ? "pointer-events-auto" : ""
                            }`}
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Nutrition 
                                nutritionResults={nutritionResults} 
                                onPassToHead={handleDishNutritionChange}
                            />
                        </motion.div>
                    )}

                    {step >= 5 && (
                        <motion.div className="w-full flex bg-gradient-to-b from-black/90 to-black">
                            <div className="w-screen h-screen flex flex-col items-center justify-center gap-5">

                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>

            </div>
        </div>
    );
}

const slideVariants = {
    initial: { y: "100vh", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100vh", opacity: 0 },
};
