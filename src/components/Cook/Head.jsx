import React, { useState } from "react";
import { DishInfo, Ingredients, Steps, Nutrition, Dietary } from "./index.js";
import { motion, AnimatePresence } from "framer-motion";
import "./cook_style.css";

export default function Head() {

    const [step, setStep] = useState(0);
    const [dishInfoData, setDishInfoData] = useState({
        dish_image_url: "",
        dish_name: "",
        dish_description: "",
        dish_difficulty: "",
    });
    const [dishIngredientsData, setDishIngredientsData] = useState([]);

    const handleDishInfoChange = (data) => {
        setDishInfoData(data);
        setStep(1);
    };

    const handleDishIngredientsChange = (data) => {
        setDishIngredientsData(data);
        setStep(2);
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center">

            <div className="w-full h-screen overflow-auto flex flex-col gap-1 scrollbar-hide py-30">

                <AnimatePresence mode="wait">

                    {step >= 0 && (
                        <motion.div
                            key="dish-info"
                            className="w-full flex items-center justify-center bg-red-300"
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
                            className="w-full flex items-center justify-center bg-orange-300"
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.6, ease: "easeInOut" }}
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
                            className="w-full flex items-center justify-center bg-blue-300"
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Steps />
                        </motion.div>
                    )}

                    {step >= 3 && (
                        <motion.div
                            key="nutrition"
                            className="w-full min-h-[600px] flex items-center justify-center"
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Nutrition />
                        </motion.div>
                    )}

                    {step >= 4 && (
                        <motion.div
                            key="dietary"
                            className="w-full min-h-[600px] flex items-center justify-center"
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Dietary />
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
