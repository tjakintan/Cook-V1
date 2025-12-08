import React, { useRef, useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { input, tr } from "framer-motion/client";
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/component_style.css";
import Messages  from "./messages.jsx";

function MenuButton({ label, icon, onClick }) {

  return (
    <motion.button
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-row items-center justify-center space-x-2 
                 px-4 py-2 bg-white rounded-[20px]
                 font-thin tracking-wide text-black
                hover:bg-gray-50 transition cursor-pointer"
    >
      {icon}
      <span className="text-[11px] font-light tracking-wide">{label}</span>
    </motion.button>
  );
}


export default function Profile() {

    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [showPostSection, setShowPostSection] = useState(false);
    const [showLikeSection, setShowLikeSection] = useState(false);
    const [showInboxSection, setShowInboxSection] = useState(false);
    const [showMessageSection, setShowMessageSection] = useState(false);
    const [showAccountSection, setShowAccountSection] = useState(false);
    const [showAccountUpdateSection, setShowAccountUpdateSection] = useState(false);
    const fileInputRef = useRef(null);
    const profile_img = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


    const [user, setUser] = useState(null);

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


    
    const upload_inputRefs = {
        user_first_name: useRef(null),
        user_last_name: useRef(null),
        user_name: useRef(null),
    };

    const date_inputRefs = useRef([]);
    const date_inputs = [
        { id: "month", maxLength: 2, placeholder: "MM" },
        { id: "day", maxLength: 2, placeholder: "DD" },
        { id: "year", maxLength: 4, placeholder: "YYYY" },
    ];


    const dob_handleChange = (e, i) => {
        // Allow only digits
        const value = e.target.value.replace(/\D/, "");
        e.target.value = value;

        // Auto-tab to next input if field is filled
        if (value.length >= date_inputs[i].maxLength && i < date_inputRefs.current.length - 1) {
            date_inputRefs.current[i + 1].focus();
        }
    };

    const dob_handleKeyDown = (e, i) => {
        const value = e.target.value;

        // Backspace navigation
        if (e.key === "Backspace") {
            // If current input is empty, move to previous input
            if (!value && i > 0) {
            const prevInput = date_inputRefs.current[i - 1];
            prevInput.focus();
            // Optional: remove last character from previous field
            prevInput.value = prevInput.value.slice(0, prevInput.value.length - 1);
            }
        }
    };


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
        try {
            const res = await fetch(
                "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/actions",
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        action: actionName,
                        user_sub: sub,
                        ...payload, // merge in any additional data
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



    const handleDeleteAccount = async() => {

        const result = await callAction("delete_user_account");

        if (result?.status === "success") {
            handleLogout();
        } else {
            console.error("Failed to delete account:", result);
        }
    };

    

    const handleGetLikedPosts = async () => {
        console.log("get_user_liked_post");

        const result = await callAction("get_user_liked_post");

        if (result?.status === "success") {
            setLikedPosts(result.liked_posts || []);
            setShowLikeSection(true);
        }
    };

    const handleGetUserPosts = async () => {
        console.log("get_user_posts");

        const result = await callAction("get_user_posts");

        if (result?.status === "success") {
            setPosts(result.posts || []);
            setShowPostSection(true);
        }
    };

    const handleLogout = () => {
        // Clear auth tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("idToken");
        navigate("/feed");
    };

    const openFilePicker = () => fileInputRef.current.click();

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const fullBase64 = reader.result;

            if (!fullBase64) return; 

            const base64Only = fullBase64.split(",")[1] || "";
            profile_img.current = fullBase64.split(",")[1] || "";
            setPreviewUrl(fullBase64 || user.profile_img_url);
        };

        reader.readAsDataURL(file);
    };

    const handleUpdateAccount = async () => {
        const first_name = upload_inputRefs.user_first_name.current?.value || user.first_name;
        const last_name = upload_inputRefs.user_last_name.current?.value || user.last_name;
        const profile_name = upload_inputRefs.user_name.current?.value || user.profile_name;
        const profile_img_base64 = profile_img.current || null;

        const [month, day, year] = date_inputRefs.current.map(input => input.value);
        const dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

        const result = await callAction("update_user_account", {
            first_name,
            last_name,
            profile_name,
            profile_img_base64,
            dob
        });

        if (result?.status === "success") {
                    setUser(prev => ({
            ...prev,
            
            ...result.updated_user,
        }));

            setShowAccountSection(false);
        } else {
            console.error("Failed to update account:", result);
        }
    };


    


    return (
        <>            
            <div className="w-full h-full flex flex-col justify-end items-center">

                {/* Headers section */}
                <div className="w-full h-1/3 flex flex-row items-center justify-between px-10 py-15">

                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden shadow cursor-pointer relative group">
                            <img 
                                src={user.profile_img_url}
                                alt="profile"
                                className="absolute w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-30"
                            />
                            <div 
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                                onClick={() => setShowAccountSection(true)}
                            >
                                <svg 
                                    viewBox="0 0 24 24"
                                    className="w-10 h-10"
                                >
                                    <path fill="#000000" d="M14.5 23q-.625 0-1.063-.438T13 21.5v-7q0-.625.438-1.063T14.5 13h7q.625 0 1.063.438T23 14.5v7q0 .625-.438 1.063T21.5 23h-7Zm0-1.5h7v-.8q-.625-.775-1.525-1.238T18 19q-1.075 0-1.975.463T14.5 20.7v.8ZM18 18q.625 0 1.063-.438T19.5 16.5q0-.625-.438-1.063T18 15q-.625 0-1.063.438T16.5 16.5q0 .625.438 1.063T18 18Zm-6-6Zm.05-3.5q-1.45 0-2.475 1.025T8.55 12q0 1.2.675 2.1T11 15.35V13.1q-.2-.2-.325-.513T10.55 12q0-.625.438-1.063t1.062-.437q.35 0 .625.138t.475.362h2.25q-.325-1.1-1.238-1.8t-2.112-.7ZM9.25 22l-.4-3.2q-.325-.125-.613-.3t-.562-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.337v-.674q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75L19.925 11H17.4q-.025-.125-.05-.263t-.075-.262l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.213-.962t-1.437-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.6.625 1.35 1.05T11 17.4V22H9.25Z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[20px] font-light tracking-wide">
                                Welcome
                            </span>
                            <span className="text-[18px] font-extralight opacity-80">
                                {user.profile_name}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Functionality section */}
                <div className="w-full h-[20%] flex items-center justify-center p-5">

                    <div className="w-full h-full flex items-center justify-around">

                        <MenuButton
                            label="My Post"
                            icon={
                                <svg
                                    viewBox="0 0 24 24" 
                                    fill="#000000"
                                    className="w-7 h-7"
                                >
                                    <g fill="#000000"><path d="M5 1.25a.75.75 0 0 1 .75.75v.5c0 .966.784 1.75 1.75 1.75h9a1.75 1.75 0 0 0 1.75-1.75V2a.75.75 0 0 1 1.5 0v.5a3.25 3.25 0 0 1-3.25 3.25h-9A3.25 3.25 0 0 1 4.25 2.5V2A.75.75 0 0 1 5 1.25Z"/><path fill-rule="evenodd" d="M8.948 6.75h6.104c.899 0 1.648 0 2.242.08c.628.084 1.195.27 1.65.725c.456.456.642 1.023.726 1.65c.08.595.08 1.345.08 2.243v1.104c0 .899 0 1.648-.08 2.242c-.084.628-.27 1.195-.726 1.65c-.455.456-1.022.642-1.65.726c-.594.08-1.344.08-2.242.08H8.948c-.898 0-1.648 0-2.242-.08c-.628-.084-1.195-.27-1.65-.726c-.456-.455-.642-1.022-.726-1.65c-.08-.594-.08-1.344-.08-2.242v-1.104c0-.899 0-1.648.08-2.242c.084-.628.27-1.195.725-1.65c.456-.456 1.023-.642 1.65-.726c.595-.08 1.345-.08 2.243-.08ZM6.905 8.317c-.461.062-.659.169-.789.3c-.13.13-.237.327-.3.788c-.064.483-.066 1.131-.066 2.095v1c0 .964.002 1.612.067 2.095c.062.461.169.659.3.789c.13.13.327.237.788.3c.483.064 1.131.066 2.095.066h6c.964 0 1.612-.002 2.095-.066c.461-.063.659-.17.789-.3c.13-.13.237-.328.3-.79c.064-.482.066-1.13.066-2.094v-1c0-.964-.002-1.612-.067-2.095c-.062-.461-.169-.659-.3-.789c-.13-.13-.327-.237-.788-.3c-.483-.064-1.131-.066-2.095-.066H9c-.964 0-1.612.002-2.095.067Z" clip-rule="evenodd"/><path d="M7.5 18.25a3.25 3.25 0 0 0-3.25 3.25v.5a.75.75 0 0 0 1.5 0v-.5c0-.966.784-1.75 1.75-1.75h9c.966 0 1.75.784 1.75 1.75v.5a.75.75 0 0 0 1.5 0v-.5a3.25 3.25 0 0 0-3.25-3.25h-9Z"/></g>
                                </svg>
                            }
                            onClick={handleGetUserPosts}
                        />

                        <MenuButton
                            label="My Like"
                            icon={
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-7 h-7"
                                >
                                    <g fill="none"><path stroke="#000000" stroke-linecap="round" stroke-width="1.5" d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2"/><path stroke="#000000" stroke-linecap="round" stroke-width="1.5" d="m2 12.5l1.752-1.533a2.3 2.3 0 0 1 3.14.105l4.29 4.29a2 2 0 0 0 2.564.222l.299-.21a3 3 0 0 1 3.731.225L21 18.5"/><path fill="#000000" d="m16.06 8.57l.492-.566l-.492.566ZM18 3.968l-.532.529a.75.75 0 0 0 1.064 0L18 3.967Zm1.94 4.602l-.492-.566l.492.566ZM18 9.606v-.75v.75Zm-1.448-1.602c-.486-.422-.952-.895-1.292-1.374c-.347-.49-.51-.914-.51-1.255h-1.5c0 .788.358 1.518.786 2.122c.435.614.999 1.175 1.533 1.639l.983-1.132ZM14.75 5.375c0-.933.42-1.404.834-1.557c.426-.156 1.13-.08 1.884.679l1.064-1.058c-1.045-1.05-2.342-1.442-3.466-1.028c-1.136.418-1.816 1.555-1.816 2.964h1.5Zm5.681 3.761c.534-.464 1.098-1.025 1.533-1.639c.428-.604.786-1.334.786-2.122h-1.5c0 .341-.163.765-.51 1.255c-.34.48-.806.952-1.292 1.374l.983 1.132Zm2.319-3.76c0-1.41-.68-2.547-1.816-2.965c-1.124-.414-2.42-.023-3.466 1.028l1.064 1.058c.755-.76 1.458-.835 1.884-.679c.414.153.834.624.834 1.557h1.5Zm-7.181 3.76c.756.658 1.36 1.22 2.431 1.22v-1.5c-.424 0-.615-.129-1.448-.852l-.983 1.132Zm3.879-1.132c-.833.723-1.024.852-1.448.852v1.5c1.071 0 1.675-.562 2.431-1.22l-.983-1.132Z"/></g>
                                </svg>
                            }
                            onClick={handleGetLikedPosts}
                        />
                        
                        {/** 
                        <MenuButton
                            label="Inbox"
                            icon={
                                <svg 
                                    viewBox="0 0 20 20"
                                    className="w-7 h-7"
                                >
                                    <path fill="#000000" d="M16.157 0c.378 0 .842.372 1.035.83L20 7.439V18a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7.438L2.808.831C3 .372 3.465 0 3.843 0ZM6.741 8.838H1.4V18a.6.6 0 0 0 .6.6h16a.6.6 0 0 0 .6-.6V8.838h-4.341a3.902 3.902 0 0 1-7.518 0ZM15.913 1.4H4.087L1.52 7.438h6.505a2.5 2.5 0 1 0 4.95 0h5.505L15.913 1.4Z"/>
                                </svg>
                            }
                        //onClick={() => setShowInboxSection(true)} CHANGE LATER
                        />
                        */}

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
         
                                    <div className={`w-full h-full flex flex-col justify-center items-center p-5 gap-2 ${showAccountUpdateSection  ? "hidden" : ""} bg-white rounded-[30px]`}>


                                        {/* buttons */}
                                        <div className={`w-full h-full flex flex-row justify-center items-center`}>

                                            <motion.button
                                                    className="relative w-full h-full rounded-[10px] cursor-pointer "
                                                    animate={{ rotateY: showDeleteConfirm ? 180 : 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    style={{ transformStyle: "preserve-3d" }}
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                >

                                                    {/* Front (Delete) */}
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center"
                                                        style={{ backfaceVisibility: "hidden" }}
                                                    >
                                                        <span className="text-md font-light tracking-widest">Delete</span>
                                                    </div>

                                                    {/* Back (Confirm delete) */}
                                                    <div
                                                        className="absolute w-full h-full inset-0 flex items-center justify-center bg-red-500 rounded-[30px]"
                                                        style={{
                                                        transform: "rotateY(180deg)",
                                                        backfaceVisibility: "hidden"
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowAccountSection(false);
                                                            setShowDeleteConfirm(false);
                                                            //handleDeleteAccount();
                                                        }}
                                                    >
                                                    </div>

                                                </motion.button>

                                            <motion.div 
                                                whileHover={{ scale: 1.05 }} 
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className={`${showAccountUpdateSection ? "w-1/3" : "w-full"} h-full rounded-[10px] flex flex-row justify-center items-center space-x-1 hover:bg-green-500 cursor-pointer ${showDeleteConfirm ? "hidden" : ""}`}
                                                onClick={() => {
                                                    setShowAccountUpdateSection(true);
                                                    setPreviewUrl(user.profile_img_url);}}
                                            >
                                                <span className="text-md font-light text-center tracking-widest">Update</span>
                                            </motion.div>


                                            <motion.div 
                                                whileHover={{ scale: 1.05 }} 
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className={`w-full h-full rounded-[10px] flex flex-row justify-center items-center space-x-1 hover:bg-yellow-300 cursor-pointer ${showDeleteConfirm ? "hidden" : ""}`}
                                                onClick={handleLogout}
                                            >
                                                <span className="text-md font-light text-center tracking-widest">Log out</span>
                                            </motion.div>

                                        </div>

                                        <span className={`font-thin text-[9px] tracking-widest text-center ${showDeleteConfirm ? "" : "hidden"}`}>
                                            Please note that upon <span className="text-[9px] font-bold">Tapping the red circle</span>, all your data will be <span className="text-[10px] font-bold">deleted</span> and retained for 30 days in accordance with our policy. Review our <span className="underline">terms & conditions</span>, for more.
                                        </span>
                                    
                                     </div>

                                      {/* Update Account Section */}
                                    <div className={`w-full md:w-2/3 lg:w-2/3 h-full ${showAccountUpdateSection ? "" : "hidden"} flex flex-col justify-center items-center p-10 gap-5 bg-white rounded-[30px]`}>

                                        {/* EDIT profile image */}                         
                                        <div className="w-full h-[30%] flex flex-col justify-center items-center">
                                            <img
                                                src={previewUrl}
                                                className="w-25 h-25 rounded-full object-cover overflow-hidden outline-1 cursor-pointer"
                                                onClick={openFilePicker}
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleImageSelect}
                                            />
                                            <span htmlFor="email" className={`mt-1 block text-[12px] font-light text-black text-center tracking-widest`}>
                                                Change your a profile picture
                                            </span>
                                        </div>

                                        <div className="w-full border-t border-gray-300"></div>
                                        

                                        <div className="w-full h-full flex flex-col justify-center items-center bg-white gap-5 rounded-[30px]">
                                                 
                                            <span className={`block text-[15px] font-light text-black text-center tracking-widest`}>
                                                {user.email}
                                            </span>

                                            {/* EDIT first name*/}
                                            <motion.div 
                                                    className="w-full"
                                            >
                                                <input
                                                    id="user_first_name"
                                                    name="user_first_name"
                                                    type="text"
                                                    ref={upload_inputRefs.user_first_name}
                                                    placeholder={user.first_name}
                                                    className="w-full rounded-md bg-white px-3 py-1.5 text-base text-sm placeholder:text-xs 
                                                            text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic 
                                                            focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                                                />
                                            </motion.div>

                                            {/* EDIT last name*/}
                                            <motion.div 
                                                className="w-full"
                                            >
                                                <input
                                                    id="user_last_name"
                                                    name="user_last_name"
                                                    type="text"
                                                    ref={upload_inputRefs.user_last_name}
                                                    placeholder={user.last_name}
                                                    className="w-full rounded-md bg-white px-3 py-1.5 text-base text-sm placeholder:text-xs 
                                                                text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic
                                                                focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                                                />
                                            </motion.div> 

                                            {/* EDIT dob */}
                                            <motion.div 
                                                className="w-full flex flex-col justify-start"
                                            >
                                                <div className="w-full flex items-center justify-start gap-2">
                                                    {date_inputs.map((date_input, i) => {
                                                        
                                                       const dobDate = user?.dob ? new Date(user.dob) : null;

                                                        // Extract parts in order: MM / DD / YYYY
                                                        const dobParts = dobDate
                                                        ? [
                                                            String(dobDate.getMonth() + 1).padStart(2, "0"), // Month (0-based, so +1)
                                                            String(dobDate.getDate()).padStart(2, "0"),      // Day
                                                            String(dobDate.getFullYear())                    // Year
                                                            ]
                                                        : ["", "", ""];

                                                        // For your input
                                                        const placeholderValue = dobParts[i] || date_input.placeholder

                                                        return (
                                                            <React.Fragment key={date_input.id}>
                                                                <input
                                                                    id={date_input.id}
                                                                    ref={(el) => (date_inputRefs.current[i] = el)}
                                                                    maxLength={date_input.maxLength}
                                                                    placeholder={placeholderValue}
                                                                    onChange={(e) => dob_handleChange(e, i)}
                                                                    onKeyDown={(e) => dob_handleKeyDown(e, i)}
                                                                    className="w-12 h-8 flex items-center justify-center rounded-md bg-white text-center text-black 
                                                                            text-sm outline-1 outline-black focus:outline-2 focus:outline-indigo-500 cursor-text"
                                                                />
                                                                {i < date_inputs.length - 1 && <span className="text-black text-sm">/</span>}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>

                                            {/* EDIT user_name*/}
                                            <motion.div 
                                                className="w-1/2"
                                            >
                                                <input
                                                    id="user_last_name"
                                                    name="user_last_name"
                                                    type="text"
                                                    ref={upload_inputRefs.user_name}
                                                    placeholder={user.profile_name}
                                                    className="w-full rounded-md bg-white px-3 py-1.5 text-base text-sm placeholder:text-xs 
                                                                text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic
                                                                focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                                                />
                                            </motion.div> 

                                        </div>

                                        <motion.div 
                                            whileHover={{ scale: 1.05 }} 
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className={`w-full h-full flex flex-col justify-center items-center space-x-1 cursor-pointer `}
                                            onClick={handleUpdateAccount}
                                        >
                                            <span className="w-full text-md rounded-[30px] font-light text-center tracking-widest hover:bg-gray-50 px-3 py-2">Update</span>                                      
                                        </motion.div>

                                        <span className={`text-[10px] font-thin text-center text-black tracking-widest`}>
                                            Changes will be fully reflected after restarting the application.
                                        </span> 

                                    </div>

                          
                            
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
                                                                <g fill="none"><rect width="18" height="15" x="3" y="6" stroke="#000000" stroke-width="2" rx="2"/><path fill="#000000" d="M3 10c0-1.886 0-2.828.586-3.414C4.172 6 5.114 6 7 6h10c1.886 0 2.828 0 3.414.586C21 7.172 21 8.114 21 10z"/><path stroke="#000000" stroke-linecap="round" stroke-width="2" d="M7 3v3m10-3v3"/><rect width="4" height="2" x="7" y="12" fill="#000000" rx=".5"/><rect width="4" height="2" x="7" y="16" fill="#000000" rx=".5"/><rect width="4" height="2" x="13" y="12" fill="#000000" rx=".5"/><rect width="4" height="2" x="13" y="16" fill="#000000" rx=".5"/></g>
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

        {/* Inbox Section     
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

        */}



        </>


    )
}