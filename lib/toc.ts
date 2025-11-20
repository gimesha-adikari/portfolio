export type TOCItem = { depth: 2 | 3 | 4; text: string; id: string };

export function slugify(s: string) {
    return s
        .toLowerCase()
        .replace(/[`~!@#$%^&*()+={}\[\]|\\:;"'<>,.?/]+/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export function buildTOC(mdx: string): TOCItem[] {
    const items: TOCItem[] = [];
    const lines = mdx.split(/\r?\n/);
    for (const line of lines) {
        const m = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
        if (!m) continue;
        const depth = m[1].length as 2 | 3 | 4;
        if (depth < 2 || depth > 4) continue;
        const raw = m[2].replace(/`([^`]+)`/g, "$1").replace(/\[(.*?)\]\(.*?\)/g, "$1");
        const text = raw.trim();
        const id = slugify(text);
        items.push({ depth, text, id });
    }
    return items;
}
