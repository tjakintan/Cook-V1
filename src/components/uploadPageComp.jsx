import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import "../styles/component_style.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export function UploadPage({ onNext, setFile }) {

    const fileInputRef = useRef(null);

    const onFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setFile(file);       
            onNext();            
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-full md:w-2/3 lg:w-2/3 h-full md:h-3/4 lg:h-3/4 pb-2 pt-2">
                <div className="h-full flex justify-center items-center">
                    <div className="relative w-[70px] h-[70px] rounded-lg shadow-lg">
                        <div className="absolute inset-0 bg-black bg-opacity-25 rounded-lg shadow-lg hover:brightness-50">
                            <button 
                                onClick={() => fileInputRef.current.click()} 
                                className="relative w-full h-full flex justify-center items-center cursor-pointer">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 40 40"
                                className="w-3/4 h-3/4"
                                fill="#fff"
                                >
                                <path d="M14.702 28.838c-1.757 0-3.054-.031-4.248-.061c-1.014-.024-1.954-.047-3.043-.047a6.454 6.454 0 0 1-6.447-6.446a6.393 6.393 0 0 1 2.807-5.321a10.558 10.558 0 0 1-.217-2.138C3.554 8.983 8.307 4.23 14.15 4.23c3.912 0 7.495 2.164 9.332 5.574a6.396 6.396 0 0 1 4.599-1.929a6.454 6.454 0 0 1 6.258 8.008a6.45 6.45 0 0 1 4.699 6.207a6.455 6.455 0 0 1-6.447 6.448c-1.661 0-2.827.013-3.979.024c-1.126.012-2.239.024-3.784.024a.5.5 0 0 1 0-1c1.541 0 2.65-.012 3.773-.024c1.155-.012 2.325-.024 3.99-.024a5.447 5.447 0 0 0 1.025-10.798a.5.5 0 0 1-.379-.653a5.452 5.452 0 0 0-5.156-7.213a5.412 5.412 0 0 0-4.318 2.129a.498.498 0 0 1-.852-.101a9.616 9.616 0 0 0-8.76-5.674c-5.291 0-9.596 4.304-9.596 9.595c0 .76.09 1.518.267 2.252a.5.5 0 0 1-.227.545a5.408 5.408 0 0 0-2.63 4.662a5.453 5.453 0 0 0 5.447 5.446c1.098 0 2.045.022 3.067.048c1.188.028 2.477.06 4.224.06a.5.5 0 1 1-.001 1.002z" />
                                <path d="M26.35 22.456a.5.5 0 0 1-.347-.14l-6.777-6.535l-6.746 6.508a.5.5 0 1 1-.694-.721l7.093-6.841a.5.5 0 0 1 .694-.001l7.123 6.869a.5.5 0 0 1-.346.861z" />
                                <path d="M19.226 35.769a.5.5 0 0 1-.5-.5V15.087a.5.5 0 0 1 1 0V35.27a.5.5 0 0 1-.5.499z" />
                                </svg>
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".jpg, .jpeg, .png"
                            onChange={onFileChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};



