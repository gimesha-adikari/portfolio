export function BoundarySignal() {
    return (
        <div className="boundary-signal" aria-hidden="true">
            <svg
                viewBox="0 0 640 360"
                role="presentation"
                focusable="false"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <pattern id="boundary-signal-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                        <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <radialGradient id="boundary-signal-grid-fade" cx="58%" cy="50%" r="72%">
                        <stop offset="0" stopColor="white" stopOpacity="0.85" />
                        <stop offset="0.65" stopColor="white" stopOpacity="0.42" />
                        <stop offset="1" stopColor="black" stopOpacity="0" />
                    </radialGradient>
                    <mask id="boundary-signal-grid-mask">
                        <rect width="640" height="360" fill="url(#boundary-signal-grid-fade)" />
                    </mask>
                </defs>

                <rect
                    className="boundary-signal__grid"
                    width="640"
                    height="360"
                    fill="url(#boundary-signal-grid)"
                    mask="url(#boundary-signal-grid-mask)"
                />

                <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path className="boundary-signal__route" d="M106 180H338" />
                    <path className="boundary-signal__route boundary-signal__route--secondary" d="M242 94L292 132H338" />
                    <path className="boundary-signal__route boundary-signal__route--secondary" d="M338 180H542" />
                    <path className="boundary-signal__route boundary-signal__route--secondary boundary-signal__route--tertiary" d="M468 268H398V224" />
                    <path className="boundary-signal__route boundary-signal__route--signal" d="M106 180H542" />

                    <path className="boundary-signal__boundary" d="M338 52V308M338 52H382M338 308H382" />
                    <path className="boundary-signal__gate" d="M338 162V198M352 162V198" />
                </g>

                <g className="boundary-signal__nodes">
                    <circle className="boundary-signal__node boundary-signal__node--source" cx="106" cy="180" r="7" />
                    <circle className="boundary-signal__node boundary-signal__node--secondary" cx="242" cy="94" r="5" />
                    <circle className="boundary-signal__node boundary-signal__node--signal" cx="345" cy="180" r="6" />
                    <circle className="boundary-signal__node boundary-signal__node--destination" cx="542" cy="180" r="7" />
                    <circle className="boundary-signal__node boundary-signal__node--secondary" cx="468" cy="268" r="5" />
                </g>
            </svg>
        </div>
    );
}
