import { useState, useRef, useEffect } from "react";
import "./cook_style.css";
import { motion } from "framer-motion";
import WobblyText from "../../hooks/wobbly_text";

const colors = [ 
    "bg-green-400", "bg-teal-400", "bg-cyan-400", "bg-blue-400",
    "bg-indigo-400", "bg-purple-400", "bg-pink-400", "bg-rose-400",
    "bg-lime-600", "bg-emerald-600"
];

const Dietary = ({ value, onPassToHead }) => {

    const [dish_dietary, setDish_dietary] = useState({
        vegetarian: value?.dish_dietary?.vegetarian || false,
        vegan: value?.dish_dietary?.vegan || false,
        gluten_free: value?.dish_dietary?.gluten_free || false,
        dairy_free: value?.dish_dietary?.dairy_free || false,
        nut_free: value?.dish_dietary?.nut_free || false,
        keto: value?.dish_dietary?.keto || false,
        halal: value?.dish_dietary?.halal || false,
        pescatarian: value?.dish_dietary?.pescatarian || false,
        kosher: value?.dish_dietary?.kosher || false,
        other: value?.dish_dietary?.other || ""
    });

    const toggleDiet = (key) => {
        setDish_dietary(prev => ({
        ...prev,
        [key]: !prev[key]
        }));
    };

    const dietaryKeys = Object.keys(dish_dietary);
    const rowConfig = [4, 3, 3];
    const getRows = () => {
        const rows = [];
        let start = 0;
        for (let count of rowConfig) {
        const row = dietaryKeys.slice(start, start + count);
        if (row.length) rows.push(row);
        start += count;
        }
        return rows;
    };

  const rows = getRows();
    return (
        <div className="flex flex-col gap-5 p-5 items-center justify-start">
            <h1 className="text-center tracking-widest font-bold text-[50px]">
                <WobblyText text="dietary"/>
            </h1>

            <div className="flex flex-col gap-4 w-full max-w-[1200px]">
                {rows.map((rowKeys, rowIdx) => (
                    <div key={rowIdx} className="flex justify-center gap-4 flex-wrap">
                        {rowKeys.map((key, idx) => (
                            <div 
                                key={key} 
                                className={`flex p-2 gap-1 
                                            overflow-hidden shadow-md flex flex-col rounded-lg
                                            ${colors[idx]}`}
                            >                        
                                {/* input checked box toggle */}
                                <div className="w-full h-1/2 flex justify-between space-x-10">
                                    <span className="text-white font-thin tracking-widest text-md capitalize">{key.replace("_", " ")}</span>

                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={dish_dietary[key]}
                                            onChange={() => toggleDiet(key)}
                                        />
                                        {/* Track */}
                                        <motion.div
                                            className="w-12 h-6 rounded-full bg-gray-300"
                                            animate={{ backgroundColor: dish_dietary[key] ? "#2563EB" : "#D1D5DB" }} 
                                            transition={{ duration: 0.2 }}
                                        />
                                        {/* Knob */}
                                        <motion.div
                                            className="absolute top-.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                                            animate={{ x: dish_dietary[key] ? 24 : 0 }} 
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    </label>
                                </div>

                                {/* input box information */}
                                <div className={`w-full h-full`}>  
                                </div>
                                
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dietary;