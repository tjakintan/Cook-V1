import { useEffect, useState } from "react";
import { DishInfo, Ingredients, Steps, Nutrition, Dietary } from "./index.js";
import { motion, AnimatePresence } from "framer-motion";
import "./cook_style.css";
import { useUser } from "../../utils/user.jsx";
import { getUserSub } from "../../utils/auth.js";

export default function Head() {
    const { user } = useUser();
    const sub = getUserSub(user);
    const [step, setStep] = useState(0);
    const isActive = (index) => step === index;

    const [dishInfoData, setDishInfoData] = useState({
        dish_image_file: null,   
        dish_image_url: "",      
        dish_name: "",
        dish_description: "",
        dish_difficulty: "",
    });
    const [dishIngredientsData, setDishIngredientsData] = useState([]);
    const [dishStepsData, setDishStepsData] = useState([]);
    const [dishDietaryData, setDishDietaryData] = useState([]);
    const [nutritionResults, setNutritionResults] = useState([]);
    const [dishNutritionData, setDishNutritionData] = useState([]);
    const [quickPost, setQuickPost] = useState(false);

    const handleDishInfoChange = (data) => {
        setDishInfoData(data);
        setQuickPost(true);
    };
    const handleDishIngredientsChange = (data) => {
        setDishIngredientsData(data.dish_ingredients);
        setStep(2);
    };
    const handleDishStepsChange = (data) => {
        setDishStepsData(data.dish_steps);
        setStep(3);
    };
    const handleDishDietaryChange = (data) => {
        setDishDietaryData(data.dish_dietary);
    };
    const handleDishNutritionChange = (data) => {
        setDishNutritionData(data);
        setStep(4);
    };

    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 0));
    };

    useEffect(() => {
        if (!dishIngredientsData?.length) return;

        const timer = setTimeout(async () => {
            console.log("Ingredients: ", dishIngredientsData);
            try {
                const payload = { ingredients: dishIngredientsData };

                const res = await fetch("https://api.gomeal.org/autocalculatenutrition", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();
                if (typeof data.body === "string") {
                    data = JSON.parse(data.body);
                }
                if (res.ok) {
                    setNutritionResults(data.autoCalculatedNutrition);
                    console.log("results : ", data.autoCalculatedNutrition)
                } else {
                    console.error("API error:", data);
                }
            } catch (err) {
                console.error("Error fetching nutrition:", err);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [dishIngredientsData]);

    const uploadToS3 = async (file) => {
        const res = await fetch("https://api.gomeal.org/imageuploadfunc", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
            }),
        });

        const { uploadUrl, fileUrl } = await res.json();

        await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });        

        return { fileUrl, uploadUrl };
    };

    const buildPayload = async ({

        dishInfoData = {},
        dishIngredientsData = [],
        dishStepsData = [],
        dishNutritionData = {},
        dishDietaryData = {},
        userSub = "",
        }) => {

        // 1. Upload main dish image
        const mainImageData = dishInfoData.dish_image_file
            ? await uploadToS3(dishInfoData.dish_image_file)
            : { fileUrl: dishInfoData.dish_image_url || "", uploadUrl: null };

        // 2. Upload step images

        {/** 
        const uploadedSteps = await Promise.all(
            dishStepsData.map(async (step) => {
            const stepImageUrl = await uploadToS3(step.image_file);
            return { ...step, image_url: stepImageUrl || "" };
            })
        );
*/}
        // 3. Build the final payload
        const Payload = {
            dish_name: dishInfoData.dish_name || "",
            description: dishInfoData.dish_description || "",
            difficulty: dishInfoData.dish_difficulty || "",
            image_url: mainImageData.fileUrl || "",
            upload_url: mainImageData.uploadUrl || "",
            user_sub: userSub,
            ingredients: dishIngredientsData || [],
            steps: dishStepsData,
            nutrition: dishNutritionData || {},
            dietary: dishDietaryData || {},
        };

        console.log("Final payload ready to send:", Payload);
        return Payload;
    };

    const sendToAPI = async () => {
        const payload = await buildPayload(
            {dishInfoData, dishIngredientsData, dishStepsData, dishNutritionData, dishDietaryData, sub}
        );

        console.log("Final payload", payload);
    };

    const quickPostSendToAPI = async () => {
        const payload = await buildPayload({dishInfoData});

        console.log("quick post payload", payload);

    }

    return (
        <>

            <div className={`h-screen ${step >= 3 ? "pt-[40vh]" : "justify-center"} 
                            flex flex-col scrollbar-hide overflow-y-auto`}
            >
                <AnimatePresence mode="wait">

                    {step === 0 && (
                        <StepWrapper isActive={isActive(0)} bgClass="">
                            <DishInfo value={dishInfoData} onPassToHead={handleDishInfoChange} />
                        </StepWrapper>
                    )}

                    <div className={`flex flex-col ${quickPost ? "hidden" : ""}`}>
                        {step === 1 && (
                            <StepWrapper height="min-h-[50vh]" bgClass="" isActive={isActive(1)}>
                                <Ingredients 
                                    onBack={handleBack}
                                    value={dishIngredientsData} 
                                    dish_name={dishInfoData.dish_name} 
                                    dish_description={dishInfoData.dish_description}
                                    onPassToHead={handleDishIngredientsChange} />
                            </StepWrapper>
                        )}
                        {step === 2 && (
                            <StepWrapper height="min-h-[50vh]" bgClass="" isActive={isActive(2)}>
                                <Steps onBack={handleBack} value={dishStepsData} onPassToHead={handleDishStepsChange} />
                            </StepWrapper>
                        )}
                        {step >= 3 && (
                            <StepWrapper height="min-h-[50vh]" bgClass="bg-gradient-to-b from-white to-black/90">
                                <div className="flex flex-col gap-5">
                                    <Dietary 
                                        onBack={handleBack}
                                        value={dishDietaryData} 
                                        onPassToHead={handleDishDietaryChange} 
                                    />

                                    <Nutrition 
                                        nutritionResults={nutritionResults} 
                                        onPassToHead={handleDishNutritionChange} 
                                    />
                                </div>
                            </StepWrapper>
                        )}
                        {step === 4 && (
                            <motion.div
                                className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black/90 to-black"
                            >
                                <svg
                                    onClick={sendToAPI()}
                                    className="w-20 h-20 cursor-pointer text-white"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="0.5" fill="none" />
                                    <line x1="12" y1="7" x2="12" y2="17" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
                                    <line x1="7" y1="12" x2="17" y2="12" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
                                </svg>
                            </motion.div>
                        )}
                    </div>

                </AnimatePresence>
                
            </div>

            {quickPost && (
                <AnimatePresence>

                    <motion.div
                        key="quick-post-popup"
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm p-5"
                    >
                        <div className="w-full max-w-md p-6 flex flex-col gap-5 relative items-center">
                            
                            <button
                                onClick={() => setQuickPost(false)}
                                className="absolute top-0 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold"
                            >
                                ×
                            </button>
                            
                            <h1 className="font-thin tracking-wider text-[13px]">click the icon to quick post</h1>
                            <motion.div
                                className={`flex cursor-pointer`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={quickPostSendToAPI}
                            >
                                <svg 
                                    width="100" height="100"  
                                    viewBox="0 0 100 100"
                                >
                                    <path fill="#000000" d="M88.558 49.96c0-.885-.435-1.663-1.097-2.151l.014-.024l-9.324-5.383l5.367-9.296l-.018-.011a2.666 2.666 0 0 0-.127-2.408a2.667 2.667 0 0 0-2.025-1.314v-.026H70.58V18.61h-.022a2.667 2.667 0 0 0-1.314-2.022a2.662 2.662 0 0 0-2.412-.125l-.013-.023l-9.481 5.474l-5.25-9.094l-.019.011a2.668 2.668 0 0 0-2.149-1.094c-.885 0-1.664.435-2.151 1.097l-.024-.014l-5.337 9.244l-9.19-5.306l-.011.019a2.666 2.666 0 0 0-2.408.127a2.666 2.666 0 0 0-1.315 2.025h-.027v10.674H18.845v.021a2.667 2.667 0 0 0-2.022 1.314a2.667 2.667 0 0 0-.126 2.41l-.023.014l5.246 9.087l-9.394 5.424l.011.019a2.668 2.668 0 0 0-1.094 2.149c0 .885.435 1.664 1.097 2.151l-.014.024l9.324 5.383l-5.367 9.296l.018.01a2.666 2.666 0 0 0 .127 2.408a2.667 2.667 0 0 0 2.025 1.314v.027H29.42V81.39h.022c.092.816.549 1.58 1.314 2.022a2.665 2.665 0 0 0 2.412.125l.013.023l9.481-5.474l5.25 9.094l.019-.011a2.668 2.668 0 0 0 2.149 1.094c.885 0 1.664-.435 2.151-1.096l.023.013l5.337-9.244l9.191 5.306l.011-.019a2.666 2.666 0 0 0 2.408-.127a2.666 2.666 0 0 0 1.315-2.025h.027V70.398h10.613v-.021a2.667 2.667 0 0 0 2.022-1.314a2.67 2.67 0 0 0 .126-2.411l.023-.013l-5.246-9.087l9.394-5.424l-.011-.019a2.666 2.666 0 0 0 1.094-2.149zM43.715 61.355l-9.846-4.35l4.345 7.525l-2.456 1.418l-6.662-11.537l2.525-1.459l9.53 4.162l-4.185-7.248l2.457-1.418l6.66 11.537l-2.368 1.37zm4.652-2.686l-6.661-11.538l8.165-4.713l1.248 2.162l-5.709 3.295l1.398 2.422l5.587-3.225l1.248 2.16l-5.587 3.227l1.518 2.629l5.709-3.295l1.248 2.162l-8.164 4.714zm18.906-10.915L60.675 41l2.567 9.08l-2.611 1.508l-9.965-9.629l2.75-1.588l6.838 7.168l-2.617-9.605l1.92-1.108l6.993 7.079l-2.79-9.506l2.75-1.588l3.375 13.436l-2.612 1.507z"/>
                                </svg>
                            </motion.div>

                            <h1 className="font-thin tracking-wider text-[13px] mt-3">add additional information</h1>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setQuickPost(false);
                                    setStep(1);
                                }}
                                className="px-5 py-2 tracking-widest font-thin rounded-[20px] bg-black text-white cursor-pointer"
                            >
                                + ingredient
                            </motion.button>

                        </div>
                    </motion.div>

                </AnimatePresence>
            )}

        </>
    );
}

// Step wrapper 
const StepWrapper = ({ children, isActive, bgClass, height }) => (
    <motion.div
        className={`
                    ${bgClass}   
                    ${isActive ? "pointer-events-auto" : ""}`}
        variants={slideVariants}
        initial="initial"
        animate="animate"
        exit="exit"
    >
        {children}
    </motion.div>
);

const slideVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
};
