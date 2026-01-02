import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const FrequencyBars = ({ width = 120, height = 20, color = '#8b5cf6' }) => {
    const canvasRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const bars = 20; // Fewer bars for small width
        const barWidth = width / bars;

        const drawWave = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = color;

            for (let i = 0; i < bars; i++) {
                const barHeight =
                    Math.abs(Math.sin(i * 0.3 + timeRef.current)) * (height * 0.8) +
                    Math.abs(Math.sin(i * 0.5 + timeRef.current * 2)) * (height * 0.4) +
                    2;

                const clamppedHeight = Math.min(barHeight, height);

                const x = i * barWidth;
                const y = (height - clamppedHeight) / 2;

                ctx.fillRect(x + 1, y, barWidth - 2, clamppedHeight);
            }
        };

        const ticker = gsap.ticker.add(() => {
            timeRef.current += 0.15;
            drawWave();
        });

        return () => gsap.ticker.remove(ticker);
    }, [width, height, color]);

    return <canvas ref={canvasRef} width={width} height={height} className="block" style={{ width, height }} />;
};

export default FrequencyBars;
