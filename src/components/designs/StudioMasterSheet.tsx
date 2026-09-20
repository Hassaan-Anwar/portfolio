import { motion } from 'framer-motion';
import type { InfoItem } from '@/data/info';

interface InfoPanelProps {
    item: InfoItem;
}

export default function StudioMasterSheet({ item }: InfoPanelProps) {
    const title = 'title' in item ? item.title : item.company;
    const subtitle = 'subtitle' in item ? item.subtitle : item.role;
    const year = 'year' in item ? item.year : item.period;
    const skills = 'techStack' in item ? item.techStack : item.skills;
    const isProject = 'techStack' in item;

    const description = item.longDescription || item.description;
    const color = item.color || '#333';

    const canViewSource = isProject && !!item.githubUrl;
    const canViewDemo = isProject && !!item.liveUrl;

    // Format Description into Log bullet points
    const rawLogs = description.split(/\.\s+/).filter(Boolean);
    const logs = [];
    for (let i = 0; i < rawLogs.length; i += 2) {
        logs.push(rawLogs.slice(i, i + 2).join('. ') + (rawLogs[i + 1] ? '.' : '.'));
    }

    return (
        <article
            className="w-full h-full relative flex rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] font-mono overflow-hidden"
            style={{
                backgroundColor: '#27272a', // Dark zinc base
                border: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            {/* Left Rack Panel */}
            <div className="w-10 shrink-0 flex flex-col justify-between py-16 border-r border-[#111]" style={{ background: 'linear-gradient(90deg, #18181b, #27272a)' }}>
                <div className="mx-auto w-5 h-2.5 bg-black/80 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1),0_1px_rgba(255,255,255,0.1)]" />
                <div className="mx-auto w-5 h-2.5 bg-black/80 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1),0_1px_rgba(255,255,255,0.1)]" />
            </div>

            <div className="flex-1 flex flex-col p-8 min-w-0 bg-[#27272a] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">

                {/* Top Header Block (No border grid) */}
                <div className="w-full relative mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#e4e4e7] rounded-sm text-black px-3 py-1 font-bold tracking-widest text-[11px] shadow-sm">
                            TAPE HEADER
                        </div>
                        <div className="text-right font-mono text-[11px] tracking-widest text-zinc-400 mt-1">
                            PROJECT ID: {item.catalogId || '#00'} &nbsp;|&nbsp; TAKE: FINAL &nbsp;|&nbsp; DATE: {year}
                        </div>
                    </div>

                    <div className="pb-2">
                        <h1 className="font-mono text-5xl mb-2 text-white font-bold tracking-tight">{title}</h1>
                        <h2 className="font-mono text-xl text-zinc-400 tracking-wide">{subtitle}</h2>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mb-8 shadow-[0_1px_0_rgba(0,0,0,0.5)]" />

                {/* Middle Display Area (Monitor + Logs) */}
                <div className="flex flex-row gap-10 mb-8 flex-1 min-h-0">

                    {/* Monitor */}
                    <div className="flex flex-col items-center gap-3 w-1/2 max-w-[360px] shrink-0">
                        {/* Thick Bezel */}
                        <div className="w-full rounded-2xl bg-[#111] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.7),inset_0_2px_rgba(255,255,255,0.1)] border border-[#000]">
                            <div className="w-full aspect-[4/3] rounded-lg relative overflow-hidden bg-black shadow-[inset_0_0_30px_rgba(0,0,0,1)] border border-white/5">

                                {/* Screen Content */}
                                <div className="w-full h-full flex flex-col justify-center items-center relative z-0" style={{
                                    background: `radial-gradient(ellipse at center, ${color}44 0%, #000 80%)`
                                }}>
                                    <span className={item.coverFont} style={{ fontSize: '64px', color: '#fff', textShadow: `0 0 16px ${color}, 0 0 4px #fff` }}>
                                        {item.shortTitle}
                                    </span>
                                </div>

                                {/* CRT Scanlines Overlay */}
                                <div className="absolute inset-0 pointer-events-none z-20 opacity-40 mix-blend-overlay" style={{
                                    backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,1) 50%)',
                                    backgroundSize: '100% 4px',
                                }} />

                                {/* Glare */}
                                <div className="absolute top-0 right-0 w-[150%] h-[150%] pointer-events-none z-30 mix-blend-screen opacity-5 bg-gradient-to-bl from-white via-transparent to-transparent rotate-12 -translate-y-12" />
                            </div>
                        </div>
                        <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-bold uppercase mt-1">CHANNEL 1 MONITOR</div>
                    </div>

                    {/* Logs Area */}
                    <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                        <div className="flex flex-col gap-6">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-4 text-zinc-300">
                                    <div className="shrink-0 text-[13px] mt-0.5">-</div>
                                    <div className="text-[13px] leading-relaxed">
                                        <span className="font-bold text-white tracking-widest">LOG {String(i + 1).padStart(2, '0')}: </span>
                                        <span className="text-zinc-400">{log}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mb-6 shadow-[0_1px_0_rgba(0,0,0,0.5)]" />

                {/* Channels Strip Area */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {skills?.map((tech, i) => (
                        <div key={tech} className="flex shadow-md rounded-sm overflow-hidden border border-white/5">
                            <div className="bg-[#e4e4e7] text-black px-3 flex items-center justify-center font-bold text-[11px]">
                                {i + 1}
                            </div>
                            <div className="bg-[#18181b] text-zinc-300 px-4 py-1.5 text-[11px] flex items-center justify-center tracking-wider">
                                CH {i + 1}: {tech}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Panels Bottom */}
                <div className="w-full h-[120px] rounded-xl bg-[#1f1f22] border border-black/50 shadow-[inset_0_4px_20px_rgba(0,0,0,0.6)] flex items-center justify-center gap-12 relative overflow-hidden">

                    {/* Left Box: Repo Access Fader */}
                    <div className="flex-1 max-w-[400px] flex flex-row items-center gap-6 justify-center">

                        {/* The Fader Track & Handle */}
                        <div className="relative h-16 w-8 flex items-center justify-center">
                            {/* Track indented slot */}
                            <div className="w-2 h-full bg-black rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,1)] relative overflow-hidden" />

                            {/* White tick marks */}
                            <div className="absolute left-[-8px] top-0 h-full flex flex-col justify-between py-1">
                                {[...Array(5)].map((_, idx) => (
                                    <div key={idx} className="w-[4px] h-[1px] bg-white/30" />
                                ))}
                            </div>

                            {/* The physical fader knob */}
                            <motion.div
                                className="absolute w-10 h-5 bg-gradient-to-b from-[#555] to-[#222] rounded-[3px] shadow-[0_6px_12px_rgba(0,0,0,0.7),inset_0_1px_rgba(255,255,255,0.3)] border border-black z-10 flex flex-col items-center justify-center cursor-pointer"
                                initial={{ top: '70%' }}
                                animate={canViewSource ? { top: '20%' } : { top: '70%' }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Friction grip lines */}
                                <div className="w-5 h-[1px] bg-black/60 mb-[2px]" />
                                <div className="w-5 h-[1px] bg-white/20 mb-[2px]" />
                                <div className="w-5 h-[1px] bg-black/60" />
                            </motion.div>
                        </div>

                        {/* Label & Status */}
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <span className="text-[12px] tracking-widest font-bold text-white uppercase ml-1">REPO ACCESS</span>
                            <motion.a
                                href={canViewSource ? item.githubUrl : undefined}
                                target="_blank"
                                className={`text-[12px] flex items-center gap-2 ${canViewSource ? 'cursor-pointer text-zinc-300 hover:text-white' : 'pointer-events-none opacity-40'} tracking-widest font-bold uppercase transition-colors`}
                            >
                                [ <div className={`w-2 h-2 rounded-full ${canViewSource ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)]' : 'bg-black shadow-[inset_0_1px_2px_rgba(0,0,0,1)]'}`} /> GITHUB ]
                            </motion.a>
                        </div>
                    </div>

                    <div className="h-16 w-px bg-white/10 shadow-[1px_0_rgba(0,0,0,0.5)]" />

                    {/* Right Box: Live Site Toggle */}
                    <div className="flex-1 max-w-[400px] flex flex-row items-center gap-8 justify-center">

                        {/* Label & Status */}
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <span className="text-[12px] tracking-widest font-bold text-white uppercase ml-1">LIVE SITE</span>
                            <motion.a
                                href={canViewDemo ? item.liveUrl : undefined}
                                target="_blank"
                                className={`text-[12px] flex items-center gap-2 ${canViewDemo ? 'cursor-pointer text-zinc-300 hover:text-white' : 'pointer-events-none opacity-40'} tracking-widest font-bold uppercase transition-colors`}
                            >
                                [ <div className={`w-2 h-2 rounded-full ${canViewDemo ? 'bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,1)]' : 'bg-black shadow-[inset_0_1px_2px_rgba(0,0,0,1)]'}`} /> DEMO ]
                            </motion.a>
                        </div>

                        {/* Big Glowing Switch */}
                        <div className="relative flex items-center justify-center">
                            {/* Indented circular well */}
                            <div className="w-20 h-10 rounded-full bg-black shadow-[inset_0_4px_10px_rgba(0,0,0,1)] border border-white/5 relative p-1 flex items-center">
                                <motion.a
                                    href={canViewDemo ? item.liveUrl : undefined}
                                    target="_blank"
                                    className={`w-8 h-8 rounded-full absolute ${canViewDemo ? 'bg-[#22c55e] cursor-pointer' : 'bg-[#222] pointer-events-none'} border border-black flex items-center justify-center`}
                                    style={{
                                        boxShadow: canViewDemo
                                            ? '0 0 20px rgba(34,197,94,0.6), inset 0 4px 6px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.3)'
                                            : 'inset 0 -2px 4px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
                                    }}
                                    initial={{ left: '4px' }}
                                    animate={canViewDemo ? { left: '44px' } : { left: '4px' }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    {/* Inner highlight */}
                                    <div className="w-3 h-3 rounded-full bg-white/30 absolute top-1 blur-[1px]" />
                                </motion.a>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Right Rack Panel */}
            <div className="w-10 shrink-0 flex flex-col justify-between py-16 border-l border-[#111]" style={{ background: 'linear-gradient(-90deg, #18181b, #27272a)' }}>
                <div className="mx-auto w-5 h-2.5 bg-black/80 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1),0_1px_rgba(255,255,255,0.1)]" />
                <div className="mx-auto w-5 h-2.5 bg-black/80 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1),0_1px_rgba(255,255,255,0.1)]" />
            </div>
        </article>
    );
}
