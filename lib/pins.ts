import type { Repo } from "@/lib/github";
import pinned from "@/data/pinned.json";

export function getPinnedNames(): string[] {
    return Array.isArray((pinned as any).pinned) ? (pinned as any).pinned : [];
}

export function orderReposWithPinned(repos: Repo[]): Repo[] {
    const names = getPinnedNames();
    const map = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
    const pinnedOrdered: Repo[] = [];

    for (const n of names) {
        const hit = map.get(String(n).toLowerCase());
        if (hit) pinnedOrdered.push(hit);
    }

    const pinnedSet = new Set(pinnedOrdered.map((r) => r.name.toLowerCase()));
    const rest = repos
        .filter((r) => !pinnedSet.has(r.name.toLowerCase()))
        .sort((a, b) => {
            const ad = Date.parse((a.pushedAt || a.updatedAt || "") as string);
            const bd = Date.parse((b.pushedAt || b.updatedAt || "") as string);
            return (isNaN(bd) ? 0 : bd) - (isNaN(ad) ? 0 : ad);
        });

    return [...pinnedOrdered, ...rest];
}

export function isPinned(name: string): boolean {
    return getPinnedNames().map((n) => n.toLowerCase()).includes(name.toLowerCase());
}
