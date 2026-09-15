'use client';

import { motion } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { PROJECTS } from '@/data/projects';

export default function Turntable() {
    const { currentProjectIndex, isPlaying } = useMusicStore();
    const project = PROJECTS[currentProjectIndex];

    return (
        <div className="relative flex flex-col items-center" style={{ width: 200 }}>
            {/* Turntable base */}
            <div
                className="relative rounded-lg flex items-center justify-center"
                style={{
                    width: 180,
                    height: 180,
                    background: 'linear-gradient(145deg, #1a1528 0%, #0f0c1a 100%)',
                    border: '2px solid #302C44',
                    boxShadow: `0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
            >
                {/* Platter */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: 150,
                        height: 150,
                        background: 'linear-gradient(145deg, #252030, #151020)',
                        border: '1px solid #3a3050',
                    }}
                />

                {/* Spinning vinyl */}
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        width: 140,
                        height: 140,
                        background: `radial-gradient(circle at 30% 30%, #3a3a3a, #0d0d0d)`,
                        border: `3px solid ${project.color}`,
                        boxShadow: `0 0 20px ${project.accentGlow}`,
                    }}
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={
                        isPlaying
                            ? { repeat: Infinity, duration: 2.5, ease: 'linear' }
                            : { duration: 0.5, ease: 'easeOut' }
                    }
                >
                    {/* Grooves */}
                    {[35, 45, 55, 65, 70].map((r) => (
                        <div
                            key={r}
                            className="absolute rounded-full border border-white/[0.04]"
                            style={{
                                width: r * 2,
                                height: r * 2,
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    ))}

                    {/* Center label */}
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                        <div
                            className="rounded-full flex flex-col items-center justify-center gap-0.5"
                            style={{
                                width: 44,
                                height: 44,
                                background: project.color,
                                boxShadow: `0 0 16px ${project.accentGlow}`,
                            }}
                        >
                            <span style={{ fontSize: 16 }}>{project.vinylEmoji}</span>
                            <span
                                className="font-pixel"
                                style={{ fontSize: 4, color: '#0d0a14', letterSpacing: 1 }}
                            >
                                {project.vinylLabel}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Tonearm */}
                <motion.div
                    className="absolute"
                    style={{
                        width: 2,
                        height: 70,
                        background: 'linear-gradient(to bottom, #CBB368, #8a7a40)',
                        borderRadius: 1,
                        transformOrigin: 'top center',
                        top: 10,
                        right: 14,
                        boxShadow: '0 0 6px rgba(203,179,104,0.5)',
                    }}
                    animate={isPlaying ? { rotate: 22 } : { rotate: -5 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />

                {/* Tonearm pivot */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: 10,
                        height: 10,
                        background: '#CBB368',
                        top: 6,
                        right: 10,
                        boxShadow: '0 0 8px rgba(203,179,104,0.8)',
                    }}
                />
            </div>

            {/* Turntable label */}
            <p
                className="font-pixel mt-2 text-center"
                style={{ fontSize: 5, color: project.color, letterSpacing: 2, opacity: 0.8 }}
            >
                NOW PLAYING
            </p>

            {/* Project title under turntable */}
            <p
                className="mt-1 text-center font-pixel truncate"
                style={{
                    fontSize: 7,
                    color: '#F4F1EA',
                    maxWidth: 180,
                    textShadow: `0 0 10px ${project.color}88`,
                }}
            >
                {project.title}
            </p>
        </div>
    );
}
