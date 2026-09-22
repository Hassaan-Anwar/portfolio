'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { InfoItem } from '@/data/info';

interface InfoPanelProps {
    item: InfoItem;
}

// SVG barcode — same approach as the reference design
function Barcode() {
    const widths = [2, 1, 3, 1, 2, 1, 1, 4, 1, 2, 2, 1, 3, 1, 1, 2, 1, 4, 1, 1, 2, 1, 3, 1, 1, 2, 1];
    let x = 0;
    const bars: React.ReactElement[] = [];
    widths.forEach((w, i) => {
        if (i % 2 === 0) bars.push(<rect key={i} x={x} y={0} width={w * 2.2} height={36} fill="currentColor" />);
        x += w * 2.2;
    });
    return (
        <svg viewBox={`0 0 ${x} 36`} style={{ width: '110px', height: '34px', color: 'rgba(200,185,255,0.5)' }}>
            {bars}
        </svg>
    );
}

function Track({ num, title, duration }: { num: string; title: string; duration?: string }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="flex items-baseline gap-2 cursor-default"
            style={{ padding: '10px 0' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Track number */}
            <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '9px',
                color: hovered ? 'rgba(200,185,255,0.6)' : 'rgba(200,185,255,0.28)',
                flexShrink: 0,
                width: '18px',
                transition: 'color 0.15s',
            }}>
                {num}
            </span>

            {/* Title */}
            <span style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '13px',
                fontWeight: 500,
                color: hovered ? 'rgba(255,255,255,1)' : 'rgba(228,222,255,0.78)',
                flex: 1,
                lineHeight: 1.3,
                transition: 'color 0.15s',
                textShadow: hovered ? '0 0 12px rgba(200,185,255,0.4)' : 'none',
            }}>
                {title}
            </span>

            {/* Dotted leader */}
            <div style={{
                flexShrink: 0,
                borderBottom: '1px dotted rgba(200,185,255,0.14)',
                width: '20px',
                marginBottom: '3px',
            }} />

            {/* Duration */}
            {duration && (
                <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '9px',
                    color: hovered ? 'rgba(200,185,255,0.6)' : 'rgba(200,185,255,0.28)',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s',
                }}>
                    {duration}
                </span>
            )}
        </div>
    );
}

