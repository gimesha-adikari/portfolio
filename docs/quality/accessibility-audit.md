# Accessibility and contrast audit

Measurement date: 2026-09-27

This is a local, undeployed Phase 7F accessibility review. It is not a WCAG conformance claim, a production accessibility result, or a substitute for field user testing.

## Environment and method

- Branch: `codex/portfolio-improvement-plan`
- Starting checkpoint: `fb2dceeae046cb04ffbae96e92ab5ebb671453fe`
- Build: `env -u GITHUB_USERNAME GITHUB_MAX_PAGES=1 npm run build`
- Server: `PORT=3100 npm run start`
- OS: Linux 7.0.0-34-generic, x86_64
- CPU: Intel Core i5-8500 @ 3.00 GHz, 6 logical CPUs
- Memory: 14 GiB total
- Node: `v24.11.1`
- npm: `11.6.2`
- Chrome: `154.0.8037.57`
- Temporary audit tooling: `@axe-core/playwright@4.13.0`, `playwright@1.63.0`

The temporary browser packages and raw axe JSON/review screenshots were stored outside the repository under `/tmp/portfolio-a11y.LEYMON`; they are not release artifacts.

## Routes and themes

Automated axe coverage used 375×900 light-theme runs for `/`, `/projects`, `/projects/termstead`, `/projects/pdfnest`, `/projects/banking-platform`, `/projects/polyshop`, `/case-studies`, `/case-studies/modular-document-platform`, `/about`, and `/contact`. The homepage, projects index, and Termstead also received 1280×900 light and 375×900 dark runs; About received an additional dark run.

Manual browser checks covered the same representative content plus the unknown project and case-study routes, at 375×900, 768×900, 1280×900, a 320px reflow check, and a controlled CSS 2× zoom approximation. The latter is a reflow approximation rather than native browser chrome zoom.

## Axe results

The initial run found two rule types requiring attention:

- `scrollable-region-focusable` (serious): wide evidence-table wrappers on PDFNest, Banking Platform, and PolyShop were not keyboard-focusable.
- `heading-order` (moderate): the case-study Executive Summary used an `h3` directly after the page `h1`.

The final run covered 17 route/theme/viewport jobs. It reported **0 violations in every job**, with no browser console errors or warnings captured by the audit script. The remaining axe `incomplete` checks were:

- `aria-valid-attr-value` for the closed mobile-menu trigger. The hidden dialog target is present in the DOM (`aria-controls="mobile-navigation"` and `id="mobile-navigation"`); axe could not resolve the hidden target while `aria-haspopup="dialog"` was closed. A browser check confirmed the target exists and becomes an accessible dialog when opened.
- `color-contrast` for gradient text and pseudo-element/background overlap. No `color-contrast` violation was reported; these cases require visual/token review rather than being treated as automated passes.

## Manual findings and fixes

- The page-level main target now has `tabIndex={-1}`. Activating SkipLink moves focus to `main#content` instead of leaving focus on the body.
- The SkipLink and global focus outline use the solid accent color, while component-specific focus rings remain visible.
- The mobile menu keeps its controlled dialog target mounted but hidden when closed. Opening sets `aria-expanded="true"`, exposes the labelled modal dialog, moves focus inside, traps Tab within the drawer, prevents body scrolling, and Escape or navigation closes it and restores focus to the trigger.
- The theme button exposes the action it will perform (`Switch to dark theme` or `Switch to light theme`).
- The theme button and mobile-menu trigger use at least 44px square touch-target constraints.
- The Projects result summary is a polite atomic status region so archive filter changes are announced without a separate Apply action.
- Evidence-table regions and code excerpts are keyboard-focusable. Code excerpts use a constrained grid item and local horizontal scrolling so long lines do not expand the page at 320px.
- Footer GitHub, LinkedIn, and email icon links now have 44×44px clickable containers.
- The case-study Executive Summary heading is now an `h2`.
- Generic `aria-label` overrides that conflicted with visible project/repository card text were removed.

## Structural and visual checks

- Representative routes had exactly one page-level `<main>`, one visible `h1`, and no duplicate IDs.
- SkipLink, mobile navigation, filter controls, project links, evidence/source links, and theme control were keyboard exercised. Focus returned correctly after menu Escape and navigation.
- Desktop navigation remained visible and usable at 1280px. Mobile menu behavior was checked at 375px.
- The page reported no document-level horizontal overflow at 320px, 375px, 768px, or 1280px. Wide evidence tables remained local scroll regions with `tabIndex=0`; the Termstead code excerpt became a 204px local scroll region at 320px with `scrollWidth=738px`.
- Architecture and lifecycle figures retained captions and readable stacked content. No essential information depended on color alone: evidence badges include visible classification text, and diagrams include text labels.
- Audited routes contained no rendered content images requiring missing alt text. Decorative icons use `aria-hidden`; labelled icon links retain visible accessible names.
- External links opened in new tabs retained `noopener noreferrer` where the source/evidence components own the link. Footer profile links use `noreferrer`, which also provides opener protection in current browsers.
- No real form submission flow exists on Contact; it is link/copy based.
- Unknown project and case-study routes returned HTTP 404, `noindex` metadata, and no social image metadata.

## Contrast review

The active ocean tokens were checked in light and dark themes using the rendered CSS values and WCAG relative-luminance ratios. Primary text, muted text, normal accent links, and the focus accent were comfortably above the applicable text thresholds in the active themes. Borders were treated as non-text visual boundaries rather than text contrast claims. Gradient-clipped headings and translucent decorative backgrounds were not reduced to a single token ratio; axe correctly left those cases incomplete, so they remain visual-review limitations.

The dormant violet accent declarations are not mounted by the current layout and were not treated as an active theme result. A future theme-control review should either remove that dead option or validate its contrast before exposing it.

## Scope limits

- No full screen-reader session was performed; no screen reader is installed in the local environment.
- No WCAG A/AA conformance claim was made.
- No full color-contrast scanner, axe-core ruleset extension, production-site audit, deployment check, Lighthouse run, or field accessibility data was used here.
- Keyboard and browser checks are focused regression smoke coverage. A broader axe/manual review remains appropriate if the visual system or content density changes materially.
