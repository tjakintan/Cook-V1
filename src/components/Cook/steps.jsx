import { useState } from "react";
import "./cook_style.css";

const Steps = ({ value, onPassToHead }) => {

    const [dish_steps, setDish_steps] = useState(value?.dish_steps || "");

    return (
        <div className="section-sub">
        </div>
    );
};

export default Steps;