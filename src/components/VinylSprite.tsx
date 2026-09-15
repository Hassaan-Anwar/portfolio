'use client';

import { motion } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { PROJECTS } from '@/data/projects';

interface VinylProps {
    index: number;
}

export default function VinylSprite({ index }: VinylProps) {
    const { currentProjectIndex, setCurrentProject, isPlaying } = useMusicStore();
    const project = PROJECTS[index];
    const isActive = index === currentProjectIndex;
    const isActivePlaying = isActive && isPlaying;

    return (
        <motion.button
            onClick={() => setCurrentProject(index)}
            className="relative focus:outline-none group"
            style={{ width: 64, height: 64 }}
            aria-label={`Select project: ${project.title}`}
            whileHover={{ scale: 1.18, y: -6 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
            {/* Outer ring */}
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                    background: isActive
                        ? `radial-gradient(circle at 30% 30%, #555, #111)`
                        : `radial-gradient(circle at 30% 30%, #3a3a3a, #0d0d0d)`,
                    boxShadow: isActive
                        ? `0 0 16px 4px ${project.accentGlow}, 0 4px 16px rgba(0,0,0,0.6)`
                        : `0 4px 8px rgba(0,0,0,0.5)`,
                    border: `2px solid ${isActive ? project.color : '#333'}`,
                }}
                animate={isActivePlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={
                    isActivePlaying
                        ? { repeat: Infinity, duration: 3, ease: 'linear' }
                        : { duration: 0.3 }
                }
            >
                {/* Groove rings */}
                {[20, 24, 28, 32, 36].map((size) => (
                    <div
                        key={size}
                        className="absolute rounded-full border border-white/5"
                        style={{
                            width: size,
                            height: size,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                ))}

                {/* Center label */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: 'none' }}
                >
                    <div
                        className="rounded-full flex flex-col items-center justify-center"
                        style={{
                            width: 22,
                            height: 22,
                            background: isActive ? project.color : '#222',
                            boxShadow: isActive ? `0 0 6px ${project.color}` : 'none',
                        }}
                    >
                        <span style={{ fontSize: 8, lineHeight: 1 }}>{project.vinylEmoji}</span>
                    </div>
                </div>
            </motion.div>

            {/* Tooltip label */}
            <div
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
                   transition-opacity duration-200 font-pixel text-center whitespace-nowrap pointer-events-none"
                style={{ fontSize: 5, color: project.color, letterSpacing: 1 }}
            >
                {project.vinylLabel}
            </div>
        </motion.button>
    );
}
