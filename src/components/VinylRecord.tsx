'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Multi-stop radial gradient that simulates vinyl grooves (lands & grooves alternating)
const DISC_BG = `radial-gradient(circle,
  #222 0% 25%,
  #0c0c0c 25% 27%, #1c1c1c 27% 31%,
  #0c0c0c 31% 33%, #1c1c1c 33% 38%,
  #0c0c0c 38% 40%, #1c1c1c 40% 45%,
  #0c0c0c 45% 47%, #1c1c1c 47% 53%,
  #0c0c0c 53% 55%, #1c1c1c 55% 61%,
  #0c0c0c 61% 63%, #1c1c1c 63% 70%,
  #0c0c0c 70% 72%, #1c1c1c 72% 80%,
  #0c0c0c 80% 82%, #1c1c1c 82% 91%,
  #0c0c0c 91% 93%, #1a1a1a 93% 100%
)`;

interface Props {
    color: string;
    accentGlow: string;
    emoji: string;
    label: string;
    title: string;
    isActive: boolean;
    isPlaying: boolean;
}

export default function VinylRecord({
    color, accentGlow, emoji, label, title, isActive, isPlaying,
}: Props) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    // Dimensions
    const SLEEVE = 96;       // The album cover dimension (square)
    const DISC = 92;         // Disc is slightly smaller so it perfectly hides behind the sleeve

    // Sift interactions limit the slide-out visually to indicate interactivity
    const HOVER_SLIDE = 16;

    // Calculate dynamic state
    const currentSlide = (isHovered || isActive) && !isPressed ? HOVER_SLIDE : 0;

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => { setIsHovered(false); setIsPressed(false); }}
            onTapStart={() => setIsPressed(true)}
            onTap={() => setIsPressed(false)}
            onTapCancel={() => setIsPressed(false)}
            className="relative focus:outline-none flex flex-col items-start"
            initial={{ width: SLEEVE }}
            animate={{
                width: SLEEVE + currentSlide,
                scale: isHovered || isPressed ? 1.08 : (isActive ? 1.04 : 1),
                y: isPressed ? -12 : (isHovered ? -8 : (isActive ? -4 : 0)),
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            aria-label={`Select: ${title}`}
            style={{
                height: SLEEVE,
            }}
        >
            {/* ── VINYL DISC (Layer 1 - Bottom) ── */}
            <motion.div
                className="rounded-full"
                style={{
                    position: 'absolute',
                    width: DISC,
                    height: DISC,
                    top: (SLEEVE - DISC) / 2,
                    background: DISC_BG,
                    zIndex: 1,
                    boxShadow: isActive
                        ? `0 0 0 2px ${color}, 0 0 20px ${accentGlow}`
                        : `0 4px 12px rgba(0,0,0,0.5)`,
                }}
                initial={false}
                animate={{
                    left: currentSlide > 0 ? currentSlide : (SLEEVE - DISC) / 2,
                    rotate: (isActive && isPlaying) ? 360 : 0
                }}
                transition={{
                    left: { type: 'spring', stiffness: 350, damping: 25 },
                    rotate: (isActive && isPlaying)
                        ? { repeat: Infinity, duration: 2.8, ease: 'linear' }
                        : { duration: 0.6, ease: 'easeOut' }
                }}
            >
                {/* Shine overlay */}
                <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                        background: 'conic-gradient(from 45deg, transparent 0%, rgba(255,255,255,0.06) 10%, transparent 20%, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%, transparent 90%, rgba(255,255,255,0.06) 100%)',
                    }}
                />

                {/* Center label */}
                <div
                    className="absolute rounded-full flex flex-col items-center justify-center"
                    style={{
                        width: DISC * 0.32,
                        height: DISC * 0.32,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: isActive ? color : '#1e1e1e',
                        boxShadow: isActive ? `0 0 12px ${accentGlow}` : 'none',
                        transition: 'background 0.4s, box-shadow 0.4s',
                        zIndex: 2
                    }}
                >
                    <span style={{ fontSize: DISC * 0.12 }}>{emoji}</span>
                </div>

                {/* Spindle Hole */}
                <div
                    style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#111',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 3,
                    }}
                />
            </motion.div>

            {/* ── SLEEVE (Layer 2 - Top) ── */}
            <motion.div
                className="absolute overflow-hidden flex items-center justify-center"
                animate={{ opacity: isPressed ? 0 : 1 }}
                transition={{ duration: 0.15 }}
                style={{
                    width: SLEEVE,
                    height: SLEEVE,
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${color}33 0%, #1B1229 60%, #0d0a14 100%)`,
                    border: `1.5px solid ${isActive ? color : color + '44'}`,
                    boxShadow: isActive
                        ? `0 8px 24px rgba(0,0,0,0.8), 0 0 16px ${accentGlow}`
                        : `0 8px 16px rgba(0,0,0,0.6)`,
                    transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
                }}
            >
                {/* Big emoji on sleeve */}
                <span style={{ fontSize: 32, opacity: isActive ? 1 : 0.85, transition: 'opacity 0.3s' }}>{emoji}</span>

                {/* Subtle label text */}
                <div
                    className="absolute bottom-1.5 left-0 right-0 text-center font-pixel"
                    style={{ fontSize: '4px', color: color, letterSpacing: 1, opacity: 0.9 }}
                >
                    {label}
                </div>

                {/* Sleeve Gloss Overlay */}
                <div
                    style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'linear-gradient(105deg, rgba(255,255,255,0.08) 0%, transparent 40%)'
                    }}
                />
            </motion.div>
        </motion.div>
    );
}
