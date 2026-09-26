/**
 * @deprecated Legacy repository/story-shaped content retained during the Phase 2 migration.
 * Canonical project identity now lives in lib/portfolio-projects.ts.
 */
export type ProjectStory = {
    title?: string;
    summary?: string;
    role?: string;
    duration?: string;
    team?: string;
    category?: string;
    featured?: boolean;
    liveUrl?: string;
    githubUrl?: string;
    overview?: string;
    problem?: string;
    solution?: string;
    challenges?: string[];
    lessons?: string[];
    features?: string[];
    screenshots?: {
        src: string;
        alt: string;
        caption?: string;
    }[];
    architecture?: {
        title?: string;
        items: { label: string; value: string }[];
    };
};

export const projectStories: Record<string, ProjectStory> = {
    pdfnest: {
        title: "PDFNest",
        summary:
            "A full-stack document processing platform that provides a comprehensive suite of PDF tools with an emphasis on performance, usability, and modular architecture.",

        role: "Full-Stack Developer",

        duration: "2025 – Present",

        team: "Solo Project",

        category: "Developer Tools",

        featured: true,

        liveUrl: "https://pdfnest.com",

        githubUrl: "https://github.com/gimesha-adikari/pdfnest",

        overview:
            "PDFNest is a modern web application built to simplify PDF workflows through a unified and intuitive interface. Instead of offering only a handful of document utilities, the platform combines dozens of PDF operations into a single consistent experience. The application focuses on speed, maintainability, and extensibility by separating the user interface from the document-processing backend.",

        problem:
            "Most online PDF services either offer only a small collection of tools, limit free usage, or provide inconsistent experiences between features. Large document operations can also be slow and difficult to scale. The goal of PDFNest was to create a platform that feels responsive while supporting a growing collection of document-processing capabilities through a reusable backend architecture.",

        solution:
            "The platform was designed with a Next.js frontend and a Go backend that exposes modular processing services for each PDF operation. Shared upload, validation, and processing pipelines reduce code duplication while making it easy to introduce new document tools. Authentication, subscription management, SEO optimization, and responsive UI components were integrated to provide a complete production-ready experience.",

        features: [
            "30+ document processing tools",
            "Merge, split, rotate, crop, reorder and extract PDF pages",
            "Convert PDFs to images and images to PDFs",
            "PDF compression and optimization",
            "Password protection and unlocking",
            "Watermark and page numbering",
            "Metadata editing",
            "OCR support for scanned documents",
            "Responsive drag-and-drop interface",
            "Google OAuth authentication",
            "Subscription and usage management",
            "SEO-optimized dynamic tool pages"
        ],

        challenges: [
            "Designing reusable processing pipelines that could support dozens of independent PDF operations without duplicating backend logic.",
            "Balancing processing speed and memory usage when working with large PDF documents.",
            "Supporting different document types including scanned PDFs, digitally generated PDFs, and image-based workflows.",
            "Maintaining a consistent user experience across a rapidly expanding collection of tools.",
            "Creating a scalable architecture that allows new PDF features to be implemented with minimal changes to existing code.",
            "Optimizing page rendering, metadata generation, and search engine indexing for a large number of dynamic routes."
        ],

        lessons: [
            "Building reusable services dramatically reduces maintenance effort as the application grows.",
            "Well-defined processing pipelines are easier to extend than feature-specific implementations.",
            "User experience improvements often have as much impact as backend optimizations.",
            "Separating frontend concerns from processing logic improves maintainability and testing.",
            "Investing in reusable UI components significantly accelerates development of new features."
        ],

        screenshots: [
            {
                src: "/projects/pdfnest/home.webp",
                alt: "PDFNest landing page",
                caption: "Modern landing page introducing the PDFNest platform."
            },
            {
                src: "/projects/pdfnest/tools.webp",
                alt: "PDF tool collection",
                caption: "Browse the complete collection of PDF processing tools."
            },
            {
                src: "/projects/pdfnest/editor.webp",
                alt: "Interactive PDF processing interface",
                caption: "Interactive document upload and processing workflow."
            },
            {
                src: "/projects/pdfnest/dashboard.webp",
                alt: "Account dashboard",
                caption: "User dashboard with subscriptions and document usage."
            }
        ],

        architecture: {
            title: "Technology Stack",

            items: [
                {
                    label: "Frontend",
                    value: "Next.js 16, React, TypeScript"
                },
                {
                    label: "Backend",
                    value: "Go (Fiber)"
                },
                {
                    label: "Worker",
                    value: "Python (FastAPI/dramatiq)"
                },
                {
                    label: "Database",
                    value: "PostgreSQL + GORM"
                },
                {
                    label: "Authentication",
                    value: "JWT + Google OAuth"
                },
                {
                    label: "PDF Processing",
                    value: "pdfcpu, custom processing pipeline, OCR"
                },
                {
                    label: "Deployment",
                    value: "Docker-ready architecture"
                }
            ]
        }
    },

    pdfnestBackend: {
        title: "PDFNest Backend",

        summary:
            "A modular Go backend powering PDFNest, providing scalable APIs and high-performance document processing for a wide range of PDF operations.",

        role: "Backend Developer",

        duration: "2025 – Present",

        team: "Solo Project",

        category: "Backend API",

        featured: false,

        githubUrl: "https://github.com/gimesha-adikari/pdfnest-backend",

        overview:
            "PDFNest Backend is the core processing engine behind the PDFNest platform. Built with Go and Fiber, it exposes REST APIs responsible for authentication, document management, subscription handling, and computationally intensive PDF processing while remaining modular and extensible.",

        problem:
            "PDF processing tasks such as merging, OCR, image conversion, cropping, compression, and metadata editing are CPU-intensive and difficult to scale inside a frontend application. A dedicated backend was required to centralize processing while keeping the frontend lightweight and responsive.",

        solution:
            "The backend was designed around independent service modules where each document operation is implemented as an isolated processing pipeline. Authentication, billing, uploads, storage, and PDF processing are separated into reusable packages, making it straightforward to introduce additional document tools without affecting existing functionality.",

        features: [
            "REST API built with Go and Fiber",
            "Modular PDF processing services",
            "Authentication with JWT and OAuth support",
            "Subscription and billing management",
            "Image and document conversion",
            "OCR integration",
            "Metadata editing",
            "Password protection and unlocking",
            "File upload and validation pipeline",
            "Reusable service-oriented architecture"
        ],

        challenges: [
            "Designing reusable processing services shared across dozens of PDF operations.",
            "Managing memory efficiently while processing large document files.",
            "Maintaining consistent API behavior across many independent tools.",
            "Handling long-running processing tasks without degrading application responsiveness.",
            "Keeping the backend extensible as new document-processing features are introduced."
        ],

        lessons: [
            "Service-oriented architecture simplifies maintenance as backend capabilities grow.",
            "Separating API, business logic, and processing layers results in cleaner code and easier testing.",
            "Reusable validation and processing pipelines eliminate duplicated implementation across endpoints.",
            "Careful resource management is essential for file-processing applications."
        ],

        screenshots: [],

        architecture: {
            title: "Backend Architecture",

            items: [
                {
                    label: "Language",
                    value: "Go"
                },
                {
                    label: "Framework",
                    value: "Fiber"
                },
                {
                    label: "Database",
                    value: "PostgreSQL + GORM"
                },
                {
                    label: "Authentication",
                    value: "JWT + Google OAuth"
                },
                {
                    label: "Processing",
                    value: "Modular PDF processing services"
                },
                {
                    label: "API",
                    value: "REST"
                }
            ]
        }
    },
};
