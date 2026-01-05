import React, { useState, useEffect } from 'react';
import { DishInfo, Ingredients, Steps, Nutrition, Dietary } from './index.js';
import "./cook_style.css";

export default function Head({ onDataChange }) {
    
    const [dishInfoData, setDishInfoData] = useState({
        dish_image_url: "",
        dish_name: "",
        dish_description: "",
        dish_difficulty: "",
    });

    const handleDishInfoChange = (partialData) => {
        setDishInfoData((prev) => ({
        ...prev,
        ...partialData,
        }));
    };

    return (
        <div 
            className='w-screen h-screen scrollbar-hide overflow-y-auto bg-white'
        >
            <div className="flex flex-col items-center justify-center">

                <div className={`section`}>
                    <DishInfo value={dishInfoData} onPassToHead={handleDishInfoChange}/>
                </div>
                <div className={`section`}>
                    <Ingredients />
                </div>
                <div className={`section`}>
                    <Steps />
                </div>
                <div className={`section`}>
                    <Nutrition />
                </div>
                <div className={`section`}>
                    <Dietary />
                </div>

            </div>

        </div>

    );

}