import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGoogleLogin } from '@react-oauth/google';
import {
  handleConfirmForgotPassword as cognitoConfirmForgotPassword,
  handleResendConfirmationCode as resendConfirmUser,
} from "../utils/cognito.js";
import { useUser } from "../utils/user.jsx";
import AuthHeader from "../hooks/auth_header.jsx";

const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export const SignIn = ({ email }) => {

    const [emailValue, setEmailValue] = useState(email || "");
    const { setUser, setHasAttemptedAuth } = useUser();
    const navigate = useNavigate();
    const payload_inputRefs = {
        signIn_user_email: useRef({})
    };
    const [isLoading, setIsLoading] = useState(false);
    const passcode_inputRefs = useRef([]);
    const [showSignUp, setShowSignUp] = useState(false);
    const [passcodeIncorrect, setPasscodeIncorrect] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);

    const handleUserLogin = async (user) => {
      setUser(user);
      setHasAttemptedAuth(true);
      navigate("/");   
    };

    const handleGoogleSignIn = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("🔥 GOOGLE LOGIN SUCCESS 🔥", tokenResponse);

            try {
                // Fetch Google user info
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await res.json();
                console.log("🔥 GOOGLE USER INFO 🔥", userInfo);

                // Send to social login Lambda
                const lambdaRes = await fetch("https://api.gomeal.org/auth/socialsignin", {
                    method: "POST",
                    credentials: "include",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        provider_sub: userInfo.sub,
                        email: userInfo.email,
                        provider: "google",
                        first_name: userInfo.given_name,
                        last_name: userInfo.family_name,
                        profile_img_url: userInfo.picture
                    }),
                });

                const data = await lambdaRes.json();
                console.log("🔥 SOCIAL LOGIN RESPONSE 🔥", data);

                if (data.status === "success") {
                    await handleUserLogin(data.user);
                } else if (data.status === "not_found") {
                    setShowSignUp(true);
                }
            } catch (err) {
                console.error("🔥 GOOGLE LOGIN ERROR 🔥", err);
            }
        },
        onError: (err) => console.error("🔥 GOOGLE LOGIN HOOK ERROR 🔥", err),
    });

    const handleTwitterSignIn = async (postId) => {}

    const sign_in_payload = () => {

        const email = payload_inputRefs.signIn_user_email.current?.value || '';
        const rawPasscode = passcode_inputRefs.current.map(input => input.value).join('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const handleSignIn = async () => {
        if (isLoading) return;
        const payload = sign_in_payload();
        if (!payload) return;

        setIsLoading(true);
        try {
            const response = await fetch("https://api.gomeal.org/auth/signin", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            });

            const data = await response.json();

            switch (data.status) {
            case "success":
                await handleUserLogin();
                break;

            case "not_found":
                setShowSignUp(true);
                break;

            case "unauthorized":
                setPasscodeIncorrect(true);
                setTimeout(() => setPasscodeIncorrect(false), 500);
                break;

            default:
                console.warn("Sign-in failed:", data.message);
                break;
            }
        } catch (err) {
            console.error("Network error during sign-in:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const passcode_handleChange = (e, index, refArray) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) {
            e.target.value = "";
            return;
        }
        e.target.value = value.slice(-1);
        if (value && index < refArray.current.length - 1) {
            refArray.current[index + 1]?.focus();
        }
    };

    const passcode_handleKeyDown = (e, index, refArray) => {
        if (e.key === "Backspace") {
            if (!e.target.value && index > 0) {
                refArray.current[index - 1]?.focus();
            }
        }
    };

    const handleForgotPassword = () => {
        navigate("/auth?mode=forgot", { state: { email: emailValue, fromSignIn: true } });
    };

  return (
      <>

          <div className="fixed inset-0 backdrop-blur-sm z-10"/>

          <div className="fixed inset-0 z-20 flex items-center justify-center p-2 pointer-events-auto" onClick={() => navigate("/")}>

            <motion.div 
              className={`outline-1 md:min-w-100 flex flex-col gap-5 p-5 text-black`}
              onClick={(e) => e.stopPropagation()}
            >

                <div className="flex items-center justify-center">
                        <div className="w-[100px] h-[60px] flex items-center justify-center overflow-hidden">
                            <AuthHeader />
                        </div>
                    <h1 className="text-[25px] font-thin tracking-wider text-center">Welcome back</h1>
                </div>

                <motion.div 
                    className={`flex flex-col justify-start gap-1`}
                    animate={invalidEmail ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                >
                    <span htmlFor="email" className={`block text-md text-[25px] font-light tracking-widest`}>
                        Email
                    </span>
                    <div className="mt-2">
                        <input
                            id="email"
                            ref={payload_inputRefs.signIn_user_email}
                            name="email"
                            type="text"
                            value={emailValue || ""} 
                            placeholder="eg@example.com"
                            onChange={(e) => setEmailValue(e.target.value)}
                            className="w-full rounded-xl px-3 py-1.5 text-base placeholder:text-xs text-sm
                                        text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                        />
                    </div>

                </motion.div>

                <motion.div 
                    className={`flex flex-col justify-between gap-1`}
                    animate={passcodeIncorrect ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <span className={`block text-[20px] font-light tracking-widest`}>
                        Password
                    </span>
                    <div className="flex gap-2 mt-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            
                                <input
                                    key={i}
                                    ref={(el) => (passcode_inputRefs.current[i] = el)}
                                    maxLength={1}
                                    type="password"
                                    inputMode="numeric"
                                    placeholder="0"
                                    onChange={(e) => passcode_handleChange(e, i, passcode_inputRefs)}
                                    onKeyDown={(e) => passcode_handleKeyDown(e, i, passcode_inputRefs)} 
                                    className="w-8 h-8 flex items-center justify-center rounded-xl
                                                text-center text-black text-md font-thin outline-1 placeholder:opacity-20
                                                focus:outline-2 focus:outline-indigo-500 cursor-text"
                                    tabIndex={0} 
                                />
                            
                        ))}
                    </div>
                    <a className={`mt-1 text-[10px] font-thin tracking-widest hover:text-blue-700 cursor-pointer ${passcodeIncorrect ? "hidden" : ""}`}
                        onClick={handleForgotPassword}>
                        Forgot password ?
                    </a>
                </motion.div>   

                <motion.div 
                    className={`h-[40px] flex items-center justify-start 
                                py-1 px-2 tracking-widest font-extralight cursor-pointer
                                ${isLoading ? "rounded-none outline-none" : "shadow-xl bg-cyan-500 outline-1 outline-black rounded-r-[30px]"}`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.90 }}
                    onClick={() => {if (!isLoading) handleSignIn();}}
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
                        "sign in"
                    )}
                </motion.div>

                <motion.div
                    className={`shadow-xl cursor-pointer h-[45px] py-2 flex items-end border-r-1 border-b-1 border-black rounded-r-[30px]
                                cursor-pointer tracking-widest font-extralight 
                                overflow-hidden ${email ? "hidden" : ""} `}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.90 }}
                >
                    <h1 className="w-2/3 h-full flex pt-3 text-[11px] bg-transparent">
                        Need to create one ?
                    </h1>
                    <div 
                        className="w-1/2 h-full flex items-center border-l-1 border-black justify-start px-2"
                        onClick={() => navigate("/auth?mode=signup")}
                    >
                        sign up
                    </div>
                </motion.div>

                <motion.div  
                    onClick={handleGoogleSignIn} 
                    className="cursor-pointer py-1 px-3 outline-1 space-x-10 flex justify-between items-center rounded-[30px] rounded-l-none shadow-xl"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.90 }}
                >
                    <h1 className="font-extralight tracking-widest text-xs">
                        continue with Google
                    </h1>
                    <svg className="w-9 h-9 cursor-pointer" viewBox="0 0 16 16">
                    <g fill="none" fill-rule="evenodd" clip-rule="evenodd"><path fill="#F44336" d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86" opacity=".987"/><path fill="#FFC107" d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92" opacity=".997"/><path fill="#448AFF" d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49" opacity=".999"/><path fill="#43A047" d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z" opacity=".993"/></g>
                    </svg>
                </motion.div>
                
                <motion.div 
                    onClick={handleTwitterSignIn} 
                    className="cursor-pointer  py-1 px-3 outline-1 space-x-10 flex justify-between items-center rounded-[30px] rounded-l-none shadow-xl"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.90 }}
                >
                    <h1 className="font-extralight tracking-widest text-xs">
                        continue with X
                    </h1>
                    <svg className="w-8 h-8 cursor-pointer" viewBox="0 0 16 16">
                    <path fill="#000000" d="M9.294 6.928L14.357 1h-1.2L8.762 6.147L5.25 1H1.2l5.31 7.784L1.2 15h1.2l4.642-5.436L10.751 15h4.05L9.294 6.928ZM7.651 8.852l-.538-.775L2.832 1.91h1.843l3.454 4.977l.538.775l4.491 6.47h-1.843l-3.664-5.28Z"/>
                    </svg>
                </motion.div>

                <h1 className="font-light text-gray-400 tracking-wider text-[10px]">
                    By continuing, you agree to our <span className="font-bold text-black underline cursor-pointer">Terms of Service</span> .
                </h1>

            </motion.div>

          </div>

      </>

  )
    
};

