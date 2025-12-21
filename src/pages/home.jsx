import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import "../styles/pages_style.css";
import "../styles/component_style.css";
import Placeholder from "../components/placeholder.jsx";


export default function Home() {

    const [open, setOpen] = useState(false);
    const controls = useAnimation();

    const togglePanel = () => {
        const next = !active;
        setActive(next);
        controls.start(next ? "active" : "rest");
    };  

    return (
        <div className="w-screen h-screen overflow-y-scroll scrollbar-hide">

            <div className="w-screen h-screen relative">
                <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                    <div className="w-full h-1/5 relative">

                        {/* Background */}
                        <div className="absolute inset-0">
                            <Placeholder />
                        </div>

                        {/* Foreground content */}
                        <div className="relative z-10 flex justify-center items-center h-full">
                            <p className="text-outline-white  font-bold text-xl tracking-widest text-center">
                            
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <div className="w-screen h-screen flex items-center justify-center p-5">
                <div className="w-full h-full flex flex-col md:flex-row lg:flex-row p-5 gap-5">

                    <div className="w-full md:w-1/2 lg:w-1/2 h-full rounded-[30px] bg-gray-100 flex flex-col p-1 md:p-5 lg:p-5 gap-5">
                        <div className="w-full h-2/3">

                        </div>
                        <motion.div 
                            className="h-1/2 md:h-1/3 lg:h-1/3 w-full rounded-[30px] bg-orange-500 shadow-xl cursor-pointer"
                            whileHover={{ scale: 1.05 }} 
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}>

                        </motion.div>
                    </div>

                    <div className="w-full md:w-1/2 lg:w-1/2  h-full flex flex-col p-1 md:p-5 lg:p-5 justify-center space-y-5 md:space-y-10 lg:space-y-10">
                        <motion.div 
                            className="h-1/2 md:h-1/3 lg:h-1/3 w-full rounded-[30px] bg-green-500 shadow-xl cursor-pointer"
                            whileHover={{ scale: 1.05 }} 
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}>

                        </motion.div>
                        <motion.div 
                            className="h-1/2 md:h-1/3 lg:h-1/3 w-full rounded-[30px] bg-purple-500 shadow-xl cursor-pointer"
                            whileHover={{ scale: 1.05 }} 
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}>

                        </motion.div>
                    </div>

                </div>
            </div>

            <div className="w-screen h-screen flex items-center justify-center p-5">
            </div>

            <div className="w-screen h-screen flex items-center justify-end p-5">

                <div className="w-full md:w-4/5 lg:w-4/5 h-4/5 rounded-[30px] overflow-hidden">

                    <div className="w-full h-1/5 flex items-center justify-start space-x-5">
                        <svg 
                            className="w-15 h-15"
                            viewBox="0 0 14 14"
                        >
                            <g fill="none" fill-rule="evenodd" clip-rule="evenodd"><path fill="#8fbffa" d="M7 .25c-1.523 0-3.013.08-4.44.23A2.326 2.326 0 0 0 .485 2.452a23.4 23.4 0 0 0-.01 6.54c.159 1.141 1.116 1.952 2.217 2.055l.218.02l.225.02v2.164a.5.5 0 0 0 .704.456c1.405-.63 2.255-1.242 3.28-2.39a43 43 0 0 0 4.256-.234a2.386 2.386 0 0 0 2.131-2.033a23 23 0 0 0 .244-3.266c0-1.13-.087-2.238-.239-3.301a2.354 2.354 0 0 0-2.101-2A43 43 0 0 0 7 .25"/><path fill="#2859c5" d="M6.127 4.273a.888.888 0 0 1 1.044-.856c.333.066.62.353.686.686a.52.52 0 0 1-.034.358c-.05.097-.149.212-.337.338c-.255.17-.522.353-.719.557c-.22.23-.391.526-.391.915a.625.625 0 0 0 1.25.003a.4.4 0 0 1 .043-.052c.086-.09.235-.199.511-.383c.305-.204.582-.467.757-.811c.18-.356.23-.752.146-1.169a2.15 2.15 0 0 0-1.668-1.668c-1.3-.258-2.538.758-2.538 2.082a.625.625 0 1 0 1.25 0M7.625 8.56a.625.625 0 1 0-1.25 0v.275a.625.625 0 1 0 1.25 0z"/></g>
                        </svg>
                    </div>

                    <motion.div
                        className="relative w-full h-4/5 flex items-start justify-center"
                        whileHover="hover"
                        initial="rest"
                        animate={controls}
                        onHoverStart={() => controls.start("active")} 
                        onHoverEnd={() => controls.start("rest")}
                        onClick={togglePanel} 
                    >
                        <div className="relative w-full h-4/5 flex items-center justify-center ">
                            
                            {/* Background */}
                            <div className="absolute inset-0 flex items-center justify-center p-2">
                                <div className="relative w-full h-full flex bg-gray-100 rounded-[30px] shadow-xl overflow-hidden">

                                    <div className="absolute w-1/6 flex flex-col gap-4 pt-15 pb-15 h-full left-0">

                                        <div className="flex-1 bg-gray-200 rounded-[30px] flex justify-center items-center">
                                            
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-[30px] flex justify-center items-center">
                                            
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-[30px] flex justify-center items-center">
                                            
                                        </div>

                                    </div>
                                    
                                    <div className="absolute w-2/5 h-full right-0 flex flex-col gap-4 pt-15 pb-15">

                                        <div className="flex-1 bg-gray-200 rounded-[30px] flex justify-center items-center">
                                            
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-[30px] flex justify-center items-center">
                                            
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-[30px] flex justify-center items-center">
                                            
                                        </div>


                                    </div>
                                </div>
                            </div>

                            {/* Sliding Door */}
                            <motion.div
                                className="absolute inset-0 flex items-start justify-end z-10 p-2"
                                variants={{
                                    rest: { x: "0%" },
                                    active: { x: "-40%" },
                                }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            >
                                <div className="w-5/6 h-full flex items-center justify-end bg-white/70 backdrop-blur-sm rounded-[30px] overflow-hidden">

                                    <motion.div
                                        className=" h-4/5 flex flex-col gap-4 p-4"
                                        variants={{
                                            rest: { width: "100%" },
                                            active: { width: "74%" }, 
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                        onClick={() => controls.start("active")}
                                    >
                                        <div className="flex-1 bg-gray-200 rounded-[30px] flex justify-center items-center">
                                            
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-[30px] flex justify-center items-center">
                                            
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-[30px] flex justify-center items-center">
                                            
                                        </div>

                                    </motion.div>

                                </div>
                            </motion.div>

                        </div>

                    </motion.div>

                </div>

            </div>
        </div>
    );

}