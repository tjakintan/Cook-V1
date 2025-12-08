import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignUpIn from "../components/login_signUp.jsx";
import Profile from "../components/profile.jsx";
import Placeholder from "../components/placeholder.jsx";
import "../styles/pages_style.css";


export default function More() {

    const [showSectionPage, setShowSectionPage] = useState(false);
    const [showProfile, setShowProfile] = useState(
        !!localStorage.getItem("idToken")
    );

    return (
        
        <div className="h-screen w-screen flex justify-center items-center overflow-hidden">

            <div className={`w-[90%] md:w-[70%] lg:w-[70%] h-full flex flex-col justify-center items-center ${showSectionPage ? "pb-20 space-y-5" : "pb-25 space-y-5"}`}>

                {/* Placeholder Section */}    
                <div className={`w-screen h-full flex justify-center items-center overflow-y-hidden overflow-x-auto`}>
                    <div className="w-full h-full">
                        <Placeholder />
                    </div>
                </div>  

                <div className={`w-full h-${showSectionPage ? "1/5" : "[100px]"} flex justify-center items-center ${showProfile ? "hidden" : ""}`}>

                    {/* Login/Sign-up Section */}
                    <motion.div 
                        className={`w-full h-[100px] flex flex-row justify-center items-center overflow-hidden rounded-[30px] hover:bg-gray-50 ${showSectionPage ? "hidden" : ""}`}
                        whileHover={{ scale: 1.05 }} 
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="w-full h-full relative flex flex-row items-center pl-10 space-x-5">
                            <svg 
                                viewBox="0 0 1664 1664"
                                className="w-7 h-7"
                            >
                                <path fill="#000000" d="M832 0Q673 0 560.5 112.5T448 384t112.5 271.5T832 768t271.5-112.5T1216 384t-112.5-271.5T832 0zm0 896q112 0 227 22t224 69.5t193.5 114t136 162.5t51.5 208q0 75-57 133.5t-135 58.5H192q-78 0-135-58.5T0 1472q0-112 51.5-208t136-162.5t193.5-114T605 918t227-22z"/>
                            </svg>
                            <span className="font-extralight text-[20px] text-center tracking-widest">
                                Sign up / in
                            </span>
                        </div>                        
                        <div className="w-[30%] h-full flex justify-end items-center pr-10">
                            <button 
                                className="w-11 h-11 rounded-full  flex justify-center items-center cursor-pointer dark:bg-black"
                                onClick={() => setShowSectionPage(true)}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 32 32" 
                                    preserveAspectRatio="none"
                                    className="w-8 h-8 text-blue-400"
                                >
                                    <path fill="currentColor" d="m18.72 6.78l-1.44 1.44L24.063 15H4v2h20.063l-6.782 6.78l1.44 1.44l8.5-8.5l.686-.72l-.687-.72l-8.5-8.5z"/>
                                </svg>
                            </button> 
                        </div>
                    </motion.div> 

                    {/* Sign In / Sign Up Section */}
                    {showSectionPage && (
                        <>
                        {/* Fullscreen dark background */}
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 pointer-events-auto"/>

                        {/* SIGN UP/IN */}
                        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none pb-10 overflow-y-auto">

                            <div 
                                className="w-full md:w-2/3 lg:w-4/5 h-[90%] md:h-4/5 lg-4/5 max-w-[600px] max-h-[600px]
                                            rounded-[30px] pointer-events-auto 
                                            flex flex-col justify-center items-center bg-white">

                                <motion.div 
                                    className="relative w-full h-[10%] flex justify-center items-center"
                                    whileHover={{ scale: 1.05 }} 
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <button
                                        className="absolute left-5 w-10 h-10 bg-white rounded-full outline-1 flex justify-center items-center cursor-pointer dark:bg-black"
                                        onClick={() => setShowSectionPage(false)}
                                    >
                                        <svg 
                                            viewBox="0 0 32 32"
                                            className="w-5 h-5 text-red-500"
                                            >
                                            <path fill="currentColor" d="m13.28 6.78l-8.5 8.5l-.686.72l.687.72l8.5 8.5l1.44-1.44L7.936 17H28v-2H7.937l6.782-6.78l-1.44-1.44z"/>
                                        </svg>
                                    </button>
                                </motion.div>

                                <div className="relative w-full h-full flex justify-center items-center">
                                    <SignUpIn showProfile={showProfile} setShowProfile={setShowProfile}/>
                                </div>

                            </div>
                        </div>
            
                    </>

                    )}

                </div>

                {/* Profile Section */}
                {showProfile && (
                    <div className="w-full h-1/5 flex justify-center items-center ">
                        <Profile />
                    </div>
                )}

                {/* Appearances Section */}    
                <motion.div 
                    className={`w-full h-1/5 flex justify-center items-center rounded-[30px] hover:bg-gray-50 ${showSectionPage ? "hidden" : ""} `}
                    whileHover={{ scale: 1.05 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <div className="w-full h-full relative flex flex-row items-center pl-10 space-x-5">
                            <svg 
                                viewBox="0 0 42 42"
                                className="w-7 h-7"
                            >
                                <path fill="#000000" d="M6.62 24.5c.4 1.62 1.06 3.13 1.93 4.49l-2.43 2.44c-1.09 1.09-1.08 1.74-.12 2.7l2.37 2.37c.97.971 1.63.95 2.7-.12l2.55-2.56c1.2.688 2.5 1.22 3.88 1.56v3.12c0 1.55.47 2 1.82 2h3.36c1.37 0 1.82-.48 1.82-2v-3.12c1.38-.34 2.68-.87 3.88-1.56l2.61 2.619c1.08 1.068 1.729 1.09 2.699.131l2.381-2.381c.949-.949.97-1.602-.131-2.699l-2.5-2.5a14.665 14.665 0 0 0 1.938-4.49h3.302c1.368 0 1.818-.48 1.818-2v-3c0-1.48-.393-2-1.818-2h-3.302c-.34-1.38-.87-2.68-1.562-3.88l2.382-2.37c1.05-1.05 1.14-1.7.13-2.7l-2.38-2.38c-.95-.95-1.632-.94-2.7.13l-2.26 2.25A14.946 14.946 0 0 0 24.5 6.62V3.5c0-1.48-.391-2-1.82-2h-3.36c-1.35 0-1.82.49-1.82 2v3.12c-1.62.4-3.13 1.06-4.49 1.93L10.75 6.3C9.68 5.23 9 5.22 8.05 6.17L5.67 8.55c-1.01 1-.92 1.65.13 2.7l2.37 2.37c-.68 1.2-1.21 2.5-1.55 3.88h-3.3c-1.35 0-1.82.49-1.82 2v3c0 1.55.47 2 1.82 2h3.3zm8.66-3.5c0-3.16 2.56-5.72 5.72-5.72s5.721 2.56 5.721 5.72a5.72 5.72 0 1 1-11.441 0z"/>
                            </svg>
                        <span className="font-extralight text-[20px] text-center tracking-widest">
                            App Settings
                        </span>
                    </div>
                    <div className="w-[30%] h-full flex justify-end items-center pr-10">
                        <button 
                            className="w-11 h-11 bg-white rounded-full  flex justify-center items-center cursor-pointer dark:bg-black"
                            
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 32 32" 
                                preserveAspectRatio="none"
                                className="w-8 h-8 text-blue-400"
                            >
                                <path fill="currentColor" d="m18.72 6.78l-1.44 1.44L24.063 15H4v2h20.063l-6.782 6.78l1.44 1.44l8.5-8.5l.686-.72l-.687-.72l-8.5-8.5z"/>
                            </svg>
                        </button> 
                    </div>
                </motion.div>      

                {/* Contact Section */}
                <motion.div 
                    className={`w-full h-1/5 flex justify-center items-center rounded-[30px] hover:bg-gray-50 ${showSectionPage ? "hidden" : ""}`}
                    whileHover={{ scale: 1.05 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >                   
                    <div className="w-full h-full relative flex flex-row items-center pl-10 space-x-5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 576 512"
                            className="w-7 h-7"
                        >
                            <path fill="#000000" d="m169.6 153.4l-18.7-18.7c-12.5-12.5-12.5-32.8 0-45.3L265.6-25.4c12.5-12.5 32.8-12.5 45.3 0l18.7 18.8c12.5 12.5 12.5 32.8 0 45.3L214.9 153.4c-12.5 12.5-32.8 12.5-45.3 0M276 211.7l-31.4-31.4l112-112L476 187.7l-112 112l-31.4-31.4l-232 232c-15.6 15.6-40.9 15.6-56.6 0s-15.6-40.9 0-56.6zm114.9 162.9c-12.5-12.5-12.5-32.8 0-45.3l114.7-114.7c12.5-12.5 32.8-12.5 45.3 0l18.7 18.7c12.5 12.5 12.5 32.8 0 45.3L454.9 393.4c-12.5 12.5-32.8 12.5-45.3 0l-18.7-18.7z"/>
                        </svg>
                        <span className="font-extralight text-[20px] text-center tracking-widest">
                            About & Legal
                        </span>
                    </div>
                    <div className="w-[30%] h-full flex justify-end items-center pr-10">
                        <button 
                            className="w-11 h-11 bg-white rounded-full  flex justify-center items-center cursor-pointer dark:bg-black"
                            
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 32 32" 
                                preserveAspectRatio="none"
                                className="w-8 h-8 text-blue-400"
                            >
                                <path fill="currentColor" d="m18.72 6.78l-1.44 1.44L24.063 15H4v2h20.063l-6.782 6.78l1.44 1.44l8.5-8.5l.686-.72l-.687-.72l-8.5-8.5z"/>
                            </svg>
                        </button> 
                    </div>
                </motion.div> 



            </div>

            {/* Show More Section */}

        </div>
       // <Account /> 
       
    )
};

