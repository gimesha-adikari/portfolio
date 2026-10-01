// file: components/MDX.tsx
import * as React from "react";
import type { MDXComponents } from "mdx/types";
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
        .replace(/<\s*(https?:\/\/[^>\s]+)\s*>/gi, (_match, url: string) => `[${url}](${url})`)
        .replace(/<\s*(mailto:[^>\s]+)\s*>/gi, (_match, url: string) => `[${url}](${url})`);
}

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

function isAnchorElement(node: React.ReactNode): node is React.ReactElement<AnchorProps> {
    return React.isValidElement<AnchorProps>(node) && node.type === "a";
}

function Anchor({ href = "", children, className, ...rest }: AnchorProps) {
    const kids = React.Children.toArray(children);
    const child = kids.length === 1 && isAnchorElement(kids[0]) ? kids[0] : null;

    if (child) {
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
    return function H({ children, className, ...rest }: HeadingProps) {
        const text = React.Children.toArray(children).join(" ");
        const id = slugify(String(text));
        const sizes =
            tag === "h2"
                ? "text-2xl md:text-3xl font-semibold"
                : tag === "h3"
                    ? "text-xl md:text-2xl font-semibold"
                    : "text-lg md:text-xl font-semibold";
        const Tag = tag;

        return (
            <Tag
                id={id}
                className={cx(
                    "group scroll-mt-28 mt-10 first:mt-0",
                    sizes,
                    "leading-snug tracking-tight",
                    className,
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

function Img({ className, ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <span className="block my-4 rounded-xl overflow-hidden border border-[var(--border)]">
            <img {...rest} className={cx("w-full h-auto", className)} />
        </span>
    );
}

/** Responsive table wrapper to avoid horizontal overflow on phones. */
function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
    return (
        <div className="my-4 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm md:text-base" {...props} />
        </div>
    );
}

const defaultComponents: MDXComponents = {
    h2: Heading("h2"),
    h3: Heading("h3"),
    h4: Heading("h4"),

    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className="my-4 text-[var(--muted)] leading-relaxed" {...props} />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
        <ul className="my-3 list-disc pl-6 space-y-2" {...props} />
    ),
    ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
        <ol className="my-3 list-decimal pl-6 space-y-2" {...props} />
    ),
    li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
        <li className="leading-relaxed" {...props} />
    ),

    a: Anchor,
    img: Img,
    table: Table,

    hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
        <hr className="my-8 border-[var(--border)]" {...props} />
    ),
    code: (props: React.HTMLAttributes<HTMLElement>) => (
        <code className="px-1 py-0.5 rounded bg-[var(--surface)]" {...props} />
    ),
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
        <pre tabIndex={0} className="p-4 rounded bg-[var(--surface)] overflow-x-auto" {...props} />
    ),

    blockquote: (props: React.BlockquoteHTMLAttributes<HTMLElement>) => (
        <blockquote
            className="my-5 border-l-4 border-[var(--accent)]/50 pl-4 italic text-[var(--muted)]"
            {...props}
        />
    ),
};

export function RenderMDX({
    source,
    components = {},
}: {
    source: string;
    components?: MDXComponents;
}) {
    const mergedComponents: MDXComponents = {
        ...defaultComponents,
        ...components,
    };

    return <MDXRemote source={normalizeMDX(source)} components={mergedComponents} />;
}
