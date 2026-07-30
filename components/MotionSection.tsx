"use client";

import { motion, useReducedMotion } from "framer-motion";
import { createElement, type JSX } from "react";

type Props = {
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    children: React.ReactNode;
    delay?: number;
    y?: number;
};

export default function MotionSection({ as = "div", className, children, delay = 0, y = 10 }: Props) {
    const reduce = useReducedMotion();
    const MotionEl = motion[as as keyof typeof motion] as any;

    return createElement(
        MotionEl,
        reduce
            ? { className }
            : {
                className,
                initial: { opacity: 0, y },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "0px 0px -10% 0px" },
                transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
            },
        children
    );
}