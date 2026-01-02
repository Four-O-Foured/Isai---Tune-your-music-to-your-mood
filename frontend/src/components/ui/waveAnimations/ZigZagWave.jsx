import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ZigzagWave = ({ width = 120, height = 20, color = '#8b5cf6' }) => {
    const canvasRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const drawWave = () => {
            const centerY = height / 2;

            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.lineJoin = 'round';

            const segmentWidth = 10; // Smaller segments

            for (let x = 0; x < width; x += segmentWidth) {
                // Scaled amplitude
                const amplitude = (height * 0.3) + Math.sin(x * 0.05 + timeRef.current) * (height * 0.15);
                const direction = Math.sin(x * 0.1 + timeRef.current * 3) > 0 ? 1 : -1;
                const y = centerY + direction * amplitude;

                if (x === 0) {
                    ctx.moveTo(x, centerY);
                }
                ctx.lineTo(x, y);
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

export default ZigzagWave;
