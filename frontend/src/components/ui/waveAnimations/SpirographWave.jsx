import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SpirographWave = ({ width = 120, height = 20, color = '#8b5cf6' }) => {
    const canvasRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const drawWave = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';

            ctx.beginPath();

            for (let x = 0; x < width; x += 1) {
                const angle = x * 0.1 + timeRef.current; // Tighter frequency
                const y = height / 2 +
                    Math.sin(angle) * (height * 0.25) * Math.cos(angle * 2) +
                    Math.cos(angle * 1.5) * (height * 0.15);

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
        };

        const ticker = gsap.ticker.add(() => {
            timeRef.current += 0.1;
            drawWave();
        });

        return () => gsap.ticker.remove(ticker);
    }, [width, height, color]);

    return <canvas ref={canvasRef} width={width} height={height} className="block" style={{ width, height }} />;
};

export default SpirographWave;
