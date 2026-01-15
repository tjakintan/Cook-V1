import { useState, useRef, useEffect } from "react";
import "./cook_style.css";
import { motion } from "framer-motion";
import WobblyText from "../../hooks/wobbly_text";

const colors = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
    "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
    "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
    "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
    "bg-rose-500", "bg-red-400", "bg-orange-400", "bg-yellow-400",
    "bg-green-400", "bg-teal-400", "bg-cyan-400", "bg-blue-400",
    "bg-indigo-400", "bg-purple-400", "bg-pink-400", "bg-rose-400",
    "bg-lime-600", "bg-emerald-600"
];

const UnitDropDownMenu = ({ onSelectUnit }) => {

    const UNITS = [
        "empty","gram", "kg", "oz", "lb",
        "ml", "l", "tsp", "tbsp", "cup"
    ];

    return (
        <div className="rounded-xl flex overflow-x-auto scrollbar-hide touch-pan-x">
            {UNITS.map((unit, index) => (
                <div key={unit} className="flex flex-col items-center p-1">
                    <motion.div
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.95 }} 
                        className={`py-2 px-4 rounded-xl cursor-pointer ${colors[index]} text-center font-thin tracking-widest
                            ${unit === "empty" 
                                ? "bg-red-500 text-transparent rounded-[10px]" 
                                : ""}
                        `}
                        onClick={() => onSelectUnit(unit)}
                    >
                        {unit}
                    </motion.div>
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
        setDish_ingredients(prev => {
            const copy = [...prev];

            copy[idx] = {
                ...copy[idx],
                [field]: field === "unit" && value === "empty" ? "" : value
            };

            return copy;
        });
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

        onPassToHead({ dish_ingredients, autoCalculateNutrition: true });
    };

    return (
        <div className="flex items-center justify-start flex-col gap-5 p-5">
            
            <h1 className="text-center tracking-widest font-bold text-[50px]">
                <WobblyText text="ingredients"/>
            </h1>

            {dish_ingredients.map((ing, idx) => (

                <motion.div 
                    key={idx} 
                    className={`rounded-[40px]  flex overflow-hidden flex-col items-center justify-center py-1 px-3`}
                    animate={shake[idx] ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
                >
                    {showUnitDropdown[idx] && (
                        <div  
                            ref={el => {dropdownRef.current[idx] = el || undefined;}}
                            className={`flex p-1 overflow-x-auto max-w-70 md:max-w-150`}
                        >
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
                        </div>
                    )}

                    <div className={`flex`}>

                        <div className="flex items-center justify-center gap-5">

                            {/* Ingredient quantity & unit input */}
                            <div className="flex items-center justify-center space-x-2">
                                <input 
                                    className="w-[60px] h-[40px] bg-gray-100 rounded-[25px] flex items-center justify-center 
                                                px-3 cursor-pointer text-center text-sm font-thin tracking-wide
                                                placeholder:font-light placeholder:text-gray-300 placeholder:text-xs placeholder:italic
                                                "
                                    type="text"
                                    min="0"
                                    value={ing.quantity}
                                    placeholder="3.5g"
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
                                                flex flex-col items-center justify-center cursor-pointer 
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
                                        className={`w-3 h-3 ${ing.unit ? "hidden" : ""}`} 
                                        viewBox="0 0 24 24"
                                    >
                                        <g
                                            fill="none"
                                            stroke="red"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                        >
                                            <path d="M9 17.25a3 3 0 1 0 6 0a3 3 0 0 0-6 0m3-3v2.25" />
                                            <path d="M22.432 21.3A1.5 1.5 0 0 1 21 23.25H3a1.5 1.5 0 0 1-1.432-1.95l2.813-9a1.5 1.5 0 0 1 1.431-1.05h12.375a1.5 1.5 0 0 1 1.432 1.05zM3 .75a.75.75 0 0 0-.692 1.039a10.5 10.5 0 0 0 15.515 4.696a10.5 10.5 0 0 0 3.866-4.697A.75.75 0 0 0 21 .75zm6 7.065v3.435m6-3.435v3.435" />
                                        </g>
                                    </svg>

                                    <h1 className={`text-black text-sm font-thin tracking-widest ${ing.unit ? "" : "hidden"}`}>
                                        {ing.unit}
                                    </h1>

                                </motion.div>

                            </div>
                            
                            {/* Ingredient name input */}
                            <div className="flex items-center justify-center">
                                <input 
                                    className="w-[100px] md:w-[150px] h-[40px] bg-gray-100 rounded-[25px] flex items-center justify-center 
                                                px-3 cursor-pointer text-sm font-thin tracking-wide
                                                placeholder:font-light placeholder:text-gray-300 placeholder:text-xs placeholder:italic
                                                "
                                    type="text"
                                    value={ing.name}
                                    placeholder="rice"
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

                    </div>

                </motion.div>
            
            ))}

            <div className="w-full h-1/5 flex items-center justify-center">
                <motion.button 
                    animate={!dish_ingredients.some(ing => !ing.quantity.trim() || !ing.name.trim()) 
                        ? { y: [-5, 5] } 
                        : { y: 0 }}  
                    transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        repeatType: "reverse",  
                        ease: "easeInOut" 
                    }}
                    whileHover={{ scale: 1.05 }} 
                    className="next-section-button"
                    onClick={passToHead}
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <g id="evaArrowIosDownwardFill0">
                            <g id="evaArrowIosDownwardFill1">
                                <path id="evaArrowIosDownwardFill2" fill="#000000" d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15a1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16Z"/>
                            </g>
                        </g>
                    </svg>
                </motion.button>
            </div>

        </div>
    );
};

export default Ingredients;