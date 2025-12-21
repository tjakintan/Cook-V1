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
                    <></>
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
