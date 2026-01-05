import { useState } from "react";
import "./cook_style.css";

const Dietary = ({ value, onPassToHead }) => {

    const [dish_dietary, setDish_dietary] = useState(value?.dish_dietary || "");

    return (
        <div className="section-sub">
        </div>
    );
};

export default Dietary;