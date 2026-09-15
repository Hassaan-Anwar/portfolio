'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Link2, Mail, Download, Play } from 'lucide-react';

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

function Star({ x, y, r, d }: { x: number; y: number; r: number; d: number }) {
    return (
        <div
            className="absolute rounded-full"
            style={{
                left: `${x}%`, top: `${y}%`, width: r, height: r,
                background: '#fff',
                animation: `twinkle ${2 + d}s ease-in-out ${d}s infinite`,
                opacity: 0.5,
            }}
        />
    );
}

interface Props {
    visible: boolean;
    onEnter: () => void;
}

const STATS = [
    { value: '3+', label: 'years\nexperience' },
    { value: '10+', label: 'projects\nshipped' },
    { value: '3', label: 'companies\nworked at' },
];

const ACCENT = '#B48EFF';
const GLOW = 'rgba(180, 142, 255, 0.6)';

export default function IntroScreen({ visible, onEnter }: Props) {
    const stars = [
        [5, 8, 2, 0.3], [12, 22, 1.5, 0.9], [22, 6, 2.5, 0.5], [35, 15, 1, 1.2], [48, 4, 2, 0.7],
        [58, 18, 1.5, 0.2], [70, 9, 2, 1.5], [83, 5, 1, 0.8], [91, 20, 2, 0.4], [96, 12, 1.5, 1.1],
        [7, 40, 1, 0.6], [20, 55, 2, 1], [30, 68, 1.5, 0.3], [42, 78, 2, 1.3], [55, 48, 1, 0.7],
        [68, 62, 2.5, 0.5], [78, 38, 1, 1.4], [88, 72, 2, 0.2], [94, 58, 1.5, 0.9],
    ];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="intro"
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                    style={{
                        background: 'radial-gradient(ellipse 80% 70% at 50% 40%, #2d1260 0%, #1B1229 35%, #0d0a14 100%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.06, filter: 'blur(14px)' }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                >
                    {/* Stars */}
                    {stars.map(([x, y, r, d], i) => <Star key={i} x={x} y={y} r={r} d={d} />)}

                    {/* Ambient glow orbs */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div style={{ position: 'absolute', top: '15%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(251,191,36,0.04)', filter: 'blur(60px)' }} />
                        <div style={{ position: 'absolute', bottom: '20%', right: '18%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(180,142,255,0.06)', filter: 'blur(60px)' }} />
                        <div style={{ position: 'absolute', top: '55%', left: '50%', width: 400, height: 300, borderRadius: '50%', background: 'rgba(217,119,6,0.03)', filter: 'blur(80px)', transform: 'translateX(-50%)' }} />
                    </div>

                    {/* Main card */}
                    <motion.div
                        className="relative flex flex-col items-center text-center gap-6 px-8"
                        style={{ maxWidth: 640 }}
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
                    >
                        {/* Spinning vinyl */}
                        <div className="relative">
                            <motion.div
                                className="rounded-full"
                                style={{
                                    width: 180, height: 180,
                                    background: DISC_BG,
                                    border: `3px solid ${ACCENT}`,
                                    boxShadow: `0 0 40px ${GLOW}, 0 0 80px rgba(180,142,255,0.2)`,
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                            >
                                {/* Shine */}
                                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.1) 0%, transparent 55%)' }} />
                                {/* Center label */}
                                <div
                                    className="absolute rounded-full flex flex-col items-center justify-center"
                                    style={{
                                        width: 54, height: 54, top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: ACCENT,
                                        boxShadow: `0 0 20px ${GLOW}`,
                                    }}
                                >
                                    <span style={{ fontSize: 22 }}>🎧</span>
                                </div>
                            </motion.div>

                            {/* Tonearm */}
                            <motion.div
                                style={{
                                    position: 'absolute', width: 3, height: 80,
                                    background: 'linear-gradient(#CBB368, #7a6830)',
                                    borderRadius: 2, transformOrigin: 'top center',
                                    top: -8, right: -12,
                                }}
                                animate={{ rotate: [25, 30, 25] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <div style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: '#CBB368', top: -12, right: -16, boxShadow: '0 0 8px rgba(203,179,104,0.9)' }} />
                        </div>

                        {/* Badge */}
                        <div className="flex items-center gap-2">
                            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${ACCENT})` }} />
                            <span className="font-pixel text-[7px] tracking-[4px]" style={{ color: ACCENT }}>DEVELOPER · CREATOR</span>
                            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${ACCENT})` }} />
                        </div>

                        {/* Name */}
                        <div>
                            <h1 className="font-pixel text-white leading-tight" style={{ fontSize: 36, textShadow: `0 0 32px ${GLOW}` }}>
                                DEV.LAIR
                            </h1>
                            <p className="font-mono mt-2" style={{ fontSize: 14, color: '#9b93ae' }}>
                                Full-Stack Engineer · UI & Systems · Open Source
                            </p>
                        </div>

                        {/* Short bio */}
                        <p className="text-sm leading-relaxed" style={{ color: '#c4bcce', maxWidth: 480 }}>
                            I build fast, polished digital products — from distributed backends to pixel-perfect frontends.
                            3 years shipping production software at startups, labs, and studios.
                        </p>

                        {/* Stats */}
                        <div className="flex gap-8">
                            {STATS.map(({ value, label }) => (
                                <div key={value} className="flex flex-col items-center gap-1">
                                    <span className="font-pixel text-2xl" style={{ color: ACCENT }}>{value}</span>
                                    <span className="font-mono text-[10px] text-center leading-snug" style={{ color: '#634B7D', whiteSpace: 'pre' }}>{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Social links */}
                        <div className="flex items-center gap-3">
                            {[
                                { icon: <GitBranch size={16} />, label: 'GitHub', href: '#' },
                                { icon: <Link2 size={16} />, label: 'LinkedIn', href: '#' },
                                { icon: <Mail size={16} />, label: 'Email', href: 'mailto:you@example.com' },
                            ].map(({ icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all hover:scale-105"
                                    style={{ background: 'rgba(255,255,255,0.06)', color: '#9b93ae', border: '1px solid #302C44' }}
                                >
                                    {icon} {label}
                                </a>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex gap-4">
                            <a
                                href="/cv.pdf"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm transition-all hover:scale-105"
                                style={{ background: 'rgba(255,255,255,0.07)', color: '#F4F1EA', border: '1px solid #4a3a6a' }}
                            >
                                <Download size={14} /> Download CV
                            </a>

                            <motion.button
                                onClick={onEnter}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-pixel tracking-widest text-[9px]"
                                style={{
                                    background: ACCENT,
                                    color: '#0d0a14',
                                    boxShadow: `0 0 24px ${GLOW}`,
                                }}
                                whileHover={{ scale: 1.07, boxShadow: `0 0 36px ${GLOW}` }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Play size={14} fill="#0d0a14" /> DROP THE NEEDLE
                            </motion.button>
                        </div>

                        {/* Scroll hint */}
                        <motion.p
                            className="font-pixel text-[6px] tracking-widest"
                            style={{ color: '#634B7D' }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ↑ PRESS TO ENTER THE LAIR ↑
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
