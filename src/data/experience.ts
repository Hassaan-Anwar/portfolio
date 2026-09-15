export interface Experience {
    id: number;
    company: string;
    role: string;
    period: string;
    description: string;
    longDescription: string;
    skills: string[];
    color: string;
    accentGlow: string;
    vinylEmoji: string;
    vinylLabel: string;
}

export const EXPERIENCES: Experience[] = [
    {
        id: 0,
        company: 'TechVision Labs',
        role: 'Software Engineer',
        period: '2023 – 2024',
        description:
            'Built distributed microservices and optimized real-time data pipelines processing 500k events/day with sub-10ms latency.',
        longDescription:
            "At TechVision Labs I owned the core data-ingestion microservice portfolio, migrating a monolith to Go-based gRPC services on Kubernetes. Reduced p99 latency from 120ms to 8ms, introduced circuit-breaker patterns, and led a 6-engineer squad through two major product launches.",
        skills: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL', 'Redis', 'AWS'],
        color: '#FBBF24',
        accentGlow: 'rgba(0, 242, 254, 0.6)',
        vinylEmoji: '💻',
        vinylLabel: 'TVM',
    },
    {
        id: 1,
        company: 'NovaSpark Studio',
        role: 'Full-Stack Intern',
        period: '2022 – 2023',
        description:
            'Developed the client-facing dashboard from scratch, shipping 12 features end-to-end and reducing support tickets by 40%.',
        longDescription:
            "NovaSpark is a design-tech consultancy. I built their internal project-tracking dashboard using React and FastAPI, implemented role-based access control, integrated Stripe billing, and contributed pixel-perfect UI work that elevated the product design language. Mentored a junior developer throughout.",
        skills: ['React', 'TypeScript', 'Python', 'FastAPI', 'Stripe', 'PostgreSQL'],
        color: '#D97706',
        accentGlow: 'rgba(255, 0, 191, 0.6)',
        vinylEmoji: '🚀',
        vinylLabel: 'NSS',
    },
    {
        id: 2,
        company: 'Quantum Research Lab',
        role: 'Research Assistant',
        period: '2021 – 2022',
        description:
            'Co-authored a published paper on neural network pruning, achieving 3x model compression with less than 1% accuracy loss.',
        longDescription:
            "As a research assistant at the university AI Lab, I implemented and benchmarked magnitude-based and structured pruning algorithms across vision transformers and CNNs. Built the evaluation harness in PyTorch, ran experiments on HPC clusters, and co-authored the paper 'Structured Sparsity for Edge Inference' accepted at NeurIPS Workshop 2022.",
        skills: ['Python', 'PyTorch', 'CUDA', 'HPC', 'LaTeX', 'Weights & Biases'],
        color: '#CBB368',
        accentGlow: 'rgba(203, 179, 104, 0.6)',
        vinylEmoji: '🔬',
        vinylLabel: 'QRL',
    },
];
