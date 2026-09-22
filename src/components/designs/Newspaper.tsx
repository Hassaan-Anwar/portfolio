'use client';
import { motion } from 'framer-motion';
import type { InfoItem } from '@/data/info';
import { Fragment } from 'react';

interface InfoPanelProps {
    item: InfoItem;
}

export default function Newspaper({ item }: InfoPanelProps) {
    const title = 'title' in item ? item.title : item.company;
    const subtitle = 'subtitle' in item ? item.subtitle : item.role;
    const year = 'year' in item ? item.year : item.period;
    const skills = 'techStack' in item ? item.techStack : item.skills;
    const isProject = 'techStack' in item;

    const rawDesc = item.longDescription || item.description;
    const paragraphs: string[] = Array.isArray(rawDesc) ? rawDesc : [rawDesc];
    const techString = skills?.join(', ') || '';

    // Project accent color for highlights
    const accentColor = item.color || '#2b2b2b';

    const githubUrl = 'githubUrl' in item ? item.githubUrl : undefined;
    const liveUrl = 'liveUrl' in item ? item.liveUrl : undefined;

    const githubHref = githubUrl && githubUrl !== '#' ? githubUrl : undefined;
    const liveHref = liveUrl && liveUrl !== '#' ? liveUrl : undefined;

    const dropCap = paragraphs[0].charAt(0);
    const firstRest = paragraphs[0].slice(1);
    const imageCaption = ('imageCaption' in item && item.imageCaption)
        ? item.imageCaption
        : `FIG. 1 — ${title}`;

    // Simple parser to turn **text** into bold highlighted text
    const parseHighlights = (text: string) => {
        return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={i} style={{ color: '#111', fontWeight: 800, borderBottom: `2px solid ${accentColor}88` }}>
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return <Fragment key={i}>{part}</Fragment>;
        });
    };

    return (
        <article
            className="w-full h-full relative overflow-y-auto overflow-x-hidden flex flex-col"
            style={{
                backgroundColor: '#F9F7F1',
                color: '#2b2b2b',
                scrollbarWidth: 'thin',
                scrollbarColor: '#2b2b2b transparent',
                fontFamily: 'Georgia, "Times New Roman", serif',
            }}
        >
            {/* ── MASTHEAD ── */}
            <div className="w-full text-center border-b-2 border-t-4 border-[#2b2b2b] pt-4 pb-2 px-6 shrink-0">
                <h1 className="font-black tracking-normal uppercase leading-tight" style={{ fontSize: '36px', color: '#111' }}>
                    {('newspaperData' in item && item.newspaperData?.masthead) ? item.newspaperData.masthead : 'THE DAILY DISPATCH'}
                </h1>
                <div className="border-t border-[#2b2b2b] mt-3 pt-1 flex justify-between px-2">
                    <span className="text-[9px] uppercase tracking-widest font-bold">VOL. {year || '2024'}</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold">{('newspaperData' in item && item.newspaperData?.edition) ? item.newspaperData.edition : 'THE TECHNOLOGY EDITION'}</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold">DEV.LAIR PUBLICATIONS</span>
                </div>
                <div className="w-full h-px bg-[#2b2b2b] mt-1" />
            </div>

            {/* ── HEADLINE ── */}
            <div className="text-center pt-5 pb-4 px-6 shrink-0">
                <h2 className="font-extrabold uppercase leading-[1.1] mb-3" style={{ fontSize: '28px', color: '#111' }}>
                    {title}
                </h2>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold inline-block border-b border-[#2b2b2b] pb-1">
                    {('newspaperData' in item && item.newspaperData?.byline) ? item.newspaperData.byline : `BY HASSAAN ANWAR | ${subtitle}`}
                </p>
            </div>

            {/* ── BODY (FLOAT LAYOUT) ── */}
            <div
                className="flex-1 min-h-0 overflow-y-auto"
                style={{
                    borderBottom: '1px solid rgba(43,43,43,0.3)',
                    padding: '0 20px 12px 20px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#444 transparent',
                }}
            >
                {/* RIGHT FLOATED IMAGE */}
                <div
                    className="shrink-0 flex flex-col float-right"
                    style={{ width: '45%', marginLeft: '20px', marginBottom: '12px', paddingTop: '4px' }}
                >
                    {/* Vintage photograph */}
                    <div
                        className="w-full relative overflow-hidden"
                        style={{
                            aspectRatio: '4/3',
                            border: '1px solid #2b2b2b',
                            boxShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                            backgroundColor: '#fff',
                        }}
                    >
                        {item.imageSrc ? (
                            <img
                                src={item.imageSrc}
                                alt={item.shortTitle}
                                className="w-full h-full object-cover"
                                style={{ filter: 'grayscale(100%) contrast(1.2) brightness(0.9)' }}
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ background: 'radial-gradient(ellipse at center, #777 0%, #111 80%)' }}
                            >
                                <span
                                    className={item.coverFont}
                                    style={{
                                        fontSize: '30px',
                                        color: '#fff',
                                        textShadow: '0 0 10px #000',
                                    }}
                                >
                                    {item.shortTitle}
                                </span>
                            </div>
                        )}
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
                        className="italic text-center mt-1.5 font-bold"
                        style={{ fontSize: '9px', letterSpacing: '0.05em', color: '#555' }}
                    >
                        {imageCaption}
                    </p>
                </div>

                {/* Left flowing text content */}
                <div>
                    {/* First paragraph with drop cap */}
                    <p style={{ textAlign: 'justify', fontSize: '14px', lineHeight: 1.7, color: '#333' }}>
                        <span
                            style={{
                                float: 'left',
                                fontSize: '64px',
                                lineHeight: '0.8',
                                marginRight: '7px',
                                marginTop: '7px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                color: '#111',
                            }}
                        >
                            {dropCap}
                        </span>
                        {parseHighlights(firstRest)}
                        {/* No clear:both here because we want it to wrap the image */}
                    </p>
                    {/* Additional paragraphs */}
                    {paragraphs.slice(1).map((para, i) => (
                        <p key={i} style={{ textAlign: 'justify', fontSize: '14px', lineHeight: 1.7, color: '#333', marginTop: '12px' }}>
                            {parseHighlights(para)}
                        </p>
                    ))}
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
                        <span
                            className="font-bold text-[10px] uppercase tracking-widest block mb-1"
                            style={{ color: '#2b2b2b', fontFamily: '"JetBrains Mono", monospace' }}
                        >
                            [SYSTEM SPECS]
                        </span>
                        <p
                            className="text-[11px] leading-relaxed uppercase font-bold"
                            style={{
                                color: '#444',
                                fontFamily: '"JetBrains Mono", monospace',
                            }}
                        >
                            {techString}
                        </p>
                    </div>

                    {/* Action links — always visible */}
                    <div className="flex flex-col gap-1 items-end shrink-0">
                        {githubHref && (
                            <motion.a
                                href={githubHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ x: -2 }}
                                className="font-black uppercase tracking-widest"
                                style={{
                                    fontSize: '13px',
                                    fontFamily: '"JetBrains Mono", monospace',
                                    color: '#111',
                                    textDecoration: 'underline',
                                    textDecorationThickness: '2px',
                                    textUnderlineOffset: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                <span className="mr-2">»</span> GITHUB
                            </motion.a>
                        )}
                        {liveHref && (
                            <motion.a
                                href={liveHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ x: -2 }}
                                className="font-black uppercase tracking-widest"
                                style={{
                                    fontSize: '13px',
                                    fontFamily: '"JetBrains Mono", monospace',
                                    color: '#111',
                                    textDecoration: 'underline',
                                    textDecorationThickness: '2px',
                                    textUnderlineOffset: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                <span className="mr-2">»</span> DEMO PREVIEW
                            </motion.a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
