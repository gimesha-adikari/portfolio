import { getAllCaseStudies, getCaseStudyBySlug } from "./case-studies.ts";
import { getPublishedEngineeringNoteBySlug, getPublishedEngineeringNotes } from "./engineering-notes.ts";
import { getAllPortfolioProjects, getPortfolioProjectBySlug, type PortfolioProject } from "./portfolio-projects.ts";
import { siteConfig } from "./siteConfig.ts";

export type PortfolioOgCard = {
    eyebrow: string;
    title: string;
    description: string;
    status?: string;
    evidenceLabel?: string;
    technologies?: readonly string[];
    footer?: string;
};

function compactText(value: string, maxLength = 180): string {
    const normalized = value.replace(/\s+/g, " ").trim();
    if (normalized.length <= maxLength) return normalized;
    return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function statusLabel(status: PortfolioProject["status"]): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function projectTechnologies(project: PortfolioProject): string[] {
    return [...new Set(project.architecture.flatMap((block) => block.technologies))].slice(0, 4);
}

function projectCard(project: PortfolioProject): PortfolioOgCard {
    return {
        eyebrow: project.category ?? "Engineering project",
        title: project.title,
        description: compactText(project.tagline),
        status: statusLabel(project.status),
        evidenceLabel: project.featured ? "Selected system" : "Curated secondary system",
        technologies: projectTechnologies(project),
        footer: siteConfig.displayDomain,
    };
}

export function getDefaultOgCard(): PortfolioOgCard {
    return {
        eyebrow: "Engineering portfolio",
        title: siteConfig.name,
        description: siteConfig.metadata.description,
        evidenceLabel: "Systems · backend · platform",
        technologies: ["Systems", "Backend", "Platform"],
        footer: siteConfig.displayDomain,
    };
}

export function getProjectsOgCard(): PortfolioOgCard {
    return {
        eyebrow: "Projects",
        title: "Selected systems and repository archive",
        description: "Portfolio-owned systems first, with public repositories retained as supporting evidence.",
        evidenceLabel: "Curated work",
        footer: siteConfig.displayDomain,
    };
}

export function getCaseStudiesOgCard(): PortfolioOgCard {
    return {
        eyebrow: "Case studies",
        title: "Engineering decisions in context",
        description: "Engineering decisions and trade-offs covering architecture, failure boundaries, and verified evidence.",
        evidenceLabel: "Technical narratives",
        footer: siteConfig.displayDomain,
    };
}

export function getEngineeringNotesOgCard(): PortfolioOgCard {
    return {
        eyebrow: "Engineering notes",
        title: "Focused engineering questions",
        description: "Narrow, source-backed notes about debugging decisions and the evidence behind them.",
        status: "Engineering Notes",
        evidenceLabel: "Technical notes",
        footer: siteConfig.displayDomain,
    };
}

export function getEngineeringDecisionsOgCard(): PortfolioOgCard {
    return {
        eyebrow: "Engineering decisions",
        title: "Engineering Decisions",
        description: "Evidence-backed decisions across Termstead, Platen PDF, and Banking Platform.",
        status: "Selected decisions",
        technologies: ["Termstead", "Platen PDF", "Banking Platform"],
        footer: siteConfig.displayDomain,
    };
}

export function getEngineeringNoteOgCard(slug: string): PortfolioOgCard | null {
    const note = getPublishedEngineeringNoteBySlug(slug);
    if (!note) return null;

    const project = getAllPortfolioProjects().find((candidate) => candidate.slug === note.projectSlug);
    return {
        eyebrow: project ? `Engineering note · ${project.title}` : "Engineering note",
        title: note.title,
        description: compactText(note.description),
        status: "Engineering Note",
        evidenceLabel: project?.title,
        technologies: note.tags.slice(0, 3),
        footer: siteConfig.displayDomain,
    };
}

export function getAboutOgCard(): PortfolioOgCard {
    return {
        eyebrow: "About",
        title: `About ${siteConfig.name}`,
        description: "Software engineer shipping reliable products across web, mobile, and backend.",
        evidenceLabel: "Background and working style",
        footer: siteConfig.displayDomain,
    };
}

export function getContactOgCard(): PortfolioOgCard {
    return {
        eyebrow: "Contact",
        title: `Contact ${siteConfig.name}`,
        description: `Get in touch with ${siteConfig.name} by email or through GitHub and LinkedIn.`,
        evidenceLabel: "Open to thoughtful conversations",
        footer: siteConfig.displayDomain,
    };
}

export function getPortfolioProjectOgCard(slug: string): PortfolioOgCard | null {
    const project = getPortfolioProjectBySlug(slug);
    return project ? projectCard(project) : null;
}

export function getCaseStudyOgCard(slug: string): PortfolioOgCard | null {
    const study = getCaseStudyBySlug(slug);
    if (!study) return null;

    const project = getAllPortfolioProjects().find((candidate) => candidate.caseStudies?.includes(study.slug));
    return {
        eyebrow: project ? `${project.title} case study` : "Case study",
        title: study.title,
        description: compactText(study.tldr || study.blurb || study.subtitle),
        evidenceLabel: study.tags.slice(0, 3).join(" · ") || "Technical narrative",
        technologies: study.stack.slice(0, 4).map((item) => item.name),
        footer: siteConfig.displayDomain,
    };
}

export function getAllCaseStudyOgCards(): PortfolioOgCard[] {
    return getAllCaseStudies().flatMap((study) => {
        const card = getCaseStudyOgCard(study.slug);
        return card ? [card] : [];
    });
}
