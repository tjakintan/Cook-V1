import { useEffect, useState } from "react";
import { DishInfo, Ingredients, Steps, Nutrition, Dietary } from "./index.js";
import { motion, AnimatePresence } from "framer-motion";
import "./cook_style.css";
import { useUser } from "../../utils/user.jsx";
import { getUserSub } from "../../utils/auth.js";

export default function Head() {
    const { user } = useUser();
    const sub = getUserSub(user);
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
    };
    const handleDishDietaryChange = (data) => {
        setDishDietaryData(data.dish_dietary);
        setStep(4);
    };
    const handleDishNutritionChange = (data) => {
        setDishNutritionData(data);
    };

    useEffect(() => {
        if (!dishIngredientsData?.length) return;

        const timer = setTimeout(async () => {
            console.log("Ingredients: ", dishIngredientsData);
            try {
                const payload = { ingredients: dishIngredientsData };

                const res = await fetch("https://api.gomeal.org/autocalculatenutrition", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();
                if (typeof data.body === "string") {
                    data = JSON.parse(data.body);
                }
                if (res.ok) {
                    setNutritionResults(data.autoCalculatedNutrition);
                    console.log("results : ", data.autoCalculatedNutrition)
                } else {
                    console.error("API error:", data);
                }
            } catch (err) {
                console.error("Error fetching nutrition:", err);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [dishIngredientsData]);

    const payload = {
        dish_name: dishInfoData.dish_name || "",
        description: dishInfoData.dish_description || "",
        difficulty: dishInfoData.dish_difficulty || "",
        image_url: dishInfoData.dish_image_url || "",
        created_at: new Date().toISOString(),
        user_sub: sub,
        status: "active",
        status_created_on: new Date().toISOString(),
        ingredients: dishIngredientsData,
        steps: dishStepsData,
        nutrition: dishNutritionData,
        dietary: dishDietaryData,
        autoCalculateNutrition: false,
    };

    const sendToAPI = async () => console.log("payload:", payload);

    return (
        <div className="w-screen min-h-screen">

            <div className="w-screen h-screen flex flex-col justify-center overflow-y-auto scrollbar-hide">

                <AnimatePresence mode="wait">
                    {step >= 0 && (
                        <StepWrapper isActive={isActive(0)}>
                            <DishInfo value={dishInfoData} onPassToHead={handleDishInfoChange} />
                        </StepWrapper>
                    )}
                    {step >= 1 && (
                        <StepWrapper isActive={isActive(1)}>
                            <Ingredients 
                                value={dishIngredientsData} 
                                dish_name={dishInfoData.dish_name} 
                                dish_description={dishInfoData.dish_description}
                                onPassToHead={handleDishIngredientsChange} />
                        </StepWrapper>
                    )}
                    {step >= 2 && (
                        <StepWrapper isActive={isActive(2)}>
                            <Steps value={dishStepsData} onPassToHead={handleDishStepsChange} />
                        </StepWrapper>
                    )}
                    {step >= 3 && (
                        <StepWrapper isActive bgClass="bg-gradient-to-b from-white to-black/90">
                            <div className="flex flex-col gap-5">
                                <Dietary 
                                    value={dishDietaryData} 
                                    onPassToHead={handleDishDietaryChange} 
                                />

                                <Nutrition 
                                    nutritionResults={nutritionResults} 
                                    onPassToHead={handleDishNutritionChange} 
                                />
                            </div>
                        </StepWrapper>
                    )}
                    {step >= 4 && (
                        <motion.div
                            className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-black/90 to-black"
                        >
                            <svg
                                onClick={sendToAPI}
                                className="w-20 h-20 cursor-pointer text-white"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="0.5" fill="none" />
                                <line x1="12" y1="7" x2="12" y2="17" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
                                <line x1="7" y1="12" x2="17" y2="12" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
                            </svg>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

        </div>
    );
}

// Step wrapper with smooth slide animation
const StepWrapper = ({ children, isActive, bgClass, height }) => (
    <motion.div
        className={`w-screen 
                    ${bgClass}   
                    ${isActive ? "pointer-events-auto" : ""}`}
        variants={slideVariants}
        initial="initial"
        animate="animate"
        exit="exit"
    >
        {children}
    </motion.div>
);

const slideVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
};
