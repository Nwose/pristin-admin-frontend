"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import KYCService from "@/lib/api/services/KYC.Service";
import { useAuthStore } from "@/lib/api/auth/authContext";
import { toast } from "react-toastify";
import { Camera, RefreshCw, Check, AlertCircle, Loader2, X } from "lucide-react";

interface LivenessCheckModalProps {
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function LivenessCheckModal({ onSuccess, onClose }: LivenessCheckModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const { setUser } = useAuthStore();
    
    const [cameraReady, setCameraReady] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);

    // Initialize camera
    const startCamera = useCallback(async () => {
        setIsInitializing(true);
        setCameraError(null);
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user"
                }
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setCameraReady(true);
                toast.success("Camera ready!");
            }
        } catch (err: any) {
            console.error("Camera access error:", err);
            const errorMsg = err.name === "NotAllowedError" 
                ? "Camera access denied. Please allow camera permissions."
                : "Unable to access camera. Please check your device settings.";
            setCameraError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsInitializing(false);
        }
    }, []);

    // Stop camera
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraReady(false);
    }, []);

    // Capture photo
    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                const imageData = canvas.toDataURL("image/jpeg", 0.9);
                setCapturedImage(imageData);
                stopCamera();
                toast.success("Photo captured!");
            }
        }
    }, [stopCamera]);

    // Retake photo
    const retakePhoto = useCallback(() => {
        setCapturedImage(null);
        startCamera();
    }, [startCamera]);

    // Convert base64 to blob
    const base64ToBlob = (base64: string): Blob => {
        const parts = base64.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        
        return new Blob([uInt8Array], { type: contentType });
    };

    // Submit liveness check
    const handleSubmit = async () => {
        if (!capturedImage) {
            toast.error("Please capture a photo first");
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert base64 image to blob/file for upload
            const blob = base64ToBlob(capturedImage);
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            
            // Create FormData for file upload
            const formData = new FormData();
            formData.append("selfie", file);
            
            // Call the liveness check API and get updated user
            const updatedUser = await KYCService.livenessCheck(formData as any);
            
            // Update user in auth store with new verification status
            setUser(updatedUser);
            
            toast.success("Liveness check successful!");
            onSuccess?.();
        } catch (error: any) {
            console.error("Liveness check failed:", error);
            const errorMessage = error?.response?.data?.message || "Verification failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#012638] overflow-hidden">
                {/* Animated circles and rectangles */}
                <div className="hidden sm:block animate-float-1 z-60 bottom-[-24%] right-[36px] absolute w-[500px] h-[500px] opacity-25 rounded-full bg-gradient-to-r from-[#9ECAE0] to-[#566E7A00]" />
                <div className="hidden sm:block animate-float-1 z-60 top-[50%] left-[50%] translate-x-[-130%] translate-y-[-50%] opacity-25 absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#566E7A00] to-[#9ECAE0]" />
                {/* blured stuff */}
                <div className="hidden sm:block animate-float-3 z-60 blur-2xl top-[50%] left-[50%] translate-x-[-70%] translate-y-[-50%] opacity-25 absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r bg-black" />
                <div className="hidden sm:block animate-float-4 z-60 blur-2xl top-[50%] left-[50%] translate-x-[-10%] translate-y-[-50%] opacity-25 absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r bg-black" />
                {/* rectangles */}
                <div className="hidden sm:block animate-float-6 z-60 bottom-[0%] left-[0%] absolute w-[500px] h-[200px] opacity-25 bg-gradient-to-r from-[#036B9E] to-[#012638]" />
                <div className="hidden sm:block animate-float-6 z-60 top-[0%] right-[0%] absolute w-[500px] h-[200px] opacity-25 bg-gradient-to-r from-[#036B9E] to-[#012638]" />
                <div className="absolute inset-0 z-65" />
                
                {/* Modal Content */}
                <div className="z-70 fixed inset-0 overflow-y-auto overflow-x-hidden py-5 flex">
                    <div className="z-70 relative bg-[#012638] border border-[#019893]/30 max-w-[580px] rounded-2xl shadow-2xl w-[90%] p-8 m-auto">
                        {/* Close Button */}
                        {onClose && (
                            <button
                                onClick={() => {
                                    stopCamera();
                                    onClose();
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}

                        {/* Header */}
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#019893]/10 flex items-center justify-center">
                                <Camera className="w-8 h-8 text-[#019893]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Liveness Check
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Take a clear selfie to verify your identity
                            </p>
                        </div>

                        {/* Camera/Preview Container */}
                        <div className="mb-6">
                            <div className="relative bg-[#001B2E] border-2 border-[#019893]/30 rounded-2xl overflow-hidden aspect-[4/3]">
                                {!capturedImage ? (
                                    <>
                                        {/* Video Stream */}
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className={`w-full h-full object-cover ${cameraReady ? 'block' : 'hidden'}`}
                                        />
                                        
                                        {/* Camera not ready state */}
                                        {!cameraReady && !isInitializing && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                                                {cameraError ? (
                                                    <>
                                                        <AlertCircle className="w-16 h-16 text-red-400" />
                                                        <p className="text-red-400 text-center text-sm">
                                                            {cameraError}
                                                        </p>
                                                        <button
                                                            onClick={startCamera}
                                                            className="px-6 py-3 bg-[#019893] text-white rounded-xl font-semibold hover:bg-[#017a76] transition-colors flex items-center gap-2"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                            Try Again
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Camera className="w-16 h-16 text-[#019893]" />
                                                        <p className="text-gray-400 text-center text-sm">
                                                            Click below to start camera
                                                        </p>
                                                        <button
                                                            onClick={startCamera}
                                                            className="px-6 py-3 bg-gradient-to-r from-[#019893] to-[#017a76] text-white rounded-xl font-semibold hover:from-[#017a76] hover:to-[#015d5c] transition-all flex items-center gap-2 shadow-lg"
                                                        >
                                                            <Camera className="w-4 h-4" />
                                                            Start Camera
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Initializing state */}
                                        {isInitializing && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#001B2E]/90">
                                                <Loader2 className="w-12 h-12 text-[#019893] animate-spin" />
                                                <p className="text-gray-400 text-sm">Initializing camera...</p>
                                            </div>
                                        )}
                                        
                                        {/* Face guide overlay */}
                                        {cameraReady && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-64 h-80 border-4 border-[#019893] rounded-full opacity-50"></div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* Captured Image Preview */}
                                        <img
                                            src={capturedImage}
                                            alt="Captured selfie"
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        {/* Success badge */}
                                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
                                            <Check className="w-3 h-3" />
                                            Captured
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {/* Hidden canvas for capture */}
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        {/* Instructions */}
                        <div className="bg-[#019893]/10 border border-[#019893]/30 rounded-xl p-4 mb-6">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-[#019893] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div className="text-xs text-gray-300 space-y-1">
                                    <p className="font-semibold text-[#019893]">Tips for a clear photo:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-gray-400">
                                        <li>Face the camera directly</li>
                                        <li>Ensure good lighting</li>
                                        <li>Remove glasses if possible</li>
                                        <li>Keep a neutral expression</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {!capturedImage ? (
                                <button
                                    onClick={capturePhoto}
                                    disabled={!cameraReady}
                                    className="w-full bg-gradient-to-r from-[#019893] to-[#017a76] text-white font-bold py-4 rounded-xl hover:from-[#017a76] hover:to-[#015d5c] focus:outline-none focus:ring-4 focus:ring-[#019893]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[#019893]/20 hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Camera className="w-5 h-5" />
                                    Capture Photo
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-[#019893] to-[#017a76] text-white font-bold py-4 rounded-xl hover:from-[#017a76] hover:to-[#015d5c] focus:outline-none focus:ring-4 focus:ring-[#019893]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[#019893]/20 hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Submit Photo
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={retakePhoto}
                                        disabled={isSubmitting}
                                        className="w-full border-2 border-[#019893]/30 text-[#019893] font-semibold py-3 rounded-xl hover:bg-[#019893]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Retake Photo
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Security Note */}
                        <p className="text-center text-xs text-gray-500 mt-6">
                            🔒 Your photo is encrypted and secure
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}