import { useState } from "react";
import "./cook_style.css";

const Ingredients = ({ value, onPassToHead }) => {

    const [dish_ingredients, setDish_ingredients] = useState(value?.dish_ingredients || "");

    return (
        <div className="section-sub">
        </div>
    );
};

export default Ingredients;