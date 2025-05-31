"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 10) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        {/* Anime girl profile picture */}
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img
            src="https://images.pexels.com/photos/7130465/pexels-photo-7130465.jpeg"
            alt="Loading"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Phone ring animation */}
        <div 
          className="absolute inset-0 border-4 border-chart-1 rounded-full"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            animation: "pulse 2s infinite"
          }}
        />
        <div 
          className="absolute inset-0 border-4 border-chart-2 rounded-full opacity-50"
          style={{ 
            transform: `rotate(${-rotation}deg)`,
            animation: "pulse 2s infinite 1s"
          }}
        />
        
        {/* Loading text */}
        <div className="text-center mt-6">
          <p className="text-lg font-medium text-foreground">Calculating Score</p>
          <p className="text-sm text-muted-foreground">Please wait a moment...</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1) rotate(${rotation}deg); }
          50% { transform: scale(1.1) rotate(${rotation}deg); }
          100% { transform: scale(1) rotate(${rotation}deg); }
        }
      `}</style>
    </div>
  );
}