import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

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
    stack: { name: string; icon: string }[];
    challenges: string[];
    results: string[];
    next_steps: string[];
    links: { label: string; url: string; icon: string; is_external: boolean }[];
}

const casesDirectory = path.join(process.cwd(), "content", "case-studies");

export function getAllCaseStudies(): CaseStudy[] {
    if (!fs.existsSync(casesDirectory)) return [];

    const fileNames = fs.readdirSync(casesDirectory);

    const allCases = fileNames
        .filter((fileName) => fileName.endsWith(".yml"))
        .map((fileName) => {
            const slug = fileName.replace(/\.yml$/, "");
            const fullPath = path.join(casesDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");

            const data = yaml.load(fileContents) as Partial<CaseStudy>;
            return { slug, ...data } as CaseStudy;
        });

    return allCases.sort((a, b) => (a.order || 99) - (b.order || 99));
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
    const fullPath = path.join(casesDirectory, `${slug}.yml`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const data = yaml.load(fileContents) as Partial<CaseStudy>;
    return { slug, ...data } as CaseStudy;
}