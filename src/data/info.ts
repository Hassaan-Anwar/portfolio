import type { ActiveSection } from '@/store/musicStore';
import { PROJECTS } from './projects';
import { EXPERIENCES } from './experience';

/** The presentation treatment for an information panel. */
export type InfoDesign = 'gatefold-liner' | 'studio-master-sheet' | 'newspaper' | 'album-cover';

export interface InfoCredits {
  engineering: string[];
  orchestration?: string[];
  masteredAt?: string;
}

/** Custom input fields for the Album Cover design. */
export interface AlbumCoverData {
  /** Name shown under the catalog number (e.g. 'FULL-STACK RECORDS'). */
  recordLabel?: string;
  /** Artist / author name shown at bottom of sleeve. */
  artist?: string;
  /** Release year shown on sleeve footer. */
  releaseYear?: string;
  /** Side A track list — short bullet-point strings (feature / achievement). */
  sideA?: { title: string; duration?: string }[];
  /** Side B track list — short bullet-point strings. */
  sideB?: { title: string; duration?: string }[];
  /** Produced by credit line. */
  producedBy?: string;
  /** Recorded at credit line. */
  recordedAt?: string;
  /** Sleeve accent / background colour override (defaults to item.color). */
  sleeveColor?: string;
}

/** Custom input fields for the Newspaper design. */
export interface NewspaperData {
  /** The large masthead title (default: 'THE DAILY DISPATCH'). */
  masthead?: string;
  /** Edition subtitle strip (default: 'THE TECHNOLOGY EDITION'). */
  edition?: string;
  /** Byline (default: 'BY HASSAAN ANWAR | {subtitle}'). */
  byline?: string;
}

/** Custom input fields for the Gatefold Liner design. */
export interface GatefoldData {
  /** Override the type label shown after 'FORMAT:' */
  typeLabel?: string;
}

export interface InfoPresentation {
  /** Register a renderer for new values in `InfoPanel.tsx`. */
  infoDesign: InfoDesign;
  catalogId: string;
  infoCategory: string;
  formatLabel?: string;
  imageCaption: string;
  credits: InfoCredits;
  /** Per-design custom fields — only populated when infoDesign === 'album-cover'. */
  albumCoverData?: AlbumCoverData;
  /** Per-design custom fields — only populated when infoDesign === 'newspaper'. */
  newspaperData?: NewspaperData;
  /** Per-design custom fields — only populated when infoDesign === 'gatefold-liner'. */
  gatefoldData?: GatefoldData;
}

export interface SupplementalInfoItem extends InfoPresentation {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  longDescription: string | string[];
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
  id: 0,
  title: 'Hassaan Anwar',
  subtitle: 'AI Engineer',
  year: '2024',
  description: 'A Computer Science graduate focused on bridging strong software engineering fundamentals with emerging AI technologies.',
  longDescription: [
    "**INTERFACE GUIDE**",
    "Welcome to my interactive portfolio. To navigate, browse through the record crates on the left. Selecting any vinyl record will load it onto the turntable, revealing its corresponding project architecture, experience logs, or credentials right here in the studio panel.",
    "",
    "**ABOUT ME**",
    "I’m a Computer Science graduate from FAST-NUCES with a strong foundation in software engineering, artificial intelligence, and backend development. My experience spans building full-stack and AI-powered applications, with a particular focus on Python, FastAPI, TypeScript, REST APIs, databases, and cloud technologies.",
    "I’ve worked on systems involving Generative AI, LLMs, RAG pipelines, vector databases, distributed and parallel computing, and automation, as well as deploying applications using Docker, AWS, Azure, and Kubernetes. Through my internships and academic projects, I’ve developed an interest in designing reliable, scalable systems and solving complex technical problems.",
    "I’m particularly interested in AI engineering and backend systems, where I can combine strong software engineering fundamentals with emerging AI technologies to build practical, production-oriented solutions."
  ],
  skills: ['Python', 'FastAPI', 'TypeScript', 'LLMs', 'Docker', 'AWS', 'Kubernetes'],
  color: '#D97706',
  accentGlow: 'rgba(217,119,6,0.6)',
  shortTitle: 'DEV',
  coverFont: 'font-album-2',
  vinylLabel: 'HI',
  infoDesign: 'gatefold-liner',
  catalogId: 'ME-01',
  infoCategory: 'PERSONAL PROFILE',
  formatLabel: 'INTERACTIVE PORTFOLIO',
  imageCaption: 'STUDIO PORTRAIT: AI ENGINEER & DEVELOPER',
  credits: {
    engineering: ['React', 'TypeScript', 'Tailwind CSS'],
    orchestration: ['Next.js', 'Framer Motion'],
    masteredAt: 'HASSAN’S WORKBENCH'
  },
}];

