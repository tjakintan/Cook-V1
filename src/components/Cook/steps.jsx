import { useState, useRef, useEffect } from "react";
import "./cook_style.css";
import { motion } from "framer-motion";
import WobblyText from "../../hooks/wobbly_text";

const CircleSlider = ({ size, color, value, max, onChange, label }) => {
    const svgRef = useRef(null);
    const circleRef = useRef(null);
    const dotRef = useRef(null);
    const dragging = useRef(false);
    const prevValue = useRef(value);
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const angleToValue = (angle) => Math.round((angle / 360) * max);

    const updateVisual = (val) => {
        const progress = (val / max) * circumference;
        if (circleRef.current) {
            circleRef.current.style.strokeDashoffset = circumference - progress;
            circleRef.current.style.transform = `rotate(-90deg)`;
            circleRef.current.style.transformOrigin = '50% 50%';
        }
        if (dotRef.current) {
            const rad = (val / max) * 2 * Math.PI - Math.PI / 2;
            const x = size / 2 + radius * Math.cos(rad);
            const y = size / 2 + radius * Math.sin(rad);
            dotRef.current.setAttribute("cx", x);
            dotRef.current.setAttribute("cy", y);
        }
    };

    const handlePointerMove = (e) => {
        if (!dragging.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const x = e.clientX ?? e.touches?.[0]?.clientX;
        const y = e.clientY ?? e.touches?.[0]?.clientY;

        let angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;
        angle = angle < 0 ? 360 + angle : angle;

        let val = angleToValue(angle);

        const prev = prevValue.current;
        if (val >= prev || (prev > max * 0.9 && val < max * 0.1)) {
            prevValue.current = val;
            onChange(val);
            updateVisual(val);
        }
    };

    const handlePointerUp = () => {
        dragging.current = false;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
    };

    const handlePointerDown = (e) => {
        dragging.current = true;
        handlePointerMove(e);
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    };

    useEffect(() => {
        updateVisual(value);
        prevValue.current = value;
    }, [value]);

    return (
        <svg
            ref={svgRef}
            width={size}
            height={size}
            onPointerDown={handlePointerDown}
            className="cursor-pointer"
        >
            {/* Define glow filter */}
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background Circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#eeeeeeff"
                strokeWidth="8"
                fill="none"
            />

            {/* Progress Circle with glow */}
            <circle
                ref={circleRef}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                strokeLinecap="round"
                filter="url(#glow)"
            />

            {/* Dot with glow */}
            <circle
                ref={dotRef}
                r="10"
                fill={color}
                filter="url(#glow)"
            />

            {/* Value Text */}
            <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.2}
                fontWeight="500"
                fill="#111"
            >
                {String(value).padStart(2, "0")}
            </text>

            {/* Label Text */}
            <text
                x="50%"
                y="65%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.08}
                fontWeight="300"
                fill="#111"
                letterSpacing="2"
            >
                {label.toUpperCase()}
            </text>
        </svg>
    );
};

