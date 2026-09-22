import type { InfoPresentation } from './info';

export interface Experience extends InfoPresentation {
    id: number;
    company: string;
    role: string;
    period: string;
    description: string;
    longDescription: string | string[];
    skills: string[];
    color: string;
    accentGlow: string;
    shortTitle: string;
    coverFont: string;
    vinylLabel: string;
}

export const EXPERIENCES: Experience[] = [
    {
        id: 0,
        company: 'Genesys Research Lab',
        role: 'Software Engineering Intern',
        period: 'July 2025 – August 2025',
        description:
            'Engineered an AI-powered interview platform utilizing a Weaviate and Nomic RAG-based retrieval system, Llama-based conversational models, and modular FastAPI services.',
        longDescription: [
            'Engineered a RAG-based retrieval system using Weaviate and Nomic embeddings for semantic candidate-job matching.',
            'Built and deployed modular FastAPI services with Docker Compose for scalable AI workloads and asynchronous workflow handling.',
            'Worked on conversational interview flows using Llama-based models and structured candidate data from CVs, GitHub, LinkedIn, institutional sources, and websites.',
            'Profiled and optimized the machine learning inference pipeline to achieve sub-4-second latency for real-time question generation.',
        ],
        skills: ['Python', 'RAG / LLMs', 'Docker', 'REST APIs', 'HTTPS / CORS'],
        color: '#2DD4BF',
        accentGlow: 'rgba(45, 212, 191, 0.6)',
        infoDesign: 'newspaper', catalogId: 'EXP-01', infoCategory: 'SOFTWARE ENGINEERING', formatLabel: 'AI PLATFORM',
        imageCaption: 'STUDIO SESSION: RAG INFERENCE PIPELINE',
        imageSrc: '/genesys_experience.jpg',
        credits: { engineering: ['Python', 'Docker', 'REST APIs'], orchestration: ['RAG', 'LLMs', 'HTTPS / CORS'], masteredAt: 'GENESYS RESEARCH LAB' },
        newspaperData: {
            masthead: 'THE GENESYS CHRONICLE',
            edition: 'THE INTERNSHIP EDITION',
            byline: 'BY HASSAAN ANWAR | Software Engineering Intern',
        },
        shortTitle: 'S-ENG', coverFont: 'font-album-1',
        vinylLabel: 'GRL',
    },
    {
        id: 1,
        company: 'Jazz',
        role: 'Data Engineering Intern',
        period: 'July 2024 – August 2024',
        description:
            'Designed enterprise ETL pipelines and developed "KPI Monitor", a web-based query and automated threshold-checking platform for layout users to detect data anomalies.',
        longDescription: [
            'Designed, built, and maintained enterprise ETL pipelines processing over 100,000 records daily for automated data transformation and cross-system integration.',
            'Developed "KPI Monitor", a web-based project that allows layman users to create and run queries without the hassle of knowing SQL or requesting assistance from other staff.',
            'Engineered KPI Monitor to double as an automated threshold checker, monitoring specific KPIs daily to detect anomalies in data.',
            'Re-engineered and automated service activation workflows, slashing end-to-end processing turnaround times from weeks down to just 1–2 days.',
        ],
        skills: ['Python', 'SQL', 'ETL Pipelines', 'DBMS', 'Automations'],
        color: '#38BDF8',
        accentGlow: 'rgba(56, 189, 248, 0.6)',
        infoDesign: 'newspaper', catalogId: 'EXP-02', infoCategory: 'DATA ENGINEERING', formatLabel: 'ENTERPRISE ETL',
        imageCaption: 'STUDIO SESSION: PIPELINE WORKFLOW AUTOMATION',
        imageSrc: '/jazz_expereince.jpg',
        credits: { engineering: ['Python', 'SQL', 'ETL Pipelines'], orchestration: ['DBMS', 'Workflow Automation'], masteredAt: 'JAZZ' },
        newspaperData: {
            masthead: 'THE JAZZ JOURNAL',
            edition: 'THE AUTOMATION EDITION',
            byline: 'BY HASSAAN ANWAR | Data Engineering Intern',
        },
        shortTitle: 'D-ENG', coverFont: 'font-album-2',
        vinylLabel: 'JZZ',
    }
];
