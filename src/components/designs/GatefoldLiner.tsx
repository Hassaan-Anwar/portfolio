import { motion } from 'framer-motion';

// ─── Helper: Markdown bold parser ────────────────────────────────────────────
function parseHighlights(text: string) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={i} style={{ color: '#000', fontWeight: 800 }}>{part.slice(2, -2)}</span>;
        }
        return <span key={i}>{part}</span>;
    });
}

// ─── Press-Kit Profile Layout ────────────────────────────────────────────────
function PressKitProfile({ item }: { item: any }) {
    const color = item.color || '#333';

    return (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: -5 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full relative rounded-xl shadow-2xl flex flex-col"
            style={{
                background: `
                    linear-gradient(135deg, rgba(235,232,225,0.98), rgba(220,215,205,0.96)),
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
                `,
                color: '#1a1c1d',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,1)',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '32px 36px 20px',
                fontFamily: "'IBM Plex Mono', monospace",
                overflowY: 'auto',
            }}
        >
            {/* ── CATALOG BADGE ─────────────────────────────────────────── */}
            <div style={{ marginBottom: '4px' }}>
                <span
                    className="font-mono"
                    style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase' }}
                >
                    {item.catalogId || 'ME-01'}
                </span>
            </div>

            {/* ── NAME + ROLE ───────────────────────────────────────────── */}
            <div style={{ marginBottom: '8px' }}>
                <h1
                    className="font-editorial leading-none"
                    style={{ fontSize: '38px', fontWeight: 800, color: '#1a1c1d', letterSpacing: '-0.03em' }}
                >
                    Hassaan Anwar
                </h1>
                <h2
                    className="font-editorial italic"
                    style={{ fontSize: '17px', color: '#3a3c40', marginTop: '2px' }}
                >
                    AI Engineer
                </h2>
            </div>

            {/* ── DIVIDER ───────────────────────────────────────────────── */}
            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.25)', marginBottom: '14px' }} />

            {/* ── MAIN 2-COL BODY ──────────────────────────────────────── */}
            <div
                className="press-kit-body"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '20px',
                }}
            >
                {/* LEFT: Bio + Tiny Hint */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    {/* HEADLINE label */}
                    <div>
                        <p className="font-mono" style={{ fontSize: '9px', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '4px' }}>HEADLINE</p>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a1c1d', lineHeight: 1.3 }}>
                            Building intelligent systems at the intersection of AI and software engineering.
                        </p>
                    </div>

                    {/* Bio paragraphs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', lineHeight: 1.6, color: '#2a2a2b', textAlign: 'justify' }}>
                        <p>
                            I'm a <strong>FAST-NUCES Computer Science graduate</strong> specializing in production-grade AI pipelines and robust backend infrastructure. From fine-tuning models for conversational agents to architecting scalable microservices, my work bridges the gap between research concepts and real-world deployment.
                        </p>
                        <p>
                            This portfolio is built as an interactive record collection. Flip through the crates, then play a disc on the turntable to read its liner notes.
                        </p>
                    </div>
                </div>

                {/* RIGHT: Polaroid + Session Credits */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* Polaroid placeholder */}
                    <div
                        style={{
                            background: '#fff',
                            padding: '8px 8px 28px',
                            boxShadow: '2px 4px 12px rgba(0,0,0,0.25)',
                            transform: 'rotate(2.5deg)',
                            alignSelf: 'flex-end',
                            width: '90%',
                        }}
                    >
                        <img
                            src="/profile-modified.jpg"
                            alt="Hassaan Anwar"
                            style={{
                                width: '100%',
                                aspectRatio: '1 / 1',
                                objectFit: 'cover',
                                filter: 'grayscale(100%) contrast(1.1) brightness(0.95)',
                            }}
                        />
                        <p
                            className="font-mono"
                            style={{ fontSize: '8px', textAlign: 'center', color: '#888', marginTop: '6px', fontStyle: 'italic' }}
                        >
                            Islamabad, 2024
                        </p>
                    </div>

                    {/* SESSION CREDITS */}
                    <div>
                        <p className="font-mono" style={{ fontSize: '9px', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '6px' }}>SESSION CREDITS</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                            {[
                                ['PRIMARY ENGINEER', 'Python (Core)'],
                                ['BACKEND SERVICES', 'FastAPI, REST APIs'],
                                ['FRONTEND', 'TypeScript, React'],
                                ['AI & ML MODELS', 'Gen AI, LLMs, RAG'],
                                ['CLOUD ARCHITECT', 'AWS, Azure, K8s'],
                                ['INFRASTRUCTURE', 'Docker, CI/CD'],
                            ].map(([role, tech]) => (
                                <div
                                    key={role}
                                    style={{
                                        borderTop: '1px dashed rgba(0,0,0,0.2)',
                                        padding: '4px 0',
                                    }}
                                >
                                    <p className="font-mono" style={{ fontSize: '8px', fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{role}</p>
                                    <p className="font-mono" style={{ fontSize: '8.5px', color: '#555' }}>{tech}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── DIVIDER ───────────────────────────────────────────────── */}
            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.2)', margin: '14px 0 10px' }} />

            {/* ── FOOTER ──────────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>

                {/* Mastered at line + Barcode */}
                <div>
                    <p className="font-mono" style={{ fontSize: '7.5px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Mastered at: FAST-NUCES &nbsp;|&nbsp; ANIMATION SERVER: FRAMER MOTION &nbsp;|&nbsp; EXTERNAL CREDITS: TYPESCRIPT, REACT
                    </p>
                    {/* Barcode SVG built with thin/thick bars */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        <svg width="90" height="28" viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {[2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1].map((w, i) => {
                                let x = 0;
                                for (let j = 0; j < i; j++) x += [2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1][j];
                                return i % 2 === 0 ? (
                                    <rect key={i} x={x} y="0" width={w} height="22" fill="#1a1c1d" />
                                ) : null;
                            })}
                            <text x="0" y="28" fontFamily="monospace" fontSize="6" fill="#555">17890 044086</text>
                        </svg>
                        <p className="font-mono" style={{ fontSize: '7px', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>
                            PRINTED IN ISLAMABAD
                        </p>
                    </div>
                </div>

                {/* Stamp + Signature */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    {/* Circular stamp */}
                    <div style={{ position: 'relative', width: '54px', height: '54px' }}>
                        <svg viewBox="0 0 100 100" width="54" height="54">
                            <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="5" opacity="0.7" />
                            <circle cx="50" cy="50" r="36" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
                            <text
                                textAnchor="middle"
                                x="50" y="47"
                                fontFamily="monospace"
                                fontSize="9"
                                fontWeight="bold"
                                fill={color}
                                textLength="44"
                                lengthAdjust="spacing"
                            >HASSAAN ANWAR</text>
                            <text
                                textAnchor="middle"
                                x="50" y="59"
                                fontFamily="monospace"
                                fontSize="8"
                                fill={color}
                                opacity="0.8"
                            >APPROVED 2024</text>
                            {/* Star */}
                            <polygon points="50,16 52,22 58,22 53,26 55,32 50,28 45,32 47,26 42,22 48,22" fill={color} opacity="0.8" />
                        </svg>
                    </div>

                    {/* Handwritten-style signature */}
                    <p
                        style={{
                            fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                            fontSize: '22px',
                            color: '#1a1c1d',
                            lineHeight: 1,
                            marginTop: '-4px',
                        }}
                    >
                        H. Anwar
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Original Gatefold Layout (for Projects / Experience) ────────────────────
function StandardGatefold({ item, isProject }: { item: any; isProject: boolean }) {
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
    const techStack = isProject ? (item.techStack || []) : (item.skills || []);
    let engineered: string[] = [], mixed: string[] = [], mastered: string[] = [];
    techStack.forEach((t: string, i: number) => {
        if (i % 3 === 0) engineered.push(t);
        else if (i % 3 === 1) mixed.push(t);
        else mastered.push(t);
    });

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
                background: `
                    linear-gradient(135deg, rgba(235,232,225,0.98), rgba(220,215,205,0.96)),
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
                `,
                color: '#1a1c1d',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,1)',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '40px',
                overflowY: 'auto',
            }}
        >
            <div className="mb-6">
                <span
                    className="font-mono px-3 py-1 rounded-full whitespace-nowrap"
                    style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.12)', letterSpacing: 1, fontSize: '11px', fontWeight: 600, color: '#333' }}
                >
                    {item.catalogId || 'CAT: PROJ-01'}
                </span>
            </div>

            <div className="mb-4">
                <h1 className="font-editorial leading-none gatefold-title" style={{ fontSize: '56px', fontWeight: 800, color: '#1a1c1d', letterSpacing: '-0.03em' }}>
                    {title}
                </h1>
                <h2 className="font-editorial italic gatefold-subtitle" style={{ fontSize: '28px', color: '#3a3c40', marginTop: '6px' }}>
                    {subtitle}
                </h2>
                <p className="font-mono mt-6 mb-4" style={{ fontSize: '13px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    RELEASED: {year} &bull; FORMAT: {typeLabel}
                </p>
            </div>

            <hr className="w-full border-t border-[rgba(0,0,0,0.8)] opacity-20 mb-6" />

            <div className="w-full flex flex-col pr-4">
                <div className="flex flex-col gap-5 font-sans leading-relaxed pb-4" style={{ fontSize: '16px', color: '#2a2a2b', fontWeight: 500, lineHeight: 1.6 }}>
                    {paragraphs.map((p, idx) => (
                        <p key={idx}>{parseHighlights(p)}</p>
                    ))}
                </div>
            </div>

            <hr className="w-full border-t border-[rgba(0,0,0,0.8)] opacity-20 mt-4 mb-4" />

            <div className="w-full flex flex-row justify-between items-end relative pb-2 gatefold-footer">
                <div className="font-mono uppercase leading-relaxed flex-1 tracking-widest text-black" style={{ fontSize: '11px', maxWidth: '65%' }}>
                    <span className="font-extrabold mr-2">{personnelLabel}</span> |
                    {engineered.length > 0 && <span className="text-[#333]"> <strong className="text-black">{engineeringLabel}</strong> {engineered.join(', ')} |</span>}
                    {mixed.length > 0 && <span className="text-[#333]"> <strong className="text-black">{mixingLabel}</strong> {mixed.join(', ')} |</span>}
                    {mastered.length > 0 && <span className="text-[#333]"> <strong className="text-black">{masterLabel}</strong> {mastered.join(', ')}</span>}
                </div>

                <div className="flex flex-row gap-3 absolute bottom-0 right-0 z-10" style={{ transform: 'translateY(16px)' }}>
                    {item.githubUrl && (
                        <motion.a
                            href={item.githubUrl}
                            target="_blank"
                            whileHover={{ scale: 1.05, rotate: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className="font-bold flex items-center justify-center text-center cursor-pointer pointer-events-auto shadow-2xl"
                            style={{ background: '#d94132', color: '#fff', width: '110px', height: '46px', borderRadius: '4px', transform: 'rotate(-3deg)', fontSize: '12px', lineHeight: 1.1, borderTop: '2px solid rgba(255,255,255,0.3)', borderLeft: '1px solid rgba(255,255,255,0.3)', textTransform: 'uppercase' }}
                        >
                            VIEW<br />SOURCE CODE
                        </motion.a>
                    )}
                    {item.liveUrl && (
                        <motion.a
                            href={item.liveUrl}
                            target="_blank"
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="font-bold flex items-center justify-center text-center cursor-pointer pointer-events-auto shadow-2xl"
                            style={{ background: '#47b561', color: '#fff', width: '110px', height: '46px', borderRadius: '4px', transform: 'rotate(2deg)', fontSize: '12px', lineHeight: 1.1, borderTop: '2px solid rgba(255,255,255,0.3)', borderLeft: '1px solid rgba(255,255,255,0.3)', textTransform: 'uppercase' }}
                        >
                            DEMO<br />AVAILABLE
                        </motion.a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Entry Point ─────────────────────────────────────────────────────────────
export default function GatefoldLiner({ item, isProject }: { item: any; isProject: boolean }) {
    const isProfile = item.infoCategory === 'PERSONAL PROFILE';
    if (isProfile) return <PressKitProfile item={item} />;
    return <StandardGatefold item={item} isProject={isProject} />;
}
