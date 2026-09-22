import { motion } from 'framer-motion';

// Helper to handle markdown bolding
function parseHighlights(text: string) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <span key={i} style={{ color: '#000', fontWeight: 800 }}>
                    {part.slice(2, -2)}
                </span>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

export default function GatefoldLiner({
    item,
    isProject
}: {
    item: any;
    isProject: boolean;
}) {
    // Determine variables safely across projects vs experience
    const typeLabel = isProject ? 'OPEN-SOURCE ARCHITECTURE' : 'PROFESSIONAL EXPERIENCE';
    const year = item.year || item.period;
    const title = item.title || item.company;
    const subtitle = item.subtitle || item.role;

    const rawDesc = item.longDescription || item.description;
    let paragraphs: string[] = [];
    if (Array.isArray(rawDesc)) {
        paragraphs = rawDesc;
    } else if (rawDesc.includes('\n')) {
        paragraphs = rawDesc.split('\n').map((s: string) => s.trim()).filter(Boolean);
    } else {
        paragraphs = [rawDesc];
    }

    const color = item.color || '#333';

    // Format Tech Stack into credits
    const techStack = isProject ? (item.techStack || []) : (item.skills || []);
    let engineered: string[] = [];
    let mixed: string[] = [];
    let mastered: string[] = [];
    techStack.forEach((t: string, i: number) => {
        if (i % 3 === 0) engineered.push(t);
        else if (i % 3 === 1) mixed.push(t);
        else mastered.push(t);
    });

    // Check if this is the personal profile to show Portfolio Tech Stack labels
    const isProfile = item.infoCategory === 'PERSONAL PROFILE';
    const personnelLabel = isProfile ? 'PORTFOLIO TECH STACK' : 'PERSONNEL & CREDITS';
    const engineeringLabel = isProfile ? 'FRONTEND:' : 'ENGINEERED & COMPOSED WITH:';
    const mixingLabel = isProfile ? 'ANIMATION SERVER:' : 'MIXED AT:';
    const masterLabel = isProfile ? 'DEPLOYED ON:' : 'MASTERED AT:';

    return (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: -5 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full relative rounded-xl shadow-2xl flex flex-col"
            style={{
                // Textured paper-card background
                background: `
                    linear-gradient(135deg, rgba(235,232,225,0.98), rgba(220,215,205,0.96)),
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
                `,
                color: '#1a1c1d',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,1)',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '40px'
            }}
        >
            {/* Top Catalog Badge */}
            <div className="mb-6">
                <span
                    className="font-mono px-3 py-1 rounded-full whitespace-nowrap"
                    style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.12)', letterSpacing: 1, fontSize: '11px', fontWeight: 600, color: '#333' }}
                >
                    {item.catalogId || 'CAT: PROJ-01'}
                </span>
            </div>

            {/* Editorial Headers */}
            <div className="mb-4">
                <h1 className="font-editorial leading-none" style={{ fontSize: '56px', fontWeight: 800, color: '#1a1c1d', letterSpacing: '-0.03em' }}>
                    {title}
                </h1>
                <h2 className="font-editorial italic" style={{ fontSize: '28px', color: '#3a3c40', marginTop: '6px' }}>
                    {subtitle}
                </h2>
                <p className="font-mono mt-6 mb-4" style={{ fontSize: '13px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    RELEASED: {year} &bull; FORMAT: {typeLabel}
                </p>
            </div>

            {/* Top Divider */}
            <hr className="w-full border-t border-[rgba(0,0,0,0.8)] opacity-20 mb-6" />

            {/* Central Content Container - Full Width Body Copy */}
            <div className="flex-1 w-full flex flex-col h-full overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.2) transparent' }}>
                <div
                    className="flex flex-col gap-5 font-sans leading-relaxed pb-4"
                    style={{
                        fontSize: '16px',
                        color: '#2a2a2b',
                        fontWeight: 500,
                        lineHeight: 1.6,
                        textAlign: 'left'
                    }}
                >
                    {paragraphs.map((p, idx) => (
                        <p key={idx}>{parseHighlights(p)}</p>
                    ))}
                </div>
            </div>

            {/* Bottom Divider */}
            <hr className="w-full border-t border-[rgba(0,0,0,0.8)] opacity-20 mt-4 mb-4" />

            {/* Bottom Credits / Tech Stack */}
            <div className="w-full flex flex-row justify-between items-end relative pb-2">

                <div className="font-mono uppercase leading-relaxed flex-1 tracking-widest text-black" style={{ fontSize: '11px', maxWidth: '65%' }}>
                    <span className="font-extrabold mr-2">{personnelLabel}</span> |
                    {engineered.length > 0 && <span className="text-[#333]"> <strong className="text-black">{engineeringLabel}</strong> {engineered.join(', ')} |</span>}
                    {mixed.length > 0 && <span className="text-[#333]"> <strong className="text-black">{mixingLabel}</strong> {mixed.join(', ')} |</span>}
                    {mastered.length > 0 && <span className="text-[#333]"> <strong className="text-black">{masterLabel}</strong> {mastered.join(', ')}</span>}
                </div>

                {/* Peelable Promo Stickers */}
                <div className="flex flex-row gap-3 absolute bottom-0 right-0 z-10" style={{ transform: 'translateY(16px)' }}>
                    {/* View Source Code Button (Red hype sticker) */}
                    {item.githubUrl && (
                        <motion.a
                            href={item.githubUrl}
                            target="_blank"
                            whileHover={{ scale: 1.05, rotate: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className="font-bold flex items-center justify-center text-center cursor-pointer pointer-events-auto shadow-2xl"
                            style={{
                                background: '#d94132', // bright sticker red
                                color: '#fff',
                                width: '110px',
                                height: '46px',
                                borderRadius: '4px',
                                transform: 'rotate(-3deg)',
                                fontSize: '12px',
                                lineHeight: 1.1,
                                borderTop: '2px solid rgba(255,255,255,0.3)',
                                borderLeft: '1px solid rgba(255,255,255,0.3)',
                                textTransform: 'uppercase',
                            }}
                        >
                            VIEW<br />SOURCE CODE
                        </motion.a>
                    )}

                    {/* Demo Available Button (Green hype sticker) */}
                    {item.liveUrl && (
                        <motion.a
                            href={item.liveUrl}
                            target="_blank"
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="font-bold flex items-center justify-center text-center cursor-pointer pointer-events-auto shadow-2xl"
                            style={{
                                background: '#47b561', // bright sticker green
                                color: '#fff',
                                width: '110px',
                                height: '46px',
                                borderRadius: '4px',
                                transform: 'rotate(2deg)',
                                fontSize: '12px',
                                lineHeight: 1.1,
                                borderTop: '2px solid rgba(255,255,255,0.3)',
                                borderLeft: '1px solid rgba(255,255,255,0.3)',
                                textTransform: 'uppercase',
                            }}
                        >
                            DEMO<br />AVAILABLE
                        </motion.a>
                    )}
                </div>
            </div>

        </motion.div>
    );
}
