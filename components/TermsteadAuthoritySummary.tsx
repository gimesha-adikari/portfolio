export function TermsteadAuthoritySummary() {
    return (
        <section
            id="termstead-authority-summary"
            className="termstead-authority-summary"
            aria-labelledby="termstead-authority-summary-title"
            data-termstead-authority-summary
        >
            <header className="termstead-authority-summary__header">
                <p className="termstead-authority-summary__eyebrow">Authority boundary</p>
                <h2 id="termstead-authority-summary-title" className="termstead-authority-summary__title">
                    Workspace policy and terminal authority stay separate.
                </h2>
                <p className="termstead-authority-summary__intro">
                    Termstead keeps view composition on the GUI side while the daemon remains authoritative for terminal sessions and terminal state.
                </p>
            </header>

            <div className="termstead-authority-summary__rail">
                <div className="termstead-authority-summary__domain termstead-authority-summary__domain--gui">
                    <p className="termstead-authority-summary__label">GUI / workspace</p>
                    <h3 className="termstead-authority-summary__domain-title">View and workspace ownership</h3>
                    <ul className="termstead-authority-summary__list">
                        <li><span aria-hidden="true" />Windows, tabs, and pane layout</li>
                        <li><span aria-hidden="true" />Focus, commands, and workspace policy</li>
                        <li><span aria-hidden="true" />View attachment lifecycle</li>
                    </ul>
                </div>

                <div className="termstead-authority-summary__boundary">
                    <span className="termstead-authority-summary__boundary-line" aria-hidden="true" />
                    <p className="termstead-authority-summary__label">Validated state boundary</p>
                    <p className="termstead-authority-summary__boundary-value">Full snapshots + revision-contiguous deltas</p>
                    <p className="termstead-authority-summary__hint"><span>Wake hint</span> · RenderReady</p>
                    <p className="termstead-authority-summary__reading-note">Reading order only · not a one-way message path</p>
                    <span className="termstead-authority-summary__boundary-line" aria-hidden="true" />
                </div>

                <div className="termstead-authority-summary__domain termstead-authority-summary__domain--daemon">
                    <p className="termstead-authority-summary__label">Daemon / session authority</p>
                    <h3 className="termstead-authority-summary__domain-title">Terminal and session ownership</h3>
                    <ul className="termstead-authority-summary__list">
                        <li><span aria-hidden="true" />PTYs and child processes</li>
                        <li><span aria-hidden="true" />Terminal state and modes</li>
                        <li><span aria-hidden="true" />Revisions</li>
                        <li><span aria-hidden="true" />Session lifetime</li>
                    </ul>
                </div>
            </div>

            <aside className="termstead-authority-summary__lifecycle" aria-labelledby="termstead-authority-lifecycle-title">
                <div className="termstead-authority-summary__lifecycle-heading">
                    <p className="termstead-authority-summary__eyebrow">Lifecycle distinction</p>
                    <h3 id="termstead-authority-lifecycle-title" className="termstead-authority-summary__lifecycle-title">
                        View lifetime <span aria-hidden="true">≠</span><span className="sr-only"> is not </span> session lifetime
                    </h3>
                </div>
                <div className="termstead-authority-summary__lifecycle-grid">
                    <div>
                        <p className="termstead-authority-summary__label">View binding</p>
                        <p className="termstead-authority-summary__lifecycle-value">Attach · detach / close · reconnect / reattach</p>
                    </div>
                    <div className="termstead-authority-summary__lifecycle-separator" aria-hidden="true">≠</div>
                    <div>
                        <p className="termstead-authority-summary__label">Separate daemon command</p>
                        <p className="termstead-authority-summary__lifecycle-value">Explicit TerminateSession</p>
                    </div>
                </div>
                <p className="termstead-authority-summary__lifecycle-note">
                    Closing a view ends its binding; the daemon-owned session and terminal process continue while the daemon remains available.
                </p>
                <p className="termstead-authority-summary__scope-note">
                    Session continuity is bounded by daemon availability. Crash, reboot, and power-loss persistence are outside this evidence.
                </p>
            </aside>
        </section>
    );
}
