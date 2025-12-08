import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { input, tr } from "framer-motion/client";
import {
  handleForgotPassword as cognitoForgot,
  handleConfirmForgotPassword as cognitoConfirmForgotPassword,
  handleConfirmUser as cognitoConfirmUser,
  handleResendConfirmationCode as resendConfirmUser
} from "../components/cognito.js";

export default function SignUpIn({ showProfile, setShowProfile }) {

    const profile_img = useRef(null);

    const passcode_inputRefs = useRef([]);
    const passcode_inputRefs2 = useRef([]);
    const passcode_inputRefs3 = useRef([]);
    const passcode_inputRefs4 = useRef([]);
    const passcode_inputRefs5 = useRef([]);

    const date_inputRefs = useRef([]);
    const payload_inputRefs = {
        user_first_name: useRef(null),
        user_last_name: useRef(null),
        signIn_user_email: useRef(null),
        signUp_user_email: useRef(null),
        signUp_confirm_user_email: useRef(null),
        user_name: useRef(null),
    };
    const [showSignUp, setShowSignUp] = useState(false);
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [shake, setShake] = useState(false);
    const [emailInUse, setEmailInUse ] = useState(false);
    const [passcodeIncorrect, setPasscodeIncorrect] = useState(false);
    const [emailNotMatch, setEmailNotMatch] = useState(false);
    const [showForgotPasswordSection, setShowForgotPasswordSection] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [confirmForgotPasswordSent, setConfirmForgotPasswordSent] = useState(false);
    const [confirmSignUp, setConfirmSignUp] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);

    const sign_up_payload = () => {

        const [month, day, year] = date_inputRefs.current.map(input => input.value);
        const dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const first_name = payload_inputRefs.user_first_name.current?.value || '';
        const last_name = payload_inputRefs.user_last_name.current?.value || '';

        const email = payload_inputRefs.signUp_user_email.current?.value || '';
        const confirm_email = payload_inputRefs.signUp_confirm_user_email.current?.value || '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email) || !emailRegex.test(confirm_email)) {
            setInvalidEmail(true);
            setTimeout(() => setInvalidEmail(false), 1500); 
            return null;
        }
        
        if (email !== confirm_email){
            setEmailNotMatch(true);
            setTimeout(() => setEmailNotMatch(false), 500);
            return null;
        }


        const profile_name = payload_inputRefs.user_name.current?.value || '';
        const profile_img_base64 = profile_img.current || null;
        const passcode = passcode_inputRefs.current.map(input => input.value).join('');

        if (!first_name || !last_name || !email || !profile_name || !dob || passcode.length !== 6) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return null; 
        }

        const jsonData = {
            first_name,
            last_name,
            email,
            profile_name,
            dob,
            passcode,
            profile_img_base64
        };

        return jsonData;

    };


    const handleSignUp = async (e) => {
        //e.preventDefault();
        const payload = sign_up_payload();

        if (!payload) {
            return;  
        }

        try {
            const response = await fetch('https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/signup', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setConfirmSignUp(true);
                //setShowSignUp(false);
                console.log('User signed up successfully:', data);
            } else if (response.status === 409) {
                setEmailInUse(true);
                setTimeout(() => setEmailInUse(false), 500);
                console.error('Sign-up error:', data);
            }
        } catch (err) {
            console.error('Network error:', err);
        }
    };


    const sign_in_payload = () => {

        const email = payload_inputRefs.signIn_user_email.current?.value || '';
        const rawPasscode = passcode_inputRefs2.current.map(input => input.value).join('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate email
        if (!email || !emailRegex.test(email)) {
            setInvalidEmail(true);
            setTimeout(() => setInvalidEmail(false), 1500);
            return null;
        } 

        const jsonData = {
            email,
            incomingPasscode: rawPasscode
        };

        return jsonData;

    };

    const handleSignIn = async (e) => {
        //e.preventDefault();
        const payload = sign_in_payload();
        
        if (!payload) {
            return;  
        }

        try {
            const response = await fetch('https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/signin', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.status === 200 ||data.status === "success") {
                const { tokens } = data;
                localStorage.setItem('idToken', tokens.IDToken);
                localStorage.setItem('accessToken', tokens.AccessToken);
                setShowProfile(true);
                window.location.reload();
                console.log('User signed in successfully:', data);
            }
            if (response.status === 403 || data.status === "not_found") {
                setShowSignUp(true);
                console.error('User does not exist', data);
            } 
            if (response.status === 401 || data.status === "unauthorized") {
                setPasscodeIncorrect(true);
                setTimeout(() => setPasscodeIncorrect(false), 500);
                console.error('passcode incorrect', data);
            }
        } catch (err) {
            console.error('Network error:', err);
        }
    };

    const date_inputs = [
        { id: "month", placeholder: "mm", maxLength: 2 },
        { id: "day", placeholder: "dd", maxLength: 2 },
        { id: "year", placeholder: "yyyy", maxLength: 4 },
    ];

    // Handle change for a group of inputs
    const passcode_handleChange = (e, index, refArray) => {
        const value = e.target.value;

        // Only allow digits
        if (!/^\d*$/.test(value)) {
            e.target.value = "";
            return;
        }

        // Keep only the last digit typed
        e.target.value = value.slice(-1);

        // Move to next input if exists
        if (value && index < refArray.current.length - 1) {
            refArray.current[index + 1]?.focus();
        }
    };

    // Handle backspace for a group of inputs
    const passcode_handleKeyDown = (e, index, refArray) => {
        if (e.key === "Backspace") {
            if (!e.target.value && index > 0) {
                refArray.current[index - 1]?.focus();
            }
        }
    };


    const date_handleChange = (e, i) => {
        // Allow only digits
        const value = e.target.value.replace(/\D/, "");
        e.target.value = value;

        // Auto-tab to next input if field is filled
        if (value.length >= date_inputs[i].maxLength && i < date_inputRefs.current.length - 1) {
            date_inputRefs.current[i + 1].focus();
        }
    };

    const date_handleKeyDown = (e, i) => {
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

    const openFilePicker = () => fileInputRef.current.click();

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const fullBase64 = reader.result;
            setImagePreview(fullBase64);

            const base64Only = fullBase64.split(",")[1];

            profile_img.current = base64Only;
            
        }; // base64 preview
        reader.readAsDataURL(file);
    };

    const handleForgotPassword = async () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!forgotPasswordEmail || !emailRegex.test(forgotPasswordEmail)) {
            setInvalidEmail(true);
            setTimeout(() => setInvalidEmail(false), 1500); 
            return;
        }

        try {
            const res = await cognitoForgot(forgotPasswordEmail);

            if (res.success) {
                setConfirmForgotPasswordSent(true);
            } else {
                setConfirmForgotPasswordSent(false);
            }
        } catch (err) {
            console.error("Error sending forgot password request:", err);
            setConfirmForgotPasswordSent(false);
        }
    };

    const handleConfirmForgotPassword = async () => {
        const newPassword = passcode_inputRefs5.current.map(input => input.value).join(''); 
        const code = passcode_inputRefs4.current.map(input => input.value).join('');
        
        try {
            // ✅ Use the imported alias
            const res = await cognitoConfirmForgotPassword(forgotPasswordEmail, code, newPassword);

            if (res.success) {
                setConfirmForgotPasswordSent(false);
                setForgotPasswordEmail(false);
                console.log("Password reset successfully.");
            } else {
                console.error("Password reset failed:", res.error);
            }
        } catch (err) {
            console.error("Unexpected error confirming forgot password:", err);
        }
    };

    const handleConfirmUser = async () => {

        const code = passcode_inputRefs3.current.map(input => input.value).join('');
        const email = payload_inputRefs.signUp_confirm_user_email.current?.value || '';

        try {

        const res = await cognitoConfirmUser(email, code);

        if (res.success) {
            setShowSignUp(false);
            setConfirmSignUp(false);
            } 
        } catch (err) {
            console.error("Unexpected error confirming user:", err);
        }
                    
    };

    const handleResendConfirmationCode = async () => {
        const email = payload_inputRefs.signUp_confirm_user_email.current?.value || ''; 

        try {
            const res = await resendConfirmUser(email);

            if (res.success) {
                passcode_inputRefs3.current.forEach((input) => {
                    if (input) input.value = "";
                });

                passcode_inputRefs3.current[0]?.focus();

                console.log("Confirmation code resent successfully.");
            } 
        } catch (err) {
            console.error("Unexpected error resending confirmation code:", err);
        }
    };

    const handleResendConfirmationCode2 = async () => {

        try {
            const res = await resendConfirmUser(forgotPasswordEmail);

            if (res.success) {
                passcode_inputRefs4.current.forEach((input) => {
                    if (input) input.value = "";
                });

                passcode_inputRefs4.current[0]?.focus();

                console.log("Confirmation code resent successfully.");
            } 
        } catch (err) {
            console.error("Unexpected error resending confirmation code:", err);
        }
    };


  return (

    <motion.div 
        className="w-[85%] md:w-2/3 lg:w-2/3 h-full md:h-full lg:h-full flex flex-col items-center justify-center rounded-[30px] bg-white p-5"
        whileHover={{ scale: 1.05 }} 
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >

        {/* SIGN UP */}
        <motion.div 
            className={`w-full h-full relative ${confirmSignUp ? "hidden" : ""}`}
            animate={{ rotateY: showSignUp ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ transformStyle: "preserve-3d", transformOrigin: "center" }}
        >

            <div className={`absolute w-full h-full backface-hidden flex flex-col justify-center items-center rotate-y-180 gap-5`}>
                
                <div className="w-full h-[30%] flex flex-col items-center justify-center">
                    
                    <motion.div 
                        className="w-20 h-20 bg-white border-1 rounded-full flex 
                                   items-center justify-center cursor-pointer overflow-hidden" onClick={openFilePicker}
                        animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            className="hidden"
                        />

                        {imagePreview ? ( 
                            <img
                                src={imagePreview}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <svg 
                                xmlns="http://www.w3.org/2000/svg"  
                                className="w-10 h-10"
                                viewBox="0 0 24 24" fill="#000000"
                            >
                                <g fill="none" stroke="#000000" stroke-width="1">
                                    <path stroke-linejoin="round" d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/>
                                    <circle cx="12" cy="7" r="3"/>
                                </g>
                            </svg>
                        )}
                    </motion.div>
                    <span className={`mt-1 block text-[11px] font-light text-black text-center tracking-widest`}>
                        Choose a profile picture
                    </span>
                </div>

                <div className="w-full h-full flex flex-col gap-2">

                    {/* SIGN UP first name & last name*/}
                    <div className="w-full h-full flex flex-row gap-5">
                        {/* SIGN UP first name*/}
                        <motion.div 
                            className="flex-1"
                            animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                        >
                            <input
                                id="user_first_name"
                                ref={payload_inputRefs.user_first_name}
                                name="user_first_name"
                                type="text"
                                placeholder="first name"
                                className="w-full rounded-md bg-white px-3 py-1.5 text-base text-sm placeholder:text-xs 
                                        text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                            />
                        </motion.div>

                        {/* SIGN UP last name*/}
                        <motion.div 
                            className="flex-1"
                            animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                        >
                            <input
                                id="user_last_name"
                                ref={payload_inputRefs.user_last_name}
                                name="user_last_name"
                                placeholder="last name"
                                className="w-full rounded-md bg-white px-3 py-1.5 text-base text-sm placeholder:text-xs 
                                            text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic
                                            focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                            />
                        </motion.div> 

                    </div>


                    {/* SIGN UP dob */}
                        <motion.div 
                            className="w-full flex flex-col justify-start"
                            animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                        >
                            <div className="w-full flex items-center justify-start gap-2">
                                {date_inputs.map((date_input, i) => (
                                    <React.Fragment key={date_input.id}>
                                    <input
                                        id={date_input.id}
                                        ref={(el) => (date_inputRefs.current[i] = el)}
                                        maxLength={date_input.maxLength}
                                        placeholder={date_input.placeholder}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        onChange={(e) => date_handleChange(e, i)}
                                        onKeyDown={(e) => date_handleKeyDown(e, i)}
                                        className="w-12 h-8 flex items-center justify-center rounded-md bg-white text-center text-black 
                                                    text-sm outline-1 outline-black focus:outline-2 focus:outline-indigo-500 cursor-text"
                                    />
                                    {/* Add / separators */}
                                    {i < date_inputs.length - 1 && <span className="text-black text-sm">/</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </motion.div> 


                    {/* SIGN UP email */}
                    <motion.div 
                        className="w-full flex flex-col justify-start"
                        animate={invalidEmail ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                    >
                        <div className="mb-1">
                            <input
                                id="user_email"
                                ref={payload_inputRefs.signUp_user_email}
                                name="user_email"
                                type="email"
                                placeholder="email"
                                className="w-full rounded-md bg-white px-3 py-1.5 text-base text-sm placeholder:text-xs
                                        text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                            />
                        </div>
                        <span htmlFor="email" className={`block text-[11px] font-light text-black text-center tracking-widest ${emailInUse ? "" : "hidden"}`}>
                            Email is already in use
                        </span>
                    </motion.div>

                    {/* SIGN UP confirm email */}
                    <motion.div 
                        className="w-full flex flex-col justify-start"
                        animate={invalidEmail || emailNotMatch ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                    >
                        <div className="mb-1">
                            <input
                                id="user_email"
                                ref={payload_inputRefs.signUp_confirm_user_email}
                                name="user_email"
                                type="email"
                                placeholder="confirm email"
                                className="w-full rounded-md bg-white px-3 py-1.5 text-base text-sm placeholder:text-xs
                                        text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                            />
                        </div>
                    </motion.div>

                    {/* SIGN Up username */}
                    <motion.div 
                        className={`w-2/3 flex flex-col justify-start ${showSignUp ? "" : "hidden"}`}
                        animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                    >
                        <div className="mb-1">
                            <input
                                id="user_name"
                                ref={payload_inputRefs.user_name}
                                name="user_email"
                                type="text"
                                placeholder="choose user name"
                                className="w-full rounded-md bg-white px-3 py-1.5 text-base text-sm placeholder:text-xs
                                        text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                            />
                        </div>
                    </motion.div>

                    {/* SIGN UP Password */}
                    <motion.div 
                        className={`flex mt-5 flex-col justify-between ${showSignUp ? "" : "hidden"}`}
                        animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                    >
                        <div className="flex gap-2">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <input
                                        key={i}
                                        ref={(el) => (passcode_inputRefs.current[i] = el)}
                                        maxLength={1}
                                        type="password"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        onChange={(e) => passcode_handleChange(e, i, passcode_inputRefs)}
                                        onKeyDown={(e) => passcode_handleKeyDown(e, i, passcode_inputRefs)} 
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white
                                                text-center text-black text-md font-thin outline-1
                                                focus:outline-2 focus:outline-indigo-500 cursor-text"
                                    tabIndex={0} 
                                    />
                            ))}
                        </div>
                        <span htmlFor="email" className={`block mt-2 text-[11px] font-light text-black tracking-widest`}>
                            Choose a 6 digit password
                        </span>
                    </motion.div>

                    {/* SIGN UP button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }} 
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex flex-col mt-5 justify-center rounded-[30px] px-5 py-3 text-sm font-light  tracking-widest 
                                    cursor-pointer hover:bg-gray-100"
                        onClick={handleSignUp}
                    >
                        Sign Up
                    </motion.div>  

                    {/* SIGN UP text */}
                    <span className={`text-[10px] font-thin text-black tracking-widest`}>
                            Sign up with your email to use GoMeal. We respect your privacy and use your email only for account management.
                    </span>   

                </div> 

            </div>

        </motion.div>

        {/* Confirm Password */}
        <div 
            className={`w-full h-full flex flex-col items-center justify-center gap-5 ${confirmSignUp ? "" : "hidden"} `}
        >
            <span className={`block mt-2 text-[20px] font-light text-black text-center tracking-widest`}>
                    Confirm your email
            </span>     
            <motion.div 
                className={`flex flex-col justify-between mt-5 ${showSignUp ? "" : "hidden"}`}
                animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
            >
                <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                            <input
                                key={i}
                                ref={(el) => (passcode_inputRefs3.current[i] = el)}
                                maxLength={1}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                onChange={(e) => passcode_handleChange(e, i, passcode_inputRefs3)}
                                onKeyDown={(e) => passcode_handleKeyDown(e, i, passcode_inputRefs3)} 
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white
                                        text-center text-black text-md font-thin outline-1
                                        focus:outline-2 focus:outline-indigo-500 cursor-text"
                            tabIndex={0} 
                            />
                    ))}
                </div>
            </motion.div>
            <span className={`block mt-2 text-[10px] font-thin text-black text-center tracking-widest`}>
                    Enter the code sent to your email. Please check your spam.
            </span>
            <motion.div
                whileHover={{ scale: 1.05 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex flex-col mt-5 justify-center rounded-[30px] px-5 py-3 text-sm font-light  tracking-widest 
                            cursor-pointer hover:bg-gray-100`}
                onClick={handleConfirmUser}
            >
                Confirm email
            </motion.div> 
            <motion.div
                whileHover={{ scale: 1.05 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex flex-col mt-5 justify-center rounded-[30px] px-5 py-3 text-sm font-light bg-black text-white tracking-widest 
                            cursor-pointer hover:bg-gray-50 hover:text-black`}
                onClick={handleResendConfirmationCode}
            >
                Resend code
            </motion.div>   
        </div>





        


        {/* Show the Sign in area first */}
        <div className={`w-full h-full flex flex-col items-center justify-center gap-10 ${showSignUp ? "hidden" : ""}`}>

             {/* Forgot Password */}
            <div className={`${confirmForgotPasswordSent ? "" : "hidden"}`}>

                <div 
                    className={`w-full h-full flex flex-col items-center justify-center gap-5`}
                >

                    <div className="mb-5">
                        <span className={`block mt-2 text-[20px] font-light text-black text-center tracking-widest`}>
                                New Passcode 
                        </span>     
                        <motion.div 
                            className={`flex flex-col justify-between mt-5`}
                            animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                        >
                            <div className="flex gap-2">
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <input
                                            key={i}
                                            ref={(el) => (passcode_inputRefs5.current[i] = el)}
                                            maxLength={1}
                                            type="password"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            onChange={(e) => passcode_handleChange(e, i, passcode_inputRefs5)}
                                            onKeyDown={(e) => passcode_handleKeyDown(e, i, passcode_inputRefs5)} 
                                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white
                                                    text-center text-black text-md font-thin outline-1
                                                    focus:outline-2 focus:outline-indigo-500 cursor-text"
                                        tabIndex={0} 
                                        />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-5">
                        <span className={`block mt-2 text-[20px] font-light text-black text-center tracking-widest`}>
                                6 digit code 
                        </span>     
                        <motion.div 
                            className={`flex flex-col justify-between mt-5`}
                            animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                        >
                            <div className="flex gap-2">
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <input
                                        key={i}
                                        ref={(el) => (passcode_inputRefs4.current[i] = el)}
                                        maxLength={1}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        onChange={(e) => passcode_handleChange(e, i, passcode_inputRefs4)}
                                        onKeyDown={(e) => passcode_handleKeyDown(e, i, passcode_inputRefs4)} 
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white
                                                text-center text-black text-md font-thin outline-1
                                                focus:outline-2 focus:outline-indigo-500 cursor-text"
                                    tabIndex={0} 
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                    

                    <span className={`block mt-2 text-[10px] font-thin text-black text-center tracking-widest`}>
                            Enter the code sent to your email. Please check your spam.
                    </span>
                    <motion.div
                        whileHover={{ scale: 1.05 }} 
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`flex flex-col mt-5 justify-center rounded-[30px] px-5 py-3 text-sm font-light  tracking-widest 
                                    cursor-pointer hover:bg-gray-100`}
                        onClick={handleConfirmForgotPassword}
                    >
                        Confirm 
                    </motion.div> 
                    <motion.div
                        whileHover={{ scale: 1.05 }} 
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`flex flex-col mt-5 justify-center rounded-[30px] px-5 py-3 text-sm font-light tracking-widest 
                                    cursor-pointer hover:bg-gray-100 `}
                        onClick={handleResendConfirmationCode2}
                    >
                        Resend code
                    </motion.div>   
                </div>

            </div>

            {/* SIGN IN  */}
            <div className={`w-full h-full flex flex-col justify-center items-center$ gap-5 ${confirmForgotPasswordSent ? "hidden" : ""}`}>

                {/* SIGN IN email */}
                <motion.div 
                    className={`w-full flex flex-col justify-start gap-1 ${showForgotPasswordSection ? "hidden" : ""}`}
                    animate={invalidEmail ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                >
                    <span htmlFor="email" className={`block text-md font-light text-black tracking-widest`}>
                        Email
                    </span>
                    <div className="mt-2">
                        <input
                            id="email"
                            ref={payload_inputRefs.signIn_user_email}
                            name="email"
                            type="text"
                            placeholder="email"
                            className="w-full rounded-md bg-white px-3 py-1.5 text-base placeholder:text-xs text-sm
                                        text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                        />
                    </div>
                </motion.div>

                {/* SIGN IN Password */}
                <motion.div 
                    className={`w-full flex flex-col justify-between gap-1 ${showForgotPasswordSection ? "hidden" : ""}`}
                    animate={passcodeIncorrect ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <span className={`block text-md font-light text-black tracking-widest`}>
                        Password
                    </span>
                    <div className="flex gap-2 mt-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            
                                <input
                                    key={i}
                                    ref={(el) => (passcode_inputRefs2.current[i] = el)}
                                    maxLength={1}
                                    type="password"
                                    inputMode="numeric"
                                    onChange={(e) => passcode_handleChange(e, i, passcode_inputRefs2)}
                                    onKeyDown={(e) => passcode_handleKeyDown(e, i, passcode_inputRefs2)} 
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white
                                                text-center text-black text-md font-thin 
                                                focus:outline-2 focus:outline-indigo-500 cursor-text"
                                    tabIndex={0} 
                                />
                            
                        ))}
                    </div>
                    <a className={`mt-1 text-[12px] font-thin text-black tracking-wider hover:text-blue-800 cursor-pointer ${passcodeIncorrect ? "hidden" : ""}`}
                        onClick={() => setShowForgotPasswordSection(true)}>
                        Forgot password ?
                    </a>
                </motion.div>   

                <motion.div
                    whileHover={{ scale: 1.05 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`flex flex-col mt-5 justify-center items-center rounded-[30px] px-5 py-3 text-sm font-light  tracking-widest 
                                cursor-pointer hover:bg-gray-100 ${showForgotPasswordSection ? "hidden" : ""}`}
                    onClick={handleSignIn}
                >
                    Sign In
                </motion.div> 


                <motion.div 
                    className={`w-full flex flex-col justify-start gap-1  ${showForgotPasswordSection ? "" : "hidden"}`}
                    animate={invalidEmail ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                >
                    <span htmlFor="email" className={`block text-md font-light text-black tracking-widest`}>
                        Email
                    </span>
                    <div className="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            className="w-full rounded-md bg-white px-3 py-1.5 text-base placeholder:text-xs text-sm
                                        text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                        />
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`flex flex-col mt-5 justify-center rounded-[30px] px-5 py-3 text-sm font-light  tracking-widest 
                                cursor-pointer hover:bg-gray-100 ${showForgotPasswordSection ? "" : "hidden"}`}
                    onClick={handleForgotPassword}
                >
                    Send Code
                </motion.div>   

            </div>



            </div>


    </motion.div>

  )
}