export const ForgotPassword = ({ email }) => {

    const navigate = useNavigate();
    const [emailValue, setEmailValue] = useState(email || "");
    const [isLoading, setIsLoading] = useState(false);
    const passcode_inputRefs4 = useRef([]);
    const passcode_inputRefs5 = useRef([]);

    const handleConfirmForgotPassword = async () => {
        const newPassword = passcode_inputRefs5.current.map(input => input.value).join(''); 
        const code = passcode_inputRefs4.current.map(input => input.value).join('');
        
        try {
            const res = await cognitoConfirmForgotPassword(emailValue, code, newPassword);

            if (res.success) {
                console.log("Password reset successfully.");
            } else {
                console.error("Password reset failed:", res.error);
            }
        } catch (err) {
            console.error("Unexpected error confirming forgot password:", err);
        }
    };

    const handleResendConfirmationCode = async () => {

        try {
            const res = await resendConfirmUser(emailValue);

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
        <>
          <div className="fixed inset-0 backdrop-blur-sm z-10"/>

          <div className="fixed inset-0 z-20 flex items-center justify-center p-2 pointer-events-auto" onClick={() => navigate("/auth?mode=signin")}>

            <div className={`w-full md:w-2/3 lg:w-2/3 flex flex-col items-center justify-center gap-5 bg-red-300 p-5`} onClick={(e) => e.stopPropagation()}>

              <div className="flex flex-col items-center justify-center gap-1">

                  <span className={`block text-[14px] font-light text-black text-center tracking-widest`}>
                          Enter the 6 digit code sent to your email
                  </span>     

                  <motion.div className={`flex flex-col justify-between`}>
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

              <div className="mt-5 flex flex-col items-center justify-center gap-2">

                  <span className={`block text-[14px] font-light text-black text-center tracking-widest`}>
                          Choose a new 6 digit Passcode 
                  </span>  

                  <motion.div 
                      className={`flex flex-col justify-between`}
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
          
              <motion.div
                  whileHover={{ scale: 1.05 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-full md:w-1/2 flex flex-col mt-5 justify-center rounded-[30px] px-5 py-3 text-sm font-light  tracking-widest 
                              cursor-pointer bg-black text-white rounded-l-none`}
                  onClick={handleConfirmForgotPassword}
              >
                  Confirm 
              </motion.div> 

              <motion.div
                  whileHover={{ scale: 1.05 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-full md:w-1/2 flex flex-col justify-center rounded-[30px] px-5 py-3 text-sm font-light tracking-widest 
                              cursor-pointer hover:bg-gray-100 bg-gray-50 rounded-l-none`}
                  onClick={handleResendConfirmationCode}
              >
                  Resend code
              </motion.div>  

              <span className={`block text-[10px] font-thin text-black text-center tracking-widest`}>
                  Please check your spam.
              </span>

            </div>

          </div>
        
        </>
    );
}