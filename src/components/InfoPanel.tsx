'use client';

import { motion } from 'framer-motion';
import type { CSSProperties, ComponentType } from 'react';
import type { InfoItem } from '@/data/info';
import StudioMasterSheet from './designs/StudioMasterSheet';
import Broadsheet from './designs/Broadsheet';

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

  // Only show link buttons when a real URL is provided (not a placeholder '#')
  const canViewSource = isProject && !!item.githubUrl && item.githubUrl !== '#';
  const canViewDemo = isProject && !!item.liveUrl && item.liveUrl !== '#';

  // Extract structured credits
  const credits = 'credits' in item ? item.credits : { engineering: [], orchestration: [], masteredAt: '' };
  const hasEngineering = credits.engineering && credits.engineering.length > 0;
  const hasOrchestration = credits.orchestration && credits.orchestration.length > 0;
  const hasSkills = !hasEngineering && !isProject && skills && skills.length > 0;

  return (
    <article
      className="w-full h-full relative rounded-xl flex flex-col"
      style={{
        background: `
          linear-gradient(135deg, rgba(235,232,225,0.98), rgba(220,215,205,0.96)),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
        color: '#1a1c1d',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,1)',
        border: '1px solid rgba(0,0,0,0.1)',
        padding: '32px 36px 28px',
      }}
    >
      {/* Top Catalog Badge */}
      <div className="mb-4">
        <span
          className="font-mono px-3 py-1 rounded-full whitespace-nowrap"
          style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.12)', letterSpacing: 1, fontSize: '11px', fontWeight: 600, color: '#333' }}
        >
          {item.catalogId || 'CAT: PROJ-01'}
        </span>
      </div>

      {/* Editorial Headers */}
      <div className="mb-2 text-left">
        <h1 className="font-editorial leading-none" style={{ fontSize: '52px', fontWeight: 800, color: '#1a1c1d', letterSpacing: '-0.03em' }}>
          {title}
        </h1>
        <h2 className="font-editorial italic" style={{ fontSize: '26px', color: '#3a3c40', marginTop: '4px' }}>
          {subtitle}
        </h2>
        <p className="font-mono mt-3 mb-3" style={{ fontSize: '12px', color: '#1a1c1d', letterSpacing: '1px', textTransform: 'uppercase' }}>
          RELEASED: {year} &bull; FORMAT: {item.formatLabel ?? item.infoCategory}
        </p>
      </div>

      {/* Thin divider */}
      <hr className="border-t border-black/15 mb-4" />

      {/* Central Content: float image left, text wraps around + below */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.18) transparent' }}>

        {/* Float image block left — text flows around it */}
        <div style={{ float: 'left', width: '210px', marginRight: '32px', marginBottom: '8px' }}>
          <div
            className="w-full relative rounded-sm overflow-hidden"
            style={{
              aspectRatio: '4 / 3',
              background: '#111',
              boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
            }}
          >
            {/* Film strip metadata */}
            <div className="absolute top-1.5 left-3 text-[#555] font-mono" style={{ fontSize: '6px' }}>OPALUX A&LM-1305</div>
            <div className="absolute top-1.5 right-3 text-[#555] font-mono" style={{ fontSize: '6px' }}>48</div>
            <div className="absolute bottom-1.5 left-3 flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-1.5 bg-[#1e1e1e]" />)}
            </div>

            {/* Inner scene */}
            <div
              className="absolute inset-0 m-2"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${color}33, #0a0a0c)`,
                border: `1px solid ${color}40`,
                overflow: 'hidden',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={item.coverFont} style={{ fontSize: '60px', color: '#fff', opacity: 0.9, textShadow: `0 4px 16px ${color}` }}>
                  {item.shortTitle}
                </span>
              </div>
              {/* CRT scanline overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.28) 50%)',
                backgroundSize: '100% 4px',
              }} />
            </div>
          </div>

          {/* Caption */}
          <div className="font-mono uppercase text-center mt-1" style={{ fontSize: '7px', color: '#666', letterSpacing: '0.08em', fontWeight: 700, lineHeight: 1.4 }}>
            {('imageCaption' in item && item.imageCaption) ? item.imageCaption : `FIG 1.0 — ${title}`}
          </div>
        </div>

        {/* Text flows around float and wraps below image when long enough */}
        <p
          className="font-sans"
          style={{ fontSize: '15px', color: '#111', fontWeight: 500, lineHeight: 1.7, textAlign: 'left' }}
        >
          {description}
        </p>

        {/* Clearfix so container grows to contain the float */}
        <div style={{ clear: 'both' }} />
      </div>

      {/* Bottom row: credits + sticker buttons */}
      <div className="mt-auto pt-4 relative">
        <hr className="border-t border-black/15 mb-3" />

        <div className="flex flex-row items-end justify-between gap-4">
          {/* Credits block */}
          <div
            className="font-mono uppercase leading-[1.75] text-[#111] flex-1 min-w-0"
            style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}
          >
            <strong className="font-extrabold" style={{ fontSize: '11px' }}>PERSONNEL &amp; CREDITS</strong>
            {hasEngineering && <span> | <strong>ENGINEERED &amp; COMPOSED WITH:</strong>{formatCredits(credits.engineering)}</span>}
            {hasOrchestration && <span> | <strong>MIXED AT:</strong>{formatCredits(credits.orchestration)}</span>}
            {credits.masteredAt && <span> | <strong>MASTERED AT:</strong>{credits.masteredAt}</span>}
            {hasSkills && <span> | <strong>PERSONNEL:</strong>{formatCredits(skills)}</span>}
          </div>

          {/* Promo sticker buttons — only when real URLs exist */}
          {(canViewSource || canViewDemo) && (
            <div className="flex flex-row gap-3 shrink-0">
              {canViewSource && (
                <motion.a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ rotate: -3 }}
                  whileHover={{ scale: 1.07, rotate: -5, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative flex flex-col items-center justify-center text-center cursor-pointer select-none"
                  style={{
                    width: '96px',
                    height: '52px',
                    background: 'linear-gradient(170deg, #e8392a 0%, #c0281b 100%)',
                    color: '#fff',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    lineHeight: 1.25,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.2)',
                    border: '1.5px solid rgba(255,100,80,0.6)',
                    transform: 'rotate(-3deg)',
                  }}
                >
                  {/* top-left peel corner */}
                  <span
                    className="absolute top-0 left-0"
                    style={{
                      width: 0, height: 0,
                      borderStyle: 'solid',
                      borderWidth: '10px 10px 0 0',
                      borderColor: 'rgba(0,0,0,0.18) transparent transparent transparent',
                    }}
                  />
                  <span style={{ fontSize: '10px', fontWeight: 900 }}>VIEW</span>
                  <span style={{ fontSize: '9px', fontWeight: 700, opacity: 0.85 }}>SOURCE CODE</span>
                </motion.a>
              )}

              {canViewDemo && (
                <motion.a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ rotate: 2 }}
                  whileHover={{ scale: 1.07, rotate: 4, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative flex flex-col items-center justify-center text-center cursor-pointer select-none"
                  style={{
                    width: '96px',
                    height: '52px',
                    background: 'linear-gradient(170deg, #2dbd5f 0%, #1e9447 100%)',
                    color: '#fff',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    lineHeight: 1.25,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.2)',
                    border: '1.5px solid rgba(100,220,130,0.5)',
                    transform: 'rotate(2deg)',
                  }}
                >
                  {/* bottom-right peel corner */}
                  <span
                    className="absolute bottom-0 right-0"
                    style={{
                      width: 0, height: 0,
                      borderStyle: 'solid',
                      borderWidth: '0 0 10px 10px',
                      borderColor: 'transparent transparent rgba(0,0,0,0.18) transparent',
                    }}
                  />
                  <span style={{ fontSize: '10px', fontWeight: 900 }}>DEMO</span>
                  <span style={{ fontSize: '9px', fontWeight: 700, opacity: 0.85 }}>AVAILABLE</span>
                </motion.a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

const INFO_DESIGNS = {
  'gatefold-liner': GatefoldLiner,
  'studio-master-sheet': StudioMasterSheet,
  'broadsheet': Broadsheet,
} satisfies Record<InfoItem['infoDesign'], ComponentType<InfoPanelProps>>;

export default function InfoPanel(props: InfoPanelProps) {
  const Panel = INFO_DESIGNS[props.item.infoDesign];
  return <Panel {...props} />;
}
