// file: app/projects/loading.tsx
export default function Loading() {
    return (
        <section className="relative hero-glow">
            <div className="container-xl max-w-7xl mx-auto pt-10 md:pt-14 pb-20">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Skeleton Desktop Sidebar */}
                    <aside className="hidden lg:block w-[280px] shrink-0">
                        <div className="card h-[400px] rounded-[14px] bg-[var(--surface)] animate-pulse border border-[var(--border)]" />
                    </aside>

                    {/* Skeleton Main Content */}
                    <div className="flex-1 w-full min-w-0 space-y-8">
                        {/* Header Skeleton */}
                        <div className="space-y-3">
                            <div className="h-10 w-48 bg-[var(--surface)] rounded-lg animate-pulse" />
                            <div className="h-5 w-64 bg-[var(--surface)] rounded-md animate-pulse" />
                        </div>

                        {/* Grid Skeleton */}
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="relative rounded-[14px] p-[1px]">
                                    <div className="absolute inset-0 rounded-[14px] border border-transparent bg-[var(--surface)] animate-pulse" />
                                    <div className="relative card rounded-[14px] overflow-hidden h-full flex flex-col bg-[var(--bg)]">
                                        <div className="aspect-[16/10] bg-[var(--surface)] animate-pulse border-b border-[var(--border)]" />
                                        <div className="p-5 md:p-6 space-y-4">
                                            <div className="h-6 w-3/4 bg-[var(--surface)] rounded-md animate-pulse" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-full bg-[var(--surface)] rounded-md animate-pulse" />
                                                <div className="h-4 w-5/6 bg-[var(--surface)] rounded-md animate-pulse" />
                                            </div>
                                            <div className="pt-4 flex gap-2">
                                                <div className="h-5 w-16 bg-[var(--surface)] rounded-md animate-pulse" />
                                                <div className="h-5 w-16 bg-[var(--surface)] rounded-md animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}