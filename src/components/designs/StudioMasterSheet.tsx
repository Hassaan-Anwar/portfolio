'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { InfoItem } from '@/data/info';

interface InfoPanelProps {
    item: InfoItem;
}

function parseHighlights(text: string) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <span key={i} style={{ color: '#ffffff', fontWeight: 600 }}>
                    {part.slice(2, -2)}
                </span>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

export default function StudioMasterSheet({ item }: InfoPanelProps) {
    const title = 'title' in item ? item.title : item.company;
    const subtitle = 'subtitle' in item ? item.subtitle : item.role;
    const year = 'year' in item ? item.year : item.period;
    const skills = 'techStack' in item ? item.techStack : item.skills;
    const isProject = 'techStack' in item;

    const rawDesc = item.longDescription || item.description;
    const color = item.color || '#FBBF24';

    // Real URLs — works for both Project and SupplementalInfoItem (Featured)
    const rawGithub = 'githubUrl' in item ? (item as any).githubUrl : undefined;
    const rawLive = 'liveUrl' in item ? (item as any).liveUrl : undefined;
    const githubHref = rawGithub && rawGithub !== '#' ? rawGithub : undefined;
    const liveHref = rawLive && rawLive !== '#' ? rawLive : undefined;

    let logs: string[] = [];
    if (Array.isArray(rawDesc)) {
        // If it's already an array of carefully constructed paragraphs, use it directly
        logs = rawDesc;
    } else {
        // If it's a string, try splitting by newline, else fall back to paired sentences
        if (rawDesc.includes('\n')) {
            logs = rawDesc.split('\n').map(s => s.trim()).filter(Boolean);
        } else {
            const sentences = rawDesc.match(/[^.!?]+[.!?]+/g) ?? [rawDesc];
            for (let i = 0; i < sentences.length; i += 2) {
                logs.push([sentences[i], sentences[i + 1]].filter(Boolean).join(' ').trim());
            }
        }
    }

    return (
        <article
            className="w-full h-full relative flex flex-col rounded-xl overflow-y-auto overflow-x-hidden studio-master"
            style={{
                fontFamily: '"JetBrains Mono", monospace',
                background: 'linear-gradient(160deg, #1c1c1f 0%, #141416 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent',
                boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
            }}
        >
            {/* Corner rack screws */}
            {(['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'] as const).map(pos => (
                <div key={pos} className={`absolute ${pos} w-2 h-2 rounded-full`}
                    style={{ background: '#111', boxShadow: 'inset 0 1px 2px rgba(0,0,0,1), 0 1px rgba(255,255,255,0.05)' }} />
            ))}

            {/* ── TAPE HEADER BAR ── */}
            <div className="flex items-center justify-between px-5 py-2.5 shrink-0 studio-tape-header"
                style={{ background: '#1a1a1e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="font-bold tracking-widest px-3 py-1 text-[10px] rounded-sm"
                    style={{ background: '#e4e4e7', color: '#111' }}>
                    TAPE HEADER
                </div>
                <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#71717a' }}>
                    PROJECT ID:&nbsp;{item.catalogId || '#00'}&nbsp;|&nbsp;TAKE: FINAL&nbsp;|&nbsp;DATE: {year}
                </div>
            </div>

            {/* ── TITLE BLOCK ── */}
            <div className="px-6 pt-4 pb-2 shrink-0">
                <h1 className="font-bold text-white leading-none studio-title" style={{ fontSize: '38px', letterSpacing: '-0.02em' }}>
                    {title}
                </h1>
                <h2 style={{ fontSize: '17px', color: '#71717a', marginTop: '4px' }}>
                    {subtitle}
                </h2>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '0 24px' }} />

            {/* ── MAIN BODY: CRT monitor floated left, logs wrap around it ── */}
            <div
                className="px-6 py-4"
                style={{ paddingRight: '32px' }}
            >
                {/* CRT monitor — floated left so log text wraps around it */}
                <div className="flex flex-col gap-2" style={{ float: 'left', width: '280px', marginRight: '24px', marginBottom: '12px' }} data-studio-crt>
                    {/* Thick outer bezel */}
                    <div className="w-full rounded-xl overflow-hidden"
                        style={{
                            background: '#0d0d0f',
                            border: '1px solid #000',
                            padding: '10px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.9), inset 0 1px rgba(255,255,255,0.06)',
                        }}>
                        {/* Screen */}
                        <div className="relative w-full rounded-md overflow-hidden" style={{ paddingBottom: '75%', background: '#000' }}>
                            {/* Glow content / Image */}
                            {item.imageSrc ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src={item.imageSrc}
                                        alt={item.shortTitle}
                                        fill
                                        priority
                                        className="object-cover"
                                        style={{ filter: 'brightness(0.8) contrast(1.1)' }}
                                    />
                                    {/* Subdued radial shadow around edges to retain CRT feel */}
                                    <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 28px rgba(0,0,0,0.85)' }} />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center"
                                    style={{ background: `radial-gradient(ellipse at center, ${color}3a 0%, #000 72%)` }}>
                                    <span className={item.coverFont}
                                        style={{ fontSize: '56px', color: '#fff', textShadow: `0 0 18px ${color}, 0 0 5px #fff` }}>
                                        {item.shortTitle}
                                    </span>
                                </div>
                            )}
                            {/* CRT scanlines */}
                            <div className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.4) 50%)',
                                    backgroundSize: '100% 3px',
                                    mixBlendMode: 'overlay',
                                    opacity: 0.7,
                                }} />
                            {/* Glass glare */}
                            <div className="absolute top-0 left-0 w-full pointer-events-none"
                                style={{ height: '35%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)' }} />
                        </div>
                    </div>
                    <div className="text-center font-bold" style={{ fontSize: '8px', letterSpacing: '0.18em', color: '#52525b' }}>
                        CHANNEL 1 MONITOR
                    </div>
                </div>

                {/* Log entries — flow naturally around the floated CRT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-3">
                            <span style={{ color: '#52525b', flexShrink: 0, fontSize: '13px', marginTop: '2px' }}>-</span>
                            <div style={{ fontSize: '13px', lineHeight: 1.65, textAlign: 'justify' }}>
                                <span style={{ color: '#ffffff', fontWeight: 700, letterSpacing: '0.12em', fontSize: '11px' }}>
                                    LOG {String(i + 1).padStart(2, '0')}:{' '}
                                </span>
                                <span style={{ color: '#a1a1aa' }}>{parseHighlights(log)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Clear float */}
                <div style={{ clear: 'both' }} />
            </div>


            {/* ── CHANNEL STRIP TABS ── */}
            <div className="px-6 pb-3 flex flex-row flex-wrap gap-2 shrink-0"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                {skills?.map((tech, i) => (
                    <div key={tech} className="flex overflow-hidden rounded-sm"
                        style={{ border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                        {/* Numbered white badge */}
                        <div className="flex items-center justify-center font-bold px-2.5"
                            style={{ background: '#e4e4e7', color: '#111', fontSize: '10px', minWidth: '22px' }}>
                            {i + 1}
                        </div>
                        {/* Tech label */}
                        <div className="flex items-center px-3 py-1.5"
                            style={{ background: '#18181b', color: '#d4d4d8', fontSize: '10px', letterSpacing: '0.08em' }}>
                            CH {i + 1}: {tech}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── BOTTOM ACTION STRIP ── */}
            <div className="shrink-0 flex flex-row studio-actions"
                style={{
                    background: 'linear-gradient(90deg, #18181a 0%, #1c1c1f 100%)',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    minHeight: '76px',
                }}>

                {/* REPO ACCESS — conditionally rendered if githubHref exists */}
                {githubHref ? (
                    <a
                        href={githubHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex flex-row items-center justify-center gap-5 px-5"
                        style={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                        {/* Fader assembly */}
                        <div className="relative flex items-center justify-center shrink-0" style={{ width: '40px', height: '52px' }}>
                            {/* Recessed track */}
                            <div className="absolute left-1/2 -translate-x-1/2 rounded-full"
                                style={{ width: '6px', height: '100%', background: '#000', boxShadow: 'inset 0 2px 6px rgba(0,0,0,1)' }} />
                            {/* Tick marks left side */}
                            <div className="absolute flex flex-col justify-between py-1" style={{ left: '4px', top: 0, height: '100%' }}>
                                {[...Array(5)].map((_, idx) => (
                                    <div key={idx} style={{ width: '4px', height: '1px', background: 'rgba(255,255,255,0.25)' }} />
                                ))}
                            </div>
                            {/* Animated fader knob — pointer-events-none since the whole wrapper is the button now */}
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-[3px] rounded-sm pointer-events-none"
                                style={{
                                    width: '28px', height: '14px', background: 'linear-gradient(to bottom, #666, #252525)',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.8), inset 0 1px rgba(255,255,255,0.22)', border: '1px solid #000', zIndex: 10
                                }}
                                initial={{ top: '65%' }} animate={{ top: '10%' }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
                            >
                                <div style={{ width: '14px', height: '1px', background: 'rgba(0,0,0,0.6)' }} />
                                <div style={{ width: '14px', height: '1px', background: 'rgba(255,255,255,0.22)' }} />
                                <div style={{ width: '14px', height: '1px', background: 'rgba(0,0,0,0.6)' }} />
                            </motion.div>
                        </div>

                        {/* Label + amber LED link */}
                        <div className="flex flex-col gap-2">
                            <span style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#ffffff', fontWeight: 700 }}>
                                REPO ACCESS
                            </span>
                            <span style={{ fontSize: '11px', letterSpacing: '0.1em', fontWeight: 700, color: '#d4d4d8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                [&nbsp;
                                <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', background: '#FBBF24', boxShadow: '0 0 10px rgba(251,191,36,0.9), 0 0 4px rgba(251,191,36,0.6)', flexShrink: 0 }} />
                                &nbsp;GITHUB ]
                            </span>
                        </div>
                    </a>
                ) : (
                    <div className="flex-1" />
                )}

                {/* Divider (Only show if both links exist) */}
                {githubHref && liveHref && (
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)', alignSelf: 'stretch', margin: '10px 0' }} />
                )}

                {/* DEMO — always glowing, always ON */}
                <a
                    href={liveHref}
                    target={liveHref ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    onClick={!liveHref ? (e) => e.preventDefault() : undefined}
                    className="flex-1 flex flex-row items-center justify-center gap-5 px-5"
                    style={{ textDecoration: 'none', cursor: liveHref ? 'pointer' : 'default' }}
                >
                    {/* Label + green LED */}


                    {/* Pill toggle */}
                    <div className="relative flex items-center shrink-0 pointer-events-none"
                        style={{ width: '56px', height: '28px', background: '#000', borderRadius: '999px', boxShadow: 'inset 0 3px 8px rgba(0,0,0,1)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <motion.div
                            className="flex items-center justify-center"
                            style={{ position: 'absolute', width: '22px', height: '22px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 14px rgba(34,197,94,0.8), inset 0 3px 4px rgba(255,255,255,0.4), inset 0 -3px 4px rgba(0,0,0,0.3)' }}
                            initial={{ left: '3px' }} animate={{ left: '31px' }} transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.4 }}
                        >
                            <div style={{ position: 'absolute', top: '3px', left: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.35)', filter: 'blur(1px)' }} />
                        </motion.div>
                    </div>
                </a>
            </div>
        </article>
    );
}
