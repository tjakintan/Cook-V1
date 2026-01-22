import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../utils/user";
import "../styles/component_style.css";

export default function Navbar() {

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



    </>
    
  )
  }