const Steps = ({ value, onPassToHead }) => {

    const [dish_steps, setDish_steps] = useState(
        Array.isArray(value?.dish_steps) && value.dish_steps.length > 0
            ? value.dish_steps
            : [{ step_number: 1, title: "", description: "", timer: null,
                image_url: "", tips: ""
            }] 
    );
    const [shake, setShake] = useState(dish_steps.map(() => false));
    const [showTimer, setShowTimer] = useState(dish_steps.map(() => false));
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [showNextBox, setShowNextBox] = useState(dish_steps.map(() => false));

    const updateTimer = (idx) => {

        setDish_steps(prev => {
            const newSteps = [...prev];
            newSteps[idx].timer = {
                hours,
                minutes,
                seconds
            };
            return newSteps;
        });

        setShowTimer(prev => {
            const newShow = [...prev];
            newShow[idx] = false;
            return newShow;
        });

        setHours(0);
        setMinutes(0);
        setSeconds(0);
    };

    const addSteps = (idx) => {

        const lastIdx = dish_steps.length - 1;

    };

    const updateStep = (idx, field, value) => {
        const updated = [...dish_steps];
        if (field === "unit" && value === "empty") {updated[idx][field] = "";} else { updated[idx][field] = value;}
        setDish_steps(updated);
    };

    return (
        <div className="w-full flex items-center justify-start flex-col gap-5 p-5">
            
            <h1 className="text-center tracking-widest font-bold text-[50px]">
                <WobblyText text="steps"/>
            </h1>

            {dish_steps.map((step, idx) => (
                
                <motion.div 
                    key={idx} 
                    className={`rounded-[40px] bg-white shadow-xl shadow-lg flex overflow-hidden 
                                flex-col md:flex-row p-3
                                items-start md:items-center justify-center gap-1`}
                    animate={shake[idx] ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
                >
                    <h1 className="flex items-center justify-center 
                                font-bold leading-none
                                text-[clamp(2rem,5vw,3rem)]"
                    >
                        {step.step_number}
                    </h1>

                    <div className={`${showTimer[idx] ? "hidden" : ""} min-w-[200px] h-[40px] flex cursor-pointer p-1 gap-1`}>

                        <motion.div 
                            layout
                            className="flex items-center justify-center pr-2"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                            <svg 
                                className="w-5 h-5"
                                viewBox="0 0 24 24">
                                    <path fill="#000000" fill-rule="evenodd" d="M7 3a4.002 4.002 0 0 1 3.874 3H19v2h-8.126A4.002 4.002 0 0 1 3 7a4 4 0 0 1 4-4Zm0 6a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm10 11a4.002 4.002 0 0 1-3.874-3H5v-2h8.126A4.002 4.002 0 0 1 21 16a4 4 0 0 1-4 4Zm0-2a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" clip-rule="evenodd"/>
                            </svg>
                        </motion.div>

                        <div className=" w-full h-full">
                            <input 
                                className="w-full h-full bg-gray-100 rounded-[25px] flex items-center justify-center 
                                            px-3 cursor-pointer 
                                            placeholder:font-light placeholder:text-gray-300 placeholder:text-xs placeholder:italic
                                            "
                                type="text"
                                value={step.description}
                                placeholder={`what did you do ${step.step_number === 1 ? "first" : "next"} ?`}
                                onChange={(e) => updateStep(idx, "description", e.target.value)}
                            />
                        </div>

                    </div>

                    <div className="flex p-1">

                        {showTimer[idx] && (
                            <div className="flex items-center justify-center p-5">
                                <div className="bg-gray-100 flex flex-col items-center md:items-start justify-center rounded-[30px] overflow-hidden space-y-2 px-3 py-2">
                                    <div className="w-full h-full flex flex-col md:flex-row gap-1 md:gap-5 items-center justify-center">
                                        <CircleSlider size={100} color="red" value={hours} max={24} onChange={setHours} label="hours"/>
                                        <CircleSlider size={100} color="yellow" value={minutes} max={60} onChange={setMinutes} label="minutes"/>
                                        <CircleSlider size={100} color="green" value={seconds} max={60} onChange={setSeconds} label="seconds"/>
                                    </div> 
                                    <button 
                                        className={`p-3 cursor-pointer text-white tracking-widest font-light
                                                    ${hours || minutes || seconds ? "bg-black cursor-pointer" : "bg-gray-200 pointer-events-none"}
                                                    rounded-[30px] flex items-center justify-center`}
                                        disabled={!(hours || minutes || seconds)}
                                        onClick={() => {updateTimer(idx)}}
                                    >
                                        + timer
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="w-full flex gap-3">
                        
                            <div className={`flex ${showTimer[idx] ? "items-start pt-2" : "items-center justify-center"} justify-center`}>
                                <svg 
                                    className={`
                                        w-7 h-7 cursor-pointer 
                                        
                                    `}          
                                    onClick={() => setShowTimer(prev => {
                                        const newShowTimer = [...prev];
                                        newShowTimer[idx] = !newShowTimer[idx];
                                        return newShowTimer;
                                    })}                          
                                    viewBox="0 0 64 64"
                                >
                                    <path fill="#e44d3cff" d="M31.999 3C15.431 3 2 18.711 2 38.094C2 57.475 15.431 61 31.999 61S62 57.475 62 38.094C62 18.711 48.567 3 31.999 3zM32 50.152c-12.416 0-22.479-10.215-22.479-22.816S19.584 4.52 32 4.52c12.414 0 22.479 10.215 22.479 22.816S44.414 50.152 32 50.152z"/>
                                    <ellipse cx="22.404" cy="43.955" fill="#000000" rx="1.308" ry="1.289" transform="rotate(-59.987 22.407 43.957)"/>
                                    <ellipse cx="41.595" cy="10.715" fill="#000000" rx="1.308" ry="1.289" transform="rotate(119.993 41.595 10.714)"/>
                                    <ellipse cx="15.379" cy="36.932" fill="#000000" rx="1.29" ry="1.307" transform="rotate(-119.98 15.38 36.932)"/>
                                    <ellipse cx="48.62" cy="17.74" fill="#000000" rx="1.308" ry="1.289" transform="rotate(149.979 48.621 17.741)"/>
                                    <ellipse cx="12.808" cy="27.336" fill="#000000" rx="1.308" ry="1.289"/>
                                    <ellipse cx="51.191" cy="27.336" fill="#000000" rx="1.309" ry="1.289"/>
                                    <ellipse cx="15.379" cy="17.739" fill="#000000" rx="1.289" ry="1.31" transform="rotate(120.006 15.379 17.738)"/>
                                    <ellipse cx="48.621" cy="36.931" fill="#000000" rx="1.289" ry="1.308" transform="rotate(-59.979 48.622 36.932)"/><ellipse cx="22.404" cy="10.715" fill="#000000" rx="1.308" ry="1.289" transform="rotate(59.974 22.403 10.714)"/>
                                    <path fill="#000000" d="M40.941 42.822a1.3 1.3 0 0 0-.463 1.779a1.297 1.297 0 0 0 1.771.486c.615-.354.824-1.15.461-1.775a1.298 1.298 0 0 0-1.769-.49"/>
                                    <ellipse cx="32" cy="8.145" fill="" rx="1.289" ry="1.309"/>
                                    <ellipse cx="32" cy="46.527" fill="#000000" rx="1.289" ry="1.309"/>
                                    <path fill="#000000" d="M33.484 11.411c7.32.743 13.033 6.926 13.033 14.442c0 8.018-6.5 14.518-14.519 14.518s-14.518-6.5-14.518-14.518c0-7.517 5.712-13.699 13.032-14.442C22.375 12.161 16 19.001 16 27.336c0 8.836 7.162 16 15.999 16S48 36.172 48 27.336c0-8.335-6.376-15.175-14.516-15.925"/>
                                    <path 
                                        className={`
                                            transition-transform duration-300 ease-in-out
                                            transform-box-fill origin-center scale-y-80
                                            ${showTimer[idx] ? "-rotate-90" : "rotate-0"}
                                        `}               
                                        fill="#000000" 
                                        d="M32 11.336c-2.721 0-4.926 14.337-4.926 21.787c0 7.448 9.85 7.448 9.85 0c0-7.45-2.204-21.787-4.924-21.787"
                                    />
                                </svg>
                            </div>

                            <div className="w-full h-full">
                                {idx === dish_steps.length - 1  && (
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-full h-full cursor-pointer"
                                        onClick={() => addSteps(idx)}
                                    >
                                        <img
                                            src="/add_ingredient.svg"
                                            className="w-10 h-10"
                                            alt="Add ingredient"
                                        />
                                    </motion.div>
                                )}
            
                                {/* remove step button */}
                                {showNextBox[idx] && ( 
                                    <motion.div 
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.90 }} 
                                        className="ingredient-button"
                                    >
                                        <img 
                                            src="/remove_ingredient.svg" 
                                            className="w-12 h-12"
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>

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