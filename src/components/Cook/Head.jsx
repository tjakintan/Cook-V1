import React, { useState } from "react";
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

    const handleDishInfoChange = (data) => {
        setDishInfoData(data);
        setStep(1);
    };

    const handleDishIngredientsChange = (data) => {
        setDishIngredientsData(data);
        setStep(2);
    };

    const handleDishStepsChange = (data) => {
        setDishStepsData(data);
        setStep(3);
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">

            <div className="w-full h-screen overflow-auto flex flex-col gap-5 scrollbar-hide pb-20 pt-20">

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
                            className={`w-full flex items-center justify-center ${
                                isActive(3) ? "pointer-events-auto" : ""
                            }`}
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Dietary />
                        </motion.div>
                    )}

                    {step >= 4 && (
                        <motion.div
                            key="dietary"
                            className={`w-full flex items-center justify-center ${
                                isActive(4) ? "pointer-events-auto" : ""
                            }`}
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Nutrition />
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
