import { useState } from "react";
import "./cook_style.css";

const Nutrition = ({ value, onPassToHead }) => {

    const [dish_nutrition, setDish_nutrition] = useState(value?.dish_nutrition || "");

    return (
        <div className="section-sub bg-blue-300">
        </div>
    );
};

export default Nutrition;