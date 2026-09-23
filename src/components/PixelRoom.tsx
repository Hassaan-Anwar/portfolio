'use client';

import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import NowPlayingPanel from './NowPlayingPanel';
import VinylRecord from './VinylRecord';
import { useMusicStore } from '@/store/musicStore';
import { PROJECTS } from '@/data/projects';
import { EXPERIENCES } from '@/data/experience';
import { FEATURED, ABOUT } from '@/data/info';
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
                    width: DRAWER_COLLAPSED, /* no extra extension */
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
        isPlaying, setCurrentProject, setCurrentExperience, activeColor, activeGlow,
    } = useMusicStore();

    const isProject = activeSection === 'projects';
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [copied, setCopied] = useState(false);

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
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    width: '100%',
                    padding: '10px 32px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 60,
                    flexShrink: 0
                }}
            >
                {/* ── LEFT: Now Playing Status ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <motion.div
                        style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: isPlaying ? activeColor : '#302C44',
                            boxShadow: isPlaying ? `0 0 8px ${activeGlow}` : 'none',
                            flexShrink: 0,
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

                {/* ── CENTER: Identity ── */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <span
                        className="font-pixel tracking-widest"
                        style={{ fontSize: '13px', color: '#F4F1EA', letterSpacing: '0.18em' }}
                    >
                        HASSAAN ANWAR
                    </span>
                    <span
                        className="font-pixel tracking-widest"
                        style={{ fontSize: '7px', color: '#9b93ae', letterSpacing: '0.22em' }}
                    >
                        SOFTWARE ENGINEER
                    </span>
                </div>

                {/* ── RIGHT: Contact Links ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
                    {/* GitHub */}
                    <a href="https://github.com/Hassaan-Anwar" target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', color: '#9b93ae', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#9b93ae')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                    </a>

                    {/* LinkedIn */}
                    <a href="https://www.linkedin.com/in/hassaan-anwar2/" target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', color: '#9b93ae', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#9b93ae')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>

                    {/* Email */}
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hassaan.anwar20052@gmail.com"
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', color: '#9b93ae', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#9b93ae')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                    </a>

                    {/* Phone pill / Copy Button */}
                    <button
                        onClick={() => {
                            if (copied) return;
                            navigator.clipboard.writeText('+92 300-5356465');
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className="font-pixel cursor-pointer"
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#9b93ae')}
                        style={{
                            color: '#9b93ae',
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '0',
                            transition: 'color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: copied ? '40px' : '18px',
                            height: '18px'
                        }}
                        title="Copy Phone Number"
                    >
                        {copied ? (
                            <span style={{ fontSize: '7px', letterSpacing: '2px', paddingTop: '2px' }}>COPIED</span>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                        )}
                    </button>
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
                                            color={ABOUT[0].color} accentGlow={ABOUT[0].accentGlow} shortTitle={ABOUT[0].shortTitle} coverFont={ABOUT[0].coverFont} label={ABOUT[0].vinylLabel} title={ABOUT[0].title}
                                            isActive={activeSection === 'about'} isPlaying={activeSection === 'about' && isPlaying}
                                        />
                                    )
                                }
                            ]}
                        />

                        {/* FEATURED PROJECTS CRATE */}
                        <Crate
                            title="FEATURED PROJECTS"
                            items={FEATURED.map((feat, i) => ({
                                id: `bs-${i}`,
                                onPlay: () => useMusicStore.getState().setCurrentBestsellers(i),
                                content: (
                                    <VinylRecord
                                        color={feat.color} accentGlow={feat.accentGlow} shortTitle={feat.shortTitle} coverFont={feat.coverFont} label={feat.vinylLabel} title={feat.title}
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
                                            color={proj.color} accentGlow={proj.accentGlow} shortTitle={proj.shortTitle} coverFont={proj.coverFont} label={proj.vinylLabel} title={proj.title}
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
