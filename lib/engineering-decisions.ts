import {
    EVIDENCE_CLASSIFICATIONS,
    type EvidenceClassification,
    type EvidenceSource,
    type ProjectDecisionCard,
    type ProjectTechnicalEvidence,
} from "./project-evidence.ts";
import { getPortfolioProjectBySlug } from "./portfolio-projects.ts";

export const APPROVED_ENGINEERING_DECISION_PROJECTS = [
    "termstead",
    "pdfnest",
    "banking-platform",
] as const;

export type ApprovedEngineeringDecisionProject = (typeof APPROVED_ENGINEERING_DECISION_PROJECTS)[number];

export type EngineeringDecisionAlternative = {
    label: string;
    reasonNotChosen?: string;
};

export type EngineeringDecision = {
    id: string;
    projectSlug: ApprovedEngineeringDecisionProject;
    projectTitle: string;
    title: string;
    question: string;
    context: string;
    constraints?: readonly string[];
    decision: string;
    alternatives?: readonly EngineeringDecisionAlternative[];
    rationale: readonly string[];
    tradeoffs?: readonly string[];
    limitations?: readonly string[];
    classification: EvidenceClassification;
    evidence: readonly EvidenceSource[];
};

type DecisionOverlay = {
    id: string;
    projectSlug: ApprovedEngineeringDecisionProject;
    decisionTitle: string;
    question: string;
    context: string;
    constraints?: readonly string[];
    tradeoffs?: readonly string[];
    limitations?: readonly string[];
    additionalSourceIds?: readonly string[];
};

const pilotDecisionOverlays = [
    {
        id: "termstead-daemon-gui-ownership",
        projectSlug: "termstead",
        decisionTitle: "Keep workspace layout client-owned",
        question: "Who owns terminal sessions and authoritative terminal state?",
        context: "Termstead has a native product shell where workspace views and terminal sessions have different lifetimes.",
        constraints: [
            "The daemon owns PTYs, child processes, terminal state, revisions, modes, and session lifetime.",
            "The GUI owns windows, tabs, pane layout, focus, commands, and workspace policy.",
        ],
        tradeoffs: [
            "The split keeps presentation policy out of terminald, but the shell must maintain an explicit session/view binding across close, detach, reconnect, and termination.",
        ],
        limitations: [
            "The evidence does not establish daemon persistence across crash, reboot, or power loss.",
            "This is an ownership boundary, not a claim about complete GPUI product-shell functionality.",
        ],
    },
    {
        id: "termstead-snapshot-delta-authority",
        projectSlug: "termstead",
        decisionTitle: "Use event-driven synchronization with snapshots and deltas",
        question: "Which IPC messages carry authoritative terminal state?",
        context: "Visible sessions need updates without turning every pane into an independent polling loop.",
        constraints: [
            "FullSnapshot and RenderDelta must preserve identity and revision continuity.",
            "RenderReady may wake visible bindings but cannot replace authoritative state.",
        ],
        tradeoffs: [
            "Wake hints reduce polling work, but gap and reconnect recovery still depends on snapshots and contiguous deltas.",
        ],
        limitations: [
            "This does not establish display, frame, or input-to-display latency.",
            "The complete session-to-renderer lifecycle remains reserved for the future Systems Trace experience.",
        ],
    },
    {
        id: "platen-response-mode-per-workload",
        projectSlug: "pdfnest",
        decisionTitle: "Use response mode per workload",
        question: "When should PDF work remain on the request path versus leave for a worker?",
        context: "Platen PDF exposes document tools with different result lifetimes: direct blobs, long-running jobs, and previews.",
        constraints: [
            "The browser talks to the Go API; workers remain behind server-owned boundaries.",
            "Long-running work needs explicit job state, artifact ownership, cancellation, and cleanup.",
        ],
        tradeoffs: [
            "Direct paths keep bounded results in the request, while asynchronous paths add job, storage, polling, cancellation, and cleanup state.",
        ],
        limitations: [
            "The source shows implementation boundaries, not throughput, scalability, or speed outcomes.",
            "Not every document operation is asynchronous.",
        ],
    },
    {
        id: "platen-document-optional-boundary",
        projectSlug: "pdfnest",
        decisionTitle: "Keep platen-document optional and standalone",
        question: "Why is platen-document related to Platen PDF without being a required service?",
        context: "The portfolio groups the web/API/worker product with a separately published document-processing SDK.",
        constraints: [
            "Application-owned jobs, queues, storage, auth, billing, and UI remain outside the SDK.",
        ],
        tradeoffs: [
            "The separation keeps the SDK local-first and reusable, but integration requires explicit application adapters and does not collapse the product into one runtime.",
        ],
        limitations: [
            "This relationship does not prove production deployment, throughput, or scalability.",
        ],
    },
    {
        id: "banking-server-authorization",
        projectSlug: "banking-platform",
        decisionTitle: "Keep authorization server-owned",
        question: "What does Android device security protect, and what remains server-owned?",
        context: "Banking Platform spans a Spring API and React/Android clients with client-side navigation and token handling.",
        constraints: [
            "Protected resources must enforce authentication, roles, ownership, and session validity at the API boundary.",
            "Android Keystore and encryption protect local token storage; they do not decide server authorization.",
        ],
        tradeoffs: [
            "Client guards improve navigation and local protection, but the server must repeat authorization checks and can reject stale or invalid tokens.",
        ],
        limitations: [
            "The source shows code and configuration boundaries, not security certification or production deployment.",
        ],
        additionalSourceIds: ["android-storage", "android-security"],
    },
    {
        id: "banking-kyc-under-review-boundary",
        projectSlug: "banking-platform",
        decisionTitle: "Use review fallback for KYC uncertainty",
        question: "Why can KYC uncertainty route to UNDER_REVIEW rather than approval?",
        context: "KYC combines multiple checks and an external FastAPI aggregate call; missing or unavailable signals need an explicit policy outcome.",
        constraints: [
            "A low-score rejection branch is distinct from missing or unavailable evidence.",
            "The Spring service records check and reason data and retains a reviewable case state.",
        ],
        tradeoffs: [
            "UNDER_REVIEW preserves human reviewability but does not claim a favorable model outcome or eliminate operational follow-up.",
        ],
        limitations: [
            "Thresholds and policy code are not measured accuracy or false-rejection outcomes.",
            "Calibration tooling is not a completed calibration study.",
        ],
    },
] as const satisfies readonly DecisionOverlay[];

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