export default function AlbumCover({ item }: InfoPanelProps) {
    const title = 'title' in item ? item.title : item.company;
    const skills = 'techStack' in item ? item.techStack : item.skills;

    const acd = item.albumCoverData;

    const sleeveColor = acd?.sleeveColor || item.color || '#6B21A8';
    const recordLabel = acd?.recordLabel || 'FULL-STACK RECORDS';
    const artist = acd?.artist || ('subtitle' in item ? item.subtitle : item.role) || '';
    const releaseYear = acd?.releaseYear || ('year' in item ? item.year : item.period) || '2024';
    const catalogId = item.catalogId || 'CAT-001';
    const description = item.description || '';

    const sideA: { title: string; duration?: string }[] = acd?.sideA || [];
    const sideB: { title: string; duration?: string }[] = acd?.sideB || [];

    const producedBy = acd?.producedBy || skills?.slice(0, 3).join(' · ') || '';
    const recordedAt = acd?.recordedAt || skills?.slice(3).join(' · ') || '';

    // Derive a lighter tint for accents in the right panel
    const accentLight = sleeveColor + 'cc';

    const githubUrl = 'githubUrl' in item ? item.githubUrl : undefined;
    const liveUrl = 'liveUrl' in item ? item.liveUrl : undefined;
    const githubHref = githubUrl && githubUrl !== '#' ? githubUrl : undefined;
    const liveHref = liveUrl && liveUrl !== '#' ? liveUrl : undefined;

    return (
        <div className="w-full h-full flex overflow-hidden" style={{ fontFamily: '"JetBrains Mono", monospace' }}>

            {/* ── LEFT SLEEVE PANEL ──────────────────── */}
            <div
                className="relative flex flex-col shrink-0 overflow-hidden"
                style={{ width: '38%', background: sleeveColor }}
            >
                {/* Noise texture overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat', backgroundSize: '250px 250px', opacity: 0.055,
                }} />

                {/* Ghosted vinyl stamped into sleeve */}
                <div className="absolute pointer-events-none" style={{
                    bottom: '-60px', right: '-60px', width: '260px', height: '260px', opacity: 0.1,
                }}>
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle cx="100" cy="100" r="97" fill="rgba(0,0,0,0.3)" />
                        {Array.from({ length: 8 }, (_, i) => (
                            <circle key={i} cx="100" cy="100" r={88 - i * 9} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" />
                        ))}
                        <circle cx="100" cy="100" r="22" fill="rgba(0,0,0,0.5)" />
                        <circle cx="100" cy="100" r="3.5" fill="rgba(0,0,0,0.8)" />
                    </svg>
                </div>

                {/* Dark gradient at bottom for text legibility */}
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
                    height: '65%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
                }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full px-6 pt-6 pb-6">
                    {/* Top meta row */}
                    <div className="flex justify-between items-start shrink-0">
                        <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.25em' }}>
                            {catalogId}
                        </span>
                        <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.2em', textAlign: 'right' }}>
                            {recordLabel.toUpperCase()}
                        </span>
                    </div>

                    {/* Spacer — empty "art" zone */}
                    <div className="flex-1" />

                    {/* Genre tag */}
                    <div className="shrink-0 mb-4">
                        <span style={{
                            fontSize: '8px', letterSpacing: '0.3em',
                            color: 'rgba(255,255,255,0.6)',
                            borderTop: '1px solid rgba(255,255,255,0.3)',
                            paddingTop: '6px', display: 'inline-block',
                            textTransform: 'uppercase',
                        }}>
                            {item.infoCategory}
                        </span>
                    </div>

                    {/* Big title */}
                    <div className="shrink-0 mb-5">
                        <h1 style={{
                            fontFamily: 'var(--font-editorial, Georgia, serif)',
                            fontSize: 'clamp(28px, 4.2vw, 46px)',
                            fontWeight: 900,
                            color: '#ffffff',
                            lineHeight: 1.05,
                            letterSpacing: '-0.02em',
                            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                        }}>
                            {title}
                        </h1>
                    </div>

                    {/* Description beneath title */}
                    {description && (
                        <p className="shrink-0" style={{
                            fontSize: '11px', color: 'rgba(255,255,255,0.62)',
                            lineHeight: 1.55,
                            fontFamily: 'Georgia, serif',
                        }}>
                            {description}
                        </p>
                    )}

                    {/* Artist + year — pushed down with margin-top for breathing room */}
                    <div className="shrink-0 flex justify-between items-end" style={{ marginTop: '20px' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase' }}>
                            {artist}
                        </span>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.45)' }}>
                            {releaseYear}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ──────────────────── */}
            <div className="relative flex flex-col flex-1 overflow-hidden" style={{ background: '#080714' }}>

                {/* Accent rule at top */}
                <div className="shrink-0" style={{ height: '3px', background: sleeveColor }} />

                {/* STEREO + title row */}
                <div className="shrink-0 flex justify-between items-center px-6 py-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                    <span style={{ fontSize: '8px', color: 'rgba(200,185,255,0.3)', letterSpacing: '0.25em', textTransform: 'uppercase', paddingRight: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                        {title}
                    </span>
                    <span style={{ fontSize: '8px', color: accentLight, letterSpacing: '0.2em', flexShrink: 0 }}>
                        ◉ STEREO
                    </span>
                </div>

                {/* Track listing — shrink-0 so it takes natural height only */}
                <div className="shrink-0 flex px-6 pt-5 pb-4 gap-6">

                    {/* Side A */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="shrink-0 mb-1 pb-2" style={{ borderBottom: `1px solid ${sleeveColor}55` }}>
                            <span style={{ fontSize: '8px', color: accentLight, letterSpacing: '0.35em', textTransform: 'uppercase' }}>
                                SIDE A
                            </span>
                        </div>
                        {sideA.map((t, i) => (
                            <Track
                                key={i}
                                num={String(i + 1).padStart(2, '0')}
                                title={t.title}
                                duration={t.duration}
                            />
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="shrink-0" style={{ width: '1px', background: 'rgba(255,255,255,0.04)', alignSelf: 'stretch' }} />

                    {/* Side B */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="shrink-0 mb-1 pb-2" style={{ borderBottom: `1px solid ${sleeveColor}55` }}>
                            <span style={{ fontSize: '8px', color: accentLight, letterSpacing: '0.35em', textTransform: 'uppercase' }}>
                                SIDE B
                            </span>
                        </div>
                        {sideB.map((t, i) => (
                            <Track
                                key={i}
                                num={String(sideA.length + i + 1).padStart(2, '0')}
                                title={t.title}
                                duration={t.duration}
                            />
                        ))}
                    </div>
                </div>

                {/* Spacer — fills all remaining space, pinning footer to the bottom */}
                <div style={{ flex: '1 1 0' }} />

                {/* ── FOOTER ── */}
                <div
                    className="shrink-0 px-7 py-7 flex items-end justify-between gap-6"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                >
                    {/* Credit columns */}
                    <div className="flex flex-col gap-5 min-w-0 flex-1">
                        {producedBy && (
                            <div>
                                <div style={{ fontSize: '9px', color: 'rgba(200,185,255,0.42)', letterSpacing: '0.25em', marginBottom: '5px', textTransform: 'uppercase' }}>
                                    Produced By
                                </div>
                                <div style={{ fontSize: '13px', color: 'rgba(215,208,255,0.78)', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.5 }}>
                                    {producedBy}
                                </div>
                            </div>
                        )}
                        {recordedAt && (
                            <div>
                                <div style={{ fontSize: '9px', color: 'rgba(200,185,255,0.42)', letterSpacing: '0.25em', marginBottom: '5px', textTransform: 'uppercase' }}>
                                    Recorded At
                                </div>
                                <div style={{ fontSize: '13px', color: 'rgba(215,208,255,0.78)', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.5 }}>
                                    {recordedAt}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-5">
                            {githubHref && (
                                <motion.a href={githubHref} target="_blank" rel="noopener noreferrer"
                                    whileHover={{ x: -2 }}
                                    style={{ fontSize: '12px', color: 'rgba(200,185,255,0.68)', textDecoration: 'underline', textUnderlineOffset: '3px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}
                                >
                                    » GitHub
                                </motion.a>
                            )}
                            {liveHref && (
                                <motion.a href={liveHref} target="_blank" rel="noopener noreferrer"
                                    whileHover={{ x: -2 }}
                                    style={{ fontSize: '12px', color: 'rgba(200,185,255,0.68)', textDecoration: 'underline', textUnderlineOffset: '3px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}
                                >
                                    » Demo
                                </motion.a>
                            )}
                        </div>

                    </div>

                    {/* Barcode + copyright */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                        <Barcode />
                        <span style={{ fontSize: '9px', color: 'rgba(200,185,255,0.38)', letterSpacing: '0.1em' }}>
                            {catalogId}
                        </span>
                        <span style={{ fontSize: '9px', color: 'rgba(200,185,255,0.32)', letterSpacing: '0.08em' }}>
                            © {releaseYear} {recordLabel}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
