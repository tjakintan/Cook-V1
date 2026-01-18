import { useRef, useEffect, useState } from "react";
import "../styles/component_style.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../utils/user.jsx";
import { useSignOut, getUserSub } from "../utils/auth.js";
import Profile from "../components/profile";

function SettingsFooter({ passToHeadClick }) {

    const navigate = useNavigate();
    const { user } = useUser();
    const location = useLocation();
    const [ showSignInUpPage, setShowSignInUpPage ] = useState(false);
    const [ showProfilePage, setShowProfilePage ] = useState(false);
    const [profilePos, setProfilePos] = useState({ top: 0, left: 0 });
    const userButtonRef = useRef(null);

    const openProfile = () => {
        if (userButtonRef.current) {
        const rect = userButtonRef.current.getBoundingClientRect();
        setProfilePos({
            top: rect.bottom + 5, 
            left: rect.right - 300, 
        });
        setShowProfilePage(true);
        }
    };

    useEffect(() => {
        if (showSignInUpPage || showProfilePage) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showSignInUpPage, showProfilePage]);

    return (
        <>

            <div className="relative p-2 w-full md:w-2/3 flex items-center justify-between ">

                {/* goMeal Icon and link to home */}
                <NavLink to="/" className="flex items-center">
                    <img
                        src="/gomeal1.png"
                        className="w-12 h-12 object-contain"
                        alt="GoMeal"
                    />
                </NavLink>

                {/* links to settings & authenticate/showProfile */}
                <div className="flex gap-6">

                    {/* if user show profile if not show signUpIn Page */}
                    {user ? (
                        <div 
                            ref={userButtonRef}
                            className={`relative isolate w-8 h-8 rounded-full flex items-center justify-center z-10 cursor-pointer overflow-hidden`}
                            onClick={openProfile}
                        >
                        <img
                            src={user.profile_img_url}
                            alt="profile"
                            className={`object-cover cursor-pointer `}
                        />
                        </div>
                    ) : (
                        <button
                        onClick={() => {setShowSignInUpPage(true)}}
                        className="cursor-pointer"
                        >
                        <svg viewBox="0 0 1664 1664" className="w-5 h-5">
                            <path
                            fill="currentColor"
                            d="M832 0Q673 0 560.5 112.5T448 384t112.5 271.5T832 768t271.5-112.5T1216 384t-112.5-271.5T832 0zm0 896q112 0 227 22t224 69.5t193.5 114t136 162.5t51.5 208q0 75-57 133.5t-135 58.5H192q-78 0-135-58.5T0 1472q0-112 51.5-208t136-162.5t193.5-114T605 918t227-22z"
                            />
                        </svg>
                        </button>
                    )}

                    {/* Settings Button */}
                    <button className="flex cursor-pointer" onClick={passToHeadClick}>
                        <svg viewBox="0 0 42 42" className="w-6 h-6">
                        <path
                            fill="currentColor"
                            d="M6.62 24.5c.4 1.62 1.06 3.13 1.93 4.49l-2.43 2.44c-1.09 1.09-1.08 1.74-.12 2.7l2.37 2.37c.97.971 1.63.95 2.7-.12l2.55-2.56c1.2.688 2.5 1.22 3.88 1.56v3.12c0 1.55.47 2 1.82 2h3.36c1.37 0 1.82-.48 1.82-2v-3.12c1.38-.34 2.68-.87 3.88-1.56l2.61 2.619c1.08 1.068 1.729 1.09 2.699.131l2.381-2.381c.949-.949.97-1.602-.131-2.699l-2.5-2.5a14.665 14.665 0 0 0 1.938-4.49h3.302c1.368 0 1.818-.48 1.818-2v-3c0-1.48-.393-2-1.818-2h-3.302c-.34-1.38-.87-2.68-1.562-3.88l2.382-2.37c1.05-1.05 1.14-1.7.13-2.7l-2.38-2.38c-.95-.95-1.632-.94-2.7.13l-2.26 2.25A14.946 14.946 0 0 0 24.5 6.62V3.5c0-1.48-.391-2-1.82-2h-3.36c-1.35 0-1.82.49-1.82 2v3.12c-1.62.4-3.13 1.06-4.49 1.93L10.75 6.3C9.68 5.23 9 5.22 8.05 6.17L5.67 8.55c-1.01 1-.92 1.65.13 2.7l2.37 2.37c-.68 1.2-1.21 2.5-1.55 3.88h-3.3c-1.35 0-1.82.49-1.82 2v3c0 1.55.47 2 1.82 2h3.3zm8.66-3.5c0-3.16 2.56-5.72 5.72-5.72s5.721 2.56 5.721 5.72a5.72 5.72 0 1 1-11.441 0z"
                        />
                        </svg>
                    </button>

                </div>

            </div>


            {showSignInUpPage &&  (
                <>
                <div
                    className="fixed inset-0 backdrop-blur-sm z-40"
                    onClick={() => setShowSignInUpPage(false)}
                />
                <div
                    className="fixed top-1/2 left-1/2 isolate w-full md:w-2/3 lg:w-2/3
                            -translate-x-1/2 -translate-y-1/2 z-50
                            flex flex-col justify-center items-center gap-4 p-5 font-thin"
                >
                    <span className="tracking-wider">You’re almost there</span>
                    <h1 className="text-center text-sm">Get to save recipes, upload dishes, and personalize your feed</h1>
                    <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                        className="w-11/12 md:w-1/3 lg:w-1/3 p-3 rounded-[30px] bg-black outline-2 outline-black text-white text-start cursor-pointer tracking-wider rounded-l-none"
                        onClick={() => navigate("/auth?mode=signup")}
                    >sign Up
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                        className="w-11/12 md:w-1/3 lg:w-1/3 p-3 rounded-[30px] bg-white outline-2 cursor-pointer tracking-wider text-start rounded-l-none"
                        onClick={() => navigate("/auth?mode=signin")}
                    >sign In
                    </motion.button>
                </div>
                </>
            )}

            {showProfilePage && user && (
                <>
                <div
                    className="fixed inset-0 bg-white/5 backdrop-blur-xs z-40"
                    onClick={() => setShowProfilePage(false)}
                />
                <div
                    className="fixed w-[300px] z-70 flex flex-col justify-start items-end py-3 relative"
                    style={{
                    top: profilePos.top,
                    left: profilePos.left,
                    }}
                >
                    <div className="absolute top-0 w-0 h-0 mr-1
                                    border-l-[15px] border-l-transparent
                                    border-r-[15px] border-r-transparent
                                    border-b-[15px] border-b-[#00ffff] shadow-2xl"></div>
                                    
                    <div className="flex shadow-lg -mr-20 rounded-[30px] bg-gradient-to-b from-[#00ffff] via-[#7dd3fc] to-[#c4b5fd]">
                    <Profile />
                    </div>
                </div>
                </>
            )}

        </>
    );
}

const UpdateAccount = ({payload = {}, passToHeadUpdate }) => {

    const { user } = useUser();

    const upload_inputRefs = {
        user_first_name: useRef(null),
        user_last_name: useRef(null),
        user_name: useRef(null),
    };
    const fileInputRef = useRef(null);
    const profile_img = useRef(payload.profile_img_base64 || "");
    const [previewUrl, setPreviewUrl] = useState(user?.profile_img_url || "");
    const [isLoading, setIsLoading] = useState(false);

    const openFilePicker = () => fileInputRef.current.click();

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const fullBase64 = reader.result;
            if (!fullBase64) return;
            profile_img.current = fullBase64.split(",")[1] || "";
            setPreviewUrl(fullBase64);
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateAccount = async () => {
        setIsLoading(true);

        const first_name = upload_inputRefs.user_first_name.current?.value || user.first_name;
        const last_name = upload_inputRefs.user_last_name.current?.value || user.last_name;
        const profile_name = upload_inputRefs.user_name.current?.value || user.profile_name;
        const profile_img_base64 = profile_img.current || null;

        // Build payload
        const updatedPayload = {
            first_name,
            last_name,
            profile_name,
            profile_img_base64,
        };

        // Send to parent
        passToHeadUpdate(updatedPayload);

        setIsLoading(false);
    };

    return (
        <>
        
            {/* Update Account Section */}
            <div className={`w-full md:w-2/3 lg:w-2/3 h-full flex flex-col justify-center items-center p-10 gap-5 bg-white rounded-[30px]`}>

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
                        Choose a new profile picture
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
                            placeholder={user.first_name || "first name"}
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
                            placeholder={user.last_name || "last name"}
                            className="w-full rounded-md bg-white px-3 py-1.5 text-base text-sm placeholder:text-xs 
                                        text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                        />
                    </motion.div> 

                    {/* Show dob */}
                    <div className="w-full flex flex-col justify-start">
                        <div className="w-full flex items-center justify-center font-thin gap-2 tracking-widest">
                            {(() => {
                            if (!user?.dob) return "-- / -- / ----";

                            const dobDate = new Date(user.dob);

                            const formattedDob = [
                                String(dobDate.getMonth() + 1).padStart(2, "0"),
                                String(dobDate.getDate()).padStart(2, "0"),
                                String(dobDate.getFullYear())
                            ].join(" / ");

                            return formattedDob;
                            })()}
                        </div>
                    </div>

                    {/* EDIT user_name*/}
                    <motion.div 
                        className="w-1/2"
                    >
                        <input
                            id="user_last_name"
                            name="user_last_name"
                            type="text"
                            ref={upload_inputRefs.user_name}
                            placeholder={user.profile_name || "user name"}
                            className="w-full rounded-md bg-white px-3 py-1.5 text-base text-sm placeholder:text-xs 
                                        text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                        />
                    </motion.div> 

                </div>

                <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-full h-[50px] flex justify-start items-center space-x-1 cursor-pointer 
                                text-md rounded-[30px] rounded-l-none text-white font-light tracking-widest px-3 py-3
                                ${isLoading ? "" : "bg-black"}`}
                    onClick={() => {if (!isLoading) handleUpdateAccount();}}
                >            
                    {isLoading ? (
                        <div className="h-full w-full flex justify-center items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <circle cx="12" cy="2" r="0" fill="#000">
                                <animate attributeName="r" begin="0s" dur="1s" repeatCount="indefinite" values="0;2;0;0" />
                                </circle>
                                <circle cx="12" cy="2" r="0" fill="#000" transform="rotate(90 12 12)">
                                <animate attributeName="r" begin="0.25s" dur="1s" repeatCount="indefinite" values="0;2;0;0" />
                                </circle>
                                <circle cx="12" cy="2" r="0" fill="#000" transform="rotate(180 12 12)">
                                <animate attributeName="r" begin="0.5s" dur="1s" repeatCount="indefinite" values="0;2;0;0" />
                                </circle>
                                <circle cx="12" cy="2" r="0" fill="#000" transform="rotate(270 12 12)">
                                <animate attributeName="r" begin="0.75s" dur="1s" repeatCount="indefinite" values="0;2;0;0" />
                                </circle>
                            </svg>
                        </div>
                    ) : (
                        "update"
                    )}                                      
                </motion.div>

                <span className={`text-[10px] font-thin text-center text-black tracking-widest`}>
                    Changes will be fully reflected after restarting the application.
                </span> 

            </div>
        </>
    );
}

export default function Settings({isOpen, toggleOpen }) {

    const { user, setUser, loading } = useUser();
    const signout = useSignOut();
    const [isLoading, setIsLoading] = useState(false);
    const [showAccountUpdateSection, setShowAccountUpdateSection] = useState(false);
    //const [updateAccountClicked, setUpdateAccountClicked] = useState(false);
    const fileInputRef = useRef(null);
    const profile_img = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const callAction = async (actionName, payload = {}) => {

        if (isLoading) return;
        setIsLoading(true);

        const sub = getUserSub(user);

        if (!sub) {
            console.error("No user speciied")
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

    const handleSignOut = () => {
        signout();
    }

    const handleDeleteAccount = async() => {

        const result = await callAction("delete_user_account");

        if (result?.status === "success") {
            handleSignOut();
        } else {
            console.error("Failed to delete account:", result);
        }
    };

    const handleUpdateAccount = async () => {

        const first_name = upload_inputRefs.user_first_name.current?.value || user.first_name;
        const last_name = upload_inputRefs.user_last_name.current?.value || user.last_name;
        const profile_name = upload_inputRefs.user_name.current?.value || user.profile_name;
        const profile_img_base64 = profile_img.current || null;

        const result = await callAction("update_user_account", {
            first_name,
            last_name,
            profile_name,
            profile_img_base64,
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
        <div className={`flex flex-col items-center justify-between`}>

            <div className={`w-full px-3 pt-0 flex items-center ${isOpen ? "h-[75vh] max-w-full md:max-w-2/3" : "hidden"}`}>
                <div className="w-full h-full flex flex-col p-3 gap-5 justify-between bg-gray-200 rounded-[30px] rounded-t-none">
                    <div className="w-full flex flex-col gap-6 h-2/5 bg-red-300 px-10">
                        <div className="w-full h-1/2 bg-purple-300 rounded-[30px]">

                        </div>
                        <div className="w-full h-1/2 bg-cyan-300 rounded-[30px]">

                        </div>
                    </div>
                    <div className="w-full h-3/5 rounded-[30px] bg-orange-300">

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
                                    className="absolute inset-0 flex items-center justify-center bg-red-500 rounded-[30px]"
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
                                        //setShowAccountSection(false);
                                        setShowDeleteConfirm(false);
                                        handleDeleteAccount();
                                    }}
                                >
                                </div>

                            </motion.button>

                            <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`${showAccountUpdateSection ? "w-1/3" : "w-full"} h-full rounded-[30px] flex flex-row justify-center items-center space-x-1 bg-green-500 cursor-pointer ${showDeleteConfirm ? "hidden" : ""}`}
                                onClick={() => {
                                    setShowAccountUpdateSection(true);
                                    setPreviewUrl(user.profile_img_url);}}
                            >
                                <span className="text-md font-light text-center tracking-widest">Update</span>
                            </motion.div>


                            <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`w-full h-full rounded-[30px] flex flex-row justify-center items-center space-x-1 bg-yellow-300 cursor-pointer ${showDeleteConfirm ? "hidden" : ""}`}
                                onClick={handleSignOut}
                            >
                                <span className="text-md font-light text-center tracking-widest">signout</span>
                            </motion.div>

                            <span className={`font-thin text-[9px] tracking-widest text-center ${showDeleteConfirm ? "" : "hidden"}`}>
                                Please note that upon <span className="text-[9px] font-bold">Tapping the red circle</span>, all your data will be <span className="text-[10px] font-bold">deleted</span> and retained for 30 days in accordance with our policy. Review our <span className="underline">terms & conditions</span>, for more.
                            </span>

                        </div>

                    </div>
                </div>
            </div>

            <SettingsFooter passToHeadClick={toggleOpen}/>

        </div>
    );
}
