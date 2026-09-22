import { create } from 'zustand';
import type { InfoPresentation } from '@/data/info';
import { EXPERIENCES } from '@/data/experience';
import { PROJECTS } from '@/data/projects';

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
}

const ABOUT_COUNT = 1;         // ABOUT array always has 1 entry
const BESTSELLERS_COUNT = 2;   // FEATURED consists of MelodyMind and MLOps Ad Gen
const PROJECT_COUNT = PROJECTS.length;
const EXPERIENCE_COUNT = EXPERIENCES.length;

export const useMusicStore = create<MusicStore>((set, get) => ({
  activeSection: 'about',
  currentAboutIndex: 0,
  currentBestsellersIndex: 0,
  currentProjectIndex: 0,
  currentExperienceIndex: 0,
  isPlaying: false,
  muted: false,
  modalOpen: false,
  isDragging: false,

  setCurrentAbout: (index) =>
    set({ activeSection: 'about', currentAboutIndex: index, isPlaying: true }),

  setCurrentBestsellers: (index) =>
    set({ activeSection: 'bestsellers', currentBestsellersIndex: index, isPlaying: true }),

  setCurrentProject: (index) =>
    set({ activeSection: 'projects', currentProjectIndex: index, isPlaying: true }),

  setCurrentExperience: (index) =>
    set({ activeSection: 'experience', currentExperienceIndex: index, isPlaying: true }),

  next: () => {
    const { activeSection, currentProjectIndex, currentExperienceIndex, currentAboutIndex, currentBestsellersIndex } = get();
    if (activeSection === 'projects') {
      set({ currentProjectIndex: (currentProjectIndex + 1) % PROJECT_COUNT, isPlaying: true });
    } else if (activeSection === 'experience') {
      set({ currentExperienceIndex: (currentExperienceIndex + 1) % EXPERIENCE_COUNT, isPlaying: true });
    } else if (activeSection === 'bestsellers') {
      set({ currentBestsellersIndex: (currentBestsellersIndex + 1) % BESTSELLERS_COUNT, isPlaying: true });
    } else {
      set({ currentAboutIndex: (currentAboutIndex + 1) % ABOUT_COUNT, isPlaying: true });
    }
  },

  prev: () => {
    const { activeSection, currentProjectIndex, currentExperienceIndex, currentAboutIndex, currentBestsellersIndex } = get();
    if (activeSection === 'projects') {
      set({ currentProjectIndex: (currentProjectIndex - 1 + PROJECT_COUNT) % PROJECT_COUNT, isPlaying: true });
    } else if (activeSection === 'experience') {
      set({ currentExperienceIndex: (currentExperienceIndex - 1 + EXPERIENCE_COUNT) % EXPERIENCE_COUNT, isPlaying: true });
    } else if (activeSection === 'bestsellers') {
      set({ currentBestsellersIndex: (currentBestsellersIndex - 1 + BESTSELLERS_COUNT) % BESTSELLERS_COUNT, isPlaying: true });
    } else {
      set({ currentAboutIndex: (currentAboutIndex - 1 + ABOUT_COUNT) % ABOUT_COUNT, isPlaying: true });
    }
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
  setDragging: (v) => set({ isDragging: v }),
}));
