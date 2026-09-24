'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { getActiveInfoItem } from '@/data/info';
import InfoPanel from '@/components/InfoPanel';
import { SkipBack, SkipForward, Play, Pause } from 'lucide-react';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import useIsMobile from '@/hooks/useIsMobile';
import { useRef, useCallback, useEffect } from 'react';

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

// ─── Analogue Volume Dial ─────────────────────────────────────────────────────
// Rotation: −135° = 0 vol … 0° = 0.5 vol … +135° = 1.0 vol
const DIAL_MIN_DEG = -135;
const DIAL_MAX_DEG = 135;

function volToDeg(v: number) {
    return DIAL_MIN_DEG + v * (DIAL_MAX_DEG - DIAL_MIN_DEG);
}
function degToVol(d: number) {
    return (d - DIAL_MIN_DEG) / (DIAL_MAX_DEG - DIAL_MIN_DEG);
}

interface VolumeDial {
    volume: number;
    setVolume: (v: number) => void;
    color: string;
    accentGlow: string;
}

function VolumeDial({ volume, setVolume, color, accentGlow }: VolumeDial) {
    const dialRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const lastY = useRef(0);
    const degRef = useRef(volToDeg(volume));

    // Keep degRef synced when volume changes externally
    useEffect(() => {
        degRef.current = volToDeg(volume);
    }, [volume]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        e.preventDefault();
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        // Optionally calculate initial angle immediately on click
        if (dialRef.current) {
            const rect = dialRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
            if (angle > 180) angle -= 360;

            const clamped = Math.max(DIAL_MIN_DEG, Math.min(DIAL_MAX_DEG, angle));
            degRef.current = clamped;
            setVolume(degToVol(clamped));
        }
    }, [setVolume]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragging.current || !dialRef.current) return;

        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // atan2 gives standard angle; +90 rotates 0 degrees to point straight up
        let angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;

        // map purely into [-180, 180] constraint space
        if (angle > 180) angle -= 360;

        const clampedAngle = Math.max(DIAL_MIN_DEG, Math.min(DIAL_MAX_DEG, angle));
        degRef.current = clampedAngle;
        setVolume(degToVol(clampedAngle));
    }, [setVolume]);

    const onPointerUp = useCallback(() => {
        dragging.current = false;
    }, []);

    const deg = volToDeg(volume);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                userSelect: 'none',
            }}
        >
            {/* Dial ring */}
            <div
                style={{
                    position: 'relative',
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #3a3540, #1a1521)',
                    border: `1px solid #4a4258`,
                    boxShadow: `0 4px 16px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.08), 0 0 12px ${accentGlow}33`,
                    cursor: 'ns-resize',
                }}
                ref={dialRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
            >
                {/* Tick marks */}
                {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((t) => (
                    <div
                        key={t}
                        style={{
                            position: 'absolute',
                            width: '1px',
                            height: t % 60 === 0 ? '5px' : '3px',
                            background: Math.abs(t - DIAL_MIN_DEG - (deg - DIAL_MIN_DEG)) < 20 ? color : 'rgba(255,255,255,0.15)',
                            top: '4px',
                            left: '50%',
                            transformOrigin: `0 ${52 / 2 - 4}px`,
                            transform: `translateX(-50%) rotate(${t}deg)`,
                            borderRadius: '1px',
                            transition: 'background 0.2s',
                        }}
                    />
                ))}

                {/* Knob face */}
                <motion.div
                    animate={{ rotate: deg }}
                    transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                    style={{
                        position: 'absolute',
                        inset: '6px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 35% 30%, #5a5272, #251e35)`,
                        boxShadow: `inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.08)`,
                    }}
                >
                    {/* Indicator line */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '2px',
                            height: '12px',
                            background: color,
                            top: '2px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderRadius: '1px',
                            boxShadow: `0 0 4px ${accentGlow}`,
                        }}
                    />
                </motion.div>
            </div>

            {/* Label */}
            <span
                className="font-pixel"
                style={{ fontSize: '6px', color: '#9b93ae', letterSpacing: '2px' }}
            >
                VOL
            </span>

            {/* Volume % readout */}
            <span
                className="font-pixel"
                style={{ fontSize: '6px', color: color, letterSpacing: '1px', opacity: 0.85 }}
            >
                {Math.round(volume * 100)}%
            </span>
        </div>
    );
}

