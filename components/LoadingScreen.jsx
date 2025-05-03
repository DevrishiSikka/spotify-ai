"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Lottie component with SSR disabled
const Lottie = dynamic(() => import('react-lottie').then(mod => mod.default), {
  ssr: false,
});

export default function LoadingScreen() {
  const [animation, setAnimation] = useState(null);
  const [isStopped, setIsStopped] = useState(false); // Initialize to false

  useEffect(() => {
    // Load the animation JSON
    import('@/public/animations/loader.json')
      .then((module) => setAnimation(module.default))
      .catch((err) => console.error('Failed to load animation:', err));
    
    // No timer to stop the animation
  }, []);

  const defaultOptions = {
    loop: true, // Keep looping
    autoplay: true, // Always autoplay when mounted
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-black text-white">
      <div className="flex flex-col items-center">
        {animation && (
          <Lottie 
            options={defaultOptions}
            height={192}
            width={192}
            isStopped={isStopped}
          />
        )}
      </div>
    </div>
  );
}
