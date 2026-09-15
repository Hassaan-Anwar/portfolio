'use client';

import { useEffect, useRef } from 'react';
import { useMusicStore } from '@/store/musicStore';
import { PROJECTS } from '@/data/projects';
import { EXPERIENCES } from '@/data/experience';

export default function WaveformCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isPlaying, activeSection, currentProjectIndex, currentExperienceIndex } = useMusicStore();
    const animFrameRef = useRef<number | null>(null);
    const phaseRef = useRef(0);

    const color =
        activeSection === 'projects'
            ? (PROJECTS[currentProjectIndex]?.color ?? '#D97706')
            : activeSection === 'experience'
                ? (EXPERIENCES[currentExperienceIndex]?.color ?? '#FBBF24')
                : activeSection === 'about'
                    ? '#D97706'
                    : '#FBBF24';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const w = canvas.width;
            const h = canvas.height;
            const bars = 32;
            const barW = Math.floor(w / bars) - 1;

            for (let i = 0; i < bars; i++) {
                const freq = isPlaying
                    ? Math.abs(Math.sin(phaseRef.current + i * 0.4)) * 0.7 +
                    Math.abs(Math.sin(phaseRef.current * 1.3 + i * 0.7)) * 0.3
                    : 0.05 + Math.abs(Math.sin(i * 0.5)) * 0.05;

                const barH = Math.max(2, freq * h);
                const x = i * (barW + 1);
                const y = (h - barH) / 2;

                const grad = ctx.createLinearGradient(x, y, x, y + barH);
                grad.addColorStop(0, color + 'ff');
                grad.addColorStop(1, color + '44');
                ctx.fillStyle = grad;
                ctx.fillRect(x, y, barW, barH);
            }

            if (isPlaying) phaseRef.current += 0.09;
            animFrameRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isPlaying, color]);

    return (
        <canvas
            ref={canvasRef}
            width={160}
            height={32}
            className="opacity-90"
        />
    );
}
