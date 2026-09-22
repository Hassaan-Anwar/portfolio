import { Project } from '@/store/musicStore';

export const PROJECTS: Project[] = [
    {
        id: 0,
        title: 'Agentic Gen AI',
        subtitle: 'Prompt-to-Video System',
        year: '2025',
        description:
            'An end-to-end prompt-to-video agentic system generating short animated films via web UI and natural language edits.',
        longDescription: [
            "The **Agentic AI Video Generation System** is an end-to-end prompt-to-video platform. The architecture is driven by a **FastAPI** backend and a **React/Vite** frontend that orchestrates a sophisticated pipeline for creating short animated films entirely from text prompts.",
            "The multi-phase pipeline relies on **LangGraph** and **Groq** for structured script classification, passing the output into **ComfyUI** and **Stable Diffusion** for character imagery. Dialogue is synthesized through Edge TTS, while rendering and audio synchronization are handled directly by **MoviePy** and **FFmpeg**.",
            "It fundamentally incorporates a natural language edit-intent classification system connected to an **SQLite** state history, empowering users to execute versioned undo and revert actions fluidly across the **WebSocket**-powered interface."
        ],
        techStack: ['FastAPI', 'React', 'Groq', 'LangGraph', 'ComfyUI', 'FFmpeg', 'SQLite', 'MoviePy'],
        color: '#8B5CF6',
        accentGlow: 'rgba(139, 92, 246, 0.6)',
        githubUrl: 'https://github.com/saadnadeem554/Autonomous-Story-and-Image-Generation',
        infoDesign: 'album-cover', catalogId: 'PROJ-01', infoCategory: 'AGENTIC AI PLATFORM', formatLabel: 'END-TO-END SYSTEM',
        imageCaption: 'STUDIO SESSION: STABLE DIFFUSION RENDER',
        credits: { engineering: ['FastAPI', 'React', 'SQLite'], orchestration: ['LangGraph', 'Groq', 'Stable Diffusion'], masteredAt: 'DEV.LAIR ARCHIVE' },
        albumCoverData: {
            recordLabel: 'DEV.LAIR ARCHIVE',
            artist: 'HASSAAN ANWAR',
            releaseYear: '2025',
            sleeveColor: '#5b21b6', // slightly darkened variant of #8B5CF6
            sideA: [
                { title: 'Agentic Tooling & Routing', duration: '5:12' },
                { title: 'Generative RAG Pipelines', duration: '4:08' },
                { title: 'SQLite Memory Fabric', duration: '3:45' },
            ],
            sideB: [
                { title: 'FastAPI Async Layer', duration: '4:30' },
                { title: 'React Client App', duration: '2:55' },
                { title: 'Stable Diffusion Render', duration: '6:10' },
            ],
            producedBy: 'FastAPI · React · SQLite',
            recordedAt: 'LangGraph · Groq · ComfyUI',
        },
        vinylLabel: 'AGT',
        shortTitle: 'AGENT', coverFont: 'font-album-2',

    },
    {
        id: 1,
        title: 'DevSecOps Pipeline',
        subtitle: 'Netflix Clone on EKS',
        year: '2024',
        description:
            'An end-to-end DevSecOps pipeline for containerizing, securing, and deploying a Netflix clone application using AWS, Docker, Jenkins, and Kubernetes.',
        longDescription: [
            "This project demonstrates a production-grade DevSecOps implementation. It takes a React/Node.js-based Netflix web application integrated with the TMDB API, and deploys it via GitOps with **ArgoCD** to an **Amazon EKS** cluster.",
            "The CI/CD automation is built on **Jenkins** declarative pipelines with strict 'Shift-Left' security gates. Code undergoes static analysis via **SonarQube** and dependency scanning via **OWASP**, while Docker image filesystem vulnerabilities are secured with **Trivy** scanning before pushes to DockerHub.",
            "Full-stack observability is maintained through **Prometheus** web scaling and Node Exporters, visually aggregated inside a **Grafana** dashboard monitoring cluster resource utilization, JVM memory, and continuous pipeline health."
        ],
        techStack: ['AWS EKS', 'Jenkins', 'Docker', 'ArgoCD', 'SonarQube', 'Prometheus'],
        color: '#E50914',
        accentGlow: 'rgba(229, 9, 20, 0.6)',
        githubUrl: '#',
        infoDesign: 'album-cover', catalogId: 'DS-001', infoCategory: 'CLOUD INFRASTRUCTURE', formatLabel: 'DEVSECOPS PIPELINE',
        imageCaption: 'STUDIO SESSION: KUBERNETES SECURE PIPELINE',
        credits: { engineering: ['Jenkins', 'Docker', 'EKS'], orchestration: ['ArgoCD', 'SonarQube'], masteredAt: 'AWS CLOUD' },
        vinylLabel: 'D-OPS',
        shortTitle: 'N-FLIX', coverFont: 'font-album-3',
        albumCoverData: {
            recordLabel: 'CLOUD OBSERVE RECORDS',
            artist: 'HASSAAN ANWAR',
            releaseYear: '2024',
            sleeveColor: '#991b1b', // standard deep red
            sideA: [
                { title: 'Jenkins Declarative Pipeline', duration: '5:18' },
                { title: 'SonarQube Quality Gates', duration: '3:44' },
                { title: 'Trivy Filesystem Scans', duration: '2:57' },
            ],
            sideB: [
                { title: 'ArgoCD GitOps Sync', duration: '4:21' },
                { title: 'Amazon EKS Auto Scaling', duration: '6:05' },
                { title: 'Prometheus Node Exporter', duration: '3:30' },
            ],
            producedBy: 'Docker · Jenkins · EKS',
            recordedAt: 'SonarQube · ArgoCD · Prometheus',
        },
    },
    {
        id: 2,
        title: 'Parallel Algorithms',
        subtitle: 'Butterfly Computations',
        year: '2024',
        description:
            'A high-performance C++ implementation of parallel algorithms for butterfly network computations using OpenMP and OpenMPI.',
        longDescription: [
            "This project implements parallel algorithms for butterfly network computations, heavily referencing the research paper \"Parallel Algorithms for Butterfly Computations\" by Jessica Shi. It solves complex challenges in index-bit manipulations, data distribution, and partition-file parsing.",
            "Three distinct implementations were engineered: A **Sequential** layered computation model, an **OpenMP** version for shared-memory threads, and a distributed **OpenMPI** architecture using `MPI_Scatter` and `MPI_Gather` for data distribution.",
            "The final architecture integrated **METIS** for intelligent graph partitioning, balancing the workload across MPI processes to minimize inter-process communication overhead. The hybrid **MPI + OpenMP** approach achieved a massive **19.2× speedup**, reducing computation time from 718s (sequential baseline) down to just 37ms."
        ],
        techStack: ['C++', 'OpenMPI', 'OpenMP', 'METIS Partitioning', 'Bash'],
        color: '#3b82f6',
        accentGlow: 'rgba(59, 130, 246, 0.6)',
        githubUrl: 'https://github.com/Hassaan-Anwar/PDC_Butterfly',
        infoDesign: 'album-cover', catalogId: 'HPC-001', infoCategory: 'PARALLEL COMPUTING', formatLabel: 'DISTRIBUTED SYSTEMS',
        imageCaption: 'STUDIO SESSION: CLUSTER NODE PROFILING',
        credits: { engineering: ['C++', 'OpenMPI', 'OpenMP'], orchestration: ['METIS GRAPH', 'MPI_SCATTER'], masteredAt: 'COMPUTE CLUSTER' },
        albumCoverData: {
            recordLabel: 'HPC RECORDS',
            artist: 'HASSAAN ANWAR',
            releaseYear: '2024',
            sleeveColor: '#1e3a8a', // Dark blue
            sideA: [
                { title: 'Sequential Layered Model', duration: '6:22' },
                { title: 'OpenMP Shared Memory', duration: '4:48' },
                { title: 'OpenMPI Distributed Nodes', duration: '5:10' },
            ],
            sideB: [
                { title: 'Hybrid MPI + OpenMP', duration: '3:37' },
                { title: 'METIS Graph Partitioning', duration: '2:15' },
                { title: 'Index-Bit Operations', duration: '1:58' },
            ],
            producedBy: 'C++ · OpenMPI · OpenMP',
            recordedAt: 'METIS Graph Tools',
        },
        vinylLabel: 'B-FLY',
        shortTitle: 'B-FLY', coverFont: 'font-album-4',
    },
    {
        id: 3,
        title: 'Auto Driving Agent',
        subtitle: 'TORCS ML Classifier',
        year: '2023',
        description:
            'An end-to-end autonomous driving agent for The Open Racing Car Simulator (TORCS), utilizing machine learning classifiers trained on real-time vehicle telemetry.',
        longDescription: [
            "This project develops a fully autonomous driving agent for TORCS by training a machine learning classifier on recorded vehicle telemetry, entirely replacing hand-crafted heuristics with predictive autonomous modeling.",
            "The data pipeline samples track boundary sensors, wheel spin velocities, and slip angles in real-time. These features are cleaned, normalized, and mapped to target control labels derived from expert demonstration runs.",
            "A multi-class model processes this telemetry to automate five distinct control vectors simultaneously: optimal-line lateral steering, dynamic throttle acceleration, threshold trail-braking, and sequential gear shifting to prevent engine redlining."
        ],
        techStack: ['Python', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'TORCS'],
        color: '#10B981',
        accentGlow: 'rgba(16, 185, 129, 0.6)',
        githubUrl: 'https://github.com/mishalali-A2/TORCS',
        infoDesign: 'album-cover', catalogId: 'ML-003', infoCategory: 'MACHINE LEARNING', formatLabel: 'AUTONOMOUS VEHICLE',
        imageCaption: 'STUDIO SESSION: TORCS TELEMETRY TRAINING',
        credits: { engineering: ['Python', 'NumPy', 'Pandas'], orchestration: ['TensorFlow', 'Scikit-Learn'], masteredAt: 'TORCS SIM' },
        albumCoverData: {
            recordLabel: 'AUTONOMY RECORDS',
            artist: 'HASSAAN ANWAR',
            releaseYear: '2023',
            sleeveColor: '#064e3b', // Deep emerald green
            sideA: [
                { title: 'Lidar Boundary Feature Extraction', duration: '4:55' },
                { title: 'Vehicle Dynamics Processing', duration: '3:18' },
                { title: 'Multi-Class Classifier Training', duration: '7:04' },
            ],
            sideB: [
                { title: 'Lateral Steering Navigation', duration: '5:30' },
                { title: 'Dynamic Throttle & Braking', duration: '4:12' },
                { title: 'Sequential Gear Automation', duration: '2:46' },
            ],
            producedBy: 'Python · TensorFlow · Scikit-Learn',
            recordedAt: 'TORCS Sim · NumPy · Pandas',
        },
        vinylLabel: 'ML-DRV',
        shortTitle: 'A-DRV', coverFont: 'font-album-2',
    },
    {
        id: 4,
        title: 'Library Manager System',
        subtitle: 'Python Flask Application',
        year: '2023',
        description:
            'A comprehensive library management system built using Python Flask, emphasizing rigorous software engineering practices and Agile methodology.',
        longDescription: [
            "This platform was engineered with a strict adherence to Agile development principles, organized through priority-based sprint backlogs and iterative continuous delivery to ensure predictable feature releases.",
            "The system features a normalized relational database with transaction management, alongside robust security practices including session handling, password hashing, and SQL injection prevention via secured endpoints.",
            "A comprehensive dual-testing strategy was implemented, combining White Box unit testing (via pytest and mock objects) for core functionalities with Black Box integration testing to validate end-to-end API and UI behaviors."
        ],
        techStack: ['Python', 'Flask', 'Pytest', 'SQLite', 'Agile', 'Git'],
        color: '#FBBF24', // Amber/Gold
        accentGlow: 'rgba(251, 191, 36, 0.6)',
        githubUrl: 'https://github.com/Hassaan-Anwar/SE_Project',
        infoDesign: 'album-cover', catalogId: 'SWE-001', infoCategory: 'SOFTWARE ENGINEERING', formatLabel: 'FULL-STACK APPLICATION',
        imageCaption: 'STUDIO SESSION: AGILE SPRINT TESTING',
        credits: { engineering: ['Python', 'Flask', 'SQLite'], orchestration: ['Pytest', 'Git', 'Agile'], masteredAt: 'LOCAL DEV' },
        albumCoverData: {
            recordLabel: 'SOFTWARE CRAFT',
            artist: 'HASSAAN ANWAR',
            releaseYear: '2023',
            sleeveColor: '#b45309', // Bronze/Amber dark
            sideA: [
                { title: 'Agile Sprint Planning', duration: '3:24' },
                { title: 'Flask REST API Layer', duration: '5:08' },
                { title: 'Normalized Schema Design', duration: '4:37' },
            ],
            sideB: [
                { title: 'White Box Pytest Suite', duration: '2:51' },
                { title: 'Black Box API Integration', duration: '3:16' },
                { title: 'Session & Auth Validation', duration: '4:02' },
            ],
            producedBy: 'Python · Flask · HTML',
            recordedAt: 'Pytest · Git · SQLite',
        },
        vinylLabel: 'LIB-SYS',
        shortTitle: 'LIB-APP', coverFont: 'font-album-5',
    },
];
