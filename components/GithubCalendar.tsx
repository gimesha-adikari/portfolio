"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useEffect, useState } from "react";

export default function GithubCalendar({ username }: { username: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-[112px] w-full animate-pulse bg-transparent rounded" />;
    }

    return (
        <GitHubCalendar
            username={username}
            colorScheme="dark"
            blockSize={12}
            blockMargin={4}
            fontSize={12}
        />
    );
}