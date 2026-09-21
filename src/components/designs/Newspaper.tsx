'use client';
import { motion } from 'framer-motion';
import type { InfoItem } from '@/data/info';

interface InfoPanelProps {
    item: InfoItem;
}

export default function Newspaper({ item }: InfoPanelProps) {
    const title = 'title' in item ? item.title : item.company;
    const subtitle = 'subtitle' in item ? item.subtitle : item.role;
    const year = 'year' in item ? item.year : item.period;
    const skills = 'techStack' in item ? item.techStack : item.skills;
    const isProject = 'techStack' in item;

    const description = item.longDescription || item.description;
    const techString = skills?.join(', ') || '';

    const githubHref = isProject && item.githubUrl && item.githubUrl !== '#' ? item.githubUrl : undefined;
    const liveHref = isProject && item.liveUrl && item.liveUrl !== '#' ? item.liveUrl : undefined;

    const dropCap = description.charAt(0);
    const remainingDesc = description.slice(1);
    const imageCaption = ('imageCaption' in item && item.imageCaption) ? item.imageCaption : `FIG. 1 — ${title}`;

    return (
        <article
            className="w-full h-full relative overflow-y-auto overflow-x-hidden flex flex-col"
            style={{
                backgroundColor: '#F9F7F1',
                color: '#2b2b2b',
                scrollbarWidth: 'thin',
                scrollbarColor: '#2b2b2b transparent',
                fontFamily: 'Georgia, "Times New Roman", serif',
                paddingRight: '4px', // tiny right breathing room
            }}
        >
            {/* ── MASTHEAD ── */}
            <div className="w-full text-center border-b-2 border-t-4 border-[#2b2b2b] pt-4 pb-2 px-6 shrink-0">
                <h1 className="text-4xl font-black tracking-normal uppercase leading-tight">
                    THE DAILY DISPATCH
                </h1>
                <div className="border-t border-[#2b2b2b] mt-3 pt-1 flex justify-between px-2">
                    <span className="text-[9px] uppercase tracking-widest font-bold">VOL. {year || '2024'}</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold">THE TECHNOLOGY EDITION</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold">DEV.LAIR PUBLICATIONS</span>
                </div>
                <div className="w-full h-px bg-[#2b2b2b] mt-1" />
            </div>

            {/* ── HEADLINE ── */}
            <div className="text-center pt-5 pb-4 px-6 shrink-0">
                <h2 className="text-3xl font-extrabold uppercase leading-[1.1] mb-3">
                    {title}
                </h2>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold inline-block border-b border-[#2b2b2b] pb-1">
                    BY HASSAAN ANWAR | {subtitle}
                </p>
            </div>

            {/* ── TWO-COLUMN BODY: left = text, right = image + caption ── */}
            <div
                className="flex-1 min-h-0 flex flex-row px-4 pb-3 gap-0"
                style={{ borderBottom: '1px solid rgba(43,43,43,0.2)' }}
            >
                {/* LEFT COLUMN — body text fills the full column height */}
                <div
                    className="flex-1 pr-4 overflow-y-auto"
                    style={{
                        borderRight: '1px solid rgba(43,43,43,0.25)',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#2b2b2b transparent',
                    }}
                >
                    <div style={{ textAlign: 'justify', fontSize: '13.5px', lineHeight: 1.7 }}>
                        {/* Drop cap */}
                        <span
                            style={{
                                float: 'left',
                                fontSize: '62px',
                                lineHeight: '0.8',
                                marginRight: '6px',
                                marginTop: '6px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                            }}
                        >
                            {dropCap}
                        </span>
                        {remainingDesc}
                        <div style={{ clear: 'both' }} />
                    </div>
                </div>

                {/* RIGHT COLUMN — image pinned at top, caption below */}
                <div
                    className="shrink-0 flex flex-col pl-4 pt-1"
                    style={{ width: '42%' }}
                >
                    {/* Vintage photograph */}
                    <div
                        className="w-full relative bg-white border border-[#2b2b2b] shadow-sm overflow-hidden"
                        style={{ aspectRatio: '4/3' }}
                    >
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: 'radial-gradient(ellipse at center, #667 0%, #111 80%)' }}
                        >
                            <span
                                className={item.coverFont}
                                style={{ fontSize: '30px', color: '#fff', textShadow: '0 0 10px #000' }}
                            >
                                {item.shortTitle}
                            </span>
                        </div>
                        {/* Halftone overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(black 1px, transparent 1px)',
                                backgroundSize: '3px 3px',
                                opacity: 0.35,
                                mixBlendMode: 'overlay',
                            }}
                        />
                    </div>

                    {/* Caption */}
                    <p
                        className="italic text-center uppercase mt-1"
                        style={{ fontSize: '9px', letterSpacing: '0.05em', color: '#555' }}
                    >
                        {imageCaption}
                    </p>
                </div>
            </div>

            {/* ── FOOTER / CLASSIFIEDS ── */}
            <div
                className="w-full px-6 pt-3 pb-4 shrink-0"
                style={{ borderTop: '3px solid #2b2b2b' }}
            >
                <div className="flex justify-between items-end gap-8">
                    {/* Tech specs */}
                    <div className="flex-1">
                        <span className="font-bold text-[10px] uppercase tracking-widest block mb-1">
                            [SYSTEM SPECS]
                        </span>
                        <p className="font-mono text-[11px] leading-relaxed uppercase" style={{ color: '#2b2b2b' }}>
                            {techString}
                        </p>
                    </div>

                    {/* Action links — always rendered, greyed when no real URL */}
                    <div className="flex flex-col gap-1 items-end shrink-0">
                        <motion.a
                            href={githubHref}
                            target={githubHref ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            whileHover={githubHref ? { x: -4 } : {}}
                            className="font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
                            style={{
                                fontSize: '12px',
                                color: githubHref ? '#2b2b2b' : '#aaaaaa',
                                cursor: githubHref ? 'pointer' : 'default',
                                pointerEvents: githubHref ? 'auto' : 'none',
                            }}
                        >
                            <span className="mr-2">»</span> GITHUB
                        </motion.a>
                        <motion.a
                            href={liveHref}
                            target={liveHref ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            whileHover={liveHref ? { x: -4 } : {}}
                            className="font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
                            style={{
                                fontSize: '12px',
                                color: liveHref ? '#2b2b2b' : '#aaaaaa',
                                cursor: liveHref ? 'pointer' : 'default',
                                pointerEvents: liveHref ? 'auto' : 'none',
                            }}
                        >
                            <span className="mr-2">»</span> DEMO PREVIEW
                        </motion.a>
                    </div>
                </div>
            </div>
        </article>
    );
}
