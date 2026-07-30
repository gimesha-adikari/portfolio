"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({
                                   children,
                                   delay = 0
                               }: {
    children: React.ReactNode;
    delay?: number;
}) {
    const reduce = useReducedMotion();

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}