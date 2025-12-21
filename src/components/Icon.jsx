import { motion } from "framer-motion";
import "../styles/component_style.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/user";

export default function Icons() {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <div 
            className="w-full h-[60px] fixed top-5 flex justify-center items-end z-50" 
            onClick={() => navigate("/")}
        >
            {/* PILL */}
            <motion.div
                layout
                initial="collapsed"
                whileHover="expanded"
                className="flex items-center rounded-[30px] bg-white/30 backdrop-blur-lg overflow-hidden outline-2"
                variants={{
                collapsed: { paddingRight: 12 },
                expanded: { paddingRight: 20 },
                }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >

                {/* LOGO */}
                <motion.div
                    layout="position"
                    className="w-15 h-15 flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                >
                    <img
                        src="./gomeal.png"
                        className="w-15 h-15 object-contain mt-1 ml-4"
                    />
                </motion.div>

                {/* VERSION TEXT */}
                <motion.div
                    layout="position"
                    className="flex items-center font-thin text-[12px] text-black"
                >
                    <motion.div
                        className="overflow-hidden"
                        variants={{
                        collapsed: { width: 0, opacity: 0 },
                        expanded: { width: 90, opacity: 1 },
                        }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    >
                        <span className="text-[10px] whitespace-nowrap tracking-widest">
                            v2<span className="text-[11px] ">&nbsp;|&nbsp;</span>Serverless
                        </span>
                    </motion.div>
                </motion.div>

            </motion.div>
            
        </div>
    );
}
