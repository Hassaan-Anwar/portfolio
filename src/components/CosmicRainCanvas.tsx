'use client';

import { useEffect, useRef } from 'react';

export default function CosmicRainCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // --- Rain Particles ---
        const rainCount = Math.floor((width * height) / 10000);
        const rain: { x: number, y: number, length: number, speed: number, alpha: number }[] = [];
        for (let i = 0; i < rainCount; i++) {
            rain.push({
                x: Math.random() * width,
                y: Math.random() * height,
                length: Math.random() * 8 + 4,
                speed: Math.random() * 2 + 1,
                alpha: Math.random() * 0.3 + 0.1
            });
        }

        // --- Meteors ---
        const meteors: { x: number, y: number, length: number, speed: number, alpha: number, active: boolean, size: number }[] = [];
        for (let i = 0; i < 3; i++) {
            meteors.push({ x: 0, y: 0, length: 0, speed: 0, alpha: 0, active: false, size: Math.random() * 1.5 + 0.5 });
        }

        let animationFrameId: number;

        const draw = () => {
            // Draw background (Cozy deep space indigo/midnight blue)
            const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
            bgGradient.addColorStop(0, '#0a0514'); // Very deep night
            bgGradient.addColorStop(0.5, '#120b24'); // Midnight indigo
            bgGradient.addColorStop(1, '#0b0818');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // Draw Rain (Slow falling)
            for (let i = 0; i < rain.length; i++) {
                const r = rain[i];
                ctx.beginPath();
                ctx.moveTo(r.x, r.y);
                ctx.lineTo(r.x, r.y + r.length);
                ctx.strokeStyle = `rgba(160, 180, 255, ${r.alpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                r.y += r.speed;
                if (r.y > height) {
                    r.y = -r.length;
                    r.x = Math.random() * width;
                }
            }

            // Draw Meteors
            for (let i = 0; i < meteors.length; i++) {
                const m = meteors[i];
                if (m.active) {
                    ctx.beginPath();
                    ctx.moveTo(m.x, m.y);
                    // Diagonal trajectory
                    const endX = m.x - m.length;
                    const endY = m.y - m.length;
                    ctx.lineTo(endX, endY);

                    // Meteor gradient
                    const grad = ctx.createLinearGradient(m.x, m.y, endX, endY);
                    grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
                    grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

                    ctx.strokeStyle = grad;
                    ctx.lineWidth = m.size;
                    ctx.stroke();

                    // Movement
                    m.x -= m.speed;
                    m.y += m.speed; // diagonal fall
                    m.alpha -= 0.005; // fade out slowly

                    if (m.alpha <= 0 || m.x < 0 || m.y > height) {
                        m.active = false;
                    }
                } else {
                    // Randomly spawn meteor
                    if (Math.random() < 0.002) {
                        m.active = true;
                        m.x = Math.random() * width * 1.5;
                        m.y = -50;
                        m.length = Math.random() * 150 + 50;
                        m.speed = Math.random() * 6 + 4;
                        m.alpha = Math.random() * 0.5 + 0.3;
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        // Handle Resize
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
}
