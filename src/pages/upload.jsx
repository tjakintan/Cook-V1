import React, { useState } from "react";
import { UploadPage, UploadNextPage, UploadPreview } from "../components/uploadPageComp.jsx";
import "../styles/pages_style.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Upload() {
    
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [postData, setPostData] = useState(null);
    const accessToken = localStorage.getItem("accessToken");

   
    if (step === 1) {
        return (
            <>
                <UploadPage 
                    onNext={() => {
                        if (!accessToken) return;
                        setStep(2)}}
                    setFile={setSelectedFile}
                />
                {!accessToken && (
                    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex justify-center items-center bg-black/70 backdrop-blur-sm">
                        <div className="w-[50%] md:w-[25%] lg:w-[25%] h-[20%] rounded-[30px] flex flex-col justify-between items-center bg-white py-5 px-2">
                            <span className="font-thin tracking-wider text-[15px]">Please sign in to post</span>
                            <div className="w-4/5 border-t border-gray-300"></div>
                            <button 
                                className="flex w-15 h-15 justify-center items-center rounded-full bg-black px-3 py-1.5 text-sm font-light text-white tracking-widest 
                                cursor-pointer hover:border-[2px] hover:border-blue-600"
                                onClick={() => navigate("/more")}>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 32 32" 
                                        preserveAspectRatio="none"
                                        className="w-8 h-8 text-blue-400"
                                    >
                                        <path fill="currentColor" d="m18.72 6.78l-1.44 1.44L24.063 15H4v2h20.063l-6.782 6.78l1.44 1.44l8.5-8.5l.686-.72l-.687-.72l-8.5-8.5z"/>
                                    </svg> 
                            </button>

                        </div>
                    </div>
                )}
            </>
        );
    }

    if (step === 2) {
        return (
            <UploadNextPage 
                file={selectedFile}
                data={postData}
                onBack={() => {
                    setPostData(null);
                    setSelectedFile(null);
                    setStep(1);
                }}
                onNext={(data) => {
                    const decoded = jwtDecode(accessToken); 
                    const user_sub = decoded.sub;
                    setPostData({ ...data, user_sub });
                    setStep(3);
                }}
            />
        );
    }

    if (step === 3) {
        return postData ? (
            <UploadPreview 
                data={postData}
                onBack={() => setStep(2)}
                post={() => setPostData(null)}
            />
        ) : ( null
        );
    }


    return null; 
}
