import { useEffect, useRef } from 'react';

export default function AudioWaveform() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions with device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Animation parameters
    const barCount = 120; // Number of bars
    const barWidth = 6; // Increased bar width for better visibility
    const barGap = 2; // Gap between bars
    const barMinHeight = 5;
    const barMaxHeight = 72;
    const totalWidth = (barWidth + barGap) * barCount - barGap;

    // Ensure all bars fit within the canvas
    const startX = Math.max((rect.width * dpr - totalWidth) / 2, 0);

    // Initial bar heights - center bars taller, edges shorter
    const bars = Array.from({ length: barCount }).map((_, i) => {
      const distanceFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
      return {
        height: barMaxHeight - distanceFromCenter * (barMaxHeight - barMinHeight) * 0.6,
        velocity: 0,
        targetHeight: 0,
        phase: Math.random() * Math.PI * 2, // Random starting phase
      };
    });

    // Animation settings
    const amplitude = 0.4; // Wave amplitude
    const frequency = 1.5; // Wave frequency
    const damping = 0.1; // How quickly bars reach target height
    const noiseStrength = 0.3; // Randomness factor

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw each bar
      for (let i = 0; i < barCount; i++) {
        const bar = bars[i];

        // Update target height with sine wave + noise
        const time = performance.now() / 1000;
        const distanceFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);

        // Base height from sine wave
        const baseHeight = Math.sin(time * frequency + bar.phase) * amplitude;

        // Add noise with center emphasis
        const noise = (Math.random() - 0.5) * noiseStrength * (1 - distanceFromCenter * 0.5);

        // Calculate target height
        const heightFactor = 1 - distanceFromCenter * 0.8;
        bar.targetHeight =
          barMinHeight +
          (barMaxHeight - barMinHeight) * (0.4 + (baseHeight + noise) * heightFactor);

        // Smoothly interpolate current height toward target height
        bar.height += (bar.targetHeight - bar.height) * damping;

        // Draw the bar
        const x = startX + i * (barWidth + barGap);
        const y = (canvas.height / dpr - bar.height) / 2;

        ctx.fillStyle = '#1ed760'; // Spotify green
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, bar.height, 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Clean up animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-16 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}


