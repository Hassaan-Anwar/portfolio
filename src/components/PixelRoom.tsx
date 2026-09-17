'use client';

import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import NowPlayingPanel from './NowPlayingPanel';
import VinylRecord from './VinylRecord';
import { useMusicStore } from '@/store/musicStore';
import { PROJECTS } from '@/data/projects';
import { EXPERIENCES } from '@/data/experience';
import Crate from './Crate';
import CosmicRainCanvas from './CosmicRainCanvas';
import { Disc3, ChevronLeft } from 'lucide-react';

/* ─── Floating space cat (pixel art SVG) ─── */
function SpaceCat({
    x, y, scale, phase, rotateDir,
}: { x: number; y: number; scale: number; phase: number; rotateDir: number }) {
    return (
        <motion.div
            className="absolute pointer-events-none select-none"
            style={{ left: `${x}%`, top: `${y}%`, opacity: 0.55 }}
            animate={{
                x: [0, 18 * rotateDir, -12 * rotateDir, 8 * rotateDir, 0],
                y: [0, -14, 10, -6, 0],
                rotate: [-4 * rotateDir, 6 * rotateDir, -2 * rotateDir, 8 * rotateDir, -4 * rotateDir],
                opacity: [0.55, 0.8, 0.5, 0.8, 0.55],
            }}
            transition={{ duration: 9 + phase * 1.5, repeat: Infinity, delay: phase, ease: 'easeInOut' }}
        >
            <svg
                width={Math.round(36 * scale)}
                height={Math.round(32 * scale)}
                viewBox="0 0 36 32"
                style={{ imageRendering: 'pixelated', display: 'block' }}
            >
                <rect x="10" y="16" width="16" height="12" fill="#B48EFF" />
                <rect x="12" y="7" width="12" height="11" fill="#B48EFF" />
                <rect x="12" y="4" width="5" height="5" fill="#B48EFF" />
                <rect x="19" y="4" width="5" height="5" fill="#B48EFF" />
                <rect x="13" y="5" width="2" height="2" fill="#D97706" />
                <rect x="20" y="5" width="2" height="2" fill="#D97706" />
                <rect x="14" y="11" width="2" height="3" fill="#FBBF24" />
                <rect x="20" y="11" width="2" height="3" fill="#FBBF24" />
                <rect x="17" y="15" width="2" height="1" fill="#D97706" />
                <rect x="26" y="18" width="2" height="8" fill="#B48EFF" />
                <rect x="28" y="15" width="2" height="4" fill="#B48EFF" />
                <rect x="3" y="10" width="2" height="2" fill="#CBB368" />
                <rect x="2" y="11" width="4" height="1" fill="#CBB368" />
                <rect x="3" y="9" width="2" height="4" fill="#CBB368" />
            </svg>
        </motion.div>
    );
}

