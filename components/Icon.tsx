export function Icon({ name, className = "", label }: { name: string; className?: string; label?: string }) {
    return (
        <span
            className={`${name} ${className} inline-block align-[0.125em] size-5`}
            role={label ? "img" : "presentation"}
            aria-label={label ?? undefined}
            aria-hidden={label ? undefined : true}
        />
    );
}
