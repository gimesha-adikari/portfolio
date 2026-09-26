export const EVIDENCE_CLASSIFICATIONS = [
    "IMPLEMENTED",
    "MEASURED",
    "ACCEPTED",
    "DESIGNED / PLANNED",
    "DEFERRED",
    "NOT TESTED",
    "ENVIRONMENT-LIMITED",
] as const;

export type EvidenceClassification = (typeof EVIDENCE_CLASSIFICATIONS)[number];

export type EvidenceSource = {
    id: string;
    label: string;
    url: string;
    commit: string;
    date?: string;
    description: string;
};

export type ProjectOwnershipBoundary = {
    boundary: string;
    owner: string;
    responsibility: string;
    classification: EvidenceClassification;
    sources: readonly string[];
};

export type ProjectIpcBoundary = {
    boundary: string;
    behavior: string;
    classification: EvidenceClassification;
    sources: readonly string[];
};

export const PROJECT_WORKFLOW_MODES = ["sync", "async", "preview"] as const;
export type ProjectWorkflowMode = (typeof PROJECT_WORKFLOW_MODES)[number];

export type ProjectWorkflow = {
    title: string;
    entryPoint: string;
    mode: ProjectWorkflowMode;
    owner: string;
    processing: string;
    result: string;
    classification: EvidenceClassification;
    sources: readonly string[];
};

export type ProjectLifecycleStep = {
    phase: string;
    actor: string;
    action: string;
    result: string;
    classification: EvidenceClassification;
    sources: readonly string[];
};

export type ProjectFileLifecycle = {
    title: string;
    description: string;
    steps: readonly ProjectLifecycleStep[];
};

export type ProjectProcessingPath = {
    title: string;
    boundary: string;
    behavior: string;
    classification: EvidenceClassification;
    limitations: readonly string[];
    sources: readonly string[];
};

export type ProjectFailureBoundary = {
    boundary: string;
    trigger: string;
    behavior: string;
    classification: EvidenceClassification;
    sources: readonly string[];
};

export type ProjectDecisionCard = {
    title: string;
    choice: string;
    rationale: string;
    alternative: string;
    classification: EvidenceClassification;
    sources: readonly string[];
};

export type ProjectEvidenceMeasurement = {
    claim: string;
    result: string;
    context: string;
    classification: EvidenceClassification;
    method: string;
    environment: string;
    sample: string;
    limitations: readonly string[];
    sources: readonly string[];
};

export type ProjectDebuggingStory = {
    title: string;
    symptom: string;
    rootCause: string;
    correction: string;
    verification: string;
    classification: EvidenceClassification;
    limitations: readonly string[];
    sources: readonly string[];
};

export type ProjectTechnicalEvidence = {
    introduction: string;
    ownership: readonly ProjectOwnershipBoundary[];
    ipc: readonly ProjectIpcBoundary[];
    workflows?: readonly ProjectWorkflow[];
    lifecycle: readonly ProjectLifecycleStep[];
    fileLifecycles?: readonly ProjectFileLifecycle[];
    processingPaths?: readonly ProjectProcessingPath[];
    failureBoundaries?: readonly ProjectFailureBoundary[];
    decisions: readonly ProjectDecisionCard[];
    measurements: readonly ProjectEvidenceMeasurement[];
    debuggingStories: readonly ProjectDebuggingStory[];
    limitations: readonly string[];
    sources: readonly EvidenceSource[];
};

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

function classification(value: unknown, path: string): EvidenceClassification {
    const parsed = requiredString(value, path) as EvidenceClassification;
    if (!EVIDENCE_CLASSIFICATIONS.includes(parsed)) {
        throw new Error(`${path} is not a supported evidence classification`);
    }
    return parsed;
}

function workflowMode(value: unknown, path: string): ProjectWorkflowMode {
    const parsed = requiredString(value, path) as ProjectWorkflowMode;
    if (!PROJECT_WORKFLOW_MODES.includes(parsed)) {
        throw new Error(`${path} is not a supported workflow mode`);
    }
    return parsed;
}

function parseSources(value: unknown, path: string): EvidenceSource[] {
    if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`${path} must contain at least one source`);
    }

    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        const url = requiredString(record.url, `${path}[${index}].url`);
        const commit = requiredString(record.commit, `${path}[${index}].commit`);
        if (!/^https:\/\//i.test(url)) throw new Error(`${path}[${index}].url must use https`);
        if (!/^[0-9a-f]{40}$/i.test(commit)) throw new Error(`${path}[${index}].commit must be a commit SHA`);

        return {
            id: requiredString(record.id, `${path}[${index}].id`),
            label: requiredString(record.label, `${path}[${index}].label`),
            url,
            commit,
            date: optionalString(record.date, `${path}[${index}].date`),
            description: requiredString(record.description, `${path}[${index}].description`),
        };
    });
}

