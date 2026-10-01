import {
    termsteadTechnicalEvidence,
    validateProjectTechnicalEvidence,
    type ProjectTechnicalEvidence,
} from "./project-evidence.ts";
import { bankingPlatformTechnicalEvidence } from "./banking-platform-evidence.ts";
import { platenPdfTechnicalEvidence } from "./platen-pdf-evidence.ts";
import { polyshopTechnicalEvidence } from "./polyshop-evidence.ts";

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
        technicalEvidence: platenPdfTechnicalEvidence,
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
        tagline: "A multi-client banking system spanning a Spring Boot core, Next.js web application, Android client, and FastAPI KYC service.",
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
                boundary: "Core banking backend",
                responsibility: "Own the authoritative Spring Boot banking API, authentication, authorization, customers, accounts, financial workflows, ledger, MySQL/Flyway persistence, KYC orchestration, and server-side banking rules.",
                technologies: ["Spring Boot", "Java", "Hibernate/JPA", "MySQL", "Flyway"],
            },
            {
                boundary: "Web application",
                responsibility: "Provide supported customer, staff, and administrative browser workflows through a typed bank-core API boundary.",
                technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
            },
            {
                boundary: "KYC service",
                responsibility: "Own FastAPI KYC component checks and aggregate verification policy consumed by bank-core; optional ONNX/Tesseract modules are not presented as the default runtime path.",
                technologies: ["Python", "FastAPI", "OCR", "Vision check modules"],
            },
            {
                boundary: "Android application",
                responsibility: "Provide native Kotlin/Android banking, account, KYC, wallet, and device-local security flows.",
                technologies: ["Kotlin", "Android", "Retrofit", "OkHttp"],
            },
        ],
        decisions: [
            {
                decision: "Represent four independently versioned repositories as one Banking Platform.",
                rationale: "Repository ownership follows the backend, web, AI/KYC, and Android deployable/client boundaries while the portfolio presents them as one multi-client banking system.",
            },
            {
                decision: "Keep KYC as a component boundary instead of a separate public flagship by default.",
                rationale: "The KYC service has its own repository and explicit HTTP boundary, while the former AI Verification route was synthetic and the curated project remains the correct product-level grouping.",
            },
        ],
        outcomes: [
            {
                label: "Repository grouping evidence",
                description: "Four independently versioned repositories expose the Spring backend, Next.js web client, FastAPI KYC service, and Android client through explicit boundaries.",
                source: "https://github.com/gimesha-adikari/bank-web",
            },
            {
                label: "Claims intentionally scoped",
                description: "Legacy false-reject, manual-review, and similar outcome claims remain unpublished because reproducible labeled outcome evidence is not attached.",
                source: "content/case-studies/modular-kyc-architecture.yml",
            },
        ],
        repositories: [
            {
                name: "bank-core",
                role: "Spring Boot authoritative banking backend",
                url: "https://github.com/gimesha-adikari/bank-core",
            },
            {
                name: "bank-web",
                role: "Next.js web frontend",
                url: "https://github.com/gimesha-adikari/bank-web",
            },
            {
                name: "bank-service",
                role: "FastAPI AI/KYC service",
                url: "https://github.com/gimesha-adikari/bank-service",
            },
            {
                name: "bank-app",
                role: "Kotlin/Android banking client",
                url: "https://github.com/gimesha-adikari/bank-app",
            },
        ],
        caseStudies: ["modular-kyc-architecture", "resilient-mobile-payments"],
        technicalEvidence: bankingPlatformTechnicalEvidence,
        contentNotes: [
            "The curated slug is banking-platform; bank-core, bank-web, bank-service, and bank-app remain independently versioned source repositories.",
            "KYC thresholds and decision branches are source-backed policy evidence, not measured accuracy or false-rejection outcomes.",
        ],
    },
    {
        slug: "polyshop",
        title: "PolyShop",
        tagline: "A source-audited service-oriented commerce lab with explicit boundaries, shared contracts, and documented distributed-workflow designs.",
        status: "experimental",
        featured: false,
        order: 40,
        role: "Systems/backend engineer",
        category: "Distributed systems lab",
        problem: "Explore how an e-commerce system can separate identity, commerce domains, gateway concerns, shared contracts, infrastructure, and verification assets.",
        constraints: [
            "The public main snapshot must be read as the evidence boundary; README and design documents are not treated as runtime proof.",
            "Implemented auth and narrow messaging evidence must remain distinct from scaffolded services and planned distributed workflows.",
            "Docker, Kubernetes, Pact, Newman, and k6 assets are recorded without implying that they were built, applied, or executed.",
        ],
        architecture: [
            {
                boundary: "Repository service boundaries",
                responsibility: "Separate auth, product, inventory, order, payment, notification, search, and analytics areas; the audited source shows substantial implementation only in auth.",
                technologies: ["Spring Boot", "FastAPI", "Express", "Java", "Python", "Node.js"],
            },
            {
                boundary: "Gateway and contracts",
                responsibility: "Pair a gateway module and OpenAPI assets with shared Java, TypeScript, and Python DTO/event helpers; runtime gateway routes remain planned.",
                technologies: ["Spring Cloud Gateway", "OpenAPI 3.1", "Shared DTOs", "Event contracts"],
            },
            {
                boundary: "Messaging, infrastructure, and QA",
                responsibility: "Keep one narrow auth audit producer, declared Kafka/Redis/Compose/Kubernetes resources, and Pact/Postman/k6 assets visible with their execution limits.",
                technologies: ["KafkaTemplate", "Redis (planned)", "Docker Compose", "Kubernetes", "Pact", "k6", "Newman"],
            },
        ],
        decisions: [
            {
                decision: "Keep PolyShop curated but non-featured.",
                rationale: "The source audit supports a useful service/layout/contract record, but the executable distributed workflow and operational evidence are not deep enough for homepage flagship promotion.",
            },
            {
                decision: "Separate executable source from design and test assets.",
                rationale: "Auth implementation, one optional Kafka audit producer, shared contracts, docs, infrastructure, and QA files have different evidence strengths and should not be collapsed into one runtime claim.",
            },
            {
                decision: "Treat the order saga and Redis boundary as designed/planned.",
                rationale: "The repository contains design/configuration material, but no executable saga orchestrator or Redis client was found at the audited commit.",
            },
        ],
        outcomes: [
            {
                label: "Source-audited boundary",
                description: "The public main snapshot contains named services, a gateway module, shared OpenAPI/event assets, local infrastructure, Kubernetes manifests, and QA files; implementation depth varies by area.",
                source: "https://github.com/gimesha-adikari/PolyShop",
            },
            {
                label: "Implemented core",
                description: "Auth provides the strongest executable slice: RS256 JWTs, persisted hashed token records, account state, rate-limit filters, and audit persistence with an optional narrow Kafka producer.",
                source: "https://github.com/gimesha-adikari/PolyShop/blob/2e818de0c772fd186da27640933da71d1cda43e5/services/auth-service/src/main/java/com/polyshop/authservice/controller/AuthController.java",
            },
            {
                label: "Evidence boundary",
                description: "Saga orchestration, Redis runtime use, full Kafka consumers, CI/CD, deployment, scale, and measured performance remain unpublished because the current source does not establish them.",
                source: "https://github.com/gimesha-adikari/PolyShop/tree/2e818de0c772fd186da27640933da71d1cda43e5",
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
        technicalEvidence: polyshopTechnicalEvidence,
        contentNotes: [
            "PolyShop was audited against public main at 2e818de0c772fd186da27640933da71d1cda43e5; source-backed and design-only claims are separated in the evidence record.",
            "The project remains non-featured and absent from homepage flagship selectors; a future evidence pass may revisit promotion without changing this record's source boundary.",
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
