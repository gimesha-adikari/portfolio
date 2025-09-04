import { slugify } from "@/components/MDX";

export type TOCItem = { depth: 2 | 3 | 4; text: string; id: string };

export function buildTOC(mdx: string): TOCItem[] {
    const items: TOCItem[] = [];
    let inFence = false;
    for (const raw of mdx.split(/\r?\n/)) {
        const line = raw.trimEnd();
        if (/^```/.test(line)) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;

        const m = /^(#{2,4})\s+(.+)$/.exec(line);
        if (m) {
            const depth = m[1].length as 2 | 3 | 4;
            const text = m[2].replace(/\s+#$/, "").trim();
            const id = slugify(text);
            items.push({ depth, text, id });
        }
    }
    return items;
}