function parseOwnership(value: unknown, path: string): ProjectOwnershipBoundary[] {
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            boundary: requiredString(record.boundary, `${path}[${index}].boundary`),
            owner: requiredString(record.owner, `${path}[${index}].owner`),
            responsibility: requiredString(record.responsibility, `${path}[${index}].responsibility`),
            classification: classification(record.classification, `${path}[${index}].classification`),
            sources: stringArray(record.sources, `${path}[${index}].sources`),
        };
    });
}

function parseIpc(value: unknown, path: string): ProjectIpcBoundary[] {
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            boundary: requiredString(record.boundary, `${path}[${index}].boundary`),
            behavior: requiredString(record.behavior, `${path}[${index}].behavior`),
            classification: classification(record.classification, `${path}[${index}].classification`),
            sources: stringArray(record.sources, `${path}[${index}].sources`),
        };
    });
}

function parseWorkflows(value: unknown, path: string): ProjectWorkflow[] | undefined {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            title: requiredString(record.title, `${path}[${index}].title`),
            entryPoint: requiredString(record.entryPoint, `${path}[${index}].entryPoint`),
            mode: workflowMode(record.mode, `${path}[${index}].mode`),
            owner: requiredString(record.owner, `${path}[${index}].owner`),
            processing: requiredString(record.processing, `${path}[${index}].processing`),
            result: requiredString(record.result, `${path}[${index}].result`),
            classification: classification(record.classification, `${path}[${index}].classification`),
            sources: stringArray(record.sources, `${path}[${index}].sources`),
        };
    });
}

function parseLifecycle(value: unknown, path: string): ProjectLifecycleStep[] {
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            phase: requiredString(record.phase, `${path}[${index}].phase`),
            actor: requiredString(record.actor, `${path}[${index}].actor`),
            action: requiredString(record.action, `${path}[${index}].action`),
            result: requiredString(record.result, `${path}[${index}].result`),
            classification: classification(record.classification, `${path}[${index}].classification`),
            sources: stringArray(record.sources, `${path}[${index}].sources`),
        };
    });
}

function parseFileLifecycles(value: unknown, path: string): ProjectFileLifecycle[] | undefined {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            title: requiredString(record.title, `${path}[${index}].title`),
            description: requiredString(record.description, `${path}[${index}].description`),
            steps: parseLifecycle(record.steps, `${path}[${index}].steps`),
        };
    });
}

function parseProcessingPaths(value: unknown, path: string): ProjectProcessingPath[] | undefined {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            title: requiredString(record.title, `${path}[${index}].title`),
            boundary: requiredString(record.boundary, `${path}[${index}].boundary`),
            behavior: requiredString(record.behavior, `${path}[${index}].behavior`),
            classification: classification(record.classification, `${path}[${index}].classification`),
            limitations: stringArray(record.limitations, `${path}[${index}].limitations`),
            sources: stringArray(record.sources, `${path}[${index}].sources`),
        };
    });
}

function parseFailureBoundaries(value: unknown, path: string): ProjectFailureBoundary[] | undefined {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            boundary: requiredString(record.boundary, `${path}[${index}].boundary`),
            trigger: requiredString(record.trigger, `${path}[${index}].trigger`),
            behavior: requiredString(record.behavior, `${path}[${index}].behavior`),
            classification: classification(record.classification, `${path}[${index}].classification`),
            sources: stringArray(record.sources, `${path}[${index}].sources`),
        };
    });
}

function parseDecisions(value: unknown, path: string): ProjectDecisionCard[] {
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            title: requiredString(record.title, `${path}[${index}].title`),
            choice: requiredString(record.choice, `${path}[${index}].choice`),
            rationale: requiredString(record.rationale, `${path}[${index}].rationale`),
            alternative: requiredString(record.alternative, `${path}[${index}].alternative`),
            classification: classification(record.classification, `${path}[${index}].classification`),
            sources: stringArray(record.sources, `${path}[${index}].sources`),
        };
    });
}

function parseMeasurements(value: unknown, path: string): ProjectEvidenceMeasurement[] {
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            claim: requiredString(record.claim, `${path}[${index}].claim`),
            result: requiredString(record.result, `${path}[${index}].result`),
            context: requiredString(record.context, `${path}[${index}].context`),
            classification: classification(record.classification, `${path}[${index}].classification`),
            method: requiredString(record.method, `${path}[${index}].method`),
            environment: requiredString(record.environment, `${path}[${index}].environment`),
            sample: requiredString(record.sample, `${path}[${index}].sample`),
            limitations: stringArray(record.limitations, `${path}[${index}].limitations`),
            sources: stringArray(record.sources, `${path}[${index}].sources`),
        };
    });
}

