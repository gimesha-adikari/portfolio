import * as React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

function cx(...cls: Array<string | undefined | false>) {
    return cls.filter(Boolean).join(" ");
}

export function slugify(s: string) {
    return s
        .toLowerCase()
        .replace(/[`~!@#$%^&*()+={}\[\]|\\:;"'<>,.?/]+/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function normalizeMDX(s: string) {
    return s
        .replace(/<\s*(https?:\/\/[^>\s]+)\s*>/gi, (_m, url) => `[${url}](${url})`)
        .replace(/<\s*(mailto:[^>\s]+)\s*>/gi, (_m, url) => `[${url}](${url})`);
}

function Anchor(props: any) {
    const { href = "", children, className, ...rest } = props;
    const kids = React.Children.toArray(children);

    if (
        kids.length === 1 &&
        React.isValidElement(kids[0]) &&
        (kids[0] as any).type === "a"
    ) {
        const child = kids[0] as React.ReactElement<any>;
        return React.cloneElement(child, {
            ...child.props,
            ...rest,
            href: child.props.href ?? href,
            className: cx(child.props.className, className),
        });
    }

    const isExternal = /^https?:\/\//i.test(href);
    return (
        <a
            href={href}
            className={cx("underline hover:no-underline break-words", className)}
            {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
            {...rest}
        >
            {children}
        </a>
    );
}

function Heading(tag: "h2" | "h3" | "h4") {
    return function H({ children, className, ...rest }: any) {
        const text = React.Children.toArray(children).join(" ");
        const id = slugify(String(text));
        const Tag: any = tag;
        const sizes =
            tag === "h2"
                ? "text-2xl md:text-3xl font-semibold"
                : tag === "h3"
                    ? "text-xl md:text-2xl font-semibold"
                    : "text-lg md:text-xl font-semibold";

        return (
            <Tag
                id={id}
                className={cx(
                    "group scroll-mt-28 mt-10 first:mt-0",
                    sizes,
                    "leading-snug tracking-tight",
                    className
                )}
                {...rest}
            >
                <a href={`#${id}`} className="no-underline text-inherit">
                    {children}
                    <span className="ml-2 opacity-0 group-hover:opacity-60 transition-opacity">#</span>
                </a>
            </Tag>
        );
    };
}

function Img(props: any) {
    const { className, ...rest } = props;
    return (
        <span className="block my-4 rounded-xl overflow-hidden border border-[var(--border)]">
            <img {...rest} className={cx("w-full h-auto", className)} />
    </span>
    );
}

/** Responsive table wrapper to avoid horizontal overflow on phones. */
function Table(props: any) {
    return (
        <div className="my-4 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm md:text-base" {...props} />
        </div>
    );
}

const components = {
    h2: Heading("h2"),
    h3: Heading("h3"),
    h4: Heading("h4"),

    p:  (p: any) => <p className="my-4 text-[var(--muted)] leading-relaxed" {...p} />,
    ul: (p: any) => <ul className="my-3 list-disc pl-6 space-y-2" {...p} />,
    ol: (p: any) => <ol className="my-3 list-decimal pl-6 space-y-2" {...p} />,
    li: (p: any) => <li className="leading-relaxed" {...p} />,

    a: Anchor,
    img: Img,
    table: Table,

    hr:   (p: any) => <hr className="my-8 border-[var(--border)]" {...p} />,
    code: (p: any) => <code className="px-1 py-0.5 rounded bg-[var(--surface)]" {...p} />,
    pre:  (p: any) => <pre className="p-4 rounded bg-[var(--surface)] overflow-x-auto" {...p} />,

    blockquote: (p: any) => (
        <blockquote
            className="my-5 border-l-4 border-[var(--accent)]/50 pl-4 italic text-[var(--muted)]"
            {...p}
        />
    ),
};

export function RenderMDX({ source }: { source: string }) {
    return <MDXRemote source={normalizeMDX(source)} components={components as any} />;
}
