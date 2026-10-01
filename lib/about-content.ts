export type AboutBadge = {
    label: string;
    icon: string;
};

export type AboutOverview = {
    text?: string;
    focus_areas?: string[];
};

export type AboutWorkingStyle = {
    title: string;
    desc: string;
};

export type AboutStackEntry = {
    category: string;
    icon: string;
    items: string;
    subtext?: string;
};

export type AboutSelectedWork = {
    title: string;
    description: string;
    link?: string;
    link_text?: string;
};

export type AboutSkill = {
    category: string;
    icon: string;
    desc: string;
};

export type AboutEducation = {
    degree: string;
    institution: string;
    additional?: string[];
};

export type AboutData = {
    name?: string;
    subtitle?: string;
    role_description?: string;
    tldr?: string;
    badges?: AboutBadge[];
    overview?: AboutOverview;
    working_style?: AboutWorkingStyle[];
    stack?: AboutStackEntry[];
    selected_work?: AboutSelectedWork[];
    skills?: AboutSkill[];
    availability?: string;
    education?: AboutEducation;
    languages?: string;
    [key: string]: unknown;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
}

function readStringArray(value: unknown): string[] | undefined {
    if (!Array.isArray(value)) return undefined;
    return value.filter((item): item is string => typeof item === "string");
}

function readRecords<T>(value: unknown, parse: (item: UnknownRecord) => T | null): T[] | undefined {
    if (!Array.isArray(value)) return undefined;
    return value.flatMap((item) => (isRecord(item) ? [parse(item)].filter((parsed): parsed is T => parsed !== null) : []));
}

function parseBadge(value: UnknownRecord): AboutBadge | null {
    const label = readString(value.label);
    const icon = readString(value.icon);
    return label && icon ? { label, icon } : null;
}

function parseOverview(value: unknown): AboutOverview | undefined {
    if (!isRecord(value)) return undefined;
    const text = readString(value.text);
    const focusAreas = readStringArray(value.focus_areas);
    if (text === undefined && focusAreas === undefined) return undefined;

    const overview: AboutOverview = {};
    if (text !== undefined) overview.text = text;
    if (focusAreas !== undefined) overview.focus_areas = focusAreas;
    return overview;
}

function parseWorkingStyle(value: UnknownRecord): AboutWorkingStyle | null {
    const title = readString(value.title);
    const desc = readString(value.desc);
    return title && desc ? { title, desc } : null;
}

function parseStackEntry(value: UnknownRecord): AboutStackEntry | null {
    const category = readString(value.category);
    const icon = readString(value.icon);
    const items = readString(value.items);
    const subtext = readString(value.subtext);
    if (!category || !icon || !items) return null;

    return subtext === undefined
        ? { category, icon, items }
        : { category, icon, items, subtext };
}

function parseSelectedWork(value: UnknownRecord): AboutSelectedWork | null {
    const title = readString(value.title);
    const description = readString(value.description);
    if (!title || !description) return null;
    if (value.link !== undefined && typeof value.link !== "string") return null;
    if (value.link_text !== undefined && typeof value.link_text !== "string") return null;

    const selectedWork: AboutSelectedWork = {
        title,
        description,
    };
    const link = readString(value.link);
    const linkText = readString(value.link_text);
    if (link !== undefined) selectedWork.link = link;
    if (linkText !== undefined) selectedWork.link_text = linkText;
    return selectedWork;
}

function parseSkill(value: UnknownRecord): AboutSkill | null {
    const category = readString(value.category);
    const icon = readString(value.icon);
    const desc = readString(value.desc);
    return category && icon && desc ? { category, icon, desc } : null;
}

function parseEducation(value: unknown): AboutEducation | undefined {
    if (!isRecord(value)) return undefined;
    const degree = readString(value.degree);
    const institution = readString(value.institution);
    if (!degree || !institution) return undefined;

    const education: AboutEducation = {
        degree,
        institution,
    };
    const additional = readStringArray(value.additional);
    if (additional !== undefined) education.additional = additional;
    return education;
}

export function parseAboutData(value: unknown): AboutData {
    if (!isRecord(value)) return {};

    const data: AboutData = { ...value };
    data.name = readString(value.name);
    data.subtitle = readString(value.subtitle);
    data.role_description = readString(value.role_description);
    data.tldr = readString(value.tldr);
    data.overview = parseOverview(value.overview);
    data.availability = readString(value.availability);
    data.languages = readString(value.languages);
    data.education = parseEducation(value.education);

    const badges = readRecords(value.badges, parseBadge);
    const workingStyle = readRecords(value.working_style, parseWorkingStyle);
    const stack = readRecords(value.stack, parseStackEntry);
    const selectedWork = readRecords(value.selected_work, parseSelectedWork);
    const skills = readRecords(value.skills, parseSkill);

    if (badges) data.badges = badges;
    else delete data.badges;
    if (workingStyle) data.working_style = workingStyle;
    else delete data.working_style;
    if (stack) data.stack = stack;
    else delete data.stack;
    if (selectedWork) data.selected_work = selectedWork;
    else delete data.selected_work;
    if (skills) data.skills = skills;
    else delete data.skills;

    return data;
}
