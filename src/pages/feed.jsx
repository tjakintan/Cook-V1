import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/pages_style.css";
import "../styles/component_style.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Feed() {

    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [like, setLike] = useState(false);
    const [more, setMore] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedPost, setSelectedPost] = useState(null);
    const [showMessageSection, setShowMessageSection ] = useState(false);
    const [messageText, setMessageText] = useState("");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return (
         <div className="fixed inset-0 w-screen h-screen overflow-hidden flex justify-center items-center bg-black/30 backdrop-blur-sm">
            <div className="w-[50%] md:w-[25%] lg:w-[25%] h-[20%] flex flex-col justify-center items-center  py-5 px-2">
                
                <button 
                    className="flex w-15 h-15 justify-center items-center rounded-full bg-black px-3 py-1.5 text-sm font-light text-white tracking-widest 
                    cursor-pointer hover:border-[2px] hover:border-blue-600"
                    onClick={() => navigate("/more")}>
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
        </div>

    );

    const decoded = jwtDecode(accessToken); 
    const sub = decoded.sub;


    useEffect(() => {

        async function fetchFeed() {
            try {
                const res = await fetch(
                    "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/feed",
                    {
                        method: "GET",
                        headers: {
                            "content-type": "application/json",
                        },
                    }
                ); // replace with your API Gateway URL
                const data = await res.json();

                setPosts(data.posts);
            } catch (err) {
                console.error("Error fetching feed:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchFeed();

    }, []); 

    const handleLike = async (postId) => {

        const post = posts.find(p => p.id === postId);
        const hasLiked = post.likes.includes(sub);

        try {
            const res = await fetch(
                "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/actions",
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ action: "like_post", post_id: postId, user_sub: sub, unlike: hasLiked }),
                }
            );
            const data = await res.json();

            if (data.status === "success") {
                setPosts((prevPosts) =>
                    prevPosts.map((p) => {
                        if (p.id !== postId) return p;

                        let updatedLikes = [...p.likes];
                        let updatedCount = Number(p.likes_count) || 0;

                        if (hasLiked) {
                            // remove like
                            updatedLikes = updatedLikes.filter(u => u !== sub);
                            updatedCount = Math.max(updatedCount - 1, 0);
                        } else {
                            // add like
                            updatedLikes.push(sub);
                            updatedCount += 1;
                        }

                        return { ...p, likes: updatedLikes, likes_count: updatedCount };
                    })
                );
            }
        } catch (err) {
            console.error("Error updating like:", err);
        }
    };

    const handleASendMessage = async (postId) => {

        if (!messageText.trim()) {
            return;
        }

        try {
            const res = await fetch(
                "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/actions",
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        action: "send_message",
                        post_id: postId,
                        user_sub: sub,
                        message: messageText
                    }),
                }
            );
            const data = await res.json();

            if (data.status === "success") {
                setShowMessageSection(false); 
                setMessageText(""); 
            } else {
                console.error("Failed to send message:");
            }
        } catch (err) {
            console.error("Error sending message:");
        }

    };



    if (loading) return (

        <div className="h-screen w-screen flex bg-white justify-center items-center">
            <svg 
                width="50" height="50" 
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="2" r="0" fill="#0000"><animate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(45 12 12)"><animate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(90 12 12)"><animate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(135 12 12)"><animate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(180 12 12)"><animate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(225 12 12)"><animate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(270 12 12)"><animate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(315 12 12)"><animate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle>
            </svg>
        </div>
    
    );

    return (
        <div className="h-screen w-screen flex justify-center items-center">

            <div  className={`relative w-full h-full overflow-y-auto scrollbar-hide flex flex-col justify-center items-center gap-5`}>
                
                {/* Preview of how it will appear on feed */}
                {posts.map((post) => (

                    <div 
                        className="relative w-full md:w-[80%] lg:w-[90%] min-h-[700px] max-h-[600px] flex flex-col overflow-hidden justify-center items-center p-5"
                    >

                        <motion.div 
                            className="w-full md:w-[80%] lg:w-[90%] h-full justify-center items-center overflow-hidden flex rounded-[60px]"
                            whileHover={{ scale: 1.05 }} 
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >

                            {/* Image(file) container */}
                            <img 
                                src={post.image_url} 
                                alt="preview" 
                                className="w-full h-full object-cover"
                            />
                            
                        </motion.div>
                        


                        <div className=" w-[90%] h-full flex flex-col justify-between">

                            <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-full h-auto top-5 flex flex-col px-10 py-5 rounded-[60px] hover:bg-gray-100/30 hover:backdrop-blur-xs cursor-pointer "
                            >
                                    <text className="font-light text-2xl tracking-widest text-black font-bold">{post.dish_name}</text>
                                    <text className="font-thin text-md tracking-wide text-black">{post.description}</text>  
                            </motion.div>
                            
                            <div className="flex flex-row justify-center items-center w-full h-[10%] pr-5 pl-5">

                                <div className="w-full h-full flex items-center flex-row space-x-1">
                                    {/* More button */}
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }} 
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className={`w-15 h-15 cursor-pointer flex justify-center items-center rounded-full hover:backdrop-blur-lg hover:bg-white/70 outline-1`}
                                        onClick={() => setMore(true)}
                                        >
                                        <svg 
                                            width="20" 
                                            height="20"
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24 ">
                                            <path fill="transparent" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.5 6.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0m6.5 11a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0m-13 0a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0" color="currentColor"/>
                                        </svg>
                                    </motion.div>

                                    {/* Profile bar container */}
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }} 
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="flex flex-row justify-center items-center space-x-2">
                                        <button 
                                            className="text-md font-light text-center text-black tracking-wider cursor-pointer rounded-[60px] hover:backdrop-blur-lg p-3 hover:bg-white/70 outline-1"
                                            onClick={() => {
                                                setSelectedPost(post);
                                                setShowMessageSection(true);
                                                setMessageText("");}}>Ask a Question</button>
                                    </motion.div>
                                </div>

                                {/* Like button */}
                                <div className="w-full h-full flex flex-row justify-end items-center space-x-1">
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }} 
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className={`w-15 h-15 cursor-pointer flex justify-center items-center rounded-full bg-white/30 backdrop-blur-xs p-1 hover:bg-red-500 outline-1`}
                                        onClick={() => handleLike(post.id)}>
                                        <svg 
                                            width="24" 
                                            height="24"
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 14 14">
                                            <path fill={post.likes.includes(sub) ? "red" : "white"} stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="m7 12.45l-5.52-5c-3-3 1.41-8.76 5.52-4.1c4.11-4.66 8.5 1.12 5.52 4.1Z"/>
                                        </svg>
                                    </motion.div>
                                    <span className="text-[17px] font-light px-2 text-black">{post.likes_count || 0}</span>
                                </div>

                            </div> 

                            <div className="w-full mt-5 border-t border-gray-300"></div> 

                        </div>

                                                    

                    </div>

                    ))}

            {/* Share & Report */}
            {more && (
                <>
                    {/* Dimmed background */}
                    <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                    onClick={() => setMore(false)} 
                    ></div>

                    <div
                        className="fixed top-1/2 left-1/2 w-[150px] h-[150px] bg-white rounded-[30px] shadow-lg cursor-pointer
                                    -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col justify-between items-center py-5"
                        >

                        {/* Share */}
                        <div className="flex items-center">
                            <span className="text-md font-light tracking-wide">Share</span>
                        </div>

                        <div className="w-3/5 border-t border-gray-300"></div>

                        {/* Report */}
                        <div className="flex items-center">
                            <span className="text-md font-light tracking-wide">Report</span>
                        </div>

                        <div className="w-3/5 border-t border-gray-300"></div>

                        {/* Close */}
                        <div 
                            className="flex items-center"
                            onClick={() => setMore(false)}
                        >
                            <span className="text-md font-thin tracking-wide">close...</span>
                        </div>                        

                    </div>
                </>
            )}

            {/* Ask a question */}
            {showMessageSection && selectedPost && (
                <>
                    {/* Dimmed background */}
                    <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                    onClick={() => setShowMessageSection(false)} 
                    ></div>

                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">

                        <div className="pointer-events-auto w-full md:w-1/2 lg:w-1/2 h-2/3 md:h-1/2 hlg:h-1/2 bg-white rounded-[30px] shadow-lg flex flex-col overflow-hidden">
                
                            <div className="w-full h-full flex flex-col justify-between items-center p-5">
                                <span className="font-light text-[20px] tracking-wider text-gray-800 text-center">Ask {selectedPost.profile_name} a question about {selectedPost.dish_name}.</span>
                                
                                <div className="w-full h-full flex flex-col justify-center items-center space-y-2">
                                    <textarea 
                                        value={messageText}      
                                        onChange={(e) => setMessageText(e.target.value)} 
                                        className="w-4/5 h-2/3 rounded-[45px] px-5 py-5 text-base placeholder:text-xs text-sm
                                        text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 overflow-hidden"
                                        placeholder="Ask a Question"
                                    />
                                    <span className="font-thin text-[10px] tracking-widest text-center">Please be nice and respectful, review our <span className="underline">terms & conditions</span>.</span>
                                </div>

                                <motion.div 
                                    whileHover={{ scale: 1.05 }} 
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-1/2 md:w-2/5 lg:w-2/3 h-[20%] rounded-[30px] flex flex-row justify-center items-center space-x-1 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleASendMessage(selectedPost.id)}
                                >
                                    <svg 
                                        viewBox="0 0 24 24"
                                        className="w-7 h-7"
                                    >
                                        <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.76 12H6.832m0 0c0-.275-.057-.55-.17-.808L4.285 5.814c-.76-1.72 1.058-3.442 2.734-2.591L20.8 10.217c1.46.74 1.46 2.826 0 3.566L7.02 20.777c-1.677.851-3.495-.872-2.735-2.591l2.375-5.378A2 2 0 0 0 6.83 12"/>
                                    </svg>
                                    <span className="text-md font-light text-center tracking-wider">Send</span>
                                </motion.div>

                            </div>

                        </div>

                    </div>
                </>
            )}

            </div>

        </div>
    )
};