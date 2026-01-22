import React, { useRef, useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/component_style.css";
import Messages  from "./messages.jsx";
import { useUser } from "../utils/user.jsx";
import { useSignOut, getUserSub } from "../utils/auth.js";

function MenuButton({ label, icon, onClick }) {

  return (
    <motion.button
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-row items-center justify-center space-x-2 
                 px-5 py-2 backdrop-blur-xl rounded-[20px]
                 font-thin tracking-wide text-black shadow-xl
                hover:bg-gray-50 transition cursor-pointer"
    >
      {icon}
    </motion.button>
  );
}

export default function Profile() {

    const { user, setUser, loading } = useUser();
    const signout = useSignOut();

    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [showPostSection, setShowPostSection] = useState(false);
    const [showLikeSection, setShowLikeSection] = useState(false);
    const [showInboxSection, setShowInboxSection] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showMessageSection, setShowMessageSection] = useState(false);
    const [showAccountSection, setShowAccountSection] = useState(false);
    const [showAccountUpdateSection, setShowAccountUpdateSection] = useState(false);
    const fileInputRef = useRef(null);
    const profile_img = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


    if (!user) return (
        <div className="h-screen w-screen flex justify-center items-center">
            <svg 
                width="50" height="50" 
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="2" r="0" fill="#000000"><animate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(45 12 12)"><animate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(90 12 12)"><animate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(135 12 12)"><animate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(180 12 12)"><animate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(225 12 12)"><animate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(270 12 12)"><animate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(315 12 12)"><animate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle>
            </svg>
        </div>
    );

    const callAction = async (actionName, payload = {}) => {

        if (isLoading) return;
        setIsLoading(true);

        const sub = getUserSub(user);

        if (!sub) {
            console.error("No use sub speciied")
        }

        try {
            const res = await fetch(
                "https://api.gomeal.org/actions",
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        action: actionName,
                        user_sub: sub,
                        ...payload, 
                    }),
                }
            );

            const data = await res.json();
            console.log("API Response:", data);

            return data;
        } catch (err) {
            console.error("API error:", err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };






    return (
        <>            
            <div className="w-full h-full flex flex-col justify-end items-center p-10 gap-5">

                {/* Headers section */}
                <div className="w-full h-1/3 flex flex-row items-center justify-start">

                    <div className="flex items-center gap-4 ">
                        <motion.div 
                            whileHover={{ scale: 1.07 }}
                            className="p-4 rounded-full shadow-xl flex items-center justify-center cursor-pointer hover:bg-gray-50"
                            onClick={() => setShowAccountSection(true)}
                        >
                            <svg 
                                viewBox="0 0 24 24"
                                className="w-10 h-10"
                            >
                                <path fill="#000000" d="M14.5 23q-.625 0-1.063-.438T13 21.5v-7q0-.625.438-1.063T14.5 13h7q.625 0 1.063.438T23 14.5v7q0 .625-.438 1.063T21.5 23h-7Zm0-1.5h7v-.8q-.625-.775-1.525-1.238T18 19q-1.075 0-1.975.463T14.5 20.7v.8ZM18 18q.625 0 1.063-.438T19.5 16.5q0-.625-.438-1.063T18 15q-.625 0-1.063.438T16.5 16.5q0 .625.438 1.063T18 18Zm-6-6Zm.05-3.5q-1.45 0-2.475 1.025T8.55 12q0 1.2.675 2.1T11 15.35V13.1q-.2-.2-.325-.513T10.55 12q0-.625.438-1.063t1.062-.437q.35 0 .625.138t.475.362h2.25q-.325-1.1-1.238-1.8t-2.112-.7ZM9.25 22l-.4-3.2q-.325-.125-.613-.3t-.562-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.337v-.674q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75L19.925 11H17.4q-.025-.125-.05-.263t-.075-.262l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.213-.962t-1.437-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.6.625 1.35 1.05T11 17.4V22H9.25Z"/>
                            </svg>
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-[20px] font-light tracking-wide">
                                Welcome
                            </span>
                            <span className="text-[18px] font-extralight text-black">
                                {user.profile_name}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Functionality section */}
                <div className="w-full h-[20%] flex items-center justify-center">

                    <div className="w-full h-full flex items-center justify-around space-x-15">



                    </div>

                
                </div>
                
            </div>

            {showAccountSection && user && (

                <>
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 pointer-events-auto" onClick={() => {setShowAccountSection(false);setShowAccountUpdateSection(false);setShowDeleteConfirm(false);}}/>
                    
                    
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">

                        <div className={`w-full md:w-2/3 lg:w-2/3 ${showAccountUpdateSection ? "h-4/5" : "h-1/3"}
                                        flex justify-center items-center rounded-3xl overflow-hidden`}>

                            <div className="w-full h-full flex flex-col items-center justify-center pointer-events-auto">
       

                            
                            </div>

                        </div>

                    </div>

                </> 

            ) }

            {showPostSection && posts && (
                 <>
                    {/* Fullscreen dark background */}
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 pointer-events-auto" 
                        onClick={() => setShowPostSection(false)}/>

                    {/* Centered square */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">

                        
                        <div className="w-full max-w-[600px] max-h-[600px] 
                                        rounded-[20px] overflow-hidden ">

                            {/* CONTENT INSIDE THE SQUARE */}
                            <div className="w-full h-full flex flex-col items-center justify-center pointer-events-auto">
                           
                                <div className="w-full h-full flex flex-col justify-center items-center overflow-y-auto overflow-x-hidden gap-5 scrollbar-hide">

                                    {posts.length > 0 ? (

                                        posts.map((post) => (
                                            <div className="w-full h flex flex-col items-center justify-center pr-1">

                                                <div className="w-full h-full flex flex-row overflow-hidden items-center justify-between ">

                                                    {/* Image */}
                                                    <div className="w-3/5 h-full flex justify-center items-center">
                                                        <img
                                                            src={post.image_url}
                                                            alt={post.dish_name}
                                                            className="w-2/3 h-full rounded-[20px] object-cover overflow-hidden"
                                                        />    
                                                    </div>         

                                                    {/* Text */}
                                                    <div 
                                                        className="w-full h-full flex flex-col justify-center 
                                                                    items-start p-5 space-y-2 overflow-hidden whitespace-nowrap bg-white
                                                                    rounded-[20px]">
                                                        
                                                        <div className="flex flex-row items-center gap-2 text-sm font-thin">
                                                            <svg 
                                                                viewBox="0 0 8 8"
                                                                className="w-5 h-5"
                                                            >
                                                                <path fill="#000000" d="M3 1V0h1v1M3 8V5h1v3M1 4V2h5l1 1l-1 1"/>
                                                            </svg>
                                                            :<span className="text-sm font-thin text-center tracking-wide">{post.id}</span>
                                                        </div>

                                                        <div className="flex flex-row items-center gap-2 text-sm font-thin">
                                                            <svg 
                                                                viewBox="0 0 24 24"
                                                                className="w-5 h-5"
                                                            >
                                                                <g fill="none"><rect width="18" height="15" x="3" y="6" stroke="#000000" strokeWidth="2" rx="2"/><path fill="#000000" d="M3 10c0-1.886 0-2.828.586-3.414C4.172 6 5.114 6 7 6h10c1.886 0 2.828 0 3.414.586C21 7.172 21 8.114 21 10z"/><path stroke="#000000" strokeLinecap="round" strokeWidth="2" d="M7 3v3m10-3v3"/><rect width="4" height="2" x="7" y="12" fill="#000000" rx=".5"/><rect width="4" height="2" x="7" y="16" fill="#000000" rx=".5"/><rect width="4" height="2" x="13" y="12" fill="#000000" rx=".5"/><rect width="4" height="2" x="13" y="16" fill="#000000" rx=".5"/></g>
                                                            </svg>
                                                            :<span className="text-sm font-thin text-center tracking-wide">{new Date(post.created_at).toLocaleDateString()}</span>
                                                        </div>  

                                                        <div className="flex flex-row items-center gap-2 text-sm font-thin">

                                                            <svg 
                                                                viewBox="0 0 48 48"
                                                                className="w- h-5"
                                                            >
                                                                <path fill="#F44336" d="M34 9c-4.2 0-7.9 2.1-10 5.4C21.9 11.1 18.2 9 14 9C7.4 9 2 14.4 2 21c0 11.9 22 24 22 24s22-12 22-24c0-6.6-5.4-12-12-12z"/>
                                                            </svg>
                                                            :<span className="text-sm font-thin text-center tracking-wide">{post.likes_count}</span>
                                                        </div> 

                                                        <div className="w-[95%] border-t border-gray-300"></div>

                                                        <p className="text-[14px] font-light tracking-widest flex items-center gap-1">
                                                            <span>Name :</span>
                                                            <span className="text-[13px] opacity-70 inline-block max-w-[225px] truncate">
                                                                {post.dish_name}
                                                            </span>
                                                        </p>

                                                        <p className="text-[14px] font-light tracking-widest flex items-center gap-1">
                                                            <span>Desc :</span>
                                                            <span className="text-[13px] opacity-70 inline-block max-w-[225px] truncate">
                                                                {post.description}
                                                            </span>
                                                        </p>

                                                    </div>  


                                                    {/**  
                                                     *    <div className="w-[40%] h-full flex justify-center items-center">
                                                        <motion.div 
                                                            whileHover={{ scale: 1.05 }} 
                                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                            className="w-3/5 h-2/5 flex justify-center items-center rounded-full text-white hover:bg-white hover:text-red-500 cursor-pointer"
                                                        >
                                                            <svg 
                                                                viewBox="0 0 1025 1024"
                                                                className="w-1/2 h-1/2 fill-current"
                                                            >
                                                                <path d="M960.865 192h-896q-26 0-45-18.5t-19-45t18.5-45.5t45.5-19h320q0-26 18.5-45t45.5-19h128q27 0 45.5 19t18.5 45h320q26 0 45 19t19 45.5t-19 45t-45 18.5zm0 704q0 53-37.5 90.5t-90.5 37.5h-640q-53 0-90.5-37.5t-37.5-90.5V256h896v640zm-640-448q0-26-19-45t-45.5-19t-45 19t-18.5 45v384q0 27 18.5 45.5t45 18.5t45.5-18.5t19-45.5V448zm256 0q0-26-19-45t-45.5-19t-45 19t-18.5 45v384q0 27 18.5 45.5t45 18.5t45.5-18.5t19-45.5V448zm256 0q0-26-19-45t-45.5-19t-45 19t-18.5 45v384q0 27 18.5 45.5t45 18.5t45.5-18.5t19-45.5V448z"/>
                                                            </svg>
                                                        </motion.div>
                        
                                                    </div> 
                                                     */}
                                                        
                                               

                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Empty state
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                        <span className="text-xl font-light">No posts yet.</span>
                                        </div>
                                    )}

                                </div>
                            </div>

                        </div>
                    </div>
                </>
            )}

            {showLikeSection && likedPosts && (
                 <>
                    {/* Fullscreen dark background */}
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 pointer-events-auto" 
                        onClick={() => setShowLikeSection(false)}
                    ></div>

                    {/* Centered square */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                        <div className="w-[90vw] h-[90vw] max-w-[600px] max-h-[600px] 
                                        rounded-3xl overflow-hidden">

                            {/* CONTENT INSIDE THE SQUARE */}
                            <div className="w-full h-full flex flex-col items-center justify-center pointer-events-auto">
                               
                                <div className="w-full h-full flex flex-col justify-center items-center overflow-y-auto gap-10 scrollbar-hide">

                                    {likedPosts.length > 0 ? (

                                        likedPosts.map((like_post) => (

                                            <div 
                                                className="relative w-full h-full flex-none rounded-[20px] 
                                                flex flex-row items-center justify-start overflow-hidden bg-transparent"
                                            >
                                                <div className="w-full h-full relative overflow-hidden rounded-lg cursor-pointer">
                                                    <img
                                                        src={like_post.image_url}
                                                        alt={like_post.dish_name}
                                                        className="w-full h-full object-cover overflow-hidden"
                                                    />
                                                    <div 
                                                        className="absolute bottom-5 right-5 flex flex-row bg-white/10 
                                                                opacity-70 rounded-[30px] space-x-5 py-2 pr-2 pl-2"
                                                    >
                                                        <div className="flex flex-row justify-center space-x-2">
                                                            <div 
                                                                className="w-6 h-6 bg-white rounded-full flex 
                                                                items-center justify-center cursor-pointer overflow-hidden"
                                                            >
                                                                <img 
                                                                    src={like_post.profile_img_url} alt={like_post.dish_name}
                                                                    className="w-full h-full object-cover overflow-hidden"
                                                                /> 
                                                            </div>
                                                            <p className="text-md font-thin tracking-wider truncate whitespace-nowrap overflow-hidden">{like_post.profile_name}</p>
                                                        </div>

                                                        <div className="w-1/2 h-full flex flex-row items-center space-x-2">
                                                            <svg 
                                                                viewBox="0 0 48 48"
                                                                className="w-6 h-6"
                                                            >
                                                                <path fill="#F44336" d="M34 9c-4.2 0-7.9 2.1-10 5.4C21.9 11.1 18.2 9 14 9C7.4 9 2 14.4 2 21c0 11.9 22 24 22 24s22-12 22-24c0-6.6-5.4-12-12-12z"/>
                                                            </svg>
                                                            <span className="text-sm font-extralight text-center tracking-wide">{like_post.likes_count}</span>
                                                        </div>

                                                    </div>   
                                                </div>

                                            </div>

                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                        <span className="text-xl font-light">No posts yet.</span>
                                        </div>
                                    )}

                                </div>
                            </div>

                        </div>
                    </div>
                </>
            )}
   
            {showInboxSection && (
            <>
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 pointer-events-auto"
                    onClick={() => setShowInboxSection(false)}
                ></div>

                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">

                    <div className="w-[90vw] max-w-[600px] aspect-square flex flex-col overflow-hidden pointer-events-auto">
                        
                        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">

                            <Messages />
                            
                        </div>

                    </div>
                </div>
            </>
            )}

        </>
    )
}