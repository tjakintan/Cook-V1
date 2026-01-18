import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../utils/user";
import "../styles/component_style.css";
import Profile from "./profile";

export default function Navbar({ showSignInUpPromptPage }) {

  //map showSIgnupinppage to s;
  const location = useLocation();
  const { user } = useUser();
  const [ showSignInUpPage, setShowSignInUpPage ] = useState(false);
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

    </>
    
  )
  }

