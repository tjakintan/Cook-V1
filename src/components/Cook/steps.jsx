import { useState, useRef, useEffect } from "react";
import "./cook_style.css";
import { motion } from "framer-motion";
import WobblyText from "../../hooks/wobbly_text";
import { title } from "process";

const Steps = ({ value, onPassToHead }) => {

    const [dish_steps, setDish_steps] = useState(
        Array.isArray(value?.dish_steps) && value.dish_steps.length > 0
            ? value.dish_steps
            : [{ step_number: 1, title: "", description: "", timer: null,
                image_url: "", tips: ""
            }] 
    );
    const [shake, setShake] = useState(dish_steps.map(() => false));

    return (
        <div className="w-full flex items-center justify-start flex-col gap-5 p-5">
            
            <h1 className="text-center tracking-widest font-bold text-[50px]">
                <WobblyText text="steps"/>
            </h1>

            {dish_steps.map((step, idx) => (
                <motion.div 
                    key={idx} 
                    className={`w-full h-[100px] md:w-1/2 rounded-[40px] bg-white shadow-lg flex overflow-hidden 
                                md:flex-row items-end md:items-center justify-center `}
                    animate={shake[idx] ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
                >

                    <div className="w-1/3 h-full bg-orange-400  flex items-center justify-center">

                    </div>

                    <motion.div 
                        layout 
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-1/3  h-full bg-red-300 flex flex-col p-3 cursor-pointer"
                    >

                    </motion.div>

                    <div className="w-1/3 flex items-center justify-center">

                    </div>

                </motion.div>
            ))}

            <div className="w-full h-1/5 flex items-center justify-center">
                <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                    className="next-section-button"
                >
                    dietary
                </motion.button>
            </div>

        </div>
    );
};

export default Steps;