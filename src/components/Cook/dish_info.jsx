import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import WobblyText from "../../hooks/wobbly_text";
import "./cook_style.css";

function DifficultyButton({ label, active, onClick, color }) {
  return (
    <div className="flex flex-col items-center cursor-pointer">
      <motion.div
        onClick={onClick}
        className={`w-[70px] h-[40px] rounded-lg  mb-2 ${
          active ? "bg-black scale-120" : color
        }`}
        whileHover={{ scale: 1.05 }}
        animate={{
          scale: active ? 1.15 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      <h1
        className={`font-light tracking-wider text-xl text-center ${
          active ? "font-bold text-black" : "opacity-50"
        }`}
      >
        {label}
      </h1>
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
    const pageWidth = window.innerWidth;
    const options = ["hard", "medium", "easy"];
    const difficultyColors = {
        easy: "bg-green-400",
        medium: "bg-yellow-400",
        hard: "bg-red-400",
    };

    const nextPage = () => { 
        setPageIndex((prev) => (prev + 1) % 4); 
    }; 

    const prevPage = () => { 
        setPageIndex((prev) => (prev - 1 + 4) % 4); 
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const imageUrl = URL.createObjectURL(file);
            setDish_image_url(imageUrl);
            nextPage(); 
            }
        },
        accept: { "image/*": [] },
        multiple: false,
    });

    const passToHead = () => {

        console.log("Passing Dish Info to Head:", {
            dish_image_url,
            dish_name,
            dish_description,
            dish_difficulty,
        });

        const check = validateInputs();
        
        if (!check.valid) {
            let stepBack = pageIndex - check.page;
            if (stepBack < 0) {stepBack = 4 + stepBack}
            for (let i = 0; i < stepBack; i++) {prevPage()}
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
        <div className="w-full h-full flex items-center justify-center overflow-auto scrollbar-hide">

            <div className="w-full h-full">

                <motion.div 
                    className="flex w-full h-full" 
                    drag="x" 
                    dragConstraints={{ left: -pageWidth * (3 - 1), right: 0 }} 
                    dragElastic={0.2} 
                    onDragEnd={(event, info) => { 
                        if (info.offset.x < -20) nextPage(); 
                        if (info.offset.x > 20) prevPage(); 
                    }} 
                    animate={{ x: -pageIndex * pageWidth }} 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                >
                    {/* Page 1: Image Upload */}
                    <div className="w-full min-h-[600px] p-5 flex flex-shrink-0 items-center justify-center">
                        <div 
                            {...getRootProps()}
                            className={`w-full h-full flex flex-col cursor-pointer hover:bg-white
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
                                    "This section you swipe left or right to navigate"
                                </h3>
                            </div>
                            <div className="flex items-center justify-center">
                                <svg 
                                    className="w-30 h-30"
                                    viewBox="0 0 24 24"
                                >
                                    <g fill="none"><path fill="#ffef5e" d="m20.034 4.672l-.696-1.48a.48.48 0 0 0-.433-.275h-.772a.48.48 0 0 0-.459.344l-2.4 8.262h-.118l.787-9.842a.48.48 0 0 0-.436-.515L13.6 1.002a.48.48 0 0 0-.518.438l-.842 10.083h-.487L10.91 1.442a.476.476 0 0 0-.516-.44l-1.907.164a.48.48 0 0 0-.437.515l.793 9.842h-.122L6.317 3.26a.48.48 0 0 0-.459-.344h-.772a.48.48 0 0 0-.433.274l-.695 1.48A.48.48 0 0 0 3.93 5l1.792 6.522l1.735 5.117h9.114l1.7-5.117L20.066 5a.5.5 0 0 0-.031-.328"/><path fill="#fff9bf" d="m19.172 8.24l.89-3.238a.48.48 0 0 0-.027-.33l-.695-1.48a.48.48 0 0 0-.433-.275h-.772a.48.48 0 0 0-.46.344l-.982 3.384c.894.419 1.728.955 2.48 1.595M15.58 6.19l.362-4.51a.48.48 0 0 0-.436-.514L13.6 1.002a.48.48 0 0 0-.518.438l-.349 4.18c.97.063 1.927.255 2.847.57M4.82 8.242A11 11 0 0 1 7.3 6.645L6.317 3.26a.48.48 0 0 0-.459-.344h-.772a.48.48 0 0 0-.433.274l-.695 1.48A.48.48 0 0 0 3.93 5zm6.44-2.62l-.35-4.18a.47.47 0 0 0-.33-.419a.5.5 0 0 0-.187-.021l-1.906.164a.48.48 0 0 0-.437.515l.363 4.51c.92-.315 1.877-.506 2.847-.569"/><path stroke="#191919" stroke-linecap="round" stroke-linejoin="round" d="m20.034 4.672l-.696-1.48a.48.48 0 0 0-.433-.275h-.772a.48.48 0 0 0-.459.344l-2.4 8.262h-.118l.787-9.842a.48.48 0 0 0-.436-.515L13.6 1.002a.48.48 0 0 0-.518.438l-.842 10.083h-.487L10.91 1.442a.476.476 0 0 0-.516-.44l-1.907.164a.48.48 0 0 0-.437.515l.793 9.842h-.122L6.317 3.26a.48.48 0 0 0-.459-.344h-.772a.48.48 0 0 0-.433.274l-.695 1.48A.48.48 0 0 0 3.93 5l1.792 6.522l1.735 5.117h9.114l1.7-5.117L20.066 5a.5.5 0 0 0-.031-.328"/><path stroke="#191919" stroke-linecap="round" stroke-linejoin="round" d="m11.999 14.434l-1.09-12.992a.47.47 0 0 0-.33-.419a.5.5 0 0 0-.186-.021l-1.906.164a.48.48 0 0 0-.437.515l.984 12.186m2.965.567l1.085-12.992a.47.47 0 0 1 .167-.326a.48.48 0 0 1 .35-.114l1.905.162a.48.48 0 0 1 .437.515l-.979 12.188"/><path fill="#ffef5e" stroke="#191919" stroke-linecap="round" stroke-linejoin="round" d="m18.824 17.263l-.718 2.87H5.882l-.717-2.87z"/><path fill="#ff808c" stroke="#191919" stroke-linecap="round" stroke-linejoin="round" d="M5.877 20.13h12.229l-.536 2.143a.956.956 0 0 1-.929.727H7.346a.956.956 0 0 1-.93-.727zm14.238-8.012l-1.291 5.145H5.164l-1.28-5.145a.46.46 0 0 1 .085-.412a.48.48 0 0 1 .379-.183h2.439a.47.47 0 0 1 .467.392c.603 3.357 8.877 3.357 9.48 0a.47.47 0 0 1 .468-.392h2.449a.476.476 0 0 1 .469.593z"/></g>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Page 2: Dish Name */}
                    <div className={`w-full h-full flex-shrink-0 p-5 flex items-center justify-center text-2xl`}>
                        <div className="w-full h-full flex flex-col overflow-hidden p-5 gap-5">
                            <h1 className="text-center tracking-widest font-bold text-[50px]">
                                <WobblyText text="name"/>
                            </h1>
                            <motion.div 
                                className="h-full bg-yellow-300 shadow-xl rounded-[30px] p-5"
                                whileHover={{ scale: 1.05 }} 
                                transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                            >
                                <input 
                                    value={dish_name}
                                    onChange={(e) => {setDish_name(e.target.value)}}
                                    className="w-full h-[40px] bg-gray-200 rounded-[25px] 
                                            px-3 cursor-pointer text-center 
                                            placeholder-italic placeholder:font-light placeholder:tracking-wider placeholder:text-sm placeholder:italic
                                            "
                                />
                            </motion.div>
                            <h1 className="section-info-question">
                                Your dish has a name ?
                            </h1>
                            <div className="h-1/5 flex items-center justify-center">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} 
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                                    className={`next-button ${dish_name.trim() ? "bg-black text-white cursor-pointer" : "text-black cursor-not-allowed"}`}
                                    onClick={() => nextPage()}
                                    disabled={!dish_name.trim()}
                                >next
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Page 3: Dish Description */}
                    <div className={`w-full h-full flex-shrink-0 p-5 flex items-center justify-center text-2xl`}>
                        <div className="w-full h-full flex flex-col overflow-hidden p-5 gap-5">
                            <h1 className="text-center tracking-widest font-bold text-[50px]">
                                <WobblyText text="description" />
                            </h1>
                            <motion.div 
                                className="h-full bg-blue-300 rounded-[30px] p-5"
                                whileHover={{ scale: 1.05 }} 
                                transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                            >
                                <textarea 
                                    value={dish_description}
                                    onChange={(e) => {setDish_description(e.target.value);}}
                                    className="w-full h-[40px] bg-gray-200 rounded-[25px] 
                                            px-3 cursor-pointer text-center 
                                            placeholder-italic placeholder:font-light placeholder:tracking-wider placeholder:text-sm placeholder:italic
                                            "
                                />
                            </motion.div>
                            <h1 className="section-info-question">
                                what is your dish ?
                            </h1>
                            <div className="h-1/5 flex items-center justify-center">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} 
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className={`next-button ${dish_description.trim() ? "bg-black text-white cursor-pointer" : "text-black cursor-not-allowed"}`}
                                    onClick={() => nextPage()}
                                    disabled={!dish_description.trim()}
                                >next
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Page 4: Dish Difficulty */}
                    <div className={`w-full h-full flex-shrink-0 p-5 flex items-center justify-center text-2xl`}>
                        <div className="w-full flex flex-col overflow-hidden p-5 gap-5">
                            <h1 className="text-center tracking-widest font-bold text-[50px]">
                                <WobblyText text="difficulty" />
                            </h1>
                            <div className="h-full flex flex-col">
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
                                <h1 className="section-info-question mt-5">
                                    How difficult is it to prepare your dish ?
                                </h1>
                            </div>
                            <div className="h-1/5 flex items-center justify-center">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} 
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                                    className="next-section-button"
                                    onClick={passToHead}
                                >ingredient
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
