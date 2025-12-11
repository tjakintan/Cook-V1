import React, { useRef, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import "../styles/component_style.css";

export default function Messages() {
    const [user, setUser] = useState(null);
    const [inbox, setInbox] = useState({});
    const [groupedInbox, setGroupedInbox] = useState({});
    const [openConversation, setOpenConversation] = useState({});
    const [messageText, setMessageText] = useState("");
    const [activeUserSub, setActiveUserSub] = useState(null); // current open conversation
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const accessToken = localStorage.getItem("accessToken");
    const sub = accessToken ? jwtDecode(accessToken).sub : null;

    // Fetch user info
    useEffect(() => {
        if (!sub) return;

        const fetchUserInfo = async () => {
            try {
                const res = await fetch("https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/user", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ sub }),
                });
                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error("Failed to fetch user info:", err);
            }
        };
        fetchUserInfo();
    }, [sub]);

    const callAction = async (actionName, payload = {}) => {
        try {
            const res = await fetch("https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/actions", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ action: actionName, user_sub: sub, ...payload }),
            });
            return await res.json();
        } catch (err) {
            console.error("API error:", err);
            return null;
        }
    };

    // Fetch inbox and group by user pairs
    const fetchInbox = async () => {
        const result = await callAction("get_inbox");
        if (result?.status === "success") {
            const inboxObj = result.inbox || {};

            // Group by other user sub
            const grouped = {};
            Object.values(inboxObj).forEach(item => {
                const otherSub = item.other_user?.sub || "unknown";

                // Keep the latest message
                if (!grouped[otherSub] || new Date(item.last_message_at) > new Date(grouped[otherSub].last_message_at)) {
                    grouped[otherSub] = item;
                }
            });

            // Sort by newest message
            const sortedGrouped = Object.fromEntries(
                Object.entries(grouped).sort(
                    ([, a], [, b]) => new Date(b.last_message_at) - new Date(a.last_message_at)
                )
            );

            setInbox(inboxObj);
            setGroupedInbox(sortedGrouped);
        }
    };

    // Load all messages for a user pair
    const openOrLoadConversation = async (otherUserSub) => {
        try {
            const res = await fetch("https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/actions", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    action: "get_or_create_conversation",
                    user_a: sub,
                    user_b: otherUserSub,
                }),
            });

            const data = await res.json();
            const parsed = data.body ? JSON.parse(data.body) : data;

            if (parsed.success) {
                setMessages(parsed.messages || []);
                setActiveUserSub(otherUserSub);
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } catch (err) {
            console.error("Error loading conversation:", err);
        }
    };

    const handleASendMessage = async () => {

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
                        user_b: activeUserSub,
                        message: messageText
                    }),
                }
            );
            const data = await res.json();

            if (data.status === "success") {
                setActiveUserSub(null); 
                //setShowProfileSection(null);
                setMessageText(""); 
            } else {
                console.error("Failed to send message:");
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }

    };

    useEffect(() => {
        if (!sub) return;
        fetchInbox();
    }, [sub]);

    return (
        <div className="w-full flex flex-col items-center justify-start p-2 gap-4 overflow-y-auto scrollbar-hide">
            {Object.entries(groupedInbox).map(([otherSub, convo]) => {
                const other = convo.other_user || {};
                const displayName = other.name || "Unknown";
                const displayImg = other.img || "/default.png";

                const isOpen = activeUserSub === otherSub; // only expand if this conversation is active

                return (
                    <motion.div
                        key={otherSub}
                        layout // enables smooth height animation
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-full flex flex-col bg-white rounded-[30px] p-3 cursor-pointer"
                        onClick={() => {
                            if (isOpen) {
                                setActiveUserSub(null); // collapse if already open
                            } else {
                                openOrLoadConversation(otherSub);
                            }
                        }}
                    >
                        <div className="flex flex-row items-center space-x-3">
                            <img src={displayImg} alt={displayName} className="w-10 h-10 rounded-full" />
                            <div className="flex flex-col">
                                <span className="font-extralight tracking-wider text-lg">{displayName}</span>
                                <span className={`text-gray-500 font-thin text-xs ${isOpen ? "hidden" : ""}`}>{convo.last_message}</span>
                            </div>
                            <span className={`ml-auto text-xs text-gray-400 ${isOpen ? "hidden" : ""}`}>
                                {new Date(convo.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-3 rounded-lg p-3"
                            >
                                <div className="w-full max-h-[25vh] flex flex-col p-4 rounded-xl overflow-y-auto scrollbar-hide">

                                    {messages.length === 0 ? (
                                        <div className="text-gray-500 text-center">No messages in this conversation</div>
                                    ) : (
                                        messages.map(msg => {
                                            const isSender = msg.sender_sub === sub;
                                            return (
                                                <div key={msg.message_id} className={`flex ${isSender ? 'justify-end' : 'justify-start'} w-full mb-2`}>
                                                    <div className={`flex flex-col max-w-[70%] ${isSender ? 'items-end' : 'items-start'}`}>
                                                        <div className={`px-5 py-1 rounded-[30px] ${isSender ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white text-black rounded-bl-none'} shadow`}>
                                                            {msg.reply_to && (
                                                                <div className="text-xs text-gray-400 italic mb-1 border-l-2 border-gray-300 pl-2">
                                                                    {msg.reply_to.content}
                                                                </div>
                                                            )}
                                                            {msg.content}
                                                        </div>
                                                        <div className="text-right text-[10px] font-thin text-gray-500 mt-1">
                                                            {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                               
                                </div>
                                {/* Send conversation */}
                                <div className={`w-full mt-1 flex items-center flex-row `}
                                    onClick={(e) => e.stopPropagation()}>
                                        <textarea 
                                        value={messageText}      
                                        onChange={(e) => {setMessageText(e.target.value)}} 
                                        onKeyDown={async (e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            const result = await handleASendMessage();
                                        }
                                        }}
                                        className="w-full h-9 rounded-[30px] px-3 py-2 text-base placeholder:text-xs text-sm bg-white
                                        text-black placeholder:text-gray-400 outline-1 placeholder:italic 
                                        focus:outline-1 focus:-outline-offset-1 focus:outline-indigo-500 overflow-hidden"
                                        placeholder=""
                                    />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                );
            })}

        </div>
    );
}


