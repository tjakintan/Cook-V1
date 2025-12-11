import React, { useEffect, useState, useRef } from "react";
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
    const [ showFullDesc, setShowFullDesc] = useState(false);

    const [selectedPost, setSelectedPost] = useState(null);
    const [showMessageSection, setShowMessageSection ] = useState(false);
    const [showOtherUserSub, setShowOtherUserSub] = useState(null);
    const messageTimeoutRef = useRef(null);
    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const [conversation_id, setConversation_id] = useState(null);
    const messagesEndRef = useRef(null);
    const [message_id, setMessage_id] = useState(null);
    const [showProfileSection, setShowProfileSection] = useState(null);
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
                        user_a: sub,
                        user_b: showOtherUserSub,
                        message: messageText
                    }),
                }
            );
            const data = await res.json();

            if (data.status === "success") {
                setConversation_id(data.conversation_id);
                setMessage_id(data.message_id);
                setShowMessageSection(false); 
                setShowProfileSection(null);
                setMessageText(""); 
            } else {
                console.error("Failed to send message:");
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }

    };


    useEffect(() => {
        if (showOtherUserSub) {
            openOrLoadConversation(showOtherUserSub);
        }
    }, [showOtherUserSub]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const openOrLoadConversation = async (otherUserSub) => {
        try {
            const res = await fetch("https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/actions", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    action: "get_or_create_conversation",
                    user_a: sub,           // current user
                    user_b: showOtherUserSub   // person you're messaging
                })
            });

            const data = await res.json();
            const parsed = data.body ? JSON.parse(data.body) : data;

            if (parsed.success) {
                setConversation_id(parsed.conversation_id);
                setMessages(parsed.messages || []);
            }
        } catch (err) {
            console.error("Error loading/creating conversation", err);
        }
    };
    const truncateText = (text, wordLimit) => {
        const words = text.split(' ');
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
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
        <div 
            className={`h-screen w-screen flex justify-center`}
            onClick={(e) => {e.stopPropagation(); setShowProfileSection(null)}}>

            <div  className={`relative w-full md:w-[80%] lg:w-[90%] h-full overflow-y-auto scrollbar-hide flex flex-col items-center`}>
                
                {/* Preview of how it will appear on feed */}
                {posts.map((post) => (
                
                    <div 
                        className="relative w-full min-h-[600px] flex flex-col items-center py-3"
                    >

                        {/* Post image container */}
                        <div 
                            className="w-full md:w-[80%] lg:w-[90%] h-full items-center overflow-hidden flex"
                        >
                            <img 
                                src={post.image_url} 
                                alt="preview" 
                                className="w-full h-full object-cover"
                            />           
                        </div>

                        {/* Post information container */}
                        <div className="relative w-[90%] h-full flex flex-col items-center justify-between">

                            {/* Desc container */}
                            <div 
                                className="w-full md:w-5/6 lg:w-5/6 h-auto top-5 flex flex-col items-center justify-between px-10 py-5 rounded-[60px] hover:bg-gray-50 cursor-pointer"
                                onClick={() => setShowFullDesc(post)}
                            
                            >
                                    <text className="font-light text-2xl tracking-widest text-black font-bold">{post.dish_name}</text>
                                    <div className="w-2/3 mt-5 mb-5 border-t border-gray-300"></div>
                                    <text className="font-thin text-md tracking-wide text-black">{truncateText(post.description, 20)}</text> 
                            </div>
                            
                            {/* Functionality row container */}
                            <div className="flex flex-row justify-center items-center w-full md:w-2/3 lg:w-2/3 h-1/5 pr-2 pl-2 rounded-[60px] mb-1 hover:bg-gray-50">

                                <div className="w-full h-full flex items-center flex-row space-x-1">

                                    {/* More button */}
                                    <div 
                                        className={`w-15 h-15 cursor-pointer flex justify-center items-center`}
                                        onClick={() => setMore(true)}
                                    >
                                        <svg 
                                            width="20" 
                                            height="20"
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24 ">
                                            <path fill="transparent" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.5 6.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0m6.5 11a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0m-13 0a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0" color="currentColor"/>
                                        </svg>
                                    </div>


                                    {/* Profile img container */}
                                    <div 
                                        className="w-auto h-4/5 p-1 space-x-1 justify-start items-center overflow-hidden flex rounded-[60px] p-2 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Prevent opening own profile
                                            if (post.user_sub === sub) return;
                                            setShowOtherUserSub(post.user_sub);
                                            openOrLoadConversation(post.user_sub);
                                            setShowProfileSection(post.id);
                                        }}
                                    >                
                                        <img  
                                            src={post.profile_img_url}
                                            alt="preview" 
                                            className="w-10 h-10 rounded-full object-cover outline-[0.5px]"
                                        />
                                        <span
                                            className="
                                                font-thin text-md tracking-wide text-black pr-3 
                                                max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap
                                                sm:max-w-none
                                            "
                                        >
                                            {post.profile_name}
                                        </span>

                                        {/* APPEARING DIV — positioned to the right */}
                                        {showProfileSection === post.id && (
                                            <>
                                                
                                                {/* Floating profile actions card */}
                                                <div
                                                    className="
                                                        absolute left-0 bottom-1 
                                                        w-full h-full bg-transparent animate-fadeIn
                                                    "
                                                >
                                                    <div className="w-full h-full p-2 items-end justify-start flex flex-row">

                                                        <div className={`${showMessageSection ? "hidden" : ""} w-1/2 h-1/2 items-center justify-between p-3 gap-4 flex flex-col rounded-[30px] shadow-sm bg-white`}>
                                                            
                                                            <span className="font-light tracking-widest text-[15px]">{post.profile_name}</span>

                                                            <motion.div
                                                                className="w-full h-full rounded-[25px] outline-1 flex flex-row space-x-2 justify-center items-center hover:bg-gray-50"
                                                                whileHover={{ scale: 1.05 }} 
                                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                                onClick={() => {
                                                                    setShowMessageSection(true);
                                                                    //if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
                                                                    //    messageTimeoutRef.current = setTimeout(() => {
                                                                    //        setShowMessageSection(false);
                                                                    //}, 30000);
                                                                }}
                                                            >
                                                                <svg 
                                                                    viewBox="0 0 14 14"
                                                                    className="w-5 h-5"
                                                                >
                                                                    <g fill="none"><path fill="#8fbffa" fill-rule="evenodd" d="M12.722.037a1.6 1.6 0 0 0-.9.06L1.107 3.673l-.003.001a1.62 1.62 0 0 0-1.07 1.238A1.6 1.6 0 0 0 .472 6.36L3.06 8.944l-.085 3.253a.5.5 0 0 0 .73.457l2.014-1.042l1.917 1.909a1.6 1.6 0 0 0 1.52.434a1.62 1.62 0 0 0 1.168-1.068v-.001l3.575-10.712A1.62 1.62 0 0 0 12.722.037" clip-rule="evenodd"/><path fill="#2859c5" d="m3.059 8.944l-.085 3.253a.5.5 0 0 0 .73.457l2.014-1.042z"/><path fill="#2859c5" fill-rule="evenodd" d="m3.057 9.013l7.045-5.117a.625.625 0 0 0-.735-1.012L2.203 8.088l.856.856z" clip-rule="evenodd"/></g>
                                                                </svg>
                                                                <span className="font-thin tracking-widest text-[15px]">Message</span>
                                                            </motion.div>

                                                            <span className="font-thin tracking-wide text-[10px]">Joined on <span className="font-normal">{new Date(post.user_created_at).toLocaleDateString("en-us",{ month:"short",day:"numeric"})}</span></span>

                                                        </div>

                                                        <div className={`w-full h-full  ${showMessageSection ? "" : "hidden"} bg-white overflow-hidden`}>

                                                            <div className="w-full h-full flex-col">

                                                                <div className="w-full h-full flex flex-col justify-between items-center">

                                                                   {/* Conversation box */}
                                                                    <div className="flex flex-col w-full h-[80vh] overflow-y-auto p-2 space-y-2 scrollbar-hide">
                                                                        {messages.length === 0 ? (
                                                                        <div className="flex items-center justify-center font-thin text-center tracking-wide mt-4">No messages</div>
                                                                        ) : (
                                                                        messages.map(msg => {
                                                                            const isSender = msg.sender_sub === sub; // sub = current user
                                                                            return (
                                                                                <div
                                                                                    key={msg.message_id}
                                                                                    className={`flex ${isSender ? 'justify-end' : 'justify-start'} flex-row w-full mb-2`}
                                                                                >
                                                                                    
                                                                                    {/* Message bubble */}
                                                                                    <div className={`flex flex-col max-w-[70%] ${isSender ? 'items-end' : 'items-start'}`}>
                                                                                        
                                                                                        <div
                                                                                            className={`flex-4 px-5 py-1 rounded-[30px] ${
                                                                                                isSender ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white text-black rounded-bl-none'
                                                                                            } shadow w-full`}
                                                                                            style={{ flex: 0.8 }} 
                                                                                        >
                                                                                            {/* Optional: reply reference */}
                                                                                            {msg.reply_to && (
                                                                                                <div className="text-xs text-gray-400 italic mb-1 border-l-2 border-gray-300 pl-2">
                                                                                                {msg.reply_to.content}
                                                                                                </div>
                                                                                            )}
                                                                                            {msg.content}
                                                                                        </div>

                                                                                        {/* Date and time */}
                                                                                        <div
                                                                                            className="flex-1 w-full mt-1 text-right text-[10px] font-thin text-gray-500"
                                                                                            style={{ flex: 0.2 }} // 20% of height
                                                                                        >
                                                                                            {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            );
                                                                        })
                                                                        )
                                                                        }
                                                                    </div>



                                                                    {/* Send conversation */}
                                                                    <div className={`w-full flex items-center flex-row px-1`}>
                                                                          <textarea 
                                                                            value={messageText}      
                                                                            onChange={(e) => setMessageText(e.target.value)} 
                                                                            onKeyDown={async (e) => {
                                                                            if (e.key === "Enter" && !e.shiftKey) {
                                                                                e.preventDefault();
                                                                                const result = await handleASendMessage(post.id);
                                                                            }
                                                                            }}
                                                                            className="w-full h-2/3 rounded-[30px] px-3 py-2 text-base placeholder:text-xs text-sm bg-white
                                                                            text-black placeholder:text-gray-400 outline-1 placeholder:italic 
                                                                            focus:outline-1 focus:-outline-offset-1 focus:outline-indigo-500 overflow-hidden"
                                                                            placeholder=""
                                                                        />
                                                                    </div>
                                                                  
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                   
                                                </div>
                                            </>
                                        )}
                                    </div>

                                </div>

                                {/* Like button */}
                                <div className="w-full h-full flex flex-row justify-end items-center space-x-1">
                                    <div
                                        className={`w-15 h-15 cursor-pointer flex justify-center items-center`}
                                        onClick={() => handleLike(post.id)}>
                                        <svg 
                                            width="24" 
                                            height="24"
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 14 14">
                                            <path fill={post.likes.includes(sub) ? "red" : "white"} stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="m7 12.45l-5.52-5c-3-3 1.41-8.76 5.52-4.1c4.11-4.66 8.5 1.12 5.52 4.1Z"/>
                                        </svg>
                                    </div>
                                    <span className="text-[17px] font-light px-2 text-black">{post.likes_count || 0}</span>
                                </div>

                            </div> 

                        </div>

                                                    

                    </div>

                ))}

            {showFullDesc && (
                <>
                    {/* Dimmed background */}
                    <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
                    onClick={() => setShowFullDesc(null)} 
                    ></div>

                    <div
                        className="fixed top-1/2 left-1/2 w-full md:w-2/3 lg:w-2/3 h-2/3 bg-white rounded-[30px] shadow-lg cursor-pointer
                                    -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col justify-center items-center p-5 overflow-hidden"
                    >
                        <text className="font-light text-2xl tracking-widest text-black font-bold">{showFullDesc.dish_name}</text>
                        <div className="w-2/3 mt-5 mb-5 border-t border-gray-300"></div>
                        <div className="w-full h-full overflow-y-auto p-3">
                            <text className="font-thin text-md tracking-wide text-black">{showFullDesc.description}</text>
                        </div>

                        {/* Close */}
                        <motion.div 
                            className="flex w-full items-center mt-5 rounded-[30px] hover:bg-gray-50 justify-center p-2"
                            onClick={() => setShowFullDesc(null)}
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-md font-thin tracking-wide">close...</span>
                        </motion.div>                        

                    </div>
                </>
            )}


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

            </div>

        </div>
    )
};