export function UploadNextPage({ onBack, data, file, onNext }) {

    const [dishName, setDishName] = useState(data?.dishName || "");
    const [description, setDescription] = useState(data?.description || "");
    const [difficulty, setDifficulty] = useState(data?.difficulty || "");

    const [shake, setShake] = useState(false);

    const difficulties = ["Easy", "Medium", "Hard", "Very Hard"]; 
    const [open, setOpen] = useState(false);

    const imageUrl = file ? URL.createObjectURL(file) : null;

    const submitPost = () => {
   
        if (!dishName.trim() || !description.trim() || !difficulty || !file) {
            setShake(true);
            setTimeout(() => setShake(false), 400);
            return;
        }
    
        onNext({
            dishName,
            description,
            difficulty,
            file
        });
    };


    return (

        <div className="h-screen w-screen flex justify-center items-center">

            <div className="w-full md:w-2/3 lg:w-2/3 h-[95%] md:h-3/4 lg:h-3/4 pb-10 overflow-y-auto scrollbar-hide">

                {/* Header */}
                <div className="relative w-full flex flex-row items-center justify-between px-4 py-3 ">
                    <button onClick={onBack} className="w-10 h-10 rounded-full bg-black p-3 flex items-center justify-center relative left-5 cursor-pointer z-10">
                        <svg 
                            viewBox="0 0 32 32"
                            className="w-10 h-10 text-red-500"
                            >
                            <path fill="currentColor" d="m13.28 6.78l-8.5 8.5l-.686.72l.687.72l8.5 8.5l1.44-1.44L7.936 17H28v-2H7.937l6.782-6.78l-1.44-1.44z"/>
                        </svg>
                    </button>
                    <button  onClick={submitPost} className="w-10 h-10 rounded-full bg-black p-3 flex items-center justify-center relative right-5 cursor-pointer">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 32 32" 
                            className="w-8 h-8 text-blue-400"
                        >
                            <path fill="currentColor" d="m18.72 6.78l-1.44 1.44L24.063 15H4v2h20.063l-6.782 6.78l1.44 1.44l8.5-8.5l.686-.72l-.687-.72l-8.5-8.5z"/>
                        </svg>
                    </button>
                </div> 

                {/* Post image */}
                <div className="flex flex-col justify-evenly h-full pb-10 gap-10">

                    {/* Dish name */}
                    <div className="flex justify-center items-center">

                        <div className="w-[85%] h-[200px] rounded-[30px] flex items-center justify-center shadow-lg overflow-hidden">
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Uploaded"
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            )}
                        </div>

                    </div>

                    {/* Post preview (information) */}
                    <div className="flex justify-center items-center" >

                        <div className="w-3/4 relative">
                            <label className="bg-transparent absolute -top-2 right-7 bg-white px-1 text-xs font-thin tracking-wide bg-white/10"></label>
                            <motion.div
                                animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : { x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="h-[50px] rounded-[30px] flex items-center justify-between shadow-lg px-3"
                            >
                                <input 
                                    type="text"
                                    placeholder="What is your dish?"
                                    className="font-light tracking-wider text-sm placeholder-style bg-transparent text-sm outline-none w-full placeholder-gray-600"
                                    style={{ fontFamily: "Arial, sans-serif" }}
                                    value={dishName}
                                    onChange={(e) => setDishName(e.target.value)}
                                />
                            </motion.div>

                        </div>

                    </div>

                    {/* Post description */}
                    <div className="flex justify-center items-center" > 

                        <div className="w-3/4 relative">
                            <motion.div
                                animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : { x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="h-[100px] rounded-[30px] flex items-center justify-center shadow-lg px-3"
                            >
                                <textarea 
                                    type="text"
                                    placeholder="The recipe?"
                                    className="w-full h-[90%] scrollbar-hide placeholder-style bg-transparent text-sm outline-none placeholder-gray-600 font-light tracking-wider"
                                    style={{ fontFamily: "Arial, sans-serif" }}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </motion.div>
                        </div>

                    </div>

                    {/* Post difficulty level */}
                    <div className="flex justify-center items-center">
                        
                        <div className="w-3/4 relative">
                            {/* Selected box */}
                            <motion.div
                                animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : { x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="h-[45px] rounded-[30px] flex items-center justify-between shadow-lg px-3 cursor-pointer bg-white/20 backdrop-blur-sm"
                                onClick={() => setOpen(!open)}
                            >
                                <span className={`text-sm font-light tracking-wide ${difficulty ? "text-black" : "text-gray-600 italic" }`}>
                                    {difficulty || "Select difficulty"}
                                </span>
                                <span className="text-xs">▼</span>
                            </motion.div>

                            {/* Dropdown menu */}
                            {open && (
                                <div className="absolute w-full mt-1 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm z-10">
                                    {difficulties.map((level, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setDifficulty(level);
                                                setOpen(false);
                                            }}
                                            className="px-3 py-2 text-sm hover:bg-gray-200 cursor-pointer rounded-xl font-light tracking-wide"
                                        >
                                            {level}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                </div> 

            </div>

        </div>
    )
} 

export function UploadPreview({ data, onBack, post }) {

    const navigate = useNavigate();

    const { dishName, description, difficulty, file, user_sub } = data;


    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                const result = reader.result;
                const base64 = result.includes(",") ? result.split(",")[1] : result;
                resolve(base64);
            };

            reader.onerror = reject;
        });
    };


    const submitPost = async () => {
        post();
        try {
            const fileBase64 = await fileToBase64(data.file);

            const payload = {
                dishName: data.dishName,
                description: data.description,
                difficulty: data.difficulty,
                fileName: data.file.name,
                fileBase64: fileBase64,
                user_sub
            };

            const response = await fetch(
                "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/upload",  // your API endpoint
                {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const result = await response.json();
            console.log("Upload success:", result);

        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        }
    };
    
    return (

        <div className="h-screen w-screen flex justify-center items-center ">

            <div className="w-full md:w-2/3 lg:w-2/3 h-3/4 flex flex-col scrollbar-hide overflow-hidden">

                {/* Header */}
                <div className="relative w-full h-[10%] flex flex-row items-center justify-between">
                    <button onClick={onBack} className="relative left-5 cursor-pointer z-10">
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24"
                        >
                        <path fill="red" d="M16 21.308L6.692 12L16 2.692l1.063 1.064L8.82 12l8.244 8.244L16 21.308Z" />
                        </svg>
                    </button>
                </div>

                
                <div className="relative w-full h-[90%] flex flex-col">

                    {/* Preview of how it will appear on feed */}
                    <div className="flex flex-col w-full h-[80%] justify-center items-center p-4">
                        <div className="flex flex-col w-full h-full  overflow-hidden">
                            {/* Image(file) container */}
                            <div className="w-full h-[65%]">
                                <img 
                                    src={URL.createObjectURL(file)} 
                                    alt="preview" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Preview container */}
                            <div className="w-full h-[35%] flex flex-col pt-2 pl-4 pb-4">
                                <div className="w-full h-[90%] flex flex-col gap-2 items-center">
                                    <text className="font-light text-2xl tracking-widest font-bold">{dishName}</text>
                                    <div className="w-3/5 border-t border-gray-300"></div>
                                    <text className="font-thin text-md tracking-wide">{description}</text>   
                                </div>  
                            </div>
                        </div>
                    </div>


                    {/* Post button */}
                    <motion.div 
                        className="flex flex-col w-full h-[20%] justify-center items-center"
                        whileHover={{ scale: 1.05 }} 
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >

                        <button 
                            className=" w-[100px] h-[40px] bg-black text-white rounded-[30px] cursor-pointer font-thin tracking-widest"
                            onClick={() => {
                                submitPost();
                                navigate("/feed");
                            }}
                        >   
                            Post
                        </button>

                    </motion.div>

                </div>



            </div>

        </div>
    )

}