/* ─── Section header ─── */
function SectionHeader({ label, count, color }: { label: string; count: number; color: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span className="font-pixel text-[9px] tracking-[4px]" style={{ color }}>{label}</span>
            <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, ${color}55, transparent)` }} />
            <span className="font-pixel text-[6px]" style={{ color: '#634B7D' }}>{count} TRACKS</span>
        </div>
    );
}

/* ─── Star ─── */
function Star({ x, y, delay }: { x: number; y: number; delay: number }) {
    return (
        <div
            className="absolute rounded-full pointer-events-none"
            style={{
                left: `${x}%`, top: `${y}%`,
                width: 2, height: 2, background: '#fff',
                animation: `twinkle ${2.5 + delay}s ease-in-out ${delay}s infinite`,
                opacity: 0.35,
            }}
        />
    );
}

/* ═══════════════════════════════════════════════════════════
   PEEK DRAWER — The library sidebar that peeks from left edge
   Shows a thin 40px strip; expands to 280px on hover/proximity
   ═══════════════════════════════════════════════════════════ */
const DRAWER_COLLAPSED = 40;
const DRAWER_EXPANDED = 280;

function PeekDrawer({ children, accentColor, isOpen, setIsOpen }: { children: ReactNode; accentColor: string; isOpen: boolean; setIsOpen: (v: boolean) => void }) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(1);
    const rawScrollY = useMotionValue(0);
    const smoothY = useSpring(rawScrollY, { stiffness: 400, damping: 45, mass: 0.8 });

    // Track content height for virtual scroll
    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;
        const updateHeight = () => setContentHeight(Math.max(1, content.offsetHeight));
        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(content);
        return () => observer.disconnect();
    }, []);

    const syncScroll = () => {
        if (scrollRef.current) {
            rawScrollY.set(-scrollRef.current.scrollTop);
        }
    };



    const isDragging = useMusicStore((state) => state.isDragging);
    const [isHoverZone, setIsHoverZone] = useState(false);

    // Automatically manage drawer open/close based on hover and drag states
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isDragging) {
            setIsOpen(true);
        } else if (isHoverZone) {
            setIsOpen(true);
        } else {
            // Close with grace period
            timer = setTimeout(() => setIsOpen(false), 50);
        }
        return () => clearTimeout(timer);
    }, [isHoverZone, isDragging]);






    return (
        <>
            {/* Invisible proximity detection zone — extends 30px past the visible drawer edge */}
            <div
                onMouseEnter={() => setIsHoverZone(true)}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: DRAWER_COLLAPSED + 30,
                    zIndex: 100,
                    pointerEvents: isOpen ? 'none' : 'auto',
                }}
            />

            {/* The actual drawer */}
            <motion.div
                ref={drawerRef}
                onMouseEnter={() => setIsHoverZone(true)}
                onMouseLeave={() => setIsHoverZone(false)}
                initial={{ width: DRAWER_COLLAPSED }}
                animate={{ width: isOpen ? DRAWER_EXPANDED : DRAWER_COLLAPSED }}
                transition={{ type: 'spring', stiffness: 450, damping: 22, mass: 1.1 }}
                style={{
                    flexShrink: 0,
                    height: '100%',
                    zIndex: 90,
                    display: 'flex',
                    flexDirection: 'row',
                    position: 'relative',
                    overflow: 'visible',
                }}
            >
                {/* Frosted glass backdrop */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(5, 3, 10, 0.92)',
                        borderRight: '1px solid rgba(255,255,255,0.08)',
                    }}
                />

                {/* ─ PEEK TAB (always visible) ─ */}
                <motion.div
                    animate={{ opacity: isOpen ? 0 : 1 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: DRAWER_COLLAPSED,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        zIndex: 5,
                        pointerEvents: isOpen ? 'none' : 'auto',
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsOpen(true)}
                >
                    {/* Rotating disc icon */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    >
                        <Disc3 size={20} color={accentColor} style={{ opacity: 0.7 }} />
                    </motion.div>

                    {/* Vertical text */}
                    <span
                        className="font-pixel"
                        style={{
                            fontSize: '7px',
                            color: '#9b93ae',
                            letterSpacing: '3px',
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                        }}
                    >
                        CRATES
                    </span>

                    {/* Chevron indicator */}
                    <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ChevronLeft size={14} color="#9b93ae" style={{ opacity: 0.5, transform: 'rotate(180deg)' }} />
                    </motion.div>

                    {/* Glowing edge line */}
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '15%',
                            bottom: '15%',
                            width: '2px',
                            background: `linear-gradient(to bottom, transparent, ${accentColor}60, transparent)`,
                            borderRadius: '1px',
                        }}
                    />
                </motion.div>

                {/* ─ EXPANDED CONTENT (scrollable crates) ─ */}
                <motion.div
                    animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -12 }}
                    transition={{ duration: 0.3, delay: isOpen ? 0.12 : 0, ease: 'easeInOut' }}
                    onWheel={(event) => {
                        const scrollbar = scrollRef.current;
                        if (!scrollbar) return;
                        event.preventDefault();
                        scrollbar.scrollTop += event.deltaY;
                    }}
                    style={{
                        position: 'relative',
                        width: DRAWER_EXPANDED,
                        height: '100%',
                        zIndex: 2,
                        // Clip vertically but allow dragged records to escape to the right
                        clipPath: 'inset(0 -100vw 0 0)',
                    }}
                >
                    <motion.div
                        ref={contentRef}
                        style={{
                            y: smoothY,
                            willChange: 'transform',
                        }}
                    >
                        {children}
                    </motion.div>

                    <div
                        ref={scrollRef}
                        aria-label="Scroll record library"
                        className="library-scrollbar"
                        onScroll={syncScroll}
                        tabIndex={0}
                        style={{ position: 'absolute', inset: '0 2px 0 auto', width: '8px', overflowY: 'scroll', overflowX: 'hidden' }}
                    >
                        <div style={{ height: contentHeight, width: '1px' }} />
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}

/* ─── Main ─── */
export default function PixelRoom() {
    const {
        activeSection, currentProjectIndex, currentExperienceIndex, currentBestsellersIndex,
        isPlaying, setCurrentProject, setCurrentExperience,
    } = useMusicStore();

    let activeItemTitle;
    let activeColor = '#302C44';
    let activeGlow = 'rgba(48,44,68,0.5)';

    if (activeSection === 'about') { activeColor = '#D97706'; activeGlow = 'rgba(217,119,6,0.6)'; }
    else if (activeSection === 'bestsellers') { activeColor = '#FBBF24'; activeGlow = 'rgba(251,191,36,0.6)'; }
    else if (activeSection === 'experience') { activeColor = '#2DD4BF'; activeGlow = 'rgba(45,212,191,0.6)'; }
    else if (activeSection === 'projects') { activeColor = '#B48EFF'; activeGlow = 'rgba(180,142,255,0.6)'; }

    const isProject = activeSection === 'projects';
    const [drawerOpen, setDrawerOpen] = useState(false);

    const CATS = [
        { x: 12, y: 18, scale: 1, phase: 0, rotateDir: 1 },
        { x: 55, y: 10, scale: 0.8, phase: 2.5, rotateDir: -1 },
        { x: 80, y: 22, scale: 1.1, phase: 1.2, rotateDir: 1 },
        { x: 35, y: 55, scale: 0.75, phase: 3.5, rotateDir: -1 },
        { x: 70, y: 62, scale: 0.9, phase: 0.7, rotateDir: 1 },
    ];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100dvh',
                width: '100%',
                position: 'relative',
            }}
        >
            <CosmicRainCanvas />


            {/* ══ TOP HEADER ══ */}
            <header
                className="bg-black/30 backdrop-blur-md border-b border-white/10"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '16px 40px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 60,
                    flexShrink: 0
                }}
            >

                {/* Left: Now Playing Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <motion.div
                        style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: isPlaying ? activeColor : '#302C44',
                            boxShadow: isPlaying ? `0 0 8px ${activeGlow}` : 'none',
                        }}
                        animate={isPlaying ? { scale: [1, 1.4, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span className="font-pixel tracking-widest" style={{ fontSize: '8px', color: '#9b93ae' }}>
                            {isPlaying ? 'NOW PLAYING' : 'PAUSED'}
                        </span>
                        <span className="font-pixel" style={{ fontSize: '6px', color: activeColor, opacity: 0.8 }}>
                            {activeSection === 'projects' ? 'PROJECT' : activeSection === 'experience' ? 'EXPERIENCE' : activeSection === 'about' ? 'ABOUT ME' : 'FEATURED'}
                        </span>
                    </div>
                </div>

                {/* Right: DEV.LAIR & Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div>
                        <p className="font-pixel" style={{ fontSize: '6px', color: '#634B7D', letterSpacing: '4px', textAlign: 'right' }}>WELCOME TO MY</p>
                        <h1
                            className="font-pixel leading-tight"
                            style={{ fontSize: '20px', color: '#F4F1EA', textShadow: `0 0 28px ${activeColor}80`, transition: 'text-shadow 0.7s' }}
                        >
                            DEV.LAIR
                        </h1>
                    </div>
                    <nav style={{ display: 'flex', gap: '32px' }}>
                        {['ABOUT', 'CONTACT'].map(l => (
                            <a key={l} href="#" className="font-pixel hover:text-white transition-colors" style={{ fontSize: '7px', color: '#9b93ae', letterSpacing: '2px' }}>{l}</a>
                        ))}
                    </nav>
                </div>
            </header>

            {/* ══ MAIN CONTENT AREA ══ */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', position: 'relative', overflow: 'hidden' }}>

                {/* PEEK DRAWER — slides in from the left */}
                <PeekDrawer accentColor={activeColor} isOpen={drawerOpen} setIsOpen={setDrawerOpen}>
                    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        {/* ABOUT CRATE */}
                        <Crate
                            title="ABOUT ME"
                            items={[
                                {
                                    id: 'about-1',
                                    onPlay: () => useMusicStore.getState().setCurrentAbout(0),
                                    content: (
                                        <VinylRecord
                                            color="#D97706" accentGlow="rgba(217,119,6,0.6)" shortTitle="DEV" coverFont="font-album-2" label="HI" title="Hassan (Me)"
                                            isActive={activeSection === 'about'} isPlaying={activeSection === 'about' && isPlaying}
                                        />
                                    )
                                }
                            ]}
                        />

                        {/* FEATURED PROJECTS CRATE */}
                        <Crate
                            title="FEATURED PROJECTS"
                            items={[0, 1, 2].map((i) => ({
                                id: `bs-${i}`,
                                onPlay: () => useMusicStore.getState().setCurrentBestsellers(i),
                                content: (
                                    <VinylRecord
                                        color="#FBBF24" accentGlow="rgba(251,191,36,0.6)" shortTitle={`HOT-${i+1}`} coverFont="font-album-5" label={`BS${i}`} title={`Top Hit ${i + 1}`}
                                        isActive={activeSection === 'bestsellers' && currentBestsellersIndex === i}
                                        isPlaying={activeSection === 'bestsellers' && currentBestsellersIndex === i && isPlaying}
                                    />
                                )
                            }))}
                        />

                        {/* EXPERIENCE CRATE */}
                        <Crate
                            title="EXPERIENCE"
                            items={EXPERIENCES.map((exp, i) => {
                                const isActive = activeSection === 'experience' && i === currentExperienceIndex;
                                return {
                                    id: exp.id.toString(),
                                    onPlay: () => useMusicStore.getState().setCurrentExperience(i),
                                    content: (
                                        <VinylRecord
                                            color="#2DD4BF" accentGlow="rgba(45,212,191,0.6)" shortTitle={exp.shortTitle} coverFont={exp.coverFont} label={exp.vinylLabel} title={exp.company}
                                            isActive={isActive} isPlaying={isActive && isPlaying}
                                        />
                                    )
                                };
                            })}
                        />

                        {/* PROJECTS CRATE */}
                        <Crate
                            title="PROJECTS"
                            items={PROJECTS.map((proj, i) => {
                                const isActive = activeSection === 'projects' && i === currentProjectIndex;
                                return {
                                    id: proj.id.toString(),
                                    onPlay: () => useMusicStore.getState().setCurrentProject(i),
                                    content: (
                                        <VinylRecord
                                            color="#B48EFF" accentGlow="rgba(180,142,255,0.6)" shortTitle={proj.shortTitle} coverFont={proj.coverFont} label={proj.vinylLabel} title={proj.title}
                                            isActive={isActive} isPlaying={isActive && isPlaying}
                                        />
                                    )
                                };
                            })}
                        />

                        {/* Breathing room */}
                        <div style={{ height: 120 }} />
                    </div>
                </PeekDrawer>

                {/* RIGHT: Main Player Dashboard — takes full width, drawer overlays */}
                <div style={{ flex: 1, minWidth: 0, height: '100%', overflow: 'hidden' }}>
                    <NowPlayingPanel />
                </div>
            </div>

            {/* Floor glow */}
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                    height: 120,
                    background: `linear-gradient(to top, ${activeGlow}12 0%, transparent 100%)`,
                    transition: 'background 0.8s ease',
                    zIndex: 0,
                }}
            />
        </div>
    );
}
