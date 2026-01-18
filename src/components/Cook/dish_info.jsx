import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, useAnimationControls } from "framer-motion";
import WobblyText from "../../hooks/wobbly_text";
import "./cook_style.css";

function DifficultyButton({ label, active, onClick, color }) {
  return (
    <div className="flex flex-col items-center cursor-pointer">
      <motion.div
        onClick={onClick}
        className={`w-[70px] h-[40px] rounded-lg ${color.bg} mb-2 ${
          active ? "scale-120" : ""
        }`}
        whileHover={{ scale: 1.05 }}
        animate={{
          scale: active ? 1.15 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  );
}

const DishInfo = ({ value, onPassToHead }) => {

    const [dish_image_url, setDish_image_url] = useState(value?.dish_image_url || "");
    const [dish_name, setDish_name] = useState(value?.dish_name || "");
    const [dish_description, setDish_description] = useState(value?.dish_description || "");
    const [dish_difficulty, setDish_difficulty] = useState(value?.dish_difficulty || "");

    const validateInputs = () => {
        if (!dish_image_url) return { valid: false, page: 0 };
        if (!dish_name.trim()) return { valid: false, page: 1 };
        if (!dish_description.trim()) return { valid: false, page: 2 };
        if (!dish_difficulty) return { valid: false, page: 3 };
        return { valid: true };
    };
    const fileInputRef = useRef(null);
    const [pageIndex, setPageIndex] = useState(0);
    const containerRef = useRef(null);
    const mainContainerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const options = ["easy", "medium", "hard"];
    const difficultyColors = {
        easy: {
            bg: "bg-green-600",
            text: "text-green-600",
        },
        medium: {
            bg: "bg-yellow-400",
            text: "text-yellow-400",
        },
        hard: {
            bg: "bg-red-600",
            text: "text-red-600",
        },
    };
    const PADDING = 40;
    const sectionHeight = "100vh";
    const TOTAL_PAGES = 4;
    const controls = useAnimationControls();


    useEffect(() => {
        if (containerRef.current) {
            setContainerHeight(containerRef.current.clientHeight);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const imageUrl = URL.createObjectURL(file);
            setDish_image_url(imageUrl);
            swipeUp(); 
            }
        },
        accept: { "image/*": [] },
        multiple: false,
    });

    const swipeUp = () => {
        setPageIndex((prev) => {
            const next = Math.min(prev + 1, TOTAL_PAGES - 1);
            return next;
        });
    };

    const swipeDown = () => {
        setPageIndex((prev) => Math.max(prev - 1, 0));
    };

    const passToHead = () => {

        const check = validateInputs();
        
        if (!check.valid) {
            let stepBack = pageIndex - check.page;
            if (stepBack < 0) {stepBack = 4 + stepBack}
            for (let i = 0; i < stepBack; i++) {swipeDown()}
            return;
        }

        onPassToHead({
            dish_image_url,
            dish_name,
            dish_description,
            dish_difficulty,
        });

    }

    return (

        <div className="flex items-center">

            <div ref={containerRef} className="relative h-[100vh] w-full flex overflow-y-auto scrollbar-hide">
                
                <motion.div 
                    ref={mainContainerRef}
                    className="absolute w-full justify-center" 
                    animate={{ y: -pageIndex * sectionHeight }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                >
                    
                    {/* Page 1: Image Upload */}
                    <div style={{ height: sectionHeight }} className="flex flex-shrink-0 items-center justify-center">
                        <div 
                            {...getRootProps()}
                            className={`p-10 flex flex-col cursor-pointer hover:bg-white
                                        flex items-center justify-center gap-10 rounded-[30px] hover:border-4 hover:border-dashed hover:border-indigo-500
                                        ${isDragActive ? "border-4 border-dashed bg-white border-indigo-500" : ""}`}>

                            <input {...getInputProps()} />

                            <div className="flex flex-col font-thin items-center justify-center text-center">
                                <h1 className="text-[27px] tracking-wider">
                                    Ready to post your meal ?
                                </h1>
                                <h2 className="tracking-widest text-[12px] text-center italic opacity-50">
                                    Drag your image or click the fry to get started
                                </h2>
                                <h3 className="tracking-widest text-[11px] text-center italic opacity-75">
                                    "This section you swipe up or down to navigate"
                                </h3>
                            </div>
                            <div className="flex items-center justify-center">
                                <svg 
                                    className="w-30 h-30"
                                    viewBox="0 0 24 24"
                                >
                                    <g fill="none"><path fill="#ffef5e" d="m20.034 4.672l-.696-1.48a.48.48 0 0 0-.433-.275h-.772a.48.48 0 0 0-.459.344l-2.4 8.262h-.118l.787-9.842a.48.48 0 0 0-.436-.515L13.6 1.002a.48.48 0 0 0-.518.438l-.842 10.083h-.487L10.91 1.442a.476.476 0 0 0-.516-.44l-1.907.164a.48.48 0 0 0-.437.515l.793 9.842h-.122L6.317 3.26a.48.48 0 0 0-.459-.344h-.772a.48.48 0 0 0-.433.274l-.695 1.48A.48.48 0 0 0 3.93 5l1.792 6.522l1.735 5.117h9.114l1.7-5.117L20.066 5a.5.5 0 0 0-.031-.328"/><path fill="#fff9bf" d="m19.172 8.24l.89-3.238a.48.48 0 0 0-.027-.33l-.695-1.48a.48.48 0 0 0-.433-.275h-.772a.48.48 0 0 0-.46.344l-.982 3.384c.894.419 1.728.955 2.48 1.595M15.58 6.19l.362-4.51a.48.48 0 0 0-.436-.514L13.6 1.002a.48.48 0 0 0-.518.438l-.349 4.18c.97.063 1.927.255 2.847.57M4.82 8.242A11 11 0 0 1 7.3 6.645L6.317 3.26a.48.48 0 0 0-.459-.344h-.772a.48.48 0 0 0-.433.274l-.695 1.48A.48.48 0 0 0 3.93 5zm6.44-2.62l-.35-4.18a.47.47 0 0 0-.33-.419a.5.5 0 0 0-.187-.021l-1.906.164a.48.48 0 0 0-.437.515l.363 4.51c.92-.315 1.877-.506 2.847-.569"/><path stroke="#191919" strokeLinecap="round" strokeLinejoin="round" d="m20.034 4.672l-.696-1.48a.48.48 0 0 0-.433-.275h-.772a.48.48 0 0 0-.459.344l-2.4 8.262h-.118l.787-9.842a.48.48 0 0 0-.436-.515L13.6 1.002a.48.48 0 0 0-.518.438l-.842 10.083h-.487L10.91 1.442a.476.476 0 0 0-.516-.44l-1.907.164a.48.48 0 0 0-.437.515l.793 9.842h-.122L6.317 3.26a.48.48 0 0 0-.459-.344h-.772a.48.48 0 0 0-.433.274l-.695 1.48A.48.48 0 0 0 3.93 5l1.792 6.522l1.735 5.117h9.114l1.7-5.117L20.066 5a.5.5 0 0 0-.031-.328"/><path stroke="#191919" strokeLinecap="round" strokeLinejoin="round" d="m11.999 14.434l-1.09-12.992a.47.47 0 0 0-.33-.419a.5.5 0 0 0-.186-.021l-1.906.164a.48.48 0 0 0-.437.515l.984 12.186m2.965.567l1.085-12.992a.47.47 0 0 1 .167-.326a.48.48 0 0 1 .35-.114l1.905.162a.48.48 0 0 1 .437.515l-.979 12.188"/><path fill="#ffef5e" stroke="#191919" strokeLinecap="round" strokeLinejoin="round" d="m18.824 17.263l-.718 2.87H5.882l-.717-2.87z"/><path fill="#ff808c" stroke="#191919" strokeLinecap="round" strokeLinejoin="round" d="M5.877 20.13h12.229l-.536 2.143a.956.956 0 0 1-.929.727H7.346a.956.956 0 0 1-.93-.727zm14.238-8.012l-1.291 5.145H5.164l-1.28-5.145a.46.46 0 0 1 .085-.412a.48.48 0 0 1 .379-.183h2.439a.47.47 0 0 1 .467.392c.603 3.357 8.877 3.357 9.48 0a.47.47 0 0 1 .468-.392h2.449a.476.476 0 0 1 .469.593z"/></g>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Page 2: Dish Name */}
                    <div style={{ height: sectionHeight }} className={`flex-shrink-0 flex items-center justify-center text-2xl`}>
                        <div className="flex flex-col items-center overflow-hidden p-5 gap-10">
                            <div onClick={swipeDown} className="w-full flex justify-center">
                                <svg className="w-6 h-6 rotate-180 " viewBox="0 0 24 24">
                                    <g id="evaArrowIosDownwardFill0">
                                        <g id="evaArrowIosDownwardFill1">
                                            <path id="evaArrowIosDownwardFill2" fill="#5a5a5a" d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15a1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16Z"/>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <h1 className="tracking-widest font-bold text-[50px]">
                                <WobblyText text="name"/>
                            </h1>
                            <motion.div 
                                className="bg-yellow-300 rounded-[40px] p-5"
                                whileHover={{ scale: 1.05 }} 
                                transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                            >
                                <input 
                                    value={dish_name}
                                    onChange={(e) => {setDish_name(e.target.value)}}
                                    className="w-full h-[40px] bg-yellow-100 rounded-[25px] hover:bg-white
                                            px-3 cursor-pointer text-center font-light tracking-wide text-[15px]
                                            placeholder-italic placeholder:font-light placeholder:tracking-wider placeholder:text-sm placeholder:italic
                                            "
                                    placeholder="rigatoni"
                                />
                            </motion.div>
                            <div className="w-full h-1/5 flex items-center justify-center">
                                <motion.button 
                                    animate={dish_name.trim() ? { y: [-5, 5] } : {}}
                                    transition={dish_name.trim() ? { duration: 1, repeat: Infinity, repeatType: "loop", ease: "easeInOut" } : {}}
                                    whileHover={dish_name.trim() ? { scale: 1.05 } : {}}
                                    className={`next-button ${dish_name.trim() ? "" : "opacity-30 pointer-events-none"}`}
                                    onClick={swipeUp}
                                    disabled={!dish_name.trim()}
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <g id="evaArrowIosDownwardFill0">
                                            <g id="evaArrowIosDownwardFill1">
                                                <path id="evaArrowIosDownwardFill2" fill="#000000" d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15a1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16Z"/>
                                            </g>
                                        </g>
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Page 3: Dish Description */}
                    <div style={{ height: sectionHeight }} className={`flex-shrink-0 flex items-center justify-center text-2xl`}>
                        <div className="flex flex-col overflow-hidden p-5 gap-10">
                            <div onClick={swipeDown} className="w-full flex justify-center">
                                <svg className="w-6 h-6 rotate-180 " viewBox="0 0 24 24">
                                    <g id="evaArrowIosDownwardFill0">
                                        <g id="evaArrowIosDownwardFill1">
                                            <path id="evaArrowIosDownwardFill2" fill="#5a5a5a" d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15a1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16Z"/>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <h1 className="text-center tracking-widest font-bold text-[45px]">
                                <WobblyText text="description" />
                            </h1>
                            <motion.div 
                                className="bg-blue-300 rounded-[40px] p-5"
                                whileHover={{ scale: 1.05 }} 
                                transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                            >
                                <input 
                                    value={dish_description}
                                    onChange={(e) => {setDish_description(e.target.value);}}
                                    className="w-full h-[40px] bg-blue-200 rounded-[25px] hover:bg-white
                                            px-3 cursor-pointer text-center font-light tracking-wide text-[15px]
                                            placeholder-italic placeholder:font-light placeholder:tracking-wider placeholder:text-sm placeholder:italic
                                            "
                                    placeholder="italian pasta"
                                />
                            </motion.div>
                            <div className="w-full h-1/5 flex items-center justify-center">
                                <motion.button 
                                    animate={dish_description.trim() ? { y: [-5, 5] } : {}}
                                    transition={dish_description.trim() ? { duration: 1, repeat: Infinity, repeatType: "loop", ease: "easeInOut" } : {}}
                                    whileHover={dish_description.trim() ? { scale: 1.05 } : {}}
                                    className={`next-button ${dish_description.trim() ? "" : "opacity-30 pointer-events-none"}`}
                                    onClick={swipeUp}
                                    disabled={!dish_description.trim()}
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <g id="evaArrowIosDownwardFill0">
                                            <g id="evaArrowIosDownwardFill1">
                                                <path id="evaArrowIosDownwardFill2" fill="#000000" d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15a1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16Z"/>
                                            </g>
                                        </g>
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Page 4: Dish Difficulty */}
                    <div style={{ height: sectionHeight }} className={`flex-shrink-0 flex items-center justify-center text-2xl`}>
                        <div className="flex flex-col overflow-hidden p-5 gap-10">
                                <div onClick={swipeDown} className="w-full flex justify-center">
                                <svg className="w-6 h-6 rotate-180 " viewBox="0 0 24 24">
                                    <g id="evaArrowIosDownwardFill0">
                                        <g id="evaArrowIosDownwardFill1">
                                            <path id="evaArrowIosDownwardFill2" fill="#5a5a5a" d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15a1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16Z"/>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <h1 className="text-center tracking-widest font-bold text-[50px]">
                                <WobblyText text="difficulty" />
                            </h1>
                            <div className="flex flex-col">
                                <div className="h-1/2 flex flex-row items-center justify-center space-x-5">
                                    {/* Hard */}
                                    {/* medium */}
                                    {/* easy */}
                                    {options.map((level) => (
                                        <DifficultyButton
                                            key={level}
                                            label={level}
                                            active={dish_difficulty === level}
                                            onClick={() => setDish_difficulty(level)}
                                            color={difficultyColors[level]}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="h-1/5 flex items-center justify-center">
                                <motion.button
                                    animate={dish_image_url && dish_description.trim() && dish_name.trim() && dish_difficulty ? { y: [-5, 5] } : {}}
                                    transition={dish_image_url && dish_description.trim() && dish_name.trim() && dish_difficulty ? { duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } : {}}
                                    whileHover={dish_image_url && dish_description.trim() && dish_name.trim() && dish_difficulty ? { scale: 1.05 } : {}}
                                    className={`next-section-button ${dish_image_url && dish_description.trim() && dish_name.trim() && dish_difficulty ? "" : "opacity-30"}`}
                                    onClick={passToHead}
                                    disabled={!(dish_image_url && dish_description.trim() && dish_name.trim() && dish_difficulty)}
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <g id="evaArrowIosDownwardFill0">
                                            <g id="evaArrowIosDownwardFill1">
                                                <path id="evaArrowIosDownwardFill2" fill="#000000" d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15a1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16Z"/>
                                            </g>
                                        </g>
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div> 

        </div>

    );
};

export default DishInfo;
