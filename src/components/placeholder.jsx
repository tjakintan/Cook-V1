import React, { useEffect, useState } from "react";
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
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeed() {
            try {
                const res = await fetch(
                    "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/feed",
                    { method: "GET", headers: { "content-type": "application/json" } }
                );
                const data = await res.json();
                setPosts(data.posts || []);
            } catch (err) {
                console.error("Error fetching feed:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchFeed();
    }, []);

    if (loading) return (

        <div className="h-screen w-screen flex bg-white justify-center items-center">
            <svg 
                width="50" height="50" 
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="2" r="0" fill="#0000"><animate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(45 12 12)"><animate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(90 12 12)"><animate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(135 12 12)"><animate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(180 12 12)"><animate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(225 12 12)"><animate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(270 12 12)"><animate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(315 12 12)"><animate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle>
            </svg>
        </div>

    );
    const displayPosts = posts.slice(0, 3);

    return (
        <>
            {displayPosts.map((post, idx) => (
                <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-[60vw] h-full rounded-[30px] flex-shrink-0 overflow-hidden bg-gray-200"
                >
                    <img 
                        src={post.image_url} 
                        alt={`Post ${idx}`} 
                        className="w-full h-full object-cover rounded-[30px]"
                    />
                </motion.div>
            ))}
        </>
    );
}
