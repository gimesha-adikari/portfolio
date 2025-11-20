export default function Loading() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="card rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-[16/10] bg-[var(--border)]" />
                    <div className="p-5 space-y-3">
                        <div className="h-5 w-2/3 bg-[var(--border)] rounded" />
                        <div className="h-4 w-full bg-[var(--border)] rounded" />
                        <div className="h-4 w-5/6 bg-[var(--border)] rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
