import { useState, useRef, useEffect } from "react";
import "./cook_style.css";
import { motion } from "framer-motion";
import WobblyText from "../../hooks/wobbly_text";

const Nutrition = ({ value, onPassToHead }) => {

    const [dish_nutrition, setDish_nutrition] = useState(
        
        value?.dish_nutrition && Object.keys(value.dish_nutrition).length > 0
            ? value.dish_nutrition
            : {
                servings: "",
                calories_per_serving: "",
                protein_g: "",
                carbs_g: "",
                sugar_g: "",
                // optional(requires more implementation)
                fat_g: "",
                fiber_g: "",
                salt_mg: ""
            }
    );

    return (
        <div className="w-screen h-screen flex flex-col">
            <h1 className="text-center tracking-widest font-bold text-[50px]">
                <WobblyText text="nutrition"/>
            </h1>
            <div className="w-full h-full bg-blue-300">
                
            </div>
        </div>
    );
};

export default Nutrition;