function optionalStringArray(value: unknown, path: string): readonly string[] | undefined {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries when present`);
    return value.map((item, index) => requiredString(item, `${path}[${index}]`));
}

function requiredStringArray(value: unknown, path: string): readonly string[] {
    const parsed = optionalStringArray(value, path);
    if (!parsed) throw new Error(`${path} must contain entries`);
    return parsed;
}

function approvedProject(value: unknown, path: string): ApprovedEngineeringDecisionProject {
    const parsed = requiredString(value, path) as ApprovedEngineeringDecisionProject;
    if (!APPROVED_ENGINEERING_DECISION_PROJECTS.includes(parsed)) {
        throw new Error(`${path} is not an approved engineering-decision project`);
    }
    return parsed;
}

function evidenceClassification(value: unknown, path: string): EvidenceClassification {
    const parsed = requiredString(value, path) as EvidenceClassification;
    if (!EVIDENCE_CLASSIFICATIONS.includes(parsed)) throw new Error(`${path} is not a supported evidence classification`);
    return parsed;
}

function parseAlternatives(value: unknown, path: string): readonly EngineeringDecisionAlternative[] | undefined {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries when present`);

    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            label: requiredString(record.label, `${path}[${index}].label`),
            ...(record.reasonNotChosen === undefined
                ? {}
                : { reasonNotChosen: requiredString(record.reasonNotChosen, `${path}[${index}].reasonNotChosen`) }),
        };
    });
}

function parseEvidence(value: unknown, path: string): readonly EvidenceSource[] {
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    const ids = new Set<string>();

    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        const id = requiredString(record.id, `${path}[${index}].id`);
        if (ids.has(id)) throw new Error(`${path} must have unique source ids`);
        ids.add(id);

        const url = requiredString(record.url, `${path}[${index}].url`);
        if (!/^https:\/\/github\.com\/gimesha-adikari\//i.test(url)) {
            throw new Error(`${path}[${index}].url must be a public gimesha-adikari GitHub URL`);
        }

        const commit = requiredString(record.commit, `${path}[${index}].commit`);
        if (!/^[0-9a-f]{40}$/i.test(commit)) throw new Error(`${path}[${index}].commit must be a 40-character commit SHA`);

        return {
            id,
            label: requiredString(record.label, `${path}[${index}].label`),
            url,
            commit,
            ...(record.date === undefined ? {} : { date: requiredString(record.date, `${path}[${index}].date`) }),
            description: requiredString(record.description, `${path}[${index}].description`),
        };
    });
}

