import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../utils/user";
import "../styles/component_style.css";
import Profile from "./profile";

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      end
      className={`px-3 py-1 text-sm tracking-wide transition`}
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {

  const navigate = useNavigate();
  const { user } = useUser();
  const [ showSignInUpPage, setShowSignInUpPage ] = useState(false);
  const [ showProfilePage, setShowProfilePage ] = useState(false);
  const [profilePos, setProfilePos] = useState({ top: 0, left: 0 });
  const userButtonRef = useRef(null);

  const openProfile = () => {
    if (userButtonRef.current) {
      const rect = userButtonRef.current.getBoundingClientRect();
      // Position the red div slightly below and to the right of the button
      setProfilePos({
        top: rect.bottom + 5,   // 5px below button
        left: rect.right - 300, // align right edge with button (300px div width)
      });
      setShowProfilePage(true);
    }
  };

  useEffect(() => {
    if (showSignInUpPage || showProfilePage) {
      // Disable scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSignInUpPage, showProfilePage]);

  return (
    <>

      <div className="fixed md:top-5 top-auto left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">

        <div className="relative flex items-center justify-between">

          <NavLink to="/" className="flex items-center">
            <img
              src="/gomeal.png"
              className="w-14 h-14 object-contain"
              alt="GoMeal"
            />
          </NavLink>

          <div className="flex items-center gap-6">

            {user ? (
              <div 
                ref={userButtonRef}
                className={`absolute w-7 h-7 rounded-full overflow-hidden shadow cursor-pointer relative group cursor-pointer z-[999]`}
                onClick={openProfile}
              >
                <img 
                    src={user.profile_img_url}
                    alt="profile"
                    className="absolute w-full h-full object-cover"
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

      {/* CENTER — NAV */}
      <div className="fixed bottom-5 md:top-5 lg:top-5 md:bottom-auto left-1/2 -translate-x-1/2 flex gap-6 p-2 bg-white/30 backdrop-blur-lg
                rounded-[30px] shadow-md z-50">
        <NavItem to="/feed" label="Home" />
        <NavItem to="/discover" label="Discover" />
        <NavItem to="/upload" label="Upload" />
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
          <h1 className="text-center text-sm">Sign in to save recipes, upload dishes, and personalize your feed.</h1>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            transition={{ type: "spring", stiffness: 300, damping: 20 }} 
            className="w-11/12 md:w-1/3 lg:w-1/3 p-3 rounded-[30px] bg-black outline-2 outline-black text-white text-start cursor-pointer tracking-wider rounded-l-none"
            onClick={() => navigate("/auth?mode=signin")}
          >sign In
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            transition={{ type: "spring", stiffness: 300, damping: 20 }} 
            className="w-11/12 md:w-1/3 lg:w-1/3 p-3 rounded-[30px] bg-white outline-2 cursor-pointer tracking-wider text-start rounded-l-none"
            onClick={() => navigate("/auth?mode=signup")}
          >sign Up
          </motion.button>
        </div>
      </>
    )}

      {showProfilePage && (
        <>
          <div
            className="fixed inset-0 bg-white/5 backdrop-blur-xs z-50"
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
            <div className="absolute top-0 w-0 h-0
                            border-l-[15px] border-l-transparent
                            border-r-[15px] border-r-transparent
                            border-b-[15px] border-b-blue-400 shadow-2xl"></div>
                            
            <div className="w-[500px] h-full shadow-lg -mr-12 rounded-[30px]">
              <Profile />
            </div>
          </div>
        </>
      )}



    
    </>

    
  )
  }

