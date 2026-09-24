'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { AUDIO_MAP } from '@/hooks/useAudioEngine';

interface PreloaderProps {
    onComplete: () => void;
}

function getStatusMessage(percent: number) {
    if (percent === 100) return 'NEEDLE DROPPED. ENTERING..';
    if (percent >= 80) return 'WARMING UP TURNTABLE...';
    if (percent >= 60) return 'FEEDING THE CATS...';
    if (percent >= 40) return 'WIPING DUST OF THE VYNLS...';
    if (percent >= 20) return 'UNBOXING THE RECORD PLAYER...';
    return 'INITIALIZING AUDIO ENGINE...';
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [loadingPercentage, setLoadingPercentage] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [minTimePassed, setMinTimePassed] = useState(false);

    // Enforce 5-second minimum breathing room
    useEffect(() => {
        const t = setTimeout(() => setMinTimePassed(true), 5000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const audioPaths = Object.values(AUDIO_MAP);
        let loaded = 0;

        const uniquePaths = Array.from(new Set(audioPaths));
        const uniqueTotal = uniquePaths.length;

        if (uniqueTotal === 0) {
            setLoadingPercentage(100);
            setIsComplete(true);
            return;
        }

        const howls: Howl[] = [];

        uniquePaths.forEach((path) => {
            const h = new Howl({
                src: [path],
                html5: false, // Force Web Audio API decoding
                preload: true,
                onload: () => {
                    loaded++;
                    const percent = Math.floor((loaded / uniqueTotal) * 100);
                    setLoadingPercentage(percent);

                    if (loaded >= uniqueTotal) {
                        setTimeout(() => setIsComplete(true), 100);
                    }
                },
                onloaderror: () => {
                    loaded++;
                    const percent = Math.floor((loaded / uniqueTotal) * 100);
                    setLoadingPercentage(percent);

                    if (loaded >= uniqueTotal) {
                        setTimeout(() => setIsComplete(true), 100);
                    }
                }
            });
            howls.push(h);
        });

        return () => {
            // Deliberately keep in RAM
        };
    }, []);

    useEffect(() => {
        // Wait for BOTH the audio to hit 100% AND the 5-second enforced delay to pass
        if (isComplete && minTimePassed) {
            const timer = setTimeout(() => {
                onComplete();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isComplete, minTimePassed, onComplete]);

    // Fast rotation mapping (from 20s per spin down to 1.8s per spin at 100%)
    const spinDuration = 20 - (loadingPercentage / 100) * 18.2;

    return (
        <AnimatePresence>
            {(!isComplete || !minTimePassed) && (
                <motion.div
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] bg-[#0B0C10] flex flex-col items-center justify-center font-mono"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    {/* SVG Noise Filter Overlay */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
                        <svg className="w-full h-full">
                            <filter id="noiseFilter">
                                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                            </filter>
                            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                        </svg>
                    </div>

                    <div className="z-10 flex flex-col items-center max-w-sm w-full px-6">
                        {/* Spinning SVG Vinyl Record */}
                        <div className="mb-12 relative w-32 h-32 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: spinDuration, ease: 'linear' }}
                                className="w-full h-full relative shadow-2xl rounded-full"
                                style={{ boxShadow: '0 0 40px rgba(0,0,0,1)' }}
                            >
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                                    {/* Black Vinyl Base */}
                                    <circle cx="50" cy="50" r="48" fill="#111" stroke="#222" strokeWidth="1" />
                                    {/* Outer Grooves */}
                                    <circle cx="50" cy="50" r="42" stroke="#252525" strokeWidth="0.5" />
                                    <circle cx="50" cy="50" r="38" stroke="#1f1f1f" strokeWidth="0.5" />
                                    <circle cx="50" cy="50" r="34" stroke="#2a2a2a" strokeWidth="0.5" />
                                    <circle cx="50" cy="50" r="28" stroke="#1f1f1f" strokeWidth="0.5" />
                                    <circle cx="50" cy="50" r="22" stroke="#333" strokeWidth="0.8" />

                                    {/* Reflection Sheen */}
                                    <path d="M50 2 A 48 48 0 0 1 98 50" stroke="rgba(255,255,255,0.08)" strokeWidth="4" strokeLinecap="round" />
                                    <path d="M50 98 A 48 48 0 0 1 2 50" stroke="rgba(255,255,255,0.04)" strokeWidth="2" strokeLinecap="round" />

                                    {/* Vivid Orange Inner Label */}
                                    <circle cx="50" cy="50" r="16" fill="#f59e0b" stroke="#000" strokeWidth="1" />

                                    {/* Label Artwork Detail */}
                                    <path d="M50 34 A 16 16 0 0 1 66 50" stroke="#b45309" strokeWidth="4" />

                                    {/* Center Spindle Hole */}
                                    <circle cx="50" cy="50" r="3" fill="#000" />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-6 shadow-inner relative">
                            <motion.div
                                className="h-full rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${loadingPercentage}%` }}
                                transition={{ ease: 'easeOut', duration: 0.3 }}
                            />
                        </div>

                        {/* Boot Sequence Text */}
                        <div className="h-6 flex items-center justify-center text-center">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={getStatusMessage(loadingPercentage)}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xs text-amber-500/80 tracking-[0.2em] uppercase font-bold"
                                >
                                    {getStatusMessage(loadingPercentage)}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
