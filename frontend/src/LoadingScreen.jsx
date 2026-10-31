import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onLoadingComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    if (onLoadingComplete) onLoadingComplete();
                    return 100;
                }
                return prev + 5;
            });
        }, 60);

        return () => clearInterval(interval);
    }, [onLoadingComplete]);

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center font-sans select-none">

            {/* Roblox Square Logo Graphic */}
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center text-white font-black text-4xl tracking-tighter mb-8 shadow-lg">
                R
            </div>

            {/* Loading Status Text */}
            <h1 className="text-zinc-900 font-bold text-lg tracking-tight mb-6">
                ROLBOX loading group portfolio...
            </h1>

            {/* Clean Minimalist Progress Bar */}
            <div className="w-72 h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                <div
                    className="h-full bg-black transition-all duration-75 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Percentage Indicator */}
            <span className="text-xs font-mono text-zinc-400 mt-3">
                {progress}%
            </span>

        </div>
    );
}