import React, { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import "../styles/component_style.css";

export default function Placeholder() { 
    const controls = useAnimationControls();

    useEffect(() => {
        controls.start({
            x: ["0%", "-100%"],
            transition: {
                duration: 20,
                ease: "linear",
                repeat: Infinity,
            }
        });
    }, []);

    return (
        <div className="w-full h-full p-5 overflow-hidden">
            {/* BIG SCROLLER */}
            <motion.div 
                animate={controls}
                className="flex flex-row space-x-10 w-max h-full"
            >
                {/* 1st row of items */}
                <CarouselRow />

                {/* Duplicate row for smooth infinite loop */}
                <CarouselRow />
            </motion.div>
        </div>
    );
}

function CarouselRow() {
    return (
        <>
            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-[60vw] h-full rounded-[30px] bg-purple-300 flex-shrink-0"
            />

            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-[60vw] h-full rounded-[30px] bg-red-300 flex-shrink-0"
            />

            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-[60vw] h-full rounded-[30px] bg-orange-300 flex-shrink-0"
            />
        </>
    );


};