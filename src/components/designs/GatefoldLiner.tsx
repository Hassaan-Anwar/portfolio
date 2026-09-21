import { motion } from 'framer-motion';

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

    const description = item.longDescription || item.description;
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

            {/* Central Content Grid Container */}
            <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden min-h-0">

                {/* Left: Vintage Photograph Graphic (Col 3) */}
                <div className="lg:col-span-3 flex flex-col gap-2">
                    <div
                        className="w-full relative rounded-sm overflow-hidden flex flex-col justify-center items-center"
                        style={{
                            aspectRatio: '16 / 10', // Landscape format
                            padding: '16px',
                            background: '#111', // Heavy black film border
                            boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
                        }}
                    >
                        {/* Film Border artifacts */}
                        <div className="absolute top-2 left-4 text-[#555] font-mono text-[7px]">OPALUX FILM-1305</div>
                        <div className="absolute top-2 right-4 text-[#555] font-mono text-[7px]">48</div>

                        <div className="absolute bottom-2 left-4 flex gap-1.5">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2.5 h-1.5 bg-[#222]" />)}
                        </div>

                        {/* Internal image/preview window */}
                        <div
                            className="w-full h-full relative"
                            style={{
                                background: `radial-gradient(circle at 50% 50%, ${color}33, #0a0a0c)`,
                                border: `1px solid ${color}40`,
                                overflow: 'hidden'
                            }}
                        >
                            {/* Graphic inside photo */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={item.coverFont} style={{ fontSize: '64px', color: '#fff', opacity: 0.9, textShadow: `0 4px 16px ${color}` }}>
                                    {item.shortTitle}
                                </span>
                            </div>

                            {/* CRT/Scanline internal overlay */}
                            <div className="absolute inset-0 pointer-events-none" style={{
                                backgroundImage: `linear-gradient(transparent 50%, rgba(0,0,0,0.3) 50%)`,
                                backgroundSize: '100% 4px',
                            }} />
                        </div>
                    </div>
                    {/* Tiny caption under photograph */}
                    <div className="text-center font-mono uppercase mt-1" style={{ fontSize: '8px', color: '#555', letterSpacing: 1, fontWeight: 'bold' }}>
                        {'imageCaption' in item ? item.imageCaption : `FIG 1.0 — ${title}`}
                    </div>
                </div>

                {/* Right: Editorial Body Copy (Col 9) */}
                <div className="lg:col-span-9 flex flex-col h-full overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.2) transparent' }}>
                    <div
                        className="font-sans leading-relaxed"
                        style={{
                            fontSize: '16px',
                            color: '#111',
                            fontWeight: 500,
                            lineHeight: 1.6,
                            textAlign: 'left' // Explicitly left align instead of justify for cleaner reading
                        }}
                    >
                        {description}
                    </div>
                </div>
            </div>

            {/* Bottom Divider */}
            <hr className="w-full border-t border-[rgba(0,0,0,0.8)] opacity-20 mt-4 mb-4" />

            {/* Bottom Credits / Tech Stack */}
            <div className="w-full flex flex-row justify-between items-end relative pb-2">

                <div className="font-mono uppercase leading-relaxed flex-1 tracking-widest text-black" style={{ fontSize: '11px', maxWidth: '65%' }}>
                    <span className="font-extrabold mr-2">PERSONNEL & CREDITS</span> |
                    {engineered.length > 0 && <span className="text-[#333]"> <strong className="text-black">ENGINEERED & COMPOSED WITH:</strong> {engineered.join(', ')} |</span>}
                    {mixed.length > 0 && <span className="text-[#333]"> <strong className="text-black">MIXED AT:</strong> {mixed.join(', ')} |</span>}
                    {mastered.length > 0 && <span className="text-[#333]"> <strong className="text-black">MASTERED AT:</strong> {mastered.join(', ')}</span>}
                </div>

                {/* Peelable Promo Stickers */}
                <div className="flex flex-row gap-3 absolute bottom-0 right-0 z-10" style={{ transform: 'translateY(16px)' }}>
                    {/* View Source Code Button (Red hype sticker) */}
                    <motion.a
                        href={item.githubUrl || '#'}
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

                    {/* Demo Available Button (Green hype sticker) */}
                    <motion.a
                        href={item.liveUrl || '#'}
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
                </div>
            </div>

        </motion.div>
    );
}
