'use client';

import { motion } from 'framer-motion';
import type { CSSProperties, ComponentType } from 'react';
import type { InfoItem } from '@/data/info';

interface InfoPanelProps {
  item: InfoItem;
}

const formatCredits = (credits?: string[]) => credits ? credits.join(', ') : '';

function GatefoldLiner({ item }: InfoPanelProps) {
  const title = 'title' in item ? item.title : item.company;
  const subtitle = 'subtitle' in item ? item.subtitle : item.role;
  const year = 'year' in item ? item.year : item.period;
  const skills = 'techStack' in item ? item.techStack : item.skills;
  const isProject = 'techStack' in item;

  const description = item.longDescription || item.description;
  const color = item.color || '#333';

  const canViewSource = isProject && item.githubUrl && item.githubUrl !== '#';
  const canViewDemo = isProject && item.liveUrl && item.liveUrl !== '#';

  // Extract new structured credits provided in the dataset
  const credits = 'credits' in item ? item.credits : { engineering: [], orchestration: [], masteredAt: '' };
  const hasEngineering = credits.engineering && credits.engineering.length > 0;
  const hasOrchestration = credits.orchestration && credits.orchestration.length > 0;

  // Fallback personnel for experience / about
  const hasSkills = !hasEngineering && (!isProject) && skills && skills.length > 0;

  return (
    <article
      className="w-full h-full relative rounded-xl flex flex-col"
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
      <div className="mb-4 text-left">
        <h1 className="font-editorial leading-none" style={{ fontSize: '56px', fontWeight: 800, color: '#1a1c1d', letterSpacing: '-0.03em' }}>
          {title}
        </h1>
        <h2 className="font-editorial italic" style={{ fontSize: '28px', color: '#3a3c40', marginTop: '6px' }}>
          {subtitle}
        </h2>
        <p className="font-mono mt-6 mb-4" style={{ fontSize: '12.5px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase' }}>
          RELEASED: {year} &bull; FORMAT: {item.formatLabel ?? item.infoCategory}
        </p>
      </div>

      {/* Top Divider */}
      <hr className="w-full border-t border-black opacity-20 mb-6" />

      {/* Central Content Flex Container */}
      <div className="flex-1 flex flex-row gap-8 overflow-hidden min-h-0 text-left">

        {/* Left: Vintage Photograph Graphic */}
        <div className="flex flex-col shrink-0 gap-2 w-1/2 max-w-[420px]">
          <div
            className="w-full relative rounded-sm overflow-hidden flex flex-col justify-center items-center"
            style={{
              aspectRatio: '16 / 10', // Fixed Landscape layout matching screenshot
              padding: '16px',
              background: '#111',
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
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={item.coverFont} style={{ fontSize: '72px', color: '#fff', opacity: 0.9, textShadow: `0 4px 16px ${color}` }}>
                  {item.shortTitle}
                </span>
              </div>
              <span className="absolute left-2 top-2 font-mono text-[7px] tracking-[.16em] text-white/50">TAKE 01</span>

              {/* CRT overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `linear-gradient(transparent 50%, rgba(0,0,0,0.3) 50%)`,
                backgroundSize: '100% 4px',
              }} />
            </div>
          </div>
          {/* Tiny caption under photograph */}
          <div className="text-center font-mono uppercase mt-1" style={{ fontSize: '8px', color: '#555', letterSpacing: 1, fontWeight: 'bold' }}>
            {('imageCaption' in item && item.imageCaption) ? item.imageCaption : 'STUDIO SESSION: VISUALIZER PROTOTYPE'}
          </div>
        </div>

        {/* Right: Editorial Body Copy */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-4 flex flex-col" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.2) transparent' }}>
          <div
            className="font-sans leading-[1.65]"
            style={{
              fontSize: '15.5px',
              color: '#111',
              fontWeight: 500,
              textAlign: 'left' // Explicitly left aligned!
            }}
          >
            {description}
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <hr className="w-full border-t border-black opacity-20 mt-6 mb-4" />

      {/* Bottom Credits / Tech Stack */}
      <div className="w-full flex flex-row items-end justify-between relative pb-2 pt-1 text-left mt-auto overflow-hidden">

        <div className="font-mono uppercase leading-[1.6] text-[#666]" style={{ fontSize: '10.5px', letterSpacing: '0.08em', maxWidth: '65%' }}>
          <strong className="text-black font-extrabold mr-1.5" style={{ fontSize: '11px' }}>PERSONNEL & CREDITS</strong> |
          {hasEngineering && <span className="ml-1.5">ENGINEERED & COMPOSED WITH: <strong className="text-[#1a1c1d] font-bold tracking-wider">{formatCredits(credits.engineering)}</strong> |</span>}
          {hasOrchestration && <span className="ml-1.5">MIXED AT: <strong className="text-[#1a1c1d] font-bold tracking-wider">{formatCredits(credits.orchestration)}</strong> |</span>}
          {credits.masteredAt && <span className="ml-1.5">MASTERED AT: <strong className="text-[#1a1c1d] font-bold tracking-wider">{credits.masteredAt}</strong></span>}
          {hasSkills && <span className="ml-1.5">PERSONNEL: <strong className="text-[#1a1c1d] font-bold tracking-wider">{formatCredits(skills)}</strong></span>}
        </div>

        {/* Peelable Promo Stickers */}
        <div className="flex flex-row gap-3 shrink-0 ml-4 pb-1 relative z-10 self-end">
          {/* View Source Code Button (Red hype sticker) */}
          <motion.a
            href={canViewSource ? item.githubUrl : undefined}
            target="_blank"
            whileHover={canViewSource ? { scale: 1.05, rotate: -4 } : {}}
            whileTap={canViewSource ? { scale: 0.95 } : {}}
            className={`font-bold flex items-center justify-center text-center shadow-lg relative ${canViewSource ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none opacity-60 grayscale-[40%]'}`}
            style={{
              background: '#e34739',
              color: '#fff',
              width: '105px',
              height: '44px',
              borderRadius: '3px',
              transform: 'rotate(-3deg)',
              fontSize: '11px',
              lineHeight: 1.1,
              borderTop: '1px solid rgba(255,255,255,0.4)',
              borderLeft: '1px solid rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
            }}
          >
            VIEW<br />SOURCE CODE
            {/* Little peeled corner element */}
            <div className="absolute top-0 right-0 w-3 h-3 bg-[#f2867c]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)', boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.3)' }} />
          </motion.a>

          {/* Demo Available Button (Green hype sticker) */}
          <motion.a
            href={canViewDemo ? item.liveUrl : undefined}
            target="_blank"
            whileHover={canViewDemo ? { scale: 1.05, rotate: 2 } : {}}
            whileTap={canViewDemo ? { scale: 0.95 } : {}}
            className={`font-bold flex items-center justify-center text-center shadow-lg relative ${canViewDemo ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none opacity-60 grayscale-[40%]'}`}
            style={{
              background: '#34ba61',
              color: '#fff',
              width: '105px',
              height: '44px',
              borderRadius: '3px',
              transform: 'rotate(2deg)',
              fontSize: '11px',
              lineHeight: 1.1,
              borderTop: '1px solid rgba(255,255,255,0.4)',
              borderLeft: '1px solid rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
            }}
          >
            DEMO<br />AVAILABLE
            {/* Little peeled corner element */}
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#77d997]" style={{ clipPath: 'polygon(100% 100%, 0 0, 0 100%)', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.3)' }} />
          </motion.a>
        </div>
      </div>

    </article>
  );
}

const INFO_DESIGNS = {
  'gatefold-liner': GatefoldLiner,
} satisfies Record<InfoItem['infoDesign'], ComponentType<InfoPanelProps>>;

export default function InfoPanel(props: InfoPanelProps) {
  const Panel = INFO_DESIGNS[props.item.infoDesign];
  return <Panel {...props} />;
}
