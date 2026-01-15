import { useState, useRef, useEffect } from "react";
import "./cook_style.css";
import { motion } from "framer-motion";
import WobblyText from "../../hooks/wobbly_text";

const colors = [
    "bg-green-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-rose-500",
    "bg-lime-500",
    "bg-emerald-500"
];

const emptyNutrition = {
    calories_per_100g: 0,
    protein_per_100g: 0,
    carbs_per_100g: 0,
    sugar_per_100g: 0,
    fat_per_100g: 0,
    saturated_fat_g: 0,
    fiber_g: 0,
    cholesterol_mg: 0,
    sodium_mg: 0,
    water_g: 0
};

const Nutrition = ({ value, onPassToHead, nutritionResults }) => {

    const [dish_nutrition, setDish_nutrition] = useState(emptyNutrition);
    const [baseNutrition, setBaseNutrition] = useState(emptyNutrition);
    const [servings, setServings] = useState(1);

    const increaseServings = () => {
        setServings(prev => prev + 1);
    };

    const decreaseServings = () => {
        setServings(prev => Math.max(1, prev - 1));
    };

    useEffect(() => {
        if (!nutritionResults || nutritionResults.length === 0) return;

        const totals = nutritionResults.reduce((acc, ing) => {
            const qty = parseFloat(ing.quantity) || 0;
            const nutrition = ing.nutrition || {};
            const factor = qty / 100;

            acc.calories_per_100g += (nutrition.calories_per_100g || 0) * factor;
            acc.protein_per_100g += (nutrition.protein_per_100g || 0) * factor;
            acc.carbs_per_100g += (nutrition.carbs_per_100g || 0) * factor;
            acc.sugar_per_100g += (nutrition.sugar_per_100g || 0) * factor;
            acc.fat_per_100g += (nutrition.fat_per_100g || 0) * factor;
            acc.saturated_fat_g += (nutrition.saturated_fat_g || 0) * factor;
            acc.fiber_g += (nutrition.fiber_g || 0) * factor;
            acc.cholesterol_mg += (nutrition.cholesterol_mg || 0) * factor;
            acc.sodium_mg += (nutrition.sodium_mg || 0) * factor;
            acc.water_g += (nutrition.water_g || 0) * factor;

            return acc;
        }, { ...emptyNutrition });

        setBaseNutrition(totals);
    }, [nutritionResults]);

    useEffect(() => {
        const scaled = Object.fromEntries(
            Object.entries(baseNutrition).map(([key, val]) => [
                key,
                val * servings
            ])
        );

        setDish_nutrition(scaled);

        if (onPassToHead) {
            onPassToHead(scaled);
        }
    }, [servings, baseNutrition]);

    const displayRow = (label, value, unit = "g", index = 0) => (
        <div className="flex justify-between items-center">
            <div className={`font-medium py-1 px-2 rounded-lg ${colors[index % colors.length]}`}>{label}</div>
            <span className="font-bold pr-5 tracking-wider">
                {Number(value).toFixed(1)}
                <span className="text-sm font-medium ml-[0.25px]">{unit}</span>
            </span>
        </div>
    );

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-white/80 to-black/90">

            <div className="flex p-2 flex flex-col gap-1 outline-2 bg-white">

                <h1 className="tracking-widest font-bold text-[50px]">
                    <WobblyText text="nutrition"/>
                </h1>

                <div className="h-[1px] bg-black"></div>

                <div className="flex justify-between p-1 items-center">
                    <div className="tracking-wider text-[20px] font-bold">
                        Servings
                    </div>
                    <div className="gap-3 flex items-center">
                        <svg onClick={increaseServings} className="w-6 h-6 cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1" fill="none"/>
                            <line x1="12" y1="7" x2="12" y2="17" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                            <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                        </svg>
                        <h1 className="font-bold text-center text-2xl">
                            {servings}
                        </h1>
                        <svg onClick={decreaseServings} className={`${servings === 1 ? "opacity-20 pointer-events-none" : "" } w-6 h-6 cursor-pointer`} viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1" fill="none"/>
                            <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>

                <div className="h-[10px] bg-black"></div>

                <div className="flex justify-between items-center text-[25px] font-extrabold mb-2">
                    <span>Calories</span>
                    <span className="">
                        {Math.round(dish_nutrition.calories_per_100g)}
                        <span className="text-sm font-medium ml-[0.25px]">kcal</span>
                    </span>
                </div>

                <div className="h-[5px] bg-black"></div>

                <div className="flex flex-col gap-3">
                    {[
                        ["Protein", dish_nutrition.protein_per_100g],
                        ["Carbohydrates", dish_nutrition.carbs_per_100g],
                        ["Sugars", dish_nutrition.sugar_per_100g],
                        ["Fat", dish_nutrition.fat_per_100g],
                        ["Saturated Fat", dish_nutrition.saturated_fat_g],
                        ["Fiber", dish_nutrition.fiber_g],
                        ["Cholesterol", dish_nutrition.cholesterol_mg, "mg"],
                        ["Sodium", dish_nutrition.sodium_mg, "mg"]
                    ].map(([label, val, unit], idx) => 
                        displayRow(label, val, unit || "g", idx)
                    )}
                </div>
            </div>

        </div>
    );
};

export default Nutrition;