import React, { useRef, useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import "../styles/component_style.css";

export default function Messages() {

    const [user, setUser] = useState(null);
    const [inbox, setInbox] = useState([]); 
    const [messageContent, setMessageContent] = useState(""); 
    const messagesEndRef = useRef(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [selectedConversationName, setSelectedConversationName] = useState(null);
    const [showReplyPostQuestion, setShowReplyPostQuestion] = useState(false);


    const [showSendMessageSection, setShowSendMessageSection] = useState(false);
    const [selectedSenderId, setSelectedSenderId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [showReplyUserPostQuestion, setShowReplyUserPostQuestion] = useState(true);
   
    const [selectedRootMessageId, setSelectedRootMessageId] = useState(null);


    const accessToken = localStorage.getItem("accessToken");
    let sub = null;

    if (accessToken) {
        const decoded = jwtDecode(accessToken);
        sub = decoded.sub;
    }

    useEffect(() => {
        if (!sub) return;

        async function fetchUserInfo() {
            const response = await fetch(
                "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/user",
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ sub }),
                }
            );
            const data = await response.json();
            setUser(data.user);
        }
        fetchUserInfo();
    }, [sub]);  

    const callAction = async (actionName, payload = {}) => {
        try {
            const res = await fetch(
                "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/actions",
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
        }
    };

    const fetchInbox = async () => {
        try {
            const result = await callAction("get_inbox");

            if (result?.status === "success") {
                const inboxData = result.inbox || [];

                const sortedInbox = inboxData.sort(
                    (a, b) => new Date(a.sent_at) - new Date(b.sent_at)
                );
                setInbox(sortedInbox);
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } catch (err) {
            console.error("Failed to fetch inbox:", err);
        }
    };

    useEffect(() => {
        if (!sub) return;
        fetchInbox();
    }, [sub]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [inbox]);

    const handleSend = async (replyToId = null) => {

        if (!messageContent.trim()) return;

        if (!selectedPost) {
            console.error("No post selected to send message to!");
            return;
        }

        const res = await fetch(
        "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/actions",
        {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
            action: "send_message",
            user_sub: sub,
            post_id: selectedPost.post_id,
            message: messageContent,
            reply_to_id: replyToId
            }),
        }
        );

        const data = await res.json();

        if (data.status === "success") {
            setMessageContent("");
            setShowReplyPostQuestion(false);
            await fetchInbox();
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });      
        }   

    };
        
    return (

        <div className="w-full h-full flex flex-col items-center justify-start p-5 gap-4 overflow-y-auto scrollbar-hide bg-blue-100">

             {/* Conversation List */}
            <div className="w-full h-full flex flex-col gap-2 p-2 bg-red-100 rounded-[45px] overflow-y-auto scrollbar-hide">

  {[...new Set(inbox.map(m => m.conversation_id))].map(conversation_id => {

      const allMessagesMap = inbox.filter(m => m.conversation_id === conversation_id);

      return (
          <div
              key={conversation_id}
              className={`flex flex-col gap-2 p-2 rounded-[45px] cursor-pointer overflow-hidden ${
                  selectedConversationId === conversation_id ? "bg-blue-200" : "bg-white"
              }`}
              onClick={() => {
                  setSelectedConversationId(conversation_id);
                  if (allMessagesMap.length > 0) {
                      setSelectedConversationName(allMessagesMap[allMessagesMap.length - 1].sender_name);
                  }
              }}
          >

              {/* Render all messages inside this conversation */}
              {allMessagesMap.map((msg, index) => (
                  <div
                      key={msg.message_id}
                      className="flex flex-row justify-between items-center p-2 rounded-[25px] bg-blue-100"
                  >
                      <div className="flex flex-row items-center space-x-2">
                          <img 
                              src={msg.sender_img} 
                              alt="Sender Profile" 
                              className="w-10 h-10 rounded-full object-cover outline-1" 
                          />
                          <span className="font-thin tracking-wide">{msg.sender_name}</span>
                      </div>
                      <div className="flex flex-row items-center">
                          {msg.post_img && (
                              <img
                                  src={msg.post_img}
                                  alt="Post Image"
                                  className="w-20 h-20 rounded-[15px] object-cover"
                              />
                          )}
                          <span className="ml-2">{msg.content}</span>
                      </div>
                  </div>
              ))}

          </div>
      );
  })}

</div>
        
        </div>

    );

}