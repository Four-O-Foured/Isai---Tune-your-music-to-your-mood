import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const WaveformGSAP = ({ width = 60, height = 20, color = '#5D6E97' }) => {
    const canvasRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const drawWave = () => {
            // Clear canvas for transparency
            ctx.clearRect(0, 0, width, height);

            const centerY = height / 2;

            // Draw waveform
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2; // Thinner line for small size
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let x = 0; x < width; x += 1) { // Step 1 for smoother small wave
                // Reduced amplitude for small height
                const y = centerY +
                    Math.sin(x * 0.18 + timeRef.current) * (height * 0.32) +
                    Math.sin(x * 0.1 + timeRef.current * 1.5) * (height * 0.12);

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
        };

        // GSAP ticker for smooth animation
        const ticker = gsap.ticker.add(() => {
            timeRef.current += 0.15; // Faster animation for energy
            drawWave();
        });

        // Initial draw
        drawWave();

        return () => {
            gsap.ticker.remove(ticker);
        };
    }, [width, height, color]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="block"
            style={{ width, height }}
        />
    );
};

export default WaveformGSAP;
