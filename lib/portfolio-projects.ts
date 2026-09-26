import {
    termsteadTechnicalEvidence,
    validateProjectTechnicalEvidence,
    type ProjectTechnicalEvidence,
} from "./project-evidence.ts";

export type ProjectStatus = "active" | "complete" | "experimental";

export type ArchitectureBlock = {
    boundary: string;
    responsibility: string;
    technologies: readonly string[];
};

export type Decision = {
    decision: string;
    rationale: string;
};

export type Evidence = {
    label: string;
    description: string;
    source?: string;
};

export type ProjectImage = {
    src: string;
    alt: string;
    caption?: string;
};

export type ProjectRepository = {
    name: string;
    role: string;
    url: string;
};

export type RepositoryFacts = {
    name: string;
    role: string;
    url: string;
    sourceUrl: string;
    isPublic: boolean;
    updatedAt?: string;
    stars?: number;
    forks?: number;
    language?: string | null;
    defaultBranch?: string;
};

export type PortfolioProject = {
    slug: string;
    title: string;
    tagline: string;
    status: ProjectStatus;
    featured: boolean;
    order: number;
    role: string;
    period?: string;
    category?: string;
    problem: string;
    constraints: readonly string[];
    architecture: readonly ArchitectureBlock[];
    decisions: readonly Decision[];
    outcomes: readonly Evidence[];
    repositories: readonly ProjectRepository[];
    screenshots?: readonly ProjectImage[];
    caseStudies?: readonly string[];
    liveUrl?: string;
    contentNotes?: readonly string[];
    technicalEvidence?: ProjectTechnicalEvidence;
};

const PROJECT_STATUSES: readonly ProjectStatus[] = ["active", "complete", "experimental"];

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, path: string): string {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`${path} must be a non-empty string`);
    }
    return value.trim();
}

function optionalString(value: unknown, path: string): string | undefined {
    if (value === undefined || value === null) return undefined;
    return requiredString(value, path);
}

function stringArray(value: unknown, path: string, required = true): string[] {
    if (value === undefined && !required) return [];
    if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
    return value.map((item, index) => requiredString(item, `${path}[${index}]`));
}

function parseArchitecture(value: unknown, path: string): ArchitectureBlock[] {
    if (!Array.isArray(value)) throw new Error(`${path} must be an array`);

    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            boundary: requiredString(record.boundary, `${path}[${index}].boundary`),
            responsibility: requiredString(record.responsibility, `${path}[${index}].responsibility`),
            technologies: stringArray(record.technologies, `${path}[${index}].technologies`, false),
        };
    });
}

function parseDecisions(value: unknown, path: string): Decision[] {
    if (!Array.isArray(value)) throw new Error(`${path} must be an array`);

    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            decision: requiredString(record.decision, `${path}[${index}].decision`),
            rationale: requiredString(record.rationale, `${path}[${index}].rationale`),
        };
    });
}

function parseEvidence(value: unknown, path: string): Evidence[] {
    if (!Array.isArray(value)) throw new Error(`${path} must be an array`);

    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            label: requiredString(record.label, `${path}[${index}].label`),
            description: requiredString(record.description, `${path}[${index}].description`),
            source: optionalString(record.source, `${path}[${index}].source`),
        };
    });
}

function parseRepositories(value: unknown, path: string): ProjectRepository[] {
    if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`${path} must contain at least one repository`);
    }

    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        const url = requiredString(record.url, `${path}[${index}].url`);
        if (!/^https:\/\//i.test(url)) throw new Error(`${path}[${index}].url must use https`);

        return {
            name: requiredString(record.name, `${path}[${index}].name`),
            role: requiredString(record.role, `${path}[${index}].role`),
            url,
        };
    });
}

