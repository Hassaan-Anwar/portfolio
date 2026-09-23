import { create } from 'zustand';
import type { InfoPresentation } from '@/data/info';
import { EXPERIENCES } from '@/data/experience';
import { PROJECTS } from '@/data/projects';
import { ABOUT, FEATURED } from '@/data/info';

export type ActiveSection = 'about' | 'bestsellers' | 'projects' | 'experience';

export interface Project extends InfoPresentation {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  longDescription: string | string[];
  techStack: string[];
  color: string;
  accentGlow: string;
  githubUrl?: string;
  liveUrl?: string;
  vinylLabel: string;
  shortTitle: string;
  coverFont: string;
}

interface MusicStore {
  activeSection: ActiveSection;
  currentAboutIndex: number;
  currentBestsellersIndex: number;
  currentProjectIndex: number;
  currentExperienceIndex: number;
  isPlaying: boolean;
  muted: boolean;
  modalOpen: boolean;
  isDragging: boolean;
  /** The color of the currently active item — updates on every record change. */
  activeColor: string;
  /** The glow rgba of the currently active item. */
  activeGlow: string;
  /** Master volume 0–1, default 0.5 */
  volume: number;

  setCurrentAbout: (index: number) => void;
  setCurrentBestsellers: (index: number) => void;
  setCurrentProject: (index: number) => void;
  setCurrentExperience: (index: number) => void;
  next: () => void;
  prev: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  openModal: () => void;
  closeModal: () => void;
  setDragging: (v: boolean) => void;
  setVolume: (v: number) => void;
}

const ABOUT_COUNT = 1;
const BESTSELLERS_COUNT = FEATURED.length;
const PROJECT_COUNT = PROJECTS.length;
const EXPERIENCE_COUNT = EXPERIENCES.length;

export const useMusicStore = create<MusicStore>((set, get) => ({
  activeSection: 'about',
  currentAboutIndex: 0,
  currentBestsellersIndex: 0,
  currentProjectIndex: 0,
  currentExperienceIndex: 0,
  isPlaying: true,
  muted: false,
  modalOpen: false,
  isDragging: false,
  activeColor: ABOUT[0].color,
  activeGlow: ABOUT[0].accentGlow,
  volume: 0.5,

  setCurrentAbout: (index) => {
    const item = ABOUT[index % ABOUT_COUNT];
    set({ activeSection: 'about', currentAboutIndex: index, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
  },

  setCurrentBestsellers: (index) => {
    const item = FEATURED[index % BESTSELLERS_COUNT];
    set({ activeSection: 'bestsellers', currentBestsellersIndex: index, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
  },

  setCurrentProject: (index) => {
    const item = PROJECTS[index % PROJECT_COUNT];
    set({ activeSection: 'projects', currentProjectIndex: index, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
  },

  setCurrentExperience: (index) => {
    const item = EXPERIENCES[index % EXPERIENCE_COUNT];
    set({ activeSection: 'experience', currentExperienceIndex: index, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
  },

  next: () => {
    const { activeSection, currentProjectIndex, currentExperienceIndex, currentAboutIndex, currentBestsellersIndex } = get();
    if (activeSection === 'projects') {
      const newIdx = (currentProjectIndex + 1) % PROJECT_COUNT;
      const item = PROJECTS[newIdx];
      set({ currentProjectIndex: newIdx, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
    } else if (activeSection === 'experience') {
      const newIdx = (currentExperienceIndex + 1) % EXPERIENCE_COUNT;
      const item = EXPERIENCES[newIdx];
      set({ currentExperienceIndex: newIdx, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
    } else if (activeSection === 'bestsellers') {
      const newIdx = (currentBestsellersIndex + 1) % BESTSELLERS_COUNT;
      const item = FEATURED[newIdx];
      set({ currentBestsellersIndex: newIdx, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
    } else {
      const newIdx = (currentAboutIndex + 1) % ABOUT_COUNT;
      const item = ABOUT[newIdx];
      set({ currentAboutIndex: newIdx, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
    }
  },

  prev: () => {
    const { activeSection, currentProjectIndex, currentExperienceIndex, currentAboutIndex, currentBestsellersIndex } = get();
    if (activeSection === 'projects') {
      const newIdx = (currentProjectIndex - 1 + PROJECT_COUNT) % PROJECT_COUNT;
      const item = PROJECTS[newIdx];
      set({ currentProjectIndex: newIdx, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
    } else if (activeSection === 'experience') {
      const newIdx = (currentExperienceIndex - 1 + EXPERIENCE_COUNT) % EXPERIENCE_COUNT;
      const item = EXPERIENCES[newIdx];
      set({ currentExperienceIndex: newIdx, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
    } else if (activeSection === 'bestsellers') {
      const newIdx = (currentBestsellersIndex - 1 + BESTSELLERS_COUNT) % BESTSELLERS_COUNT;
      const item = FEATURED[newIdx];
      set({ currentBestsellersIndex: newIdx, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
    } else {
      const newIdx = (currentAboutIndex - 1 + ABOUT_COUNT) % ABOUT_COUNT;
      const item = ABOUT[newIdx];
      set({ currentAboutIndex: newIdx, isPlaying: true, activeColor: item.color, activeGlow: item.accentGlow });
    }
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
  setDragging: (v) => set({ isDragging: v }),
  setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),
}));