function parseDebuggingStories(value: unknown, path: string): ProjectDebuggingStory[] {
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${path} must contain entries`);
    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            title: requiredString(record.title, `${path}[${index}].title`),
            symptom: requiredString(record.symptom, `${path}[${index}].symptom`),
            rootCause: requiredString(record.rootCause, `${path}[${index}].rootCause`),
            correction: requiredString(record.correction, `${path}[${index}].correction`),
            verification: requiredString(record.verification, `${path}[${index}].verification`),
            classification: classification(record.classification, `${path}[${index}].classification`),
            limitations: stringArray(record.limitations, `${path}[${index}].limitations`),
            sources: stringArray(record.sources, `${path}[${index}].sources`),
        };
    });
}

export function validateProjectTechnicalEvidence(value: unknown): ProjectTechnicalEvidence {
    const record = isRecord(value) ? value : {};
    const sources = parseSources(record.sources, "technicalEvidence.sources");
    const sourceIds = new Set(sources.map((source) => source.id));
    if (sourceIds.size !== sources.length) throw new Error("technicalEvidence.sources must have unique ids");
    const evidence = {
        introduction: requiredString(record.introduction, "technicalEvidence.introduction"),
        ownership: parseOwnership(record.ownership, "technicalEvidence.ownership"),
        ipc: parseIpc(record.ipc, "technicalEvidence.ipc"),
        workflows: parseWorkflows(record.workflows, "technicalEvidence.workflows"),
        lifecycle: parseLifecycle(record.lifecycle, "technicalEvidence.lifecycle"),
        fileLifecycles: parseFileLifecycles(record.fileLifecycles, "technicalEvidence.fileLifecycles"),
        processingPaths: parseProcessingPaths(record.processingPaths, "technicalEvidence.processingPaths"),
        failureBoundaries: parseFailureBoundaries(record.failureBoundaries, "technicalEvidence.failureBoundaries"),
        decisions: parseDecisions(record.decisions, "technicalEvidence.decisions"),
        measurements: parseMeasurements(record.measurements, "technicalEvidence.measurements"),
        debuggingStories: parseDebuggingStories(record.debuggingStories, "technicalEvidence.debuggingStories"),
        limitations: stringArray(record.limitations, "technicalEvidence.limitations"),
        sources,
    } satisfies ProjectTechnicalEvidence;

    const references = [
        ...evidence.ownership.flatMap((item) => item.sources),
        ...evidence.ipc.flatMap((item) => item.sources),
        ...(evidence.workflows?.flatMap((item) => item.sources) ?? []),
        ...evidence.lifecycle.flatMap((item) => item.sources),
        ...(evidence.fileLifecycles?.flatMap((item) => item.steps.flatMap((step) => step.sources)) ?? []),
        ...(evidence.processingPaths?.flatMap((item) => item.sources) ?? []),
        ...(evidence.failureBoundaries?.flatMap((item) => item.sources) ?? []),
        ...evidence.decisions.flatMap((item) => item.sources),
        ...evidence.measurements.flatMap((item) => item.sources),
        ...evidence.debuggingStories.flatMap((item) => item.sources),
    ];
    for (const sourceId of references) {
        if (!sourceIds.has(sourceId)) throw new Error(`unknown technical evidence source: ${sourceId}`);
    }

    return evidence;
}

const TERMSTEAD_REPOSITORY_COMMIT = "0776a19f39539c396df76038c55a14bb55948a53";
const ARCHITECTURE_DOC_COMMIT = "f0889ba7ebf8d5585a20aedc22439dcc12b98472";
const SESSION_HUB_DOC_COMMIT = "8ca581048f33a474f27f74b0a2c3e47c1b5364c6";
const PERFORMANCE_DOC_COMMIT = "0bd57c0c3e82aefaee91392e5d78e3de3f11a5bc";
const GPUI_ACCEPTANCE_COMMIT = "6391d27b29524ea07d6a0afeb3dcdf4edb48000a";

const termsteadUrl = (commit: string, path: string): string =>
    `https://github.com/gimesha-adikari/termstead/blob/${commit}/${path}`;

export const termsteadTechnicalEvidence = {
    introduction: "Termstead is presented here as an evidence-backed systems project: authority stays explicit across the daemon, GUI shell, IPC/SessionHub, and renderer, while acceptance and measurement caveats remain visible.",
    ownership: [
        {
            boundary: "Daemon and session authority",
            owner: "terminal-daemon and terminal-engine",
            responsibility: "Own PTYs, child processes, authoritative terminal state, terminal modes, revisions, and daemon-session lifetime.",
            classification: "IMPLEMENTED",
            sources: ["architecture-doc", "terminal-daemon-source", "terminal-engine-source"],
        },
        {
            boundary: "GUI shell and workspace",
            owner: "terminal-app",
            responsibility: "Own windows, tabs, recursive pane layout, focus, commands, and view attachment lifecycle; layout policy stays on the client side.",
            classification: "IMPLEMENTED",
            sources: ["architecture-doc", "shell-source"],
        },
        {
            boundary: "IPC and renderer",
            owner: "terminal-ipc, SessionHub, and terminal-render",
            responsibility: "Move validated snapshots and revision-contiguous deltas across the Unix-socket boundary and paint the terminal grid through one optimized canvas.",
            classification: "IMPLEMENTED",
            sources: ["terminal-ipc-source", "session-hub-source", "renderer-model-source", "renderer-source"],
        },
    ],
    ipc: [
        {
            boundary: "Transport and identity",
            behavior: "The protocol uses one Unix connection with request IDs, session/attachment identity, bounded pending work, and a fixed reader path rather than one socket per pane.",
            classification: "IMPLEMENTED",
            sources: ["session-hub-spec", "terminal-ipc-source", "transport-source"],
        },
        {
            boundary: "Authoritative state",
            behavior: "FullSnapshot and revision-contiguous RenderDelta are state authority; RenderReady is only a bounded/coalescible wake hint.",
            classification: "IMPLEMENTED",
            sources: ["architecture-doc", "terminal-core-source", "session-hub-spec"],
        },
        {
            boundary: "Backpressure and recovery",
            behavior: "Pending requests, ordered events, RenderReady entries, UI acknowledgements, and bootstrap waits are bounded; journal gaps recover with a snapshot and disconnects reconnect through a fresh identity.",
            classification: "ACCEPTED",
            sources: ["session-hub-acceptance", "session-hub-source", "transport-source"],
        },
        {
            boundary: "Event mode",
            behavior: "Negotiated RenderReady event mode has no compatibility polling deadline; legacy fallback is one process-wide compatibility path rather than a timer per tab or pane.",
            classification: "ACCEPTED",
            sources: ["session-hub-acceptance", "session-hub-source"],
        },
    ],
    lifecycle: [
        {
            phase: "Open or reuse",
            actor: "GUI and SessionHub",
            action: "Create or list/reuse a session, attach, register the pane/session/attachment/generation identity, acquire control, and request the initial snapshot.",
            result: "The binding becomes ready from authoritative daemon state.",
            classification: "IMPLEMENTED",
            sources: ["session-hub-source", "terminal-daemon-source", "session-hub-spec"],
        },
        {
            phase: "Synchronize",
            actor: "Daemon, transport, SessionHub, and renderer",
            action: "Commit a revision, emit a coalesced wake hint, fetch deltas when contiguous, or request a snapshot after a journal gap; acknowledge the UI update before the next one.",
            result: "The renderer applies validated state without treating the wake hint as state authority.",
            classification: "ACCEPTED",
            sources: ["session-hub-acceptance", "session-hub-source", "renderer-model-source"],
        },
        {
            phase: "Detach a pane, tab, or window",
            actor: "GUI shell",
            action: "Hide or blur the view, release control, cancel pending binding work, and detach the attachment.",
            result: "The view ends while the daemon session and its terminal process continue.",
            classification: "IMPLEMENTED",
            sources: ["shell-source", "session-hub-source", "terminal-daemon-source"],
        },
        {
            phase: "Reconnect",
            actor: "SessionHub",
            action: "Reconnect the transport, re-establish attachment identity, bootstrap with a bounded snapshot, and discard stale generations.",
            result: "The client recovers from current authoritative state when the daemon remains available.",
            classification: "ACCEPTED",
            sources: ["session-hub-acceptance", "session-hub-source", "architecture-doc"],
        },
        {
            phase: "Explicit termination",
            actor: "User through the GUI",
            action: "Confirm TerminateSession as a separate command; the daemon then shuts down the selected engine/session.",
            result: "The named session transitions toward exited state; closing a view alone does not perform this operation.",
            classification: "IMPLEMENTED",
            sources: ["shell-source", "terminal-daemon-source", "terminal-core-source"],
        },
        {
            phase: "Application quit semantics",
            actor: "Architecture boundary",
            action: "The architecture record specifies detach-all without terminating sessions, but the inspected m6 source has no explicit AppCommand::Quit to independently verify as a named command.",
            result: "Treat this as a designed contract, not as a separately accepted runtime behavior.",
            classification: "DESIGNED / PLANNED",
            sources: ["architecture-doc", "commands-source"],
        },
        {
            phase: "Daemon crash, reboot, or power loss",
            actor: "Out of verified scope",
            action: "Persistence across daemon failure or machine restart was not part of the inspected acceptance boundary.",
            result: "Deferred; no portfolio claim is made about this behavior.",
            classification: "DEFERRED",
            sources: ["architecture-doc", "session-hub-acceptance"],
        },
    ],
    decisions: [
        {
            title: "Keep workspace layout client-owned",
            choice: "The GUI owns windows, tabs, splits, focus, commands, and layout policy; the daemon owns terminal sessions.",
            rationale: "View composition can evolve without putting presentation policy into terminald or confusing a pane with a process.",
            alternative: "Daemon-owned workspace/layout was rejected because it would couple terminal authority to GUI presentation state.",
            classification: "ACCEPTED",
            sources: ["architecture-doc", "shell-source"],
        },
        {
            title: "Treat a pane as a view of a session",
            choice: "Pane, tab, close, and detach operations release the view binding; explicit TerminateSession owns process termination.",
            rationale: "Session lifetime must survive ordinary view changes and remain available for reconnect while termination stays explicit.",
            alternative: "Equating one tab with one process was rejected because tab/view lifetime and process lifetime have different semantics.",
            classification: "ACCEPTED",
            sources: ["architecture-doc", "shell-source", "terminal-daemon-source"],
        },
        {
            title: "Use event-driven synchronization with snapshots and deltas",
            choice: "RenderReady wakes visible bindings; snapshots and revision-contiguous deltas remain authoritative.",
            rationale: "The split reduces unnecessary polling while preserving recovery when a journal gap or reconnect invalidates incremental state.",
            alternative: "Per-pane polling and treating RenderReady as a state payload were rejected by the SessionHub design.",
            classification: "ACCEPTED",
            sources: ["session-hub-spec", "session-hub-acceptance", "session-hub-source"],
        },
        {
            title: "Keep the current engine dispatch model for now",
            choice: "Retain one event-dispatch thread per daemon session while recording a future reactor revisit.",
            rationale: "The current baseline supports the implemented lifecycle and resource behavior, while the scaling cost remains visible instead of being hidden.",
            alternative: "A reactor/event-loop replacement is deferred until broader evidence justifies that architectural change.",
            classification: "ACCEPTED",
            sources: ["performance-baseline", "terminal-daemon-source"],
        },
        {
            title: "Render through one terminal canvas",
            choice: "Keep terminal-grid rendering in terminal-render and use ordinary GPUI elements for product chrome rather than per-cell widgets.",
            rationale: "The renderer boundary can validate terminal state and localize row work without turning every cell into a UI element.",
            alternative: "Per-cell GPUI elements were rejected as an unsuitable rendering boundary for the terminal grid.",
            classification: "ACCEPTED",
            sources: ["architecture-doc", "renderer-model-source", "renderer-source", "gpui-final-acceptance"],
        },
    ],
    measurements: [
        {
            claim: "Daemon resource scaling",
            result: "Detached sessions scale from 3,220 KiB daemon RSS at zero sessions to 29,808 KiB at 20 sessions; the 20-session row has 41 daemon threads and 124 file descriptors.",
            context: "Resource table for 0, 1, 5, 10, and 20 detached /bin/sh sessions.",
            classification: "MEASURED",
            method: "Release build followed by termstead-perf with three samples; daemon RSS/PSS excludes child-shell memory.",
            environment: "Linux 7.0.0-31-generic x86_64; Intel i5-8500; 6 logical CPUs; 15,511,612 kB host memory; rustc/cargo 1.98.0.",
            sample: "3 samples; baseline recorded 2026-09-14 UTC from daemon commit 310bcd5f7b44a32c2fcaa8687fedffbbe713fceb.",
            limitations: ["Single-host baseline, not a capacity guarantee.", "The thread-per-session cost is visible and remains a future reactor-review input."],
            sources: ["performance-baseline", "performance-docs"],
        },
        {
            claim: "Idle daemon CPU",
            result: "Raw CPU ticks were zero at 0, 1, 10, and 20 sessions during the one-second idle samples; the documented interpretation is below 1.000% at CLK_TCK=100, not exactly zero CPU.",
            context: "Detached idle daemon/resource probe.",
            classification: "MEASURED",
            method: "Fixed idle interval using raw process ticks and the documented CLK_TCK resolution bound.",
            environment: "Same Linux/Intel baseline host and release build as the performance baseline.",
            sample: "One-second samples at four session counts; recorded 2026-09-14 UTC.",
            limitations: ["Below tick resolution is a bound, not proof of zero CPU.", "This is not GUI frame time or input-to-display latency."],
            sources: ["performance-baseline", "performance-docs"],
        },
        {
            claim: "Startup and session creation",
            result: "Handshake p50/p95 was 10.626/122.880 ms and session creation p50/p95 was 0.899/0.927 ms in the recorded sample.",
            context: "Daemon benchmark path, not a browser or native-window startup measurement.",
            classification: "MEASURED",
            method: "Release benchmark with three samples and p50/p95 summaries.",
            environment: "Same Linux/Intel baseline host; daemon-side protocol/session operations.",
            sample: "3 samples; baseline recorded 2026-09-14 UTC.",
            limitations: ["The small sample includes a handshake outlier.", "Do not interpret these values as end-to-end GUI startup or display latency."],
            sources: ["performance-baseline", "performance-docs"],
        },
        {
            claim: "Churn and short-soak boundedness",
            result: "The recorded short soak completed 207 iterations with RSS moving from 4,036 to 40,196 KiB, a 43,208 KiB maximum, and final 10 file descriptors/4 threads; session and attachment churn returned thread/file-descriptor counts to baseline.",
            context: "Stress probes for session churn, attachment churn, malformed clients, resize, and detached output.",
            classification: "MEASURED",
            method: "Release stress harness with process resource samples and clean-up checks.",
            environment: "Same Linux/Intel baseline host; workload-dependent shell/output paths.",
            sample: "100 session cycles, 100 attachment cycles, 207 short-soak iterations, plus bounded malformed-client/resize probes.",
            limitations: ["Output-driven RSS growth was classified as INVESTIGATE for explicit byte budgeting, not as an IPC leak.", "Stress evidence is not production soak or a universal memory limit."],
            sources: ["performance-baseline", "performance-docs"],
        },
        {
            claim: "SessionHub boundedness and event mode",
            result: "The accepted boundary records one multiplexed Unix connection, one reader thread, pending requests capped at 64, coalesced RenderReady entries capped at 64 sessions, ordered events capped at 64, and no compatibility polling in negotiated event mode.",
            context: "M2 SessionHub acceptance; later m6 source adds the product-shell bindings and lifecycle work.",
            classification: "ACCEPTED",
            method: "Focused protocol/transport/SessionHub tests plus a real Wayland acceptance run.",
            environment: "Ubuntu/GNOME Wayland on Intel UHD 630/Mesa for the live acceptance portion.",
            sample: "Acceptance record status PASS WITH FOLLOW-UPS; five resource runs for the retained M2 resource confirmation.",
            limitations: ["The acceptance record is bounded to its stated M2 surface and does not prove every later product-shell interaction.", "Physical keyboard/mouse/IME and pixel capture were not tested."],
            sources: ["session-hub-spec", "session-hub-acceptance", "transport-source", "session-hub-source"],
        },
        {
            claim: "Daemon-side input-to-authoritative-state marker",
            result: "The baseline reports p50/p95 0.600/0.664 ms without flood and 0.638/0.750 ms under another-session flood.",
            context: "Input through PTY/parser/state to an authoritative snapshot marker.",
            classification: "MEASURED",
            method: "Daemon performance harness marker; includes input, PTY/parsing, state, snapshot request, and serialization.",
            environment: "Same Linux/Intel baseline host and release build.",
            sample: "Recorded 2026-09-14 UTC; benchmark sample size is documented as 10 for microbenchmarks, while this marker is not a display probe.",
            limitations: ["This is explicitly not input-to-display, frame, compositor, or pixel latency.", "No claim is made about physical input or rendered-frame response."],
            sources: ["performance-baseline", "performance-docs"],
        },
        {
            claim: "Renderer geometry and shaping smoke",
            result: "The real Wayland smoke recorded a 14 px font, 8.429 logical-cell width, 16.100 cell width, 16.198 baseline, an 80x24 to 113x29 grid change, 69 shaped runs, 10 fallback runs, and 4 emoji glyph flags.",
            context: "Renderer correction and native-window geometry/shaping evidence.",
            classification: "ACCEPTED",
            method: "Focused terminal-render tests plus one real-host Wayland smoke after the force_width correction.",
            environment: "Ubuntu 26.04.1; GNOME 50.1 Wayland; Linux 7.0.0-31; Intel UHD 630/Mesa; scale 1.",
            sample: "Focused test suite and one recorded real-window smoke on 2026-09-22.",
            limitations: ["Geometry/shaping evidence is not a pixel-golden screenshot.", "Physical input, compositor matrix, and several font/device cases remained untested or environment-limited."],
            sources: ["gpui-final-acceptance", "renderer-source", "renderer-model-source"],
        },
        {
            claim: "Physical input and IME acceptance",
            result: "Physical keyboard, mouse, and IME acceptance was not run in the inspected Termstead acceptance records.",
            context: "A deliberate boundary on the native interaction evidence.",
            classification: "NOT TESTED",
            method: "No physical-device test was available in the recorded acceptance environment.",
            environment: "Recorded Wayland host evidence covered native-window geometry/shaping, not physical input or IME behavior.",
            sample: "No physical-device sample.",
            limitations: ["Do not treat source-level semantic input encoding as physical keyboard, mouse, or IME acceptance.", "A later evidence pass must run those checks before making an interaction claim."],
            sources: ["gpui-final-acceptance", "session-hub-acceptance", "input-source"],
        },
        {
            claim: "Pixel-golden and compositor coverage",
            result: "The recorded renderer proof is environment-limited to geometry/shaping counters; pixel-golden capture and broad compositor/font/device coverage were unavailable.",
            context: "Visual evidence boundary for the force_width correction.",
            classification: "ENVIRONMENT-LIMITED",
            method: "Real-host Wayland smoke plus focused renderer tests; no pixel comparison harness was run.",
            environment: "Ubuntu 26.04.1, GNOME 50.1 Wayland, Intel UHD 630/Mesa, scale 1.",
            sample: "One real-window smoke and focused tests on 2026-09-22.",
            limitations: ["The geometry/shaping result cannot establish pixel-perfect output.", "Powerline font, physical input, compositor matrix, and device coverage remain outside the available evidence."],
            sources: ["gpui-final-acceptance", "renderer-source"],
        },
        {
            claim: "Bounded journals and scrollback",
            result: "The design and source bound the delta journal at 256 entries/8 MiB and use a default 10,000-line scrollback; transport queues and UI acknowledgement slots are bounded separately.",
            context: "A source/design guardrail, not a claim that every workload has a fixed byte cost.",
            classification: "IMPLEMENTED",
            method: "Source and protocol-spec inspection with focused bounded-queue tests.",
            environment: "Repository source at the verified remote default-branch commit.",
            sample: "Deterministic implementation/test evidence; no production workload sample.",
            limitations: ["Scrollback byte cost is workload-dependent.", "The performance baseline keeps explicit output-memory budgeting as INVESTIGATE."],
            sources: ["session-hub-spec", "terminal-daemon-source", "performance-docs"],
        },
    ],
    debuggingStories: [
        {
            title: "Correcting per-glyph terminal width at the GPUI boundary",
            symptom: "Terminal text showed scattered glyph spacing because a shaped run could receive an unexpectedly large forced width.",
            rootCause: "The renderer passed total run width (columns multiplied by cell width) to GPUI TextRun.force_width, although GPUI applies that value as the advance for each glyph.",
            correction: "Pass one cell width only for compatible runs whose scalar count matches terminal columns; exclude wide and combining content from that shortcut.",
            verification: "Focused renderer tests cover one-cell-per-glyph, combining/wide exclusions, fractional edges, and resize metrics; the real Wayland smoke confirmed geometry/shaping counters after the correction.",
            classification: "ACCEPTED",
            limitations: ["The correction was not validated with a pixel-golden screenshot.", "Visual acceptance remained environment-limited because physical/compositor capture was unavailable."],
            sources: ["gpui-final-acceptance", "renderer-source"],
        },
    ],
    limitations: [
        "The primary evidence target is the verified remote default branch product-shell-m6-layout-persistence at 0776a19f39539c396df76038c55a14bb55948a53; a separate local m8 checkout was dirty and was not used as the portfolio evidence basis.",
        "The evidence record does not claim persistence across daemon crash, logout, reboot, or power loss; that scope is deferred.",
        "The inspected source has no explicit AppCommand::Quit matching the architecture document's detach-all quit semantics, so that behavior remains designed rather than independently accepted.",
        "Physical keyboard, mouse, IME, broad compositor/font/device coverage, and pixel-golden capture were not tested or were environment-limited.",
        "Below-resolution CPU samples are reported as bounds, not zero-CPU claims; daemon-side markers are not input-to-display measurements.",
        "The resource baseline is single-host evidence. Output-memory budgeting remains an investigation item, and the thread-per-session model is retained with a future reactor revisit.",
        "The M2 SessionHub acceptance is PASS WITH FOLLOW-UPS and should not be read as unconditional production proof for every later product-shell feature.",
    ],
    sources: [
        {
            id: "architecture-doc",
            label: "Product-shell architecture",
            url: termsteadUrl(ARCHITECTURE_DOC_COMMIT, "docs/product-shell-architecture.md"),
            commit: ARCHITECTURE_DOC_COMMIT,
            date: "2026-09-22",
            description: "Ownership, lifecycle semantics, IPC authority, renderer boundary, alternatives, and explicit non-goals.",
        },
        {
            id: "session-hub-spec",
            label: "SessionHub specification",
            url: termsteadUrl(SESSION_HUB_DOC_COMMIT, "docs/product-shell-m2-session-hub-spec.md"),
            commit: SESSION_HUB_DOC_COMMIT,
            date: "2026-09-22",
            description: "Approved bounded transport, identity, event, backpressure, and recovery contract.",
        },
        {
            id: "session-hub-acceptance",
            label: "SessionHub acceptance",
            url: termsteadUrl(SESSION_HUB_DOC_COMMIT, "docs/product-shell-m2-session-hub-acceptance.md"),
            commit: SESSION_HUB_DOC_COMMIT,
            date: "2026-09-22",
            description: "PASS WITH FOLLOW-UPS acceptance record with live Wayland and resource limitations.",
        },
        {
            id: "performance-baseline",
            label: "Performance baseline",
            url: termsteadUrl(PERFORMANCE_DOC_COMMIT, "docs/performance-baseline.md"),
            commit: PERFORMANCE_DOC_COMMIT,
            date: "2026-09-14",
            description: "Resource scaling, latency markers, throughput, stress, boundedness, and methodology.",
        },
        {
            id: "performance-docs",
            label: "Performance methodology",
            url: termsteadUrl(PERFORMANCE_DOC_COMMIT, "docs/performance.md"),
            commit: PERFORMANCE_DOC_COMMIT,
            date: "2026-09-14",
            description: "Definitions and caveats separating daemon-side measurements from display/frame claims.",
        },
        {
            id: "gpui-final-acceptance",
            label: "GPUI final acceptance",
            url: termsteadUrl(GPUI_ACCEPTANCE_COMMIT, "docs/gpui-final-acceptance.md"),
            commit: GPUI_ACCEPTANCE_COMMIT,
            date: "2026-09-22",
            description: "Renderer correction, real-host geometry/shaping smoke, and environment-limited visual acceptance.",
        },
        {
            id: "terminal-core-source",
            label: "Terminal core wire model",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-core/src/lib.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "Session, attachment, revision, snapshot, delta, and lifecycle types.",
        },
        {
            id: "terminal-engine-source",
            label: "Terminal engine",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-engine/src/lib.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "PTY, terminal state, parser/event loop, resize, and engine shutdown ownership.",
        },
        {
            id: "terminal-daemon-source",
            label: "Terminal daemon",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-daemon/src/lib.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "Session manager, attachments, control, journals, lifecycle, and event dispatch.",
        },
        {
            id: "terminal-ipc-source",
            label: "IPC protocol",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-ipc/src/lib.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "Protocol versions, capabilities, RenderReady, and lifecycle message kinds.",
        },
        {
            id: "transport-source",
            label: "Multiplexed transport",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-ipc/src/transport.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "Bounded requests/events, request identity, reader/writer ownership, and coalescing.",
        },
        {
            id: "session-hub-source",
            label: "SessionHub implementation",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-app/src/session_hub.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "Process-wide hub, binding identity, synchronization, visibility, recovery, and cleanup.",
        },
        {
            id: "shell-source",
            label: "Product shell lifecycle commands",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-app/src/shell/mod.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "Pane/tab close, detach, explicit termination, and workspace-level view cleanup.",
        },
        {
            id: "commands-source",
            label: "Application command definitions",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-app/src/commands.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "Named application commands inspected for lifecycle coverage, including the absence of an explicit Quit command.",
        },
        {
            id: "input-source",
            label: "Semantic input boundary",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-input/src/lib.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "Protocol-independent key, paste, focus, mouse, and input-mode encoding boundary; source inspection is not physical-device acceptance.",
        },
        {
            id: "renderer-model-source",
            label: "Renderer state model",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-render/src/model.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "Atomic snapshot validation, contiguous delta application, identity, and grid checks.",
        },
        {
            id: "renderer-source",
            label: "Terminal renderer",
            url: termsteadUrl(TERMSTEAD_REPOSITORY_COMMIT, "crates/terminal-render/src/renderer.rs"),
            commit: TERMSTEAD_REPOSITORY_COMMIT,
            description: "Run shaping, cell-width correction, row caching, and one-canvas paint boundary.",
        },
    ],
} as const satisfies ProjectTechnicalEvidence;
