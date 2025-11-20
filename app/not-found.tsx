import Link from "next/link";

export default function NotFound() {
    return (
        <div className="max-w-xl text-center mx-auto space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold">Not found</h1>
            <p className="text-[var(--muted)]">That page doesn’t exist. Try heading back home.</p>
            <Link href="/" className="btn btn-primary focus-ring">Go home</Link>
        </div>
    );
}
