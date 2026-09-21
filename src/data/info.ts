import type { ActiveSection } from '@/store/musicStore';
import { PROJECTS } from './projects';
import { EXPERIENCES } from './experience';

/** The presentation treatment for an information panel. */
export type InfoDesign = 'gatefold-liner' | 'studio-master-sheet' | 'newspaper';

export interface InfoCredits {
  engineering: string[];
  orchestration?: string[];
  masteredAt?: string;
}

export interface InfoPresentation {
  /** Register a renderer for new values in `InfoPanel.tsx`. */
  infoDesign: InfoDesign;
  catalogId: string;
  infoCategory: string;
  formatLabel?: string;
  imageCaption: string;
  credits: InfoCredits;
}

export interface SupplementalInfoItem extends InfoPresentation {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  longDescription: string;
  skills: string[];
  color: string;
  accentGlow: string;
  shortTitle: string;
  coverFont: string;
  vinylLabel: string;
  githubUrl?: string;
  liveUrl?: string;
}

export const ABOUT: SupplementalInfoItem[] = [{
  id: 0, title: 'Hassan (Me)', subtitle: 'Full-Stack Developer', year: '2024',
  description: 'A developer who treats interfaces, systems, and interaction as one considered experience.',
  longDescription: 'Hello! This is my interactive portfolio built with React and Framer Motion. Sift through the crates on the left to see my work and experience.',
  skills: ['React', 'TypeScript', 'Next.js', 'Framer Motion'], color: '#D97706', accentGlow: 'rgba(217,119,6,0.6)',
  shortTitle: 'DEV', coverFont: 'font-album-2', vinylLabel: 'HI',
  infoDesign: 'gatefold-liner', catalogId: 'ME-01', infoCategory: 'PERSONAL PROFILE', formatLabel: 'INTERACTIVE PORTFOLIO',
  imageCaption: 'STUDIO PORTRAIT: THE PERSON BEHIND THE PRESSING',
  credits: { engineering: ['React', 'TypeScript'], orchestration: ['Next.js', 'Framer Motion'], masteredAt: 'HASSAN’S WORKBENCH' },
}];

export const FEATURED: SupplementalInfoItem[] = Array.from({ length: 3 }, (_, id) => ({
  id, title: `Top Hit ${id + 1}`, subtitle: 'Featured Item', year: '2024',
  description: 'A highlighted release from the portfolio catalog.',
  longDescription: 'A hand-picked release from the catalog. This space is ready for the project story, technical decisions, and the details that made the work worth featuring.',
  skills: ['Design', 'Code'], color: '#FBBF24', accentGlow: 'rgba(251,191,36,0.6)',
  shortTitle: 'HOT', coverFont: 'font-album-5', vinylLabel: `BS${id}`,
  infoDesign: 'studio-master-sheet', catalogId: `FT-${String(id + 1).padStart(2, '0')}`, infoCategory: 'FEATURED RELEASE', formatLabel: 'SELECTED WORK',
  imageCaption: 'ARCHIVE FRAME: FEATURED RELEASE DOCUMENTATION',
  credits: { engineering: ['Design', 'Code'], masteredAt: 'DEV.LAIR ARCHIVE' },
}));

export type InfoItem = (typeof PROJECTS)[number] | (typeof EXPERIENCES)[number] | SupplementalInfoItem;

export function getActiveInfoItem(section: ActiveSection, indexes: { about: number; bestsellers: number; projects: number; experience: number }): InfoItem {
  if (section === 'projects') return PROJECTS[indexes.projects];
  if (section === 'experience') return EXPERIENCES[indexes.experience];
  if (section === 'about') return ABOUT[indexes.about];
  return FEATURED[indexes.bestsellers];
}
