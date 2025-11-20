export function Footer() {
    return (
        <footer className="border-t border-[var(--border)]">
            <div className="container-xl py-8 text-sm text-[var(--muted)]">
                © {new Date().getFullYear()} Gimesha Nirmal. All rights reserved.
            </div>
        </footer>
    );
}
