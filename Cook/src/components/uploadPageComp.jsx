import React, { useRef } from "react";
import "./component_style.css"

export function UploadPage({ onNext, setFile }) {

    const fileInputRef = useRef(null);

    const onFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setFile(file);       // Pass file to parent
            onNext();            // Move to next screen
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-2/3 h-3/4  rounded-lg shadow-lg">
                <p className="relative top-5 text-center tracking-wider">UPLOAD</p>
                <div className="h-full flex justify-center items-center">
                    <div className="relative w-[70px] h-[70px] rounded-lg shadow-lg">
                        <div className="absolute inset-0 bg-black bg-opacity-25 rounded-lg shadow-lg">
                            <button onClick={() => fileInputRef.current.click()} className="relative w-full h-full flex justify-center items-center">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 40 40"
                                className="w-3/4 h-3/4"
                                fill="#fff"
                                >
                                <path d="M14.702 28.838c-1.757 0-3.054-.031-4.248-.061c-1.014-.024-1.954-.047-3.043-.047a6.454 6.454 0 0 1-6.447-6.446a6.393 6.393 0 0 1 2.807-5.321a10.558 10.558 0 0 1-.217-2.138C3.554 8.983 8.307 4.23 14.15 4.23c3.912 0 7.495 2.164 9.332 5.574a6.396 6.396 0 0 1 4.599-1.929a6.454 6.454 0 0 1 6.258 8.008a6.45 6.45 0 0 1 4.699 6.207a6.455 6.455 0 0 1-6.447 6.448c-1.661 0-2.827.013-3.979.024c-1.126.012-2.239.024-3.784.024a.5.5 0 0 1 0-1c1.541 0 2.65-.012 3.773-.024c1.155-.012 2.325-.024 3.99-.024a5.447 5.447 0 0 0 1.025-10.798a.5.5 0 0 1-.379-.653a5.452 5.452 0 0 0-5.156-7.213a5.412 5.412 0 0 0-4.318 2.129a.498.498 0 0 1-.852-.101a9.616 9.616 0 0 0-8.76-5.674c-5.291 0-9.596 4.304-9.596 9.595c0 .76.09 1.518.267 2.252a.5.5 0 0 1-.227.545a5.408 5.408 0 0 0-2.63 4.662a5.453 5.453 0 0 0 5.447 5.446c1.098 0 2.045.022 3.067.048c1.188.028 2.477.06 4.224.06a.5.5 0 1 1-.001 1.002z" />
                                <path d="M26.35 22.456a.5.5 0 0 1-.347-.14l-6.777-6.535l-6.746 6.508a.5.5 0 1 1-.694-.721l7.093-6.841a.5.5 0 0 1 .694-.001l7.123 6.869a.5.5 0 0 1-.346.861z" />
                                <path d="M19.226 35.769a.5.5 0 0 1-.5-.5V15.087a.5.5 0 0 1 1 0V35.27a.5.5 0 0 1-.5.499z" />
                                </svg>
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".jpg, .jpeg, .png"
                            onChange={onFileChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

export function UploadNextPage({ onBack, file }) {
    const imageUrl = file ? URL.createObjectURL(file) : null;

    return(
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="w-2/3 h-3/4 rounded-lg shadow-lg overflow-y-auto scrollbar-hide">

                <div className="relative">
                    <button onClick={onBack} className="absolute left-4 top-3 z-10">
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24"
                        >
                        <path fill="red" d="M16 21.308L6.692 12L16 2.692l1.063 1.064L8.82 12l8.244 8.244L16 21.308Z" />
                        </svg>
                    </button>
                    <p className="relative top-3 text-center tracking-wider">INFORMATION</p>
                </div> 

                <div className="flex flex-col justify-evenly h-full p-4">
                    <div className="flex justify-center items-center" > 
                        <div className="w-3/4 relative">
                            <label className="bg-transparent absolute -top-2 right-7 bg-white px-1 text-xs font-thin tracking-wide bg-white/10"></label>
                            <div className="h-[30px] rounded-[30px] flex items-center justify-between shadow-lg px-3">
                                <input 
                                type="text"
                                placeholder="What is your dish?"
                                className="placeholder-style bg-transparent text-xs outline-none w-full placeholder-gray-500"
                                style={{ fontFamily: "Arial, sans-serif" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center" >
                        <div className="w-3/4 h-[300px] rounded-[30px] flex items-center justify-center shadow-lg">
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Uploaded"
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center items-center" > 
                        <div className="w-3/4 relative">
                            <label className="bg-transparent absolute -top-2 right-7 bg-white px-1 text-xs font-thin tracking-wide bg-white/10 opacity-50"></label>
                            <div className="h-[30px] rounded-[30px] flex items-center justify-between shadow-lg px-3">
                                <input 
                                type="text"
                                placeholder="The recipe?"
                                className="placeholder-style bg-transparent text-xs outline-none w-full placeholder-gray-500"
                                style={{ fontFamily: "Arial, sans-serif" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center" > 
                        <div className="w-3/4 relative">
                            <label className="bg-transparent absolute -top-2 right-7 bg-white px-1 text-xs font-thin tracking-wide bg-white/10"></label>
                            <div className="h-[30px] rounded-[30px] flex items-center justify-between shadow-lg px-3">
                                <input 
                                type="text"
                                placeholder="The recipe?"
                                className="placeholder-style bg-transparent text-xs outline-none w-full placeholder-gray-500"
                                style={{ fontFamily: "Arial, sans-serif" }}
                                />
                            </div>
                        </div>
                    </div>
                </div> 

                <div className="">
                    <div className="">

                    </div>
                    <div className="">
                        
                    </div>
                </div>   

            </div>
        </div>
    )
}

export function UploadPreview() {

}