export function validateEngineeringDecisions(value: unknown): EngineeringDecision[] {
    if (!Array.isArray(value) || value.length === 0) throw new Error("engineering decisions must contain entries");
    const ids = new Set<string>();

    const decisions = value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        const id = requiredString(record.id, `decisions[${index}].id`);
        if (ids.has(id)) throw new Error(`duplicate engineering decision id: ${id}`);
        ids.add(id);

        return {
            id,
            projectSlug: approvedProject(record.projectSlug, `decisions[${index}].projectSlug`),
            projectTitle: requiredString(record.projectTitle, `decisions[${index}].projectTitle`),
            title: requiredString(record.title, `decisions[${index}].title`),
            question: requiredString(record.question, `decisions[${index}].question`),
            context: requiredString(record.context, `decisions[${index}].context`),
            constraints: optionalStringArray(record.constraints, `decisions[${index}].constraints`),
            decision: requiredString(record.decision, `decisions[${index}].decision`),
            alternatives: parseAlternatives(record.alternatives, `decisions[${index}].alternatives`),
            rationale: requiredStringArray(record.rationale, `decisions[${index}].rationale`),
            tradeoffs: optionalStringArray(record.tradeoffs, `decisions[${index}].tradeoffs`),
            limitations: optionalStringArray(record.limitations, `decisions[${index}].limitations`),
            classification: evidenceClassification(record.classification, `decisions[${index}].classification`),
            evidence: parseEvidence(record.evidence, `decisions[${index}].evidence`),
        } satisfies EngineeringDecision;
    });

    return decisions;
}

function findDecision(projectSlug: ApprovedEngineeringDecisionProject, title: string): {
    projectTitle: string;
    evidence: ProjectTechnicalEvidence;
    decision: ProjectDecisionCard;
} {
    const project = getPortfolioProjectBySlug(projectSlug);
    if (!project?.technicalEvidence) throw new Error(`missing technical evidence for ${projectSlug}`);

    const decision = project.technicalEvidence.decisions.find((candidate) => candidate.title === title);
    if (!decision) throw new Error(`missing decision ${title} for ${projectSlug}`);

    return { projectTitle: project.title, evidence: project.technicalEvidence, decision };
}

function adaptDecision(overlay: DecisionOverlay): EngineeringDecision {
    const { projectTitle, evidence, decision } = findDecision(overlay.projectSlug, overlay.decisionTitle);
    const sourceIds = [...new Set([...decision.sources, ...(overlay.additionalSourceIds ?? [])])];
    const sources = sourceIds.map((sourceId) => {
        const source = evidence.sources.find((candidate) => candidate.id === sourceId);
        if (!source) throw new Error(`missing source ${sourceId} for ${overlay.id}`);
        return source;
    });

    return {
        id: overlay.id,
        projectSlug: overlay.projectSlug,
        projectTitle,
        title: decision.title,
        question: overlay.question,
        context: overlay.context,
        constraints: overlay.constraints,
        decision: decision.choice,
        alternatives: [{ label: decision.alternative }],
        rationale: [decision.rationale],
        tradeoffs: overlay.tradeoffs,
        limitations: overlay.limitations,
        classification: decision.classification,
        evidence: sources,
    };
}

const pilotDecisions = pilotDecisionOverlays.map(adaptDecision);

export const engineeringDecisions: readonly EngineeringDecision[] = validateEngineeringDecisions(pilotDecisions);

export function getAllEngineeringDecisions(): readonly EngineeringDecision[] {
    return engineeringDecisions;
}

export function getEngineeringDecisionsForProject(projectSlug: string): readonly EngineeringDecision[] {
    return engineeringDecisions.filter((decision) => decision.projectSlug === projectSlug);
}

export function hasEngineeringDecisions(projectSlug: string): boolean {
    return getEngineeringDecisionsForProject(projectSlug).length > 0;
}