function PlayerBar({
    title, subtitle, item, color, isPlaying, waveBars, prev, next, togglePlay, overlay,
}: {
    title: string;
    subtitle: string;
    item: { shortTitle: string; coverFont: string };
    color: string;
    isPlaying: boolean;
    waveBars: number;
    prev: () => void;
    next: () => void;
    togglePlay: () => void;
    overlay: boolean;
}) {
    return (
        <div
            className="player-bar bg-black/30 backdrop-blur-md border-t border-white/10"
            style={{
                position: overlay ? 'absolute' : 'relative',
                bottom: overlay ? 0 : undefined,
                left: overlay ? 0 : undefined,
                right: overlay ? 0 : undefined,
                height: '64px',
                padding: overlay ? '0 24px' : '0 12px',
                display: 'grid',
                gridTemplateColumns: overlay ? '1fr auto 1fr' : 'minmax(0, 1fr) auto auto',
                alignItems: 'center',
                zIndex: 10,
                flexShrink: 0,
                gap: overlay ? 0 : '8px',
            }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '6px', flexShrink: 0, background: `linear-gradient(135deg, ${color}66, #1B1229)`, border: `1px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                        <span className={item.coverFont}>{item.shortTitle}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#F4F1EA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
                        <p className="font-mono" style={{ fontSize: '10px', color: '#9b93ae', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', alignItems: 'center', gap: overlay ? '20px' : '12px', justifyContent: 'center' }}>
                <button type="button" onClick={prev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9b93ae', display: 'flex', padding: '4px' }} onMouseEnter={e => (e.currentTarget.style.color = '#F4F1EA')} onMouseLeave={e => (e.currentTarget.style.color = '#9b93ae')}><SkipBack size={18} /></button>

                <button type="button" onClick={togglePlay} style={{ background: color, border: 'none', cursor: 'pointer', color: '#0d0a14', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.15s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>

                <button type="button" onClick={next} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9b93ae', display: 'flex', padding: '4px' }} onMouseEnter={e => (e.currentTarget.style.color = '#F4F1EA')} onMouseLeave={e => (e.currentTarget.style.color = '#9b93ae')}><SkipForward size={18} /></button>
            </div>

            <div style={{ display: overlay ? 'flex' : 'none', alignItems: 'center', gap: '2px', height: '28px', justifyContent: 'flex-end', opacity: isPlaying ? 1 : 0.4 }}>
                {Array.from({ length: waveBars }).map((_, i) => (
                    <div key={i} style={{ width: '3px', background: color, borderRadius: '2px', height: isPlaying ? `${6 + (i % 7) * 3}px` : '3px', transition: 'height 0.4s ease', animation: isPlaying ? `waveBar ${0.55 + (i % 5) * 0.15}s ease-in-out ${i * 0.04}s infinite alternate` : 'none' }} />
                ))}
            </div>
        </div>
    );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function NowPlayingPanel() {
    // Mount the audio engine — it owns all playback side-effects
    useAudioEngine();

    const {
        activeSection,
        currentAboutIndex, currentBestsellersIndex, currentProjectIndex, currentExperienceIndex,
        isPlaying, isDragging, next, prev, togglePlay,
        activeColor, activeGlow,
        volume, setVolume,
    } = useMusicStore();

    const item = getActiveInfoItem(activeSection, {
        about: currentAboutIndex,
        bestsellers: currentBestsellersIndex,
        projects: currentProjectIndex,
        experience: currentExperienceIndex,
    });

    const color = activeColor;
    const accentGlow = activeGlow;
    const DISC = 240;
    const isMobile = useIsMobile();
    const waveBars = isMobile ? 8 : 18;

    const title = 'title' in item ? item.title : item.company;
    const subtitle = 'subtitle' in item ? item.subtitle : item.role;

    return (
        <div
            className="now-playing-panel bg-black/30 backdrop-blur-md border border-white/10"
            style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 1fr)',
                gridTemplateRows: isMobile ? 'auto auto minmax(0, 1fr)' : 'minmax(0, 1fr)',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* ── LEFT HALF: Giant High-Fidelity Turntable ── */}
            <div
                className="turntable-col"
                style={{
                    display: 'flex',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'center',
                    borderRight: isMobile ? 'none' : '1px solid #302C44',
                    borderBottom: isMobile ? '1px solid #302C44' : 'none',
                    position: 'relative',
                    minHeight: 0,
                    height: isMobile ? '240px' : 'auto',
                    padding: isMobile ? '28px 12px 0' : 0,
                }}
            >
                {/* Realistic Turntable Base (Plinth) */}
                <div
                    className="turntable-plinth"
                    style={{
                        position: 'relative',
                        width: '360px',
                        height: '380px',
                        transform: isMobile ? 'scale(0.55)' : 'none',
                        transformOrigin: 'top center',
                        borderRadius: '32px',
                        background: 'linear-gradient(135deg, #2a2438 0%, #171322 100%)',
                        border: '1px solid #302C44',
                        boxShadow: `0 24px 48px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -2px 6px rgba(0,0,0,0.5), 0 0 60px ${accentGlow}15`,
                        transition: 'box-shadow 0.6s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Sleeping Cat resting on top ledge of record player */}
                    <img
                        src="/calico_sleep.gif"
                        alt="Sleeping Cat"
                        style={{
                            position: 'absolute',
                            top: '-48px',
                            left: '32px',
                            width: '64px',
                            height: 'auto',
                            zIndex: 20,
                            imageRendering: 'pixelated',
                        }}
                    />

                    {/* Metallic Platter */}
                    <div
                        style={{
                            position: 'absolute',
                            width: DISC + 16,
                            height: DISC + 16,
                            borderRadius: '50%',
                            background: 'linear-gradient(145deg, #444, #151515)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,255,255,0.2)',
                            top: '40px',
                        }}
                    />

                    {/* Spinning disc */}
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={title}
                            initial={{ x: -100, opacity: 0, rotate: -45, scale: 0.8 }}
                            animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ x: 100, opacity: 0, rotate: 45, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 1 }}
                            style={{
                                position: 'absolute',
                                top: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <motion.div
                                style={{
                                    position: 'relative',
                                    borderRadius: '50%',
                                    width: DISC,
                                    height: DISC,
                                    background: DISC_BG,
                                    boxShadow: `0 4px 12px rgba(0,0,0,0.9), 0 0 28px ${accentGlow}`,
                                    transition: 'box-shadow 0.5s',
                                }}
                                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                                transition={
                                    isPlaying
                                        ? { repeat: Infinity, duration: 2.8, ease: 'linear' }
                                        : { duration: 0.8, ease: 'easeOut' }
                                }
                            >
                                {/* Conic-gradient vinyl shine */}
                                <div
                                    style={{
                                        position: 'absolute', inset: 0, borderRadius: '50%',
                                        background: 'conic-gradient(from 45deg, transparent 0%, rgba(255,255,255,0.06) 10%, transparent 20%, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%, transparent 90%, rgba(255,255,255,0.06) 100%)',
                                        zIndex: 1,
                                    }}
                                />

                                {/* Center label */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        gap: '4px', borderRadius: '50%',
                                        width: DISC * 0.33, height: DISC * 0.33,
                                        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                        background: color, border: '1px solid rgba(0,0,0,0.3)',
                                        boxShadow: `0 0 20px ${accentGlow}`, zIndex: 2,
                                    }}
                                />

                                {/* Spindle Hole */}
                                <div
                                    style={{
                                        position: 'absolute', width: '8px', height: '8px', borderRadius: '50%',
                                        background: 'radial-gradient(circle, #eee, #555)',
                                        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.6)', zIndex: 3,
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Detailed Tonearm Assembly */}
                    <motion.div
                        key={`tonearm-${title}`}
                        style={{
                            position: 'absolute',
                            width: '4px',
                            height: '160px',
                            background: 'linear-gradient(to right, #e0e0e0, #888, #444)',
                            transformOrigin: 'top center',
                            top: '40px',
                            right: '40px',
                            boxShadow: '4px 8px 12px rgba(0,0,0,0.6)',
                            zIndex: 4,
                        }}
                        initial={{ rotate: -35 }}
                        animate={isDragging ? { rotate: -38 } : isPlaying ? { rotate: 22 } : { rotate: -15 }}
                        transition={{ duration: 0.9, ease: 'backOut', delay: 0.1 }}
                    >
                        {/* Tonearm base pivot */}
                        <div
                            style={{
                                position: 'absolute', borderRadius: '50%', width: '48px', height: '48px',
                                background: 'radial-gradient(circle, #555, #111)', border: '1px solid #666',
                                top: '-24px', left: '-22px', boxShadow: '0 6px 12px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.1)',
                            }}
                        >
                            <div style={{
                                position: 'absolute', width: '18px', height: '18px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #999, #444)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                            }} />
                        </div>

                        {/* Counterweight */}
                        <div style={{
                            position: 'absolute', width: '24px', height: '32px', borderRadius: '6px',
                            background: 'linear-gradient(to right, #777, #222)', top: '-50px', left: '-10px',
                            boxShadow: '2px 4px 8px rgba(0,0,0,0.6)',
                        }} />

                        {/* Headshell / Stylus */}
                        <div
                            style={{
                                position: 'absolute', width: '14px', height: '34px', background: 'linear-gradient(to bottom, #111, #333)',
                                borderRadius: '3px 3px 8px 8px', bottom: '-30px', left: '-5px', transform: 'rotate(24deg)',
                                boxShadow: '3px 6px 10px rgba(0,0,0,0.7)', border: '1px solid #444',
                            }}
                        >
                            <div style={{ position: 'absolute', width: '3px', height: '6px', background: color, bottom: '4px', left: '5px', borderRadius: '1px' }} />
                        </div>
                    </motion.div>

                    {/* ── Left Decorations (Lights + Pixel Cat) ── */}
                    <div style={{ position: 'absolute', bottom: '16px', left: '32px', display: 'flex', alignItems: 'center', gap: '20px', zIndex: 20 }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'radial-gradient(circle, #666, #111)', boxShadow: '0 2px 6px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.3)' }} />
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'radial-gradient(circle, #666, #111)', boxShadow: '0 2px 6px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.3)' }} />
                        </div>
                        <img src="/pixel_cat.gif" alt="Pixel Cat" style={{ width: '48px', height: '48px', opacity: 0.9, imageRendering: 'pixelated' }} />
                    </div>

                    {/* ── Volume Dial (Right Base) ── */}
                    <div style={{ position: 'absolute', bottom: '20px', right: '32px', transform: 'scale(1.15)', transformOrigin: 'bottom right', zIndex: 20 }}>
                        <VolumeDial
                            volume={volume}
                            setVolume={setVolume}
                            color={color}
                            accentGlow={accentGlow}
                        />
                    </div>
                </div>

                {/* ─── INTEGRATED PLAYER BAR (desktop overlay) ─── */}
                {!isMobile && (
                    <PlayerBar
                        title={title}
                        subtitle={subtitle}
                        item={item}
                        color={color}
                        isPlaying={isPlaying}
                        waveBars={waveBars}
                        prev={prev}
                        next={next}
                        togglePlay={togglePlay}
                        overlay
                    />
                )}
            </div>

            {isMobile && (
                <PlayerBar
                    title={title}
                    subtitle={subtitle}
                    item={item}
                    color={color}
                    isPlaying={isPlaying}
                    waveBars={waveBars}
                    prev={prev}
                    next={next}
                    togglePlay={togglePlay}
                    overlay={false}
                />
            )}

            {/* ── RIGHT HALF: Selectable information treatment ── */}
            <div
                className="info-col"
                style={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                    minWidth: 0,
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={item.vinylLabel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{ minWidth: 0, flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <InfoPanel item={item} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
