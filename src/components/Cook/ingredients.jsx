import { useState, useRef, useEffect } from "react";
import "./cook_style.css";
import { motion } from "framer-motion";
import WobblyText from "../../hooks/wobbly_text";

const UnitDropDownMenu = ({ onSelectUnit }) => {

    const UNITS = [
        "empty","gram", "kg", "oz", "lb",
        "ml", "l", "tsp", "tbsp", "cup",
        "whole", "clove", "slice", "pinch", "taste"
    ];

    return (
        <div onClick={(e) => e.stopPropagation()} className="absolute top-full mt-5 mr-5 -left-1/2 w-[60px] bg-white rounded-[10px] shadow-md z-50 overflow-y-auto max-h-60 scrollbar-hide">
            {UNITS.map((unit, index) => (
                <div key={unit} className="flex flex-col items-center  bg-white hover:bg-gray-100 p-1">
                    <motion.div
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.95 }} 
                        className={`py-2  cursor-pointer w-full text-center font-light tracking-wider italic
                            ${unit === "empty" 
                                ? "bg-red-500 text-transparent rounded-[10px] hover:bg-red-600 " 
                                : "hover:bg-gray-50"}
                        `}
                        onClick={() => onSelectUnit(unit)}
                    >
                        {unit}
                    </motion.div>

                    {index !== UNITS.length - 1 && (
                        <div className={`w-4/5 border-t border-gray-300 ${unit === "empty" ? "hidden" : ""}`} />
                    )}
                </div>
            ))}
        </div>
    );
};