function parseScreenshots(value: unknown, path: string): ProjectImage[] | undefined {
    if (value === undefined) return undefined;
    if (!Array.isArray(value)) throw new Error(`${path} must be an array`);

    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            src: requiredString(record.src, `${path}[${index}].src`),
            alt: requiredString(record.alt, `${path}[${index}].alt`),
            caption: optionalString(record.caption, `${path}[${index}].caption`),
        };
    });
}

function parseProject(value: unknown, index: number): PortfolioProject {
    const path = `projects[${index}]`;
    const record = isRecord(value) ? value : {};
    const status = requiredString(record.status, `${path}.status`) as ProjectStatus;

    if (!PROJECT_STATUSES.includes(status)) throw new Error(`${path}.status is invalid`);
    if (typeof record.featured !== "boolean") throw new Error(`${path}.featured must be boolean`);
    if (typeof record.order !== "number" || !Number.isInteger(record.order)) {
        throw new Error(`${path}.order must be an integer`);
    }

    const liveUrl = optionalString(record.liveUrl, `${path}.liveUrl`);
    if (liveUrl && !/^https:\/\//i.test(liveUrl)) throw new Error(`${path}.liveUrl must use https`);

    return {
        slug: requiredString(record.slug, `${path}.slug`),
        title: requiredString(record.title, `${path}.title`),
        tagline: requiredString(record.tagline, `${path}.tagline`),
        status,
        featured: record.featured,
        order: record.order,
        role: requiredString(record.role, `${path}.role`),
        period: optionalString(record.period, `${path}.period`),
        category: optionalString(record.category, `${path}.category`),
        problem: requiredString(record.problem, `${path}.problem`),
        constraints: stringArray(record.constraints, `${path}.constraints`),
        architecture: parseArchitecture(record.architecture, `${path}.architecture`),
        decisions: parseDecisions(record.decisions, `${path}.decisions`),
        outcomes: parseEvidence(record.outcomes, `${path}.outcomes`),
        repositories: parseRepositories(record.repositories, `${path}.repositories`),
        screenshots: parseScreenshots(record.screenshots, `${path}.screenshots`),
        caseStudies: record.caseStudies === undefined
            ? undefined
            : stringArray(record.caseStudies, `${path}.caseStudies`),
        liveUrl,
        contentNotes: record.contentNotes === undefined
            ? undefined
            : stringArray(record.contentNotes, `${path}.contentNotes`),
        technicalEvidence: record.technicalEvidence === undefined
            ? undefined
            : validateProjectTechnicalEvidence(record.technicalEvidence),
    };
}

export function validatePortfolioProjects(value: unknown): PortfolioProject[] {
    if (!Array.isArray(value)) throw new Error("projects must be an array");

    const projects = value.map(parseProject);
    const slugs = new Set<string>();
    const orders = new Set<number>();

    for (const project of projects) {
        if (slugs.has(project.slug)) throw new Error(`duplicate project slug: ${project.slug}`);
        if (orders.has(project.order)) throw new Error(`duplicate project order: ${project.order}`);
        slugs.add(project.slug);
        orders.add(project.order);
    }

    return projects;
}

const curatedProjectData = [
    {
        slug: "termstead",
        title: "Termstead",
        tagline: "A native terminal product shell built around daemon-owned sessions and a client-owned workspace.",
        status: "active",
        featured: true,
        order: 10,
        role: "Systems software engineer",
        category: "Systems software",
        problem: "Build a native terminal product without mixing GUI layout policy with PTY, process, and terminal-session authority.",
        constraints: [
            "The daemon owns PTYs, child processes, terminal state, revisions, modes, and session lifetime.",
            "The GUI owns windows, workspaces, tabs, pane layout, focus, commands, and client-side workspace policy.",
            "Terminal state reaches the renderer through validated full snapshots and revision-contiguous deltas.",
            "The optimized terminal canvas must remain separate from ordinary product chrome and per-cell widgets.",
        ],
        architecture: [
            {
                boundary: "Daemon and session authority",
                responsibility: "Own PTYs, child processes, authoritative terminal state, terminal modes, revisions, and daemon-session lifetime.",
                technologies: ["Rust", "terminald", "PTYs"],
            },
            {
                boundary: "GUI shell and workspace",
                responsibility: "Own windows, tabs, recursive pane layout, focus, overlays, commands, and client-side workspace policy.",
                technologies: ["Rust", "GPUI"],
            },
            {
                boundary: "IPC and rendering",
                responsibility: "Carry validated snapshots/deltas across the IPC boundary and paint the terminal grid through one optimized canvas.",
                technologies: ["Unix sockets", "SessionHub", "terminal-render"],
            },
        ],
        decisions: [
            {
                decision: "Keep layout client-owned while sessions remain daemon-owned.",
                rationale: "This preserves the authority boundary and lets tabs, splits, and persistence evolve without putting presentation policy into terminald.",
            },
            {
                decision: "Treat a pane as a view of one daemon session rather than equating a tab with a process.",
                rationale: "View lifetime and process lifetime need separate close, detach, reconnect, and explicit termination semantics.",
            },
            {
                decision: "Use event-driven visible-session synchronization with snapshots and deltas as authority.",
                rationale: "Wake hints and bounded routing reduce unnecessary polling while keeping the daemon state authoritative.",
            },
        ],
        outcomes: [
            {
                label: "Architecture evidence",
                description: "The repository documents the product-shell hierarchy, daemon/GUI ownership invariants, IPC boundary, and renderer constraints.",
                source: "termstead/docs/product-shell-architecture.md",
            },
            {
                label: "Lifecycle and stress evidence",
                description: "Session lifecycle, performance, benchmark, and acceptance material is kept in the Termstead repository; detailed figures remain in that evidence rather than being duplicated as portfolio claims.",
                source: "termstead/docs/product-shell-m8-v1-acceptance.md",
            },
        ],
        technicalEvidence: termsteadTechnicalEvidence,
        repositories: [
            {
                name: "termstead",
                role: "Native terminal product, daemon, IPC, session lifecycle, and renderer workspace",
                url: "https://github.com/gimesha-adikari/termstead",
            },
        ],
        caseStudies: [],
        contentNotes: [
            "No quantitative benchmark is promoted into the summary model; future evidence content should include methodology and caveats.",
        ],
    },
    {
        slug: "pdfnest",
        title: "Platen PDF",
        tagline: "A multi-repository document platform that separates the web workspace, Go API, and Python processing boundary.",
        status: "active",
        featured: true,
        order: 20,
        role: "Full-stack developer",
        period: "2025 – Present",
        category: "Developer tools",
        problem: "Coordinate browser workflows and document processing without turning every PDF operation into a separate, inconsistent implementation.",
        constraints: [
            "The web application, API, and worker have separate responsibilities and release surfaces.",
            "Uploads, validation, processing, and downloads need reusable boundaries across document workflows.",
            "PDF edge cases, OCR, and long-running processing require explicit failure and resource-handling decisions.",
            "The public product is Platen PDF while the web, API, and worker repositories retain their historical PDFNest-era names.",
        ],
        architecture: [
            {
                boundary: "Web application",
                responsibility: "Provide the Next.js/React/TypeScript document workspace, tool routes, shared UI, and browser-side workflow.",
                technologies: ["Next.js", "React", "TypeScript"],
            },
            {
                boundary: "Backend/API",
                responsibility: "Expose the Go/Fiber API and modular document, authentication, upload, and persistence boundaries.",
                technologies: ["Go", "Fiber", "PostgreSQL", "GORM"],
            },
            {
                boundary: "Processing worker",
                responsibility: "Handle Python/FastAPI and Dramatiq/Redis processing work that should not be owned by the browser shell.",
                technologies: ["Python", "FastAPI", "Dramatiq", "Redis"],
            },
            {
                boundary: "Related document SDK",
                responsibility: "Provide the local-first, separately published document-processing SDK extracted from the earlier PDFNest OCR work; it can integrate through explicit engine selectors without being required by the Platen PDF runtime.",
                technologies: ["Python", "Document SDK"],
            },
        ],
        decisions: [
            {
                decision: "Represent the frontend, Go backend, worker, and related SDK as one portfolio project with explicit repository roles.",
                rationale: "The system boundary is more meaningful than treating each implementation repository as an independent flagship.",
            },
            {
                decision: "Use reusable upload, validation, workspace, and processing boundaries.",
                rationale: "The existing project material and case studies identify these shared patterns as the useful architectural content to preserve.",
            },
        ],
        outcomes: [
            {
                label: "Migrated project architecture",
                description: "The previous document-platform story material is represented as one Platen PDF system without carrying over unsupported production or performance claims.",
                source: "data/projects.ts",
            },
            {
                label: "Case-study evidence",
                description: "Current case studies cover the modular document platform, PDF edge cases, file processing, OCR extraction, and dynamic tool routing.",
                source: "content/case-studies/",
            },
        ],
        repositories: [
            {
                name: "pdfnest",
                role: "Frontend/web application and document workspace",
                url: "https://github.com/gimesha-adikari/pdfnest",
            },
            {
                name: "pdfnest-backend",
                role: "Go backend/API and document service boundary",
                url: "https://github.com/gimesha-adikari/pdfnest-backend",
            },
            {
                name: "pdfnest-worker",
                role: "Python/FastAPI processing worker",
                url: "https://github.com/gimesha-adikari/pdfnest-worker",
            },
            {
                name: "platen-document",
                role: "Related standalone local-first document/OCR SDK and optional processing engine",
                url: "https://github.com/gimesha-adikari/platen-document",
            },
        ],
        screenshots: [],
        caseStudies: [
            "modular-document-platform",
            "pdf-edge-case-handling",
            "high-performance-file-processing",
            "dynamic-tool-routing-system",
            "ocr-document-extraction",
        ],
        liveUrl: "https://platenpdf.com",
        contentNotes: [
            "The existing static screenshot paths are not tracked in this repository, so they are not promoted into the canonical model.",
            "Platen PDF is the public product/display name; the stable portfolio route remains /projects/pdfnest.",
            "The web, API, and worker repositories retain their historical PDFNest-era names, while platen-document remains an independent local-first SDK.",
        ],
    },
    {
        slug: "banking-platform",
        title: "Banking Platform",
        tagline: "A multi-client banking system grouping core services, web operations, Android flows, and KYC boundaries.",
        status: "active",
        featured: true,
        order: 30,
        role: "Software engineer",
        category: "Financial systems",
        problem: "Keep core banking, web, mobile, and identity-verification concerns explicit while the clients and services evolve together.",
        constraints: [
            "The core backend, web application, Android client, and KYC service have separate interfaces and responsibilities.",
            "Verification behavior must remain scoped to the KYC service rather than being implied by the portfolio project identity.",
            "The former route was synthetic and repository-derived; the portfolio slug must now resolve to one curated system record.",
        ],
        architecture: [
            {
                boundary: "Core banking and web",
                responsibility: "Provide the Spring Boot banking backend and React/Vite web application contained in the BankingSystem repository.",
                technologies: ["Spring Boot", "Java", "Hibernate", "MySQL", "React", "Vite"],
            },
            {
                boundary: "KYC service",
                responsibility: "Keep FastAPI identity-verification and document-processing concerns as an explicit service boundary.",
                technologies: ["FastAPI", "ONNX", "OCR"],
            },
            {
                boundary: "Android wallet",
                responsibility: "Represent the separate Kotlin/Android client as part of the same banking product story.",
                technologies: ["Kotlin", "Android", "Retrofit", "OkHttp"],
            },
        ],
        decisions: [
            {
                decision: "Group BankingSystem and BankApp under one curated Banking Platform project.",
                rationale: "The repository structures and existing case-study material describe a single multi-client banking system rather than unrelated flagship projects.",
            },
            {
                decision: "Keep KYC as a component boundary instead of a separate public flagship by default.",
                rationale: "The verified repository places the AI/KYC service alongside the core and web components, while the former AI Verification route was synthetic.",
            },
        ],
        outcomes: [
            {
                label: "Repository grouping evidence",
                description: "BankingSystem contains backend, web-frontend, and ai-service components; BankApp supplies the separate Android application.",
                source: "https://github.com/gimesha-adikari/BankingSystem",
            },
            {
                label: "Claims intentionally scoped",
                description: "Legacy false-reject, manual-review, and similar outcome claims are not promoted until reproducible evidence is attached.",
                source: "content/case-studies/modular-kyc-architecture.yml",
            },
        ],
        repositories: [
            {
                name: "BankingSystem",
                role: "Spring Boot core, React web client, and FastAPI KYC monorepo",
                url: "https://github.com/gimesha-adikari/BankingSystem",
            },
            {
                name: "BankApp",
                role: "Kotlin/Android banking client",
                url: "https://github.com/gimesha-adikari/BankApp",
            },
        ],
        caseStudies: ["modular-kyc-architecture", "resilient-mobile-payments"],
        contentNotes: [
            "The curated slug is banking-platform; BankingSystem and BankApp remain the source repository identities.",
        ],
    },
    {
        slug: "polyshop",
        title: "PolyShop",
        tagline: "A service-oriented commerce system retained as a non-featured secondary project pending deeper evidence review.",
        status: "experimental",
        featured: false,
        order: 40,
        role: "Systems/backend engineer",
        category: "Distributed systems lab",
        problem: "Explore explicit service boundaries and cross-service coordination in an e-commerce system.",
        constraints: [
            "The repository must be evaluated from its actual service, gateway, infrastructure, and QA layout.",
            "README-described technologies are useful leads but are not treated as independently verified production outcomes.",
        ],
        architecture: [
            {
                boundary: "Service and gateway layout",
                responsibility: "Organize the commerce system into services behind an API gateway with shared libraries and infrastructure material.",
                technologies: ["Spring Boot", "API gateway", "Java"],
            },
            {
                boundary: "Messaging and data",
                responsibility: "Record the repository's described messaging, cache, and relational data components without asserting operational scale.",
                technologies: ["Kafka", "Redis", "PostgreSQL", "MySQL"],
            },
            {
                boundary: "Verification and QA",
                responsibility: "Keep contract, API, and load-test artifacts associated with the project for later evidence review.",
                technologies: ["Pact", "k6", "Newman"],
            },
        ],
        decisions: [
            {
                decision: "Keep PolyShop curated but non-featured in this phase.",
                rationale: "The public repository layout and README support a meaningful project record, but the stronger service-boundary, saga, contract-testing, and load-testing claims still need direct verification before flagship promotion.",
            },
        ],
        outcomes: [
            {
                label: "Repository evidence",
                description: "The public repository contains common libraries, gateway, infrastructure, services, and QA areas.",
                source: "https://github.com/gimesha-adikari/PolyShop",
            },
            {
                label: "Evidence boundary",
                description: "No production-readiness, scalability, latency, or throughput claim is published from README language alone.",
                source: "PolyShop README and source audit pending",
            },
        ],
        repositories: [
            {
                name: "PolyShop",
                role: "Service-oriented commerce system",
                url: "https://github.com/gimesha-adikari/PolyShop",
            },
        ],
        caseStudies: [],
        contentNotes: [
            "A direct source-level audit of the distributed-system claims remains a later evidence task.",
        ],
    },
    {
        slug: "runyard",
        title: "Runyard",
        tagline: "An experimental local-first desktop workspace for discovering projects and running development workflows.",
        status: "experimental",
        featured: false,
        order: 50,
        role: "Experimental systems builder",
        category: "Lab / desktop tooling",
        problem: "Make local project discovery, service detection, terminal work, and run configuration easier to manage from one desktop workflow.",
        constraints: [
            "Project discovery and execution must remain local-first.",
            "PTY/process lifecycle, Git operations, IDE detection, and run configurations need explicit safety boundaries.",
        ],
        architecture: [
            {
                boundary: "Desktop shell",
                responsibility: "Provide the native application shell and local project/workflow controls.",
                technologies: ["Tauri 2", "Rust", "React", "TypeScript"],
            },
            {
                boundary: "Local execution",
                responsibility: "Discover projects and coordinate terminal/process, Git, IDE, and run-configuration workflows with execution-trust controls.",
                technologies: ["SQLite", "PTY", "Git"],
            },
        ],
        decisions: [
            {
                decision: "Keep Runyard in the lab/in-progress layer.",
                rationale: "The repository contains a useful desktop-tooling direction, but it is not promoted to a flagship until the story and current implementation evidence are more complete.",
            },
        ],
        outcomes: [
            {
                label: "Lab evidence",
                description: "The repository README and source describe project discovery, multi-service detection, PTY/process lifecycle, Git and IDE workflows, and execution-trust controls.",
                source: "https://github.com/gimesha-adikari/Runyard",
            },
        ],
        repositories: [
            {
                name: "Runyard",
                role: "Experimental local-first desktop tooling",
                url: "https://github.com/gimesha-adikari/Runyard",
            },
        ],
        caseStudies: [],
    },
    {
        slug: "neurosim",
        title: "NeuroSim",
        tagline: "An educational browser-based neural-network simulator kept as an experimental learning project.",
        status: "experimental",
        featured: false,
        order: 60,
        role: "Educational project contributor",
        category: "Educational experiment",
        problem: "Make neural-network simulation behavior explorable through a browser interface.",
        constraints: [
            "The browser visualization and simulation flow should remain understandable as an educational project.",
            "Rendering behavior is documented qualitatively; no unmeasured smoothness or device-performance claim is promoted here.",
        ],
        architecture: [
            {
                boundary: "Web application",
                responsibility: "Serve the simulator and browser interaction flow.",
                technologies: ["Python", "Flask"],
            },
            {
                boundary: "Simulation view",
                responsibility: "Render the neural-network visualization and interaction surface in the browser.",
                technologies: ["HTML", "JavaScript", "Canvas"],
            },
        ],
        decisions: [
            {
                decision: "Keep NeuroSim educational and experimental.",
                rationale: "The repository and legacy case study support a learning-oriented simulator story, not a flagship production-system claim.",
            },
        ],
        outcomes: [
            {
                label: "Educational evidence",
                description: "The repository README and case-study material describe a Flask-backed browser neural-network simulator with an interactive rendering path.",
                source: "https://github.com/gimesha-adikari/neurosim",
            },
        ],
        repositories: [
            {
                name: "neurosim",
                role: "Educational browser neural-network simulator",
                url: "https://github.com/gimesha-adikari/neurosim",
            },
        ],
        caseStudies: ["browser-rendering-optimization"],
    },
] as const satisfies readonly PortfolioProject[];

export const portfolioProjects: readonly PortfolioProject[] = validatePortfolioProjects(curatedProjectData);

export function getAllPortfolioProjects(): readonly PortfolioProject[] {
    return portfolioProjects;
}

export function getFeaturedPortfolioProjects(): readonly PortfolioProject[] {
    return portfolioProjects.filter((project) => project.featured);
}

export function getPortfolioProjectBySlug(slug: string): PortfolioProject | undefined {
    return portfolioProjects.find((project) => project.slug === slug);
}

export function getCuratedRepositoryNames(): ReadonlySet<string> {
    return new Set(portfolioProjects.flatMap((project) => project.repositories.map((repository) => repository.name)));
}
