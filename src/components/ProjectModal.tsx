'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { PROJECTS } from '@/data/projects';
import { EXPERIENCES } from '@/data/experience';
import { X, GitBranch, BookOpen } from 'lucide-react';

export default function ProjectModal() {
    const {
        modalOpen, closeModal, activeSection, currentProjectIndex, currentExperienceIndex,
    } = useMusicStore();

    const item =
        activeSection === 'projects'
            ? PROJECTS[currentProjectIndex]
            : EXPERIENCES[currentExperienceIndex];

    const color = item.color;
    const accentGlow = item.accentGlow;
    const title = 'title' in item ? item.title : item.company;
    const subtitle = 'subtitle' in item ? item.subtitle : item.role;
    const year = 'year' in item ? item.year : item.period;
    const longDesc = item.longDescription;
    const chips = 'techStack' in item ? item.techStack : item.skills;
    const chipLabel = activeSection === 'projects' ? 'INSTRUMENTS USED' : 'SKILLS';
    const githubUrl = 'githubUrl' in item ? item.githubUrl : '#';

    // Placeholder image (uses placehold.co with brand colors)
    const placeholderImg = `https://placehold.co/560x200/${color.replace('#', '')}0d/FFFFFF?text=${encodeURIComponent(title)}&font=roboto`;

    return (
        <AnimatePresence>
            {modalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.88, y: 32 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 16 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    >
                        <div
                            className="relative pointer-events-auto w-full overflow-y-auto rounded-2xl"
                            style={{
                                maxWidth: 580,
                                maxHeight: '88vh',
                                background: 'rgba(13, 10, 20, 0.97)',
                                border: `1px solid ${color}44`,
                                boxShadow: `0 0 60px ${accentGlow}, 0 24px 64px rgba(0,0,0,0.9)`,
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            {/* Header */}
                            <div
                                className="flex items-center justify-between px-6 py-4"
                                style={{ borderBottom: `1px solid ${color}22` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                                        style={{ background: color, boxShadow: `0 0 14px ${accentGlow}` }}
                                    >
                                        {item.vinylEmoji}
                                    </div>
                                    <div>
                                        <p className="font-pixel text-[7px] tracking-widest" style={{ color }}>
                                            LINER NOTES
                                        </p>
                                        <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                                    style={{ color: '#9b93ae' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 space-y-5">
                                {/* Meta badge + year */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span
                                        className="font-pixel text-[7px] px-2 py-1 rounded"
                                        style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
                                    >
                                        {subtitle}
                                    </span>
                                    <span className="font-mono text-xs" style={{ color: '#9b93ae' }}>
                                        Side A · {year}
                                    </span>
                                </div>

                                {/* Placeholder preview image */}
                                <div
                                    className="w-full rounded-xl overflow-hidden flex items-center justify-center relative"
                                    style={{
                                        height: 160,
                                        background: `linear-gradient(135deg, ${color}22, #1B1229 50%, #0d0a14 100%)`,
                                        border: `1px solid ${color}22`,
                                    }}
                                >
                                    {/* Color-matched placeholder with big emoji */}
                                    <div className="flex flex-col items-center gap-3">
                                        <span style={{ fontSize: 56 }}>{item.vinylEmoji}</span>
                                        <div className="flex gap-2">
                                            {(chips.slice(0, 3)).map(c => (
                                                <span key={c} className="font-mono text-[10px] px-2 py-0.5 rounded"
                                                    style={{ background: `${color}22`, color }}>
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Corner label */}
                                    <div
                                        className="absolute top-3 right-3 font-pixel text-[6px] px-2 py-1 rounded"
                                        style={{ background: 'rgba(0,0,0,0.6)', color, letterSpacing: 2 }}
                                    >
                                        PREVIEW PLACEHOLDER
                                    </div>
                                </div>

                                {/* Long description */}
                                <div>
                                    <h3 className="font-pixel text-[7px] mb-2 tracking-widest" style={{ color }}>
                                        ABOUT THIS TRACK
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: '#c4bcce' }}>
                                        {longDesc}
                                    </p>
                                </div>

                                {/* Tech chips */}
                                <div>
                                    <h3 className="font-pixel text-[7px] mb-3 tracking-widest" style={{ color }}>
                                        {chipLabel}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {chips.map((c) => (
                                            <span
                                                key={c}
                                                className="font-mono text-xs px-2.5 py-1 rounded-md"
                                                style={{ background: `${color}15`, color: '#F4F1EA', border: `1px solid ${color}30` }}
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Links — GitHub only, no Live Demo */}
                                <div
                                    className="flex gap-3 pt-2"
                                    style={{ borderTop: `1px solid ${color}22` }}
                                >
                                    <a
                                        href={githubUrl}
                                        className="flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-lg transition-all hover:scale-105"
                                        style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                                    >
                                        <GitBranch size={13} /> View on GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
