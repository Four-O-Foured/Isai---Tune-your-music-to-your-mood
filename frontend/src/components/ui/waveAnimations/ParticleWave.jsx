import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ParticleWave = ({ width = 120, height = 20, color = '#8b5cf6' }) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Initialize particles - fewer for small size
        if (particlesRef.current.length === 0) {
            for (let i = 0; i < 20; i++) {
                particlesRef.current.push({
                    x: Math.random() * width,
                    y: height / 2,
                    baseY: height / 2,
                    offset: Math.random() * Math.PI * 2,
                    speed: 0.05 + Math.random() * 0.05,
                    size: 1 + Math.random() * 2
                });
            }
        }

        const drawWave = () => {
            ctx.clearRect(0, 0, width, height);

            particlesRef.current.forEach(particle => {
                // Wave motion - scaled down amplitude
                particle.y = particle.baseY +
                    Math.sin(particle.offset) * (height * 0.3) +
                    Math.sin(particle.offset * 2) * (height * 0.1);

                particle.offset += particle.speed;
                particle.x += 1;

                // Wrap around
                if (particle.x > width) {
                    particle.x = 0;
                }

                // Draw particle
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const ticker = gsap.ticker.add(drawWave);
        return () => gsap.ticker.remove(ticker);
    }, [width, height, color]);

    return <canvas ref={canvasRef} width={width} height={height} className="block" style={{ width, height }} />;
};

export default ParticleWave;
