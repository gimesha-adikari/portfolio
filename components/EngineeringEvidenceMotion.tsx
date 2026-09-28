"use client";

import { useInView, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

export function EngineeringEvidenceMotion({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
    const reduceMotion = useReducedMotion();
    const state = reduceMotion === true ? "static" : inView ? "active" : "static";

    return (
        <div ref={ref} className="homepage-engineering-evidence__motion" data-evidence-motion={state}>
            {children}
        </div>
    );
}
