import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const RippleWave = ({ width = 120, height = 20, color = '#8b5cf6' }) => {
    const canvasRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set actual canvas size to match display size for sharpness or just logical size
        // For simplicity in this small view, we'll rely on the props matching the canvas attributes

        const drawWave = () => {
            // Clear for transparency
            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;

            // Multiple expanding circles - adjusted for small height
            for (let i = 0; i < 3; i++) {
                // Smaller radius cycle for small component
                const maxRadius = height;
                const radius = ((timeRef.current + i * (maxRadius / 3)) % maxRadius);
                const opacity = 1 - (radius / maxRadius);

                ctx.globalAlpha = opacity;
                ctx.beginPath();
                // Draw ellipses instead of circles for rectangular view
                ctx.ellipse(centerX, centerY, radius * 3, radius, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
        };

        const ticker = gsap.ticker.add(() => {
            timeRef.current += 0.5;
            drawWave();
        });

        return () => gsap.ticker.remove(ticker);
    }, [width, height, color]);

    return <canvas ref={canvasRef} width={width} height={height} className="block" style={{ width, height }} />;
};

export default RippleWave;
