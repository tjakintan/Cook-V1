import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../utils/user";
import "../styles/component_style.css";
import Profile from "./profile";

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [ showSignInUpPage, setShowSignInUpPage ] = useState(false);
  const [ showProfilePage, setShowProfilePage ] = useState(false);
  const [profilePos, setProfilePos] = useState({ top: 0, left: 0 });
  const userButtonRef = useRef(null);
  const containerRef = useRef(null);
  const homeRef = useRef(null);
  const discoverRef = useRef(null);
  const uploadRef = useRef(null);
  const navRefs = [homeRef, discoverRef, uploadRef];
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);

  const [positions, setPositions] = useState([
    { left: 0, width: 0 },
    { left: 0, width: 0 },
    { left: 0, width: 0 },
  ]);

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

  const measurePositions = () => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const newPositions = navRefs.map((ref) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return { width: 0, left: 0 };

      const left = rect.left - containerRect.left; 
      const width = rect.width;

      return { width, left };
    });

    setPositions(newPositions);
  };

  useEffect(() => {
    measurePositions();
    window.addEventListener("resize", measurePositions);
    return () => window.removeEventListener("resize", measurePositions);
  }, []);

  useEffect(() => {
    if (location.pathname === "/feed") setActiveIndex(0);
    else if (location.pathname === "/discover") setActiveIndex(1);
    else if (location.pathname === "/upload") setActiveIndex(2);
  }, [location.pathname]);

  const displayIndex = hoverIndex !== null ? hoverIndex : activeIndex;

  return (
    <>

      <div className="fixed md:top-5 top-auto left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50">

        <div 
          className="relative flex items-center justify-between px-5 py-2 md:py-0 lg:py-0 bg-white/30 backdrop-blur-lg rounded-[30px] 
          shadow-md mt-5 md:mt-0 lg:mt-0 md:shadow-none lg:shadow-none md:backdrop-blur-none lg:backdrop-blur-none md:rounded-none lg:rounded-none md:bg-transparent
          lg:bg-transparent">

          <NavLink to="/" className="flex items-center">
            <img
              src="/gomeal1.png"
              className="w-12 h-12 object-contain"
              alt="GoMeal"
            />
          </NavLink>

          <div className="flex items-center gap-6">

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

            <NavLink to="/settings">
              <svg viewBox="0 0 42 42" className="w-6 h-6">
                <path
                  fill="currentColor"
                  d="M6.62 24.5c.4 1.62 1.06 3.13 1.93 4.49l-2.43 2.44c-1.09 1.09-1.08 1.74-.12 2.7l2.37 2.37c.97.971 1.63.95 2.7-.12l2.55-2.56c1.2.688 2.5 1.22 3.88 1.56v3.12c0 1.55.47 2 1.82 2h3.36c1.37 0 1.82-.48 1.82-2v-3.12c1.38-.34 2.68-.87 3.88-1.56l2.61 2.619c1.08 1.068 1.729 1.09 2.699.131l2.381-2.381c.949-.949.97-1.602-.131-2.699l-2.5-2.5a14.665 14.665 0 0 0 1.938-4.49h3.302c1.368 0 1.818-.48 1.818-2v-3c0-1.48-.393-2-1.818-2h-3.302c-.34-1.38-.87-2.68-1.562-3.88l2.382-2.37c1.05-1.05 1.14-1.7.13-2.7l-2.38-2.38c-.95-.95-1.632-.94-2.7.13l-2.26 2.25A14.946 14.946 0 0 0 24.5 6.62V3.5c0-1.48-.391-2-1.82-2h-3.36c-1.35 0-1.82.49-1.82 2v3.12c-1.62.4-3.13 1.06-4.49 1.93L10.75 6.3C9.68 5.23 9 5.22 8.05 6.17L5.67 8.55c-1.01 1-.92 1.65.13 2.7l2.37 2.37c-.68 1.2-1.21 2.5-1.55 3.88h-3.3c-1.35 0-1.82.49-1.82 2v3c0 1.55.47 2 1.82 2h3.3zm8.66-3.5c0-3.16 2.56-5.72 5.72-5.72s5.721 2.56 5.721 5.72a5.72 5.72 0 1 1-11.441 0z"
                />
              </svg>
            </NavLink>

          </div>

        </div>

      </div>

      <div ref={containerRef} className={`z-50 fixed bottom-5 md:top-3 lg:top-3 md:bottom-auto left-1/2 -translate-x-1/2 flex py-3 gap-5 bg-white/30 backdrop-blur-lg
                rounded-[30px] shadow-md overflow-hidden ${user ? "pointer-events-auto opacity-100" : "opacity-50 pointer-event-none"}`}>

          {user && positions[displayIndex]?.width > 0 && (
            <motion.div
              className={`absolute inset-0 bg-black rounded-full`}
              animate={{
                width: positions[displayIndex].width,
                x: positions[displayIndex].left,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
            {[
              { label: "Home", to: "/feed", ref: homeRef, index: 0 },
              { label: "Discover", to: "/discover", ref: discoverRef, index: 1 },
              { label: "Post", to: "/upload", ref: uploadRef, index: 2 },
            ].map((item) => (
              <div key={item.to} className={`${user ? (displayIndex === item.index ? "text-white" : "text-black") : "text-black"}`}>
                {user ? (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    ref={item.ref}
                    className={`relative z-10 text-sm px-4 font-extralight tracking-wider`}
                    onMouseEnter={() => setHoverIndex(item.index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <div
                    key={item.to}
                    ref={item.ref}
                    className={`relative z-10 text-sm px-4 font-extralight tracking-wider opacity-50 cursor-default`}
                    onClick={() => setShowSignInUpPage(true)}
                  >
                    {item.label}
                </div>
                )}
              </div>
            ))}
        
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
            {/* Top arrow */}
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
    
  )
  }

