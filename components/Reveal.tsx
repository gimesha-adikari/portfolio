"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
export default function Reveal({
                                   children,
                                   delay = 0,
                                   className = "",
                                   duration = 0.5,
                                   fade = false,
                                   y = 20,
                               }: {
    children: ReactNode;
    delay?: number;
    className?: string;
    duration?: number;
    fade?: boolean;
    y?: number;
}) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: fade ? 0 : 1, y }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={reduceMotion ? undefined : { once: true, margin: "-50px" }}
            transition={reduceMotion ? { duration: 0 } : { duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
            data-reveal="true"
        >
            {children}
        </motion.div>
    );
}
