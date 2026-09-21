import { motion } from 'framer-motion';
import type { InfoItem } from '@/data/info';

interface InfoPanelProps {
    item: InfoItem;
}

export default function Broadsheet({ item }: InfoPanelProps) {
    const title = 'title' in item ? item.title : item.company;
    const subtitle = 'subtitle' in item ? item.subtitle : item.role;
    const year = 'year' in item ? item.year : item.period;
    const skills = 'techStack' in item ? item.techStack : item.skills;
    const isProject = 'techStack' in item;

    const description = item.longDescription || item.description;
    const color = item.color || '#333';

    // Even for mock URLs '#', keep the visual buttons visually consistent.
    const canViewSource = isProject && !!item.githubUrl;
    const canViewDemo = isProject && !!item.liveUrl;

    const techString = skills?.join(', ') || '';

    // Extract first letter for Drop Cap
    const dropCap = description.charAt(0);
    const remainingDesc = description.slice(1);

    return (
        <article
            className="w-full h-full relative overflow-y-auto overflow-x-hidden p-8 flex flex-col font-serif"
            style={{
                backgroundColor: '#F9F7F1', // Off-white parchment
                color: '#2b2b2b',           // Charcoal ink
                scrollbarWidth: 'thin',
                scrollbarColor: '#2b2b2b transparent'
            }}
        >
            {/* 
        ========================================
        THE MASTHEAD
        ========================================
      */}
            <div className="w-full text-center mb-8 border-b-2 border-t-4 border-[#2b2b2b] pt-4 pb-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-normal uppercase leading-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    THE DAILY DISPATCH
                </h1>
                {/* Double bottom border metadata line */}
                <div className="border-t border-[#2b2b2b] mt-3 pt-1 flex justify-between px-2">
                    <span className="text-[9px] uppercase tracking-widest font-bold">VOL. {year || '2024'}</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold">THE TECHNOLOGY EDITION</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold">DEV.LAIR PUBLICATIONS</span>
                </div>
                <div className="w-full h-px bg-[#2b2b2b] mt-1" />
            </div>

            {/* 
        ========================================
        THE HEADLINE
        ========================================
      */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold uppercase leading-[1.1] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {title}
                </h2>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-center border-b border-[#2b2b2b] inline-block pb-1">
                    BY HASSAAN ANWAR | SOFTWARE ENGINEERING INTERN
                </p>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

                {/* Left: Vintage Photograph Graphic (Col 3) */}
                <div className="lg:col-span-3">
                    <div className="w-full aspect-[4/3] overflow-hidden grayscale contrast-125 sepia-0 relative bg-white shadow-sm p-1 border border-[#2b2b2b]">
                        <div className="w-full h-full flex flex-col justify-center items-center" style={{
                            background: `radial-gradient(ellipse at center, #777 0%, #111 100%)`
                        }}>
                            <span className={item.coverFont} style={{ fontSize: '32px', color: '#fff', textShadow: `0 0 8px #000` }}>
                                {item.shortTitle}
                            </span>
                        </div>

                        <div className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay" style={{
                            backgroundImage: 'radial-gradient(black 1px, transparent 1px)',
                            backgroundSize: '3px 3px'
                        }} />
                    </div>
                    <p className="text-[9px] italic tracking-wide mt-2 text-center text-[#2b2b2b] uppercase">
                        {'imageCaption' in item ? item.imageCaption : `FIG 1.0 — ${title}`}
                    </p>
                </div>

                {/* Right: Editorial Body Copy (Col 9) */}
                <div className="lg:col-span-9 text-justify text-sm leading-relaxed text-[#2b2b2b]">
                    <div className="indent-0">
                        <span className="float-left text-5xl leading-none mr-2 font-black uppercase" style={{ marginTop: '0.1rem' }}>
                            {dropCap}
                        </span>
                        {remainingDesc}
                    </div>
                </div>

            </div>

            {/* Spacer to push classifieds downwards if natural content is short */}
            <div className="flex-1" />

            {/* 
        ========================================
        THE CLASSIFIEDS (FOOTER)
        ========================================
      */}
            <div className="w-full border-t-[3px] border-[#2b2b2b] pt-4 mt-auto">
                <div className="flex justify-between items-end gap-8">

                    {/* Stock Ticker style Tech Stack */}
                    <div className="flex-1">
                        <span className="font-bold text-[10px] uppercase tracking-widest block mb-1">
                            [SYSTEM SPECS]
                        </span>
                        <p className="font-mono text-[11px] leading-relaxed uppercase">
                            {techString}
                        </p>
                    </div>

                    {/* Pure Action Links (Text-only, no borders) */}
                    {(canViewSource || canViewDemo) && (
                        <div className="flex flex-col gap-1 items-end shrink-0">
                            {canViewSource && (
                                <motion.a
                                    href={item.githubUrl}
                                    target="_blank"
                                    whileHover={{ x: -4 }}
                                    className="text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 cursor-pointer"
                                >
                                    <span className="mr-2">»</span> GITHUB
                                </motion.a>
                            )}
                            {canViewDemo && (
                                <motion.a
                                    href={item.liveUrl}
                                    target="_blank"
                                    whileHover={{ x: -4 }}
                                    className="text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 cursor-pointer"
                                >
                                    <span className="mr-2">»</span> DEMO PREVIEW
                                </motion.a>
                            )}
                        </div>
                    )}
                </div>
            </div>

        </article>
    );
}
