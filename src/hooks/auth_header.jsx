import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AuthHeader() {

    const navigate = useNavigate();

    return (

        <motion.img 
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            src="/gomeal1.png"
            className="w-[120px] h-[120px] cursor-pointer"
            onClick={() => {navigate("/")}}
        />

    );

}