"use client";

import { useState } from "react";
import { ImageLoadingReveal } from "@/components/ui/image-loading-reveal";
import { Button } from "@/components/ui/button";

export function ImageLoadingDemo() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const resetDemo = () => {
    setImageLoaded(false);
    setImageKey(prev => prev + 1);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="p-8 bg-gray-950 min-h-screen flex flex-col items-center justify-center gap-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Progressive Image Reveal Demo
        </h1>
        <p className="text-white/60">
          Watch how the image reveals progressively from top to bottom once loaded
        </p>
      </div>

      <div className="max-w-md">
        <ImageLoadingReveal 
          isLoading={!imageLoaded}
          className="relative rounded-xl border border-gray-700 overflow-hidden"
          duration={2000}
        >
          <img
            key={imageKey}
            src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=600&fit=crop"
            alt="Demo"
            className="w-full h-[400px] object-cover"
            onLoad={handleImageLoad}
          />
        </ImageLoadingReveal>
      </div>

      <div className="text-center space-y-4">
        <p className="text-white/60">
          Status: {imageLoaded ? "Image Loaded ✅" : "Loading... ⏳"}
        </p>
        
        <Button
          onClick={resetDemo}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Reset Demo
        </Button>
      </div>
    </div>
  );
}