export const FEATURED: SupplementalInfoItem[] = [
  {
    id: 0, title: 'MelodyMind', subtitle: 'AI Music Companion', year: '2024',
    description: 'An AI-powered mobile music application featuring emotional understanding and a conversational DJ.',
    longDescription: [
      "MelodyMind is a comprehensive music companion featuring an intelligent conversational DJ. The backend is built with **FastAPI** and **Python**, utilizing **SQLAlchemy 2.0** and **Supabase PostgreSQL** for robust asynchronous data management.",
      "The recommendation engine leverages a **RAG** architecture via **LangChain**. It matches user context against **Nomic text embeddings** stored in a **Pinecone vector search** database. The multi-turn conversational agent relies on **Google Gemini** alongside a **GROQ** fallback to provide an adaptive chat and **speech processing** experience.",
      "The frontend is a bespoke **React Native** and **TypeScript** mobile application. It boasts real-time voice interaction, animated blob visualizations for state representation, and Spotify-inspired dark aesthetics."
    ],
    skills: ['FastAPI', 'Python', 'LLMs', 'LangChain', 'RAG', 'Pinecone', 'PostgreSQL', 'Embeddings', 'React Native', 'TypeScript', 'Speech Processing'],
    color: '#1DB954', accentGlow: 'rgba(29, 185, 84, 0.6)',
    shortTitle: 'MLDY', coverFont: 'font-album-3', vinylLabel: 'MLD',
    infoDesign: 'studio-master-sheet', catalogId: 'FT-01', infoCategory: 'FEATURED RELEASE', formatLabel: 'FULL STACK APP',
    imageCaption: 'STUDIO SESSION: MELODYMIND ARCHITECTURE',
    credits: { engineering: ['React Native', 'FastAPI'], orchestration: ['Pinecone', 'Gemini'], masteredAt: 'DEV.LAIR ARCHIVE' },
    githubUrl: 'https://github.com/Hassaan-Anwar/MelodyMind_Backend#melodymind-backend',
  },
  {
    id: 1, title: 'E-Commerce Ad Gen', subtitle: 'MLOps Production Platform', year: '2025',
    description: 'An end-to-end MLOps system for generating AI-powered e-commerce ad creatives with full production infrastructure.',
    longDescription: [
      "The **E-Commerce Ad Creative Generator** is a complete **MLOps** platform engineered for production. It implements a robust microservices architecture comprising a **FastAPI** inference service and a **Flask** web UI, securely orchestrating the generation of AI-powered ad content.",
      "The underlying data pipeline is fully automated using **Apache Airflow** for workflow orchestration and **MLflow** for rigorous experiment tracking. The platform operates within a highly available **Kubernetes** cluster deployed on **Microsoft Azure**, scaling dynamically via Horizontal Pod Autoscaling based on real-time traffic spikes.",
      "Deep observability is built into the core infrastructure, featuring real-time **Prometheus** metrics collection and **Grafana** visualization dashboards to constantly track API latencies and model validity scores."
    ],
    skills: ['MLOps', 'Kubernetes', 'Docker', 'Azure', 'Airflow', 'MLflow', 'FastAPI', 'Prometheus', 'Grafana', 'Flask'],
    color: '#326CE5', accentGlow: 'rgba(50, 108, 229, 0.6)',
    shortTitle: 'MOP', coverFont: 'font-album-5', vinylLabel: 'MLO',
    infoDesign: 'studio-master-sheet', catalogId: 'FT-02', infoCategory: 'FEATURED RELEASE', formatLabel: 'INFRASTRUCTURE',
    imageCaption: 'PROD CLUSTER: AUTO-SCALING PIPELINES',
    credits: { engineering: ['Kubernetes', 'Azure'], orchestration: ['Airflow', 'MLflow'], masteredAt: 'DEV.LAIR ARCHIVE' },
    githubUrl: 'https://github.com/Hassaan-Anwar/e-commerce-ad-generator',
  }
];

export type InfoItem = (typeof PROJECTS)[number] | (typeof EXPERIENCES)[number] | SupplementalInfoItem;

export function getActiveInfoItem(section: ActiveSection, indexes: { about: number; bestsellers: number; projects: number; experience: number }): InfoItem {
  if (section === 'projects') return PROJECTS[indexes.projects % PROJECTS.length];
  if (section === 'experience') return EXPERIENCES[indexes.experience % EXPERIENCES.length];
  if (section === 'about') return ABOUT[indexes.about % ABOUT.length];
  return FEATURED[indexes.bestsellers % FEATURED.length];
}
