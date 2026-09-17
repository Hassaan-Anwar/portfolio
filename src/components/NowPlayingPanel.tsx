'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { PROJECTS } from '@/data/projects';
import { EXPERIENCES } from '@/data/experience';
import { GitBranch, SkipBack, SkipForward, Play, Pause } from 'lucide-react';

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

export default function NowPlayingPanel() {
    const { activeSection, currentAboutIndex, currentBestsellersIndex, currentProjectIndex, currentExperienceIndex, isPlaying, isDragging, next, prev, togglePlay } =
        useMusicStore();

    let item: any;
    if (activeSection === 'projects') item = PROJECTS[currentProjectIndex];
    else if (activeSection === 'experience') item = EXPERIENCES[currentExperienceIndex];
    else if (activeSection === 'about') item = { title: 'Hassan (Me)', subtitle: 'Full-Stack Developer', year: '2024', longDescription: 'Hello! This is my interactive portfolio built with React and Framer Motion. Sift through the crates on the left to see my work and experience.', skills: ['React', 'TypeScript', 'Next.js', 'Framer Motion'], color: '#D97706', accentGlow: 'rgba(217,119,6,0.6)', shortTitle: 'DEV', coverFont: 'font-album-2', vinylLabel: 'HI' };
    else item = { title: `Top Hit ${currentBestsellersIndex + 1}`, subtitle: 'Featured Item', year: '2024', description: 'A highly rated project or item from the catalog.', skills: ['Design', 'Code'], color: '#FBBF24', accentGlow: 'rgba(251,191,36,0.6)', shortTitle: 'HOT', coverFont: 'font-album-5', vinylLabel: `BS${currentBestsellersIndex}` };

    const isProject = activeSection === 'projects';
    let color = '#302C44';
    let accentGlow = 'rgba(48,44,68,0.5)';
    if (activeSection === 'about') { color = '#D97706'; accentGlow = 'rgba(217,119,6,0.6)'; }
    else if (activeSection === 'bestsellers') { color = '#FBBF24'; accentGlow = 'rgba(251,191,36,0.6)'; }
    else if (activeSection === 'experience') { color = '#2DD4BF'; accentGlow = 'rgba(45,212,191,0.6)'; }
    else if (activeSection === 'projects') { color = '#B48EFF'; accentGlow = 'rgba(180,142,255,0.6)'; }
    const DISC = 240; // Increased size since it's the main focus now!

    const title = 'title' in item ? item.title : item.company;
    const subtitle = 'subtitle' in item ? item.subtitle : item.role;
    const year = 'year' in item ? item.year : item.period;

    const desc = (item as any).longDescription || (item as any).description;

    const chips = 'techStack' in item ? item.techStack : item.skills;
    const githubUrl = 'githubUrl' in item ? item.githubUrl : '#';

    return (
        <div
            className="bg-black/30 backdrop-blur-md border border-white/10"
            style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                height: '100%',
                width: '100%',
                
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* ── LEFT HALF: Giant High-Fidelity Turntable ── */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: '1px solid #302C44',
                    position: 'relative'
                }}
            >
                {/* Realistic Turntable Base (Plinth) */}
                <div style={{
                        position: 'relative',
                        width: '360px',
                        height: '380px',
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
                            imageRendering: 'pixelated' 
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
                            top: '40px' // shift down slightly to make room for tonearm pivot
                        }}
                    />

                    {/* Spinning disc (with AnimatePresence for transitions) */}
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={title}
                            initial={{ x: -100, opacity: 0, rotate: -45, scale: 0.8 }}
                            animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ x: 100, opacity: 0, rotate: 45, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 1 }}
                            style={{
                                position: 'absolute',
                                top: '48px', // Match platter shift
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
                                >
                                    <span style={{ fontSize: '32px', zIndex: 2 }}>{item.shortTitle}</span>
                                    <span className="font-pixel" style={{ fontSize: '5px', color: '#0d0a14', letterSpacing: '1px', zIndex: 2 }}>
                                        {item.vinylLabel}
                                    </span>
                                </div>

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
                            width: '4px', // metallic tube
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
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                            }} />
                        </div>

                        {/* Counterweight */}
                        <div style={{
                            position: 'absolute', width: '24px', height: '32px', borderRadius: '6px',
                            background: 'linear-gradient(to right, #777, #222)', top: '-50px', left: '-10px',
                            boxShadow: '2px 4px 8px rgba(0,0,0,0.6)'
                        }} />

                        {/* Headshell / Stylus */}
                        <div
                            style={{
                                position: 'absolute', width: '14px', height: '34px', background: 'linear-gradient(to bottom, #111, #333)',
                                borderRadius: '3px 3px 8px 8px', bottom: '-30px', left: '-5px', transform: 'rotate(24deg)',
                                boxShadow: '3px 6px 10px rgba(0,0,0,0.7)', border: '1px solid #444'
                            }}
                        >
                            <div style={{ position: 'absolute', width: '3px', height: '6px', background: '#D97706', bottom: '4px', left: '5px', borderRadius: '1px' }} />
                        </div>
                    </motion.div>

                    {/* Pixel Cat Sticker */}
                    <img src="/pixel_cat.gif" alt="Pixel Cat" style={{ position: 'absolute', bottom: '12px', right: '24px', width: '48px', height: '48px', opacity: 0.9, zIndex: 10, imageRendering: 'pixelated' }} />
                    
                    {/* Decorative Base Buttons */}
                    <div style={{ position: 'absolute', bottom: '24px', left: '32px', display: 'flex', gap: '12px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'radial-gradient(circle, #666, #111)', boxShadow: '0 2px 6px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.3)' }} />
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'radial-gradient(circle, #666, #111)', boxShadow: '0 2px 6px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.3)' }} />
                    </div>
                </div>

                    {/* ─── INTEGRATED PLAYER BAR ─── */}
                    <div
                        className="bg-black/30 backdrop-blur-md border-t border-white/10"
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '64px',
                            padding: '0 24px',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto 1fr',
                            alignItems: 'center',
                            zIndex: 10,
                        }}
                    >
                        {/* 1. Track info (Left) */}
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

                        {/* 2. Controls (Centered) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
                            <button onClick={prev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9b93ae', display: 'flex', padding: '4px' }} onMouseEnter={e => (e.currentTarget.style.color = '#F4F1EA')} onMouseLeave={e => (e.currentTarget.style.color = '#9b93ae')}><SkipBack size={18} /></button>
                            
                            <button onClick={togglePlay} style={{ background: color, border: 'none', cursor: 'pointer', color: '#0d0a14', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.15s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                            </button>
                            
                            <button onClick={next} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9b93ae', display: 'flex', padding: '4px' }} onMouseEnter={e => (e.currentTarget.style.color = '#F4F1EA')} onMouseLeave={e => (e.currentTarget.style.color = '#9b93ae')}><SkipForward size={18} /></button>
                        </div>

                        {/* 3. Visualizer (Right) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '28px', justifyContent: 'flex-end', opacity: isPlaying ? 1 : 0.4 }}>
                            {Array.from({ length: 18 }).map((_, i) => (
                                <div key={i} style={{ width: '3px', background: color, borderRadius: '2px', height: isPlaying ? `${6 + (i % 7) * 3}px` : '3px', transition: 'height 0.4s ease', animation: isPlaying ? `waveBar ${0.55 + (i % 5) * 0.15}s ease-in-out ${i * 0.04}s infinite alternate` : 'none' }} />
                            ))}
                        </div>
                    </div>
            </div>

            {/* ── RIGHT HALF: Project Details & Image Dashboard ── */}
            <div
                style={{
                    overflowY: 'auto',
                    padding: '40px 48px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#302C44 transparent'
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={item.vinylLabel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                    >
                        {/* Title & Metadata */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span className="font-pixel tracking-widest" style={{ fontSize: '8px', color, padding: '4px 8px', background: `${color}15`, borderRadius: '4px', border: `1px solid ${color}40` }}>
                                    {isProject ? 'PROJECT' : 'EXPERIENCE'}
                                </span>
                                <span className="font-mono" style={{ fontSize: '12px', color: '#9b93ae' }}>
                                    {year}
                                </span>
                            </div>
                            <h2 style={{ fontWeight: '800', fontSize: '32px', color: '#F4F1EA', lineHeight: 1.1, textShadow: `0 0 24px ${color}40` }}>
                                {title}
                            </h2>
                            <p className="font-mono" style={{ fontSize: '14px', color: '#c4bcce', marginTop: '6px' }}>
                                {subtitle}
                            </p>
                        </div>

                        {/* Huge Image Placeholder visually rich representation */}
                        <div
                            style={{
                                width: '100%',
                                height: '240px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                background: `linear-gradient(135deg, ${color}22, #1B1229)`,
                                border: `1px solid ${color}40`,
                                boxShadow: `0 12px 32px rgba(0,0,0,0.5), inset 0 0 40px ${color}15`
                            }}
                        >
                            <span style={{ fontSize: '80px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))', zIndex: 2 }}>{item.shortTitle}</span>
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))', zIndex: 1 }} />
                            <p style={{ position: 'absolute', bottom: '16px', left: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', zIndex: 2 }}>Visual Preview</p>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="font-pixel tracking-widest" style={{ fontSize: '8px', color, marginBottom: '12px' }}>
                                SYSTEM_LOG
                            </p>
                            <p style={{ fontSize: '15px', color: '#d3cce0', lineHeight: 1.7 }}>
                                {desc}
                            </p>
                        </div>

                        {/* Tech / Skills */}
                        <div>
                            <p className="font-pixel tracking-widest" style={{ fontSize: '8px', color, marginBottom: '12px' }}>
                                {isProject ? 'TECH_STACK' : 'CORE_SKILLS'}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {chips.map((t: string) => (
                                    <span
                                        key={t}
                                        className="font-mono"
                                        style={{
                                            fontSize: '12px',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            background: `linear-gradient(180deg, ${color}15, transparent)`,
                                            color: '#F4F1EA',
                                            border: `1px solid ${color}40`,
                                            boxShadow: `0 4px 12px rgba(0,0,0,0.2)`
                                        }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isProject && (
                            <div style={{ display: 'flex', paddingTop: '8px' }}>
                                <a
                                    href={githubUrl}
                                    className="transition-all hover:scale-105"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        fontSize: '14px', fontWeight: 'bold', padding: '12px 24px', borderRadius: '12px',
                                        background: `${color}18`, color, border: `1px solid ${color}60`, textDecoration: 'none',
                                        boxShadow: `0 0 20px ${color}20`
                                    }}
                                >
                                    <GitBranch size={16} /> VIEW REPOSITORY
                                </a>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
