import React, { useState } from "react";
import { UploadPage, UploadNextPage } from "../components/uploadPageComp.jsx";

export default function Upload() {

    const [showNext, setShowNext] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null)

    if (showNext) {
        return (
                <UploadNextPage
                    file={selectedFile} 
                    onBack={() => setShowNext(false)} 
                />
        );
    } 
    else {
        return ( 
                <UploadPage 
                    onNext={() => setShowNext(true)}
                    setFile={setSelectedFile}
                /> 
        );
    }
}