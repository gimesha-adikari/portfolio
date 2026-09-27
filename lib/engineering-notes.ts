import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getPortfolioProjectBySlug } from "./portfolio-projects.ts";

export type EngineeringNoteSourceLink = {
    label: string;
    url: string;
};

export type EngineeringNote = {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    projectSlug: string;
    question: string;
    tags: string[];
    sourceLinks: EngineeringNoteSourceLink[];
    relatedCaseStudies: string[];
    published: boolean;
    content: string;
};

type UnknownRecord = Record<string, unknown>;

const notesDirectory = path.join(process.cwd(), "content", "engineering-notes");
const noteSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const pinnedGitHubSourcePattern = /^https:\/\/github\.com\/[^/]+\/[^/]+\/(?:blob|commit)\/[0-9a-f]{40}(?:\/|$)/i;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string): string {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`${field} must be a non-empty string`);
    }
    return value.trim();
}

function stringArray(value: unknown, field: string): string[] {
    if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
    return value.map((item, index) => requiredString(item, `${field}[${index}]`));
}

function parseDate(value: unknown, field: string): string {
    const date = value instanceof Date
        ? (Number.isNaN(value.getTime()) ? "" : value.toISOString().slice(0, 10))
        : requiredString(value, field);
    if (!date) throw new Error(`${field} must be a valid calendar date`);
    if (!isoDatePattern.test(date)) throw new Error(`${field} must use YYYY-MM-DD`);

    const parsed = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
        throw new Error(`${field} must be a valid calendar date`);
    }

    return date;
}

function optionalDate(value: unknown, field: string): string | undefined {
    if (value === undefined || value === null) return undefined;
    return parseDate(value, field);
}

function parseSourceLinks(value: unknown, field: string): EngineeringNoteSourceLink[] {
    if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`${field} must contain at least one source link`);
    }

    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        const url = requiredString(record.url, `${field}[${index}].url`);
        if (!pinnedGitHubSourcePattern.test(url)) {
            throw new Error(`${field}[${index}].url must be an HTTPS commit-pinned GitHub source URL`);
        }

        return {
            label: requiredString(record.label, `${field}[${index}].label`),
            url,
        };
    });
}

export function isValidEngineeringNoteSlug(slug: string): boolean {
    return noteSlugPattern.test(slug);
}

export function validateEngineeringNote(value: unknown, slug: string, content: string): EngineeringNote {
    if (!isValidEngineeringNoteSlug(slug)) throw new Error(`Invalid engineering-note slug: ${slug}`);

    const record = isRecord(value) ? value : {};
    const frontmatterSlug = requiredString(record.slug, "slug");
    if (frontmatterSlug !== slug) throw new Error(`slug must match filename: ${slug}`);

    const projectSlug = requiredString(record.projectSlug, "projectSlug");
    if (!getPortfolioProjectBySlug(projectSlug)) {
        throw new Error(`projectSlug does not resolve to a curated project: ${projectSlug}`);
    }

    if (typeof record.published !== "boolean") throw new Error("published must be boolean");

    const publishedAt = parseDate(record.publishedAt, "publishedAt");
    const updatedAt = optionalDate(record.updatedAt, "updatedAt");
    if (updatedAt && updatedAt < publishedAt) {
        throw new Error("updatedAt must not be earlier than publishedAt");
    }

    return {
        slug,
        title: requiredString(record.title, "title"),
        description: requiredString(record.description, "description"),
        publishedAt,
        ...(updatedAt ? { updatedAt } : {}),
        projectSlug,
        question: requiredString(record.question, "question"),
        tags: stringArray(record.tags, "tags"),
        sourceLinks: parseSourceLinks(record.sourceLinks, "sourceLinks"),
        relatedCaseStudies: stringArray(record.relatedCaseStudies, "relatedCaseStudies"),
        published: record.published,
        content: content.trim(),
    };
}

function loadEngineeringNote(fileName: string): EngineeringNote {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(notesDirectory, fileName);
    const parsed = matter(fs.readFileSync(fullPath, "utf8"));
    return validateEngineeringNote(parsed.data, slug, parsed.content);
}

export function filterPublishedEngineeringNotes(notes: readonly EngineeringNote[]): EngineeringNote[] {
    return notes.filter((note) => note.published);
}

export function getAllEngineeringNotes(): EngineeringNote[] {
    if (!fs.existsSync(notesDirectory)) return [];

    return fs
        .readdirSync(notesDirectory)
        .filter((fileName) => fileName.endsWith(".mdx"))
        .sort()
        .map(loadEngineeringNote)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title) || a.slug.localeCompare(b.slug));
}

export function getPublishedEngineeringNotes(): EngineeringNote[] {
    return filterPublishedEngineeringNotes(getAllEngineeringNotes());
}

export function getEngineeringNoteBySlug(slug: string): EngineeringNote | null {
    if (!isValidEngineeringNoteSlug(slug)) return null;

    const fileName = `${slug}.mdx`;
    if (!fs.existsSync(path.join(notesDirectory, fileName))) return null;
    return loadEngineeringNote(fileName);
}

export function getPublishedEngineeringNoteBySlug(slug: string): EngineeringNote | null {
    const note = getEngineeringNoteBySlug(slug);
    return note?.published ? note : null;
}

export function getEngineeringNotesForProject(projectSlug: string): EngineeringNote[] {
    return getPublishedEngineeringNotes().filter((note) => note.projectSlug === projectSlug);
}

export function formatEngineeringNoteDate(date: string): string {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00.000Z`));
}
