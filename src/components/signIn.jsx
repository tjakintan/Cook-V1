import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import {
  handleForgotPassword as cognitoForgot,
  handleConfirmForgotPassword as cognitoConfirmForgotPassword,
  handleConfirmUser as cognitoConfirmUser,
  handleResendConfirmationCode as resendConfirmUser
} from "../utils/cognito.js";
import { useUser } from "../utils/user.jsx";
import { jwtDecode } from "jwt-decode";
import { tr } from "framer-motion/client";

const REDIRECT_URI = "http://localhost:3000/auth?mode=fallback" || "http://gomeal.org/auth?mode=fallback";


export const SignIn = ({ email }) => {

    const [emailValue, setEmailValue] = useState(email || "");
    const { setUser, refreshUser } = useUser();
    const navigate = useNavigate();
    const payload_inputRefs = {
        signIn_user_email: useRef({})
    };
    const [isLoading, setIsLoading] = useState(false);
    const passcode_inputRefs = useRef([]);
    const [showSignUp, setShowSignUp] = useState(false);
    const [passcodeIncorrect, setPasscodeIncorrect] = useState(false);
    const [showForgotPasswordSection, setShowForgotPasswordSection] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [confirmForgotPasswordSent, setConfirmForgotPasswordSent] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);

    const handleUserLogin = async () => {
      await refreshUser();
      navigate("/");   
    };

    const handleGoogleSignIn = () => {
    };

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

        if (isLoading)  return;
        const payload = sign_in_payload();
        if (!payload) return;
        setIsLoading(true);

        try {
            const response = await fetch(
                "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/signin",
                {
                    method: "POST",
                    credentials: "include", 
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

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
        }  finally {
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

  return (
      <>
          <div className="fixed inset-0 backdrop-blur-sm z-10"/>
  
          <div className="fixed inset-0 z-20 flex items-center justify-center p-2 pointer-events-auto" onClick={() => navigate("/")}>

            <motion.div 
              className={` w-full md:w-2/3 lg:w-2/3 p-5 flex flex-col items-center justify-center gap-5 bg-red-300`}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div 
                  className={`w-full flex flex-col justify-start gap-1`}
                  animate={invalidEmail || showSignUp ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
              >
                  <span htmlFor="email" className={`block text-md text-[25px] font-light text-white tracking-widest ${showSignUp ? "hidden" : ""}`}>
                      Email
                  </span>
                  <span htmlFor="email" className={`block text-[20px] font-light text-white tracking-wider ${showSignUp ? "" : "hidden"}`}>
                    Almost there, create an account to start.
                  </span>
                  <div className="mt-2">
                      <input
                          id="email"
                          ref={payload_inputRefs.signIn_user_email}
                          name="email"
                          type="text"
                          value={emailValue || ""} 
                          placeholder="email"
                          onChange={(e) => setEmailValue(e.target.value)}
                          className="w-full rounded-md bg-white px-3 py-1.5 text-base placeholder:text-xs text-sm
                                      text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 placeholder:italic 
                                      focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                      />
                  </div>

              </motion.div>

              <motion.div 
                  className={`w-full flex flex-col justify-between gap-1 ${showSignUp ? "hidden" : ""}`}
                  animate={passcodeIncorrect ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
                  transition={{ duration: 0.4 }}
              >
                  <span className={`block text-[20px] font-light text-white tracking-widest`}>
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
                                  onChange={(e) => passcode_handleChange(e, i, passcode_inputRefs)}
                                  onKeyDown={(e) => passcode_handleKeyDown(e, i, passcode_inputRefs)} 
                                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white
                                              text-center text-black text-md font-thin 
                                              focus:outline-2 focus:outline-indigo-500 cursor-text"
                                  tabIndex={0} 
                              />
                          
                      ))}
                  </div>
                  <a className={`mt-1 text-[12px] font-thin text-white tracking-wider hover:text-blue-400 cursor-pointer ${passcodeIncorrect ? "hidden" : ""}`}
                      onClick={() => navigate("/auth?mode=forgot", { replace: true })}>
                      Forgot password ?
                  </a>
              </motion.div>   

              <div className="w-full flex flex-col gap-5">

                <motion.div 
                  className={`w-2/3 h-[40px] flex items-center justify-start 
                              py-1 px-2 tracking-widest font-extralight  
                              ${showSignUp || isLoading ? "opacity-75 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
                              ${isLoading ? "rounded-none outline-none" : "outline-2 bg-white outline-black rounded-r-[30px]"}`}
                  whileHover={{ scale: showSignUp ? 1 : 1.04 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => {if (!showSignUp && !isLoading) handleSignIn();}}
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

                <div 
                  className={`w-11/12 md:w-2/3 h-[45px] flex items-end border-t-2 border-r-2 border-b-2 border-black rounded-r-[30px]
                              cursor-pointer tracking-widest font-extralight 
                              overflow-hidden ${email ? "hidden" : ""} `}
                >
                  <h1 className="w-2/3 h-full flex items-end justify-start px-1 pb-1 text-[12px] bg-transparent">
                    Need to create one ?
                  </h1>
                  <div 
                    className="w-1/2 h-full flex items-center border-l-2 border-black justify-start px-2 bg-white"
                    onClick={() => navigate("/auth?mode=signup")}
                  >
                    sign up
                  </div>
                </div>
                

              </div>

              <div className="w-11/12 flex items-center justify-center">
                <div className="flex-1 border-t border-white"></div>
                <span className="mx-3 font-thin text-white tracking-widest">
                  Social Logins
                </span>
                <div className="flex-1 border-t border-white"></div>
              </div>

              <div className="w-full h-full flex flex-row justify-center space-x-4 ">

                <svg className="w-13 h-13 cursor-pointer" viewBox="0 0 16 16" onClick={handleGoogleSignIn}>
                  <g fill="none" fill-rule="evenodd" clip-rule="evenodd"><path fill="#F44336" d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86" opacity=".987"/><path fill="#FFC107" d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92" opacity=".997"/><path fill="#448AFF" d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49" opacity=".999"/><path fill="#43A047" d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z" opacity=".993"/></g>
                </svg>

                <span className="mt-2 font-light tracking-wide text-[15px]"> or </span>

                <svg className="w-13 h-13 cursor-pointer" viewBox="0 0 16 16" nClick={handleTwitterSignIn}>
                  <path fill="#000000" d="M9.294 6.928L14.357 1h-1.2L8.762 6.147L5.25 1H1.2l5.31 7.784L1.2 15h1.2l4.642-5.436L10.751 15h4.05L9.294 6.928ZM7.651 8.852l-.538-.775L2.832 1.91h1.843l3.454 4.977l.538.775l4.491 6.47h-1.843l-3.664-5.28Z"/>
                </svg>

              </div>
  
            </motion.div>

          </div>
      </>

  )
    
};

export const FallBack = () => {
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      navigate("/"); // fallback
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await fetch(
          "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/social-login", 
          {
            method: "POST",
            credentials: "include", 
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ code, redirect_uri: REDIRECT_URI }),
          }
        );

        const data = await response.json();
        if (data.authenticated) {
          await refreshUser();
          navigate("/");
        } else {
          navigate("/auth?mode=signin"); 
        }
      } catch (err) {
        console.error("OAuth code exchange failed:", err);
        navigate("/auth?mode=signin");
      }
    };

    exchangeCode();
  }, [navigate, refreshUser]);

  return <div>Signing in...</div>;
};