const Ingredients = ({ value, onPassToHead }) => {

    const [dish_ingredients, setDish_ingredients] = useState(
        Array.isArray(value?.dish_ingredients) && value.dish_ingredients.length > 0
            ? value.dish_ingredients
            : [{ quantity: "", unit: "", name: "" }] 
    );
    const dropdownRef = useRef([]);
    const [showUnitDropdown, setShowUnitDropdown] = useState(dish_ingredients.map(() => false));
    const [shake, setShake] = useState(dish_ingredients.map(() => false));
    const [showNextBox, setShowNextBox] = useState(dish_ingredients.map(() => false));

    const addIngredient = () => {

        const lastIdx = dish_ingredients.length - 1;

        setDish_ingredients(prev => [...prev, { quantity: "", unit: "", name: "" }]);
        setShowUnitDropdown(prev => [...prev, false]); 
        setShake(prev => [...prev, false]);
        setShowNextBox(prev => {
            const copy = [...prev];
            copy[lastIdx] = true; 
            copy.push(false);
            return copy;
        });
    };

    const updateIngredient = (idx, field, value) => {
        const updated = [...dish_ingredients];
        if (field === "unit" && value === "empty") {updated[idx][field] = "";} else { updated[idx][field] = value;}
        setDish_ingredients(updated);
    };

    const removeIngredient = (idx) => {
        const updated = dish_ingredients.filter((_, i) => i !== idx);
        setDish_ingredients(updated);
        setShowUnitDropdown(showUnitDropdown.filter((_, i) => i !== idx));
        setShake(prev => prev.filter((_, i) => i !== idx));
        setShowNextBox(showNextBox.filter((_, i) => i !== idx));
    };

    useEffect(() => {

        const handleClickOutside = (event) => {

            dropdownRef.current.forEach((ref, idx) => {
            if (ref && !ref.contains(event.target)) {
                setShowUnitDropdown(prev => {
                const copy = [...prev];
                copy[idx] = false;  
                return copy;
                });
            }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const triggerShake = (indices) => {
        setShake(prev => {
            const copy = [...prev];
            indices.forEach(idx => copy[idx] = true);
            return copy;
        });

        setTimeout(() => {
            setShake(prev => {
            const copy = [...prev];
            indices.forEach(idx => copy[idx] = false);
            return copy;
            }, 500);
        });
    };

    const passToHead = () => {
        const invalid = dish_ingredients
            .map((ing, idx) => (!ing.quantity.trim() || !ing.name.trim() ? idx : null))
            .filter(idx => idx !== null);

        if (invalid.length > 0) {
            triggerShake(invalid); 
            return;
        }

        onPassToHead({ dish_ingredients });
    };

    return (
        <div className="w-full flex items-center justify-start flex-col gap-5 p-5">
            
            <h1 className="text-center tracking-widest font-bold text-[50px]">
                <WobblyText text="ingredients"/>
            </h1>

            {dish_ingredients.map((ing, idx) => (

                <motion.div 
                    key={idx} 
                    className={`rounded-[40px] bg-white shadow-lg flex items-center justify-center p-1`}
                    animate={shake[idx] ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
                >
                    <div className="w-full h-full flex items-center justify-center gap-5">

                        {/* Ingredient quantity & unit input */}
                        <div className="flex items-center justify-center space-x-2">
                            <input 
                                className="w-[60px] h-[40px] bg-gray-100 rounded-[25px] 
                                            px-3 cursor-pointer text-center
                                            placeholder-italic placeholder:font-light placeholder:tracking-wider placeholder:text-sm placeholder:italic
                                            "
                                type="text"
                                min="0"
                                value={ing.quantity}
                                placeholder="quantity, e.g 400g"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*\.?\d*$/.test(val)) {
                                        updateIngredient(idx, "quantity", val);
                                    }
                                }}
                            />

                            <motion.div 
                                ref={el => {
                                    dropdownRef.current[idx] = el || undefined;  
                                }}
                                className={`relative h-[40px] rounded-md 
                                            flex items-center justify-center cursor-pointer 
                                            ${ing.unit ? "" : ""}`}
                                onClick={() => {
                                    setShowUnitDropdown(prev => {
                                        const copy = [...prev];
                                        copy[idx] = !copy[idx];
                                        return copy;
                                    });
                                }}
                            >

                                <svg 
                                    className={`w-4 h-4 ${ing.unit ? "hidden" : ""}`} viewBox="0 0 24 24" fill="#000000"
                                >
                                    <g fill="none" 
                                    stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                                        <path d="M9 17.25a3 3 0 1 0 6 0a3 3 0 0 0-6 0m3-3v2.25"/><path  d="M22.432 21.3A1.5 1.5 0 0 1 21 23.25H3a1.5 1.5 0 0 1-1.432-1.95l2.813-9a1.5 1.5 0 0 1 1.431-1.05h12.375a1.5 1.5 0 0 1 1.432 1.05zM3 .75a.75.75 0 0 0-.692 1.039a10.5 10.5 0 0 0 15.515 4.696a10.5 10.5 0 0 0 3.866-4.697A.75.75 0 0 0 21 .75zm6 7.065v3.435m6-3.435v3.435"/>
                                    </g>
                                </svg>

                                <h1 className={`text-sm opacity-75 font-light italic tracking-widest ${ing.unit ? "" : "hidden"}`}>
                                    {ing.unit === "empty" ? "" : ing.unit}
                                </h1>

                                {showUnitDropdown[idx] && (
                                    <UnitDropDownMenu
                                        onSelectUnit={(unit) => {
                                            updateIngredient(idx, "unit", unit);
                                            setShowUnitDropdown(prev => {
                                                const copy = [...prev]; 
                                                copy[idx] = false; 
                                                return copy;
                                            });
                                        }}
                                    />
                                )}

                            </motion.div>

                        </div>
                        
                        {/* Ingredient name input */}
                        <div className="flex items-center justify-center">
                            <input 
                                className="w-[100px] h-[40px] bg-gray-100 rounded-[25px] flex items-center justify-center 
                                            px-3 cursor-pointer text-center
                                            placeholder-italic placeholder:font-light placeholder:tracking-wider placeholder:text-sm placeholder:italic
                                            "
                                type="text"
                                value={ing.name}
                                placeholder="ingredient name"
                                onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                            />
                        </div>

                    </div>

                    {/* Add ingredient button */}
                    {idx === dish_ingredients.length - 1  && (
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.9 }}
                            className="ingredient-button"
                            onClick={() => addIngredient(idx)}
                        >
                            <img
                                src="/add_ingredient.svg"
                                className="w-12 h-12"
                                alt="Add ingredient"
                            />
                        </motion.div>
                    )}

                    {/* remove ingredient button */}
                    { showNextBox[idx] && ( 
                        <motion.div 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.90 }} 
                            className="ingredient-button"
                            onClick={() => removeIngredient(idx)}  
                        >
                            <img 
                                src="/remove_ingredient.svg" 
                                className="w-12 h-12"
                            />
                        </motion.div>
                    )}

                </motion.div>
            
            ))}

            <div className="w-full h-1/5 flex items-center justify-center">
                <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                    className="next-section-button"
                    onClick={passToHead}
                >steps
                </motion.button>
            </div>

        </div>
    );
};

export default Ingredients;