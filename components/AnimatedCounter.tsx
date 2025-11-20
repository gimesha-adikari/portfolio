"use client";
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
                                            value,
                                            duration = 700,
                                            className = "",
                                        }: {
    value: number;
    duration?: number;
    className?: string;
}) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement | null>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!ref.current || started) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setStarted(true);
                    const start = performance.now();
                    const from = 0;
                    const to = value;
                    const step = (t: number) => {
                        const p = Math.min(1, (t - start) / duration);
                        const eased = 1 - Math.pow(1 - p, 3);
                        setDisplay(Math.round(from + (to - from) * eased));
                        if (p < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                    obs.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [value, duration, started]);

    return (
        <span ref={ref} className={className}>
      {display}
    </span>
    );
}
