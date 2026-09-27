"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
    as?: "div" | "section" | "article" | "aside" | "span";
    className?: string;
    children: ReactNode;
    delay?: number;
    y?: number;
};

export default function MotionSection({ as = "div", className, children, delay = 0, y = 10 }: Props) {
    const reduce = useReducedMotion();
    const baseProps = { className, "data-motion-section": "true" };
    const motionProps = reduce
        ? baseProps
        : {
            ...baseProps,
            initial: { opacity: 0, y },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "0px 0px -10% 0px" },
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
        };

    if (as === "section") return <motion.section {...motionProps}>{children}</motion.section>;
    if (as === "article") return <motion.article {...motionProps}>{children}</motion.article>;
    if (as === "aside") return <motion.aside {...motionProps}>{children}</motion.aside>;
    if (as === "span") return <motion.span {...motionProps}>{children}</motion.span>;
    return <motion.div {...motionProps}>{children}</motion.div>;
}
