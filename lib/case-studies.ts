import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

export type CaseStudyStackItem = { name: string; icon: string };

export type CaseStudyLink = {
    label: string;
    url: string;
    icon: string;
    is_external: boolean;
};

export interface CaseStudy {
    slug: string;
    order: number;
    title: string;
    blurb: string;
    read_time: string;
    main_icon: string;
    tags: string[];
    subtitle: string;
    tldr: string;
    context: string;
    problem: string[];
    architecture: string[];
    stack: CaseStudyStackItem[];
    challenges: string[];
    results: string[];
    next_steps: string[];
    links: CaseStudyLink[];
}

type UnknownRecord = Record<string, unknown>;

const casesDirectory = path.join(process.cwd(), "content", "case-studies");
const caseStudySlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string): string {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`${field} must be a non-empty string`);
    }
    return value.trim();
}

function optionalString(value: unknown, field: string, fallback = ""): string {
    if (value === undefined || value === null) return fallback;
    return requiredString(value, field);
}

function stringArray(value: unknown, field: string): string[] {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) throw new Error(`${field} must be an array`);

    return value.map((item, index) => requiredString(item, `${field}[${index}]`));
}

function parseStack(value: unknown, field: string): CaseStudyStackItem[] {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) throw new Error(`${field} must be an array`);

    return value.map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
            name: requiredString(record.name, `${field}[${index}].name`),
            icon: requiredString(record.icon, `${field}[${index}].icon`),
        };
    });
}

function isValidResourceUrl(url: string): boolean {
    if (url.startsWith("/") && !url.startsWith("//")) return true;

    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:" || parsed.protocol === "mailto:";
    } catch {
        return false;
    }
}

function parseLinks(value: unknown, field: string): CaseStudyLink[] {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) throw new Error(`${field} must be an array`);

    const links: CaseStudyLink[] = [];
    for (const [index, item] of value.entries()) {
        const record = isRecord(item) ? item : {};
        const rawUrl = record.url;

        // Empty resource destinations are ignored rather than rendered as broken actions.
        if (rawUrl === undefined || rawUrl === null || (typeof rawUrl === "string" && rawUrl.trim() === "")) {
            continue;
        }

        const url = requiredString(rawUrl, `${field}[${index}].url`);
        if (!isValidResourceUrl(url)) throw new Error(`${field}[${index}].url is invalid`);

        const inferredExternal = /^https?:\/\//i.test(url);
        const isExternal = record.is_external === undefined ? inferredExternal : record.is_external;
        if (typeof isExternal !== "boolean") {
            throw new Error(`${field}[${index}].is_external must be boolean`);
        }

        links.push({
            label: requiredString(record.label, `${field}[${index}].label`),
            url,
            icon: optionalString(record.icon, `${field}[${index}].icon`, "icon-[tabler--link]"),
            is_external: isExternal,
        });
    }

    return links;
}

export function isValidCaseStudySlug(slug: string): boolean {
    return caseStudySlugPattern.test(slug);
}

export function validateCaseStudy(value: unknown, slug: string): CaseStudy {
    if (!isValidCaseStudySlug(slug)) throw new Error(`Invalid case-study slug: ${slug}`);

    const record = isRecord(value) ? value : {};
    const order = record.order;
    if (typeof order !== "number" || !Number.isInteger(order) || order < 0) {
        throw new Error("order must be a non-negative integer");
    }

    return {
        slug,
        order,
        title: requiredString(record.title, "title"),
        blurb: optionalString(record.blurb, "blurb"),
        read_time: optionalString(record.read_time, "read_time"),
        main_icon: optionalString(record.main_icon, "main_icon", "icon-[tabler--folder]"),
        tags: stringArray(record.tags, "tags"),
        subtitle: optionalString(record.subtitle, "subtitle"),
        tldr: optionalString(record.tldr, "tldr"),
        context: optionalString(record.context, "context"),
        problem: stringArray(record.problem, "problem"),
        architecture: stringArray(record.architecture, "architecture"),
        stack: parseStack(record.stack, "stack"),
        challenges: stringArray(record.challenges, "challenges"),
        results: stringArray(record.results, "results"),
        next_steps: stringArray(record.next_steps, "next_steps"),
        links: parseLinks(record.links, "links"),
    };
}

function loadCaseStudyFile(fileName: string): CaseStudy {
    const slug = fileName.replace(/\.yml$/, "");
    const fullPath = path.join(casesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    return validateCaseStudy(yaml.load(fileContents), slug);
}

export function getAllCaseStudies(): CaseStudy[] {
    if (!fs.existsSync(casesDirectory)) return [];

    return fs
        .readdirSync(casesDirectory)
        .filter((fileName) => fileName.endsWith(".yml"))
        .map(loadCaseStudyFile)
        .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
    if (!isValidCaseStudySlug(slug)) return null;

    const fullPath = path.join(casesDirectory, `${slug}.yml`);
    if (!fs.existsSync(fullPath)) return null;

    return loadCaseStudyFile(`${slug}.yml`);
}
