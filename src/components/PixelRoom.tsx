'use client';

import { motion } from 'framer-motion';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import NowPlayingPanel from './NowPlayingPanel';
import VinylRecord from './VinylRecord';
import { useMusicStore } from '@/store/musicStore';
import { PROJECTS } from '@/data/projects';
import { EXPERIENCES } from '@/data/experience';
import Crate from './Crate';
import CosmicRainCanvas from './CosmicRainCanvas';


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

/**
 * Keeps the library scrollable without making it an overflow container. That
 * distinction matters here: records must still be able to travel out of the
 * library and over the player while they are being dragged.
 */
function LibraryPane({ children }: { children: ReactNode }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(1);
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;

        const updateHeight = () => setContentHeight(Math.max(1, content.offsetHeight));
        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(content);
        return () => observer.disconnect();
    }, []);

    const syncScroll = () => setScrollTop(scrollRef.current?.scrollTop ?? 0);

    return (
        <div
            onWheel={(event) => {
                const scrollbar = scrollRef.current;
                if (!scrollbar) return;
                event.preventDefault();
                scrollbar.scrollTop += event.deltaY;
            }}
            style={{
                position: 'relative',
                zIndex: 50,
                minWidth: 0,
                minHeight: 0,
                height: '100%',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                // Clip vertically, but deliberately leave room to the right for a dragged record.
                clipPath: 'inset(0 -100vw 0 0)',
            }}
        >
            <div
                ref={contentRef}
                style={{
                    transform: `translateY(-${scrollTop}px)`,
                    willChange: 'transform',
                }}
            >
                {children}
            </div>

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
        </div>
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

    if (activeSection === 'projects') {
        const item = PROJECTS[currentProjectIndex];
        activeColor = item?.color || activeColor;
        activeGlow = item?.accentGlow || activeGlow;
    } else if (activeSection === 'experience') {
        const item = EXPERIENCES[currentExperienceIndex];
        activeColor = item?.color || activeColor;
        activeGlow = item?.accentGlow || activeGlow;
    } else if (activeSection === 'bestsellers') {
        activeColor = "#FBBF24";
        activeGlow = "rgba(251,191,36,0.6)";
    } else if (activeSection === 'about') {
        activeColor = "#D97706";
        activeGlow = "rgba(217,119,6,0.6)";
    }

    const isProject = activeSection === 'projects';

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
                            {isProject ? 'PROJECT' : 'EXPERIENCE'}
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

            {/* ══ MAIN SPLIT VIEW ══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', flex: 1, minHeight: 0, position: 'relative', zIndex: 1 }}>

                {/* LEFT: Record Crates (Library Sidebar) */}
                <LibraryPane>
                    <div style={{ padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        {/* ABOUT CRATE */}
                        <Crate
                            title="ABOUT ME"
                            items={[
                                {
                                    id: 'about-1',
                                    onPlay: () => useMusicStore.getState().setCurrentAbout(0),
                                    content: (
                                        <VinylRecord
                                            color="#D97706" accentGlow="rgba(217,119,6,0.6)" emoji="👋" label="HI" title="Hassan (Me)"
                                            isActive={activeSection === 'about'} isPlaying={activeSection === 'about' && isPlaying}
                                        />
                                    )
                                }
                            ]}
                        />

                        {/* BEST SELLERS CRATE */}
                        <Crate
                            title="BEST SELLERS"
                            items={[0, 1, 2].map((i) => ({
                                id: `bs-${i}`,
                                onPlay: () => useMusicStore.getState().setCurrentBestsellers(i),
                                content: (
                                    <VinylRecord
                                        color="#FBBF24" accentGlow="rgba(251,191,36,0.6)" emoji="🔥" label={`BS${i}`} title={`Top Hit ${i + 1}`}
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
                                            color={exp.color} accentGlow={exp.accentGlow} emoji={exp.vinylEmoji} label={exp.vinylLabel} title={exp.company}
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
                                            color={proj.color} accentGlow={proj.accentGlow} emoji={proj.vinylEmoji} label={proj.vinylLabel} title={proj.title}
                                            isActive={isActive} isPlaying={isActive && isPlaying}
                                        />
                                    )
                                };
                            })}
                        />

                        {/* Breathing room completely clearing the footer */}
                        <div style={{ height: 120 }} />
                    </div>
                </LibraryPane>

                {/* RIGHT: Main Player Dashboard */}
                <div style={{ minWidth: 0, height: '100%', overflow: 'hidden' }}>
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
