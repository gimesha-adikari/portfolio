# Portfolio Improvement Plan

Permanent execution plan for improving gimesha-adikari/portfolio with Codex.

Plan created: 2026-09-26
Revalidated baseline: main at b8ea4a7e8fd77c49536bdcb5a58f2a4044053c5e
Implementation branch baseline: codex/portfolio-improvement-plan at 0d6fc0cbd405459bf9d1f01602c30e2bf1d2575d
Primary production domain: https://www.gimesha.com
Status: Phases 0 through 6E and Phase 7A through Phase 7F are checkpointed; Phase 7G production validation completed on `main` at `2bfa34a`; the Engineering Notes limited pilot and its Phase 8C production validation are recorded below, while the durable notes program and later Phase 8 features remain deferred. The old query-driven OG route was replaced with route-local branded image generation, baseline headers/CI were added, and production checks are recorded below.

## Purpose

This plan converts the production audit into an ordered implementation program. Do not redesign the portfolio from scratch. Fix correctness and security problems first, simplify the architecture, make portfolio-owned content authoritative, and then improve storytelling and visuals around real engineering evidence.

Core product principle:

GitHub is evidence for the portfolio, not the portfolio content-management system.

The finished site should clearly communicate:
- explicit system and ownership boundaries;
- technical decisions supported by evidence and measurements;
- ability to carry products across frontend, backend, infrastructure, mobile, and lower-level systems work.

## How Codex must use this file

At the start of every implementation session:
1. Read this file completely.
2. Run git status and inspect the current branch and HEAD.
3. Work on the earliest incomplete phase unless the user explicitly reprioritizes.
4. Keep changes incremental and reviewable.
5. Update this file's checkboxes and execution log before ending the session.

Rules:
- Prefer one coherent concern per commit.
- Preserve working behavior unless this plan explicitly replaces it.
- Do not invent performance, accessibility, reliability, traffic, or outcome metrics.
- Do not claim Lighthouse, Core Web Vitals, contrast, or accessibility results until measured.
- Public portfolio data must be structurally unable to expose private GitHub repositories.
- Do not add visual spectacle before correctness, content ownership, and navigation simplification are complete.
- Prefer Server Components and small client islands for real interaction.
- Delete legacy systems only after useful content has been migrated.
- Quantitative portfolio claims must have reproducible evidence or be rewritten qualitatively.

Status:
- [ ] not started
- [-] in progress
- [x] complete and validated
- [!] blocked; explain in execution log

## Revalidation snapshot - 2026-09-26

Current main still points to b8ea4a7e8fd77c49536bdcb5a58f2a4044053c5e, the same commit used by the audit. No newer source changes were found.

Confirmed still present in source:
- app/layout.tsx still derives metadataBase from SITE_URL with localhost fallback.
- Open Graph siteName, sidebar/footer branding, OG route branding, vCard URL, and robots references still contain gimesha.dev.
- app/sitemap.ts still falls back to localhost, includes /cv, includes stale legacy case-study routes, and derives project routes from GitHub repositories.
- app/robots.ts and public/robots.txt both exist and point to the old .dev sitemap.
- content/about.yml still links to /projects/banking-platform and /projects/ai-verification while project routing remains repo-derived.
- content/case-studies/dynamic-tool-routing-system.yml still links to /tools.
- lib/github.ts still defaults GITHUB_INCLUDE_PRIVATE to true, fetches authenticated /user/repos, merges authenticated and public results, and filters private repos only when the flag is false.
- components/RepoCard.tsx still renders Featured unconditionally.
- components/FlyonuiScript.tsx still globally loads jQuery, Lodash, noUiSlider, DataTables, Dropzone, and FlyonUI.
- package.json still includes that compatibility stack and multiple latest ranges.
- components/Header.tsx still hard-codes aria-expanded=false and uses a 36x36 mobile target.
- components/MiniSidebar.tsx still relies on plugin and DOM synchronization rather than a React-owned drawer.
- components/ProjectsFilters.tsx still uses a render-local any typingTimer, mixes defaultValue with state, auto-applies filters, and renders Apply.
- components/Reveal.tsx still imports ReactNode from node_modules/@types/react and does not use reduced-motion state.
- components/SkipLink.tsx exists but is not mounted in root layout.
- app/case-studies/[slug]/page.tsx still nests main inside root main and has no route-specific metadata generator.
- components/Footer.tsx still shows the unsupported All systems operational indicator and an inconsistent LinkedIn path.
- data/projects.ts, YAML case studies, legacy site-content, GitHub descriptions/READMEs, and optional story fetching remain competing content sources.
- .idea/workspace.xml remains committed and .gitignore does not ignore .idea.
- README.md is stale and still advertises Next.js 15 while package.json uses Next.js 16.2.12.
- The project detail route still has too many responsibilities and uses unoptimized project imagery.

Current YAML case-study source found:
- modular-document-platform
- pdf-edge-case-handling
- high-performance-file-processing
- dynamic-tool-routing-system
- ocr-document-extraction
- modular-kyc-architecture
- resilient-mobile-payments
- browser-rendering-optimization

Revalidation limitation:
The custom production domain could not be fetched through the browsing tools available in this session, and the connected Vercel tool did not have access to the deployment. Source-backed findings are revalidated. Live-only checks such as actual HTTP status codes, emitted production metadata, response headers, Lighthouse/Core Web Vitals, visual breakpoints, and current Vercel runtime health must be checked before their related phase is marked complete.

## Target architecture

Portfolio-owned content:
- decides project identity, importance, narrative, evidence, and case studies.

GitHub enrichment:
- supplies optional mutable facts such as updated date, public source link, stars, and languages.

UI:
- renders normalized portfolio models and continues to work when GitHub is unavailable.

Target core models:
- siteConfig
- PortfolioProject
- RepositoryFacts
- CaseStudy
- EngineeringEvidence or Decision when needed

A portfolio project may contain multiple repositories. A repository must never automatically become a featured portfolio project.

## Phase 0 - Baseline and guardrails

Goal: make the work reproducible before changing behavior.

- [x] Confirm local Node/npm versions and clean working tree.
- [x] Record current main SHA in the execution log.
- [x] Run npm ci.
- [x] Run npm run lint.
- [x] Run npx tsc --noEmit.
- [x] Run npm run build.
- [x] Record baseline failures honestly.
- [x] Establish a small route/link/metadata smoke-test approach.

Exit: baseline commands and known failures are documented.

## Phase 1 - Production correctness, identity, privacy, hygiene

Goal: remove objective defects before redesigning anything.

Identity:
- [x] Add a single siteConfig for canonical URL, display domain, name, GitHub, LinkedIn, email, CV route, and default metadata.
- [x] Make https://www.gimesha.com the canonical public URL with no localhost production fallback.
- [x] Remove stale .dev identity where it is no longer intentional.
- [x] Normalize one verified LinkedIn URL.
- [x] Update OG branding and vCard through siteConfig.

Sitemap and robots:
- [x] Generate sitemap from actual static routes plus authoritative project/case-study models.
- [x] Remove stale /cv and use /cv.pdf if it remains canonical.
- [x] Remove legacy case-study slugs.
- [x] Include every current case-study slug.
- [x] Keep one robots implementation, preferably app/robots.ts.
- [x] Remove public/robots.txt after validation.

Links and UI correctness:
- [x] Fix or temporarily remove broken Banking Platform and AI Verification project links.
- [x] Fix/remove /tools case-study resource link.
- [x] Do not render resource actions with empty destinations.
- [x] Surface /cv.pdf deliberately.
- [x] Remove or replace All systems operational.

GitHub privacy:
- [x] Make public repository discovery public-only by construction.
- [x] Stop defaulting private inclusion to true.
- [x] Prefer /users/<username>/repos for public listing.
- [x] Reject repo.private even if authenticated data appears.
- [x] Use a curated repository allowlist where appropriate.
- [x] Use no token or minimal token scope when public data is enough.

Repository hygiene:
- [x] Remove .idea from version control.
- [x] Add .idea/ to .gitignore.
- [x] Rewrite README for Next.js 16 and the real content architecture.
- [x] Document local development, env vars, commands, deployment, and content editing.

Validation:
- [x] build
- [x] typecheck
- [x] link/route smoke
- [x] generated sitemap/robots/metadata inspection

Exit: no known localhost canonical, stale domain identity, stale sitemap route, known broken internal link, or private-repo exposure path remains.

## Phase 2 - Content ownership and project architecture

Goal: replace repository equals project with a curated portfolio model.

- [x] Define and validate PortfolioProject.
- [x] Include slug, title, tagline, status, featured/order, role/period, problem, constraints, architecture, decisions, outcomes/evidence, repositories, media, case studies, and optional live URL.
- [x] Make portfolio-owned project content authoritative.
- [x] Migrate useful material from data/projects.ts before deleting it.
- [x] Group Platen PDF frontend/backend/worker under one Platen PDF project, while retaining the historical repository identifiers.
- [x] Create a real multi-repository Banking Platform project.
- [x] Add Termstead as a first-class curated project.
- [x] Evaluate PolyShop as a fourth flagship using verified evidence.
- [x] Treat Runyard as Lab/In progress until it has enough story.
- [x] Keep NeuroSim experimental/educational unless new evidence changes that.
- [x] Make GitHub enrichment optional and non-authoritative.
- [x] Ensure project pages still render meaningful content if GitHub fails.
- [x] Pick one long-form content architecture. Preferred direction: validated structured metadata plus MDX for deep narratives/evidence.
- [-] Remove legacy content systems only after migration; useful content was migrated, but legacy sources remain intentionally for the later cleanup phase.

Exit: flagship identity/order/story is controlled locally and multi-repo projects work.

## Phase 3 - Refactor project and case-study implementation

Goal: align code with the new content architecture.

- [x] Break app/projects/[slug]/page.tsx into orchestration, resolver, and focused presentation components.
- [x] Add a normalized project content resolver.
- [x] Replace broad any at content/API boundaries with explicit types and runtime validation where external/YAML/MDX data enters. GitHub, archive/story, remote case-index content, MDX component mappings, the active About YAML consumer, resolver, metadata, and touched route boundaries are typed; unrelated Phase 4 client/integration casts remain outside this item.
- [x] Add route-specific metadata for case studies.
- [x] Add Article or TechArticle structured data.
- [x] Replace nested case-study main with article/section semantics.
- [x] Do not render resource buttons without valid URLs.
- [x] Reassess remote image handling and remove unoptimized unless documented.

Exit: route files mostly orchestrate normalized models and metadata/semantics are route-correct.

## Phase 4 - Navigation, client JS, accessibility, interaction cleanup

Goal: simplify ordinary interactions and remove unnecessary client complexity.

- [x] Replace FlyonUI mobile-menu ownership with a small React-controlled accessible drawer/dialog.
- [x] Remove FlyonuiScript.tsx after migration.
- [x] Remove unused jQuery, Lodash, noUiSlider, DataTables, Dropzone, and FlyonUI dependencies after verifying no consumers. The five browser-compatibility packages and their type packages were removed; `flyonui` remains as an active Tailwind/CSS plugin imported by `app/globals.css`, not as a browser runtime.
- [x] Synchronize mobile aria-expanded with real state.
- [x] Increase mobile trigger target toward at least 44px.
- [x] Mount SkipLink in root layout.
- [x] Fix Reveal.tsx React type import.
- [x] Respect reduced motion in Reveal and other animations.
- [x] Disable smooth scrolling under reduced motion.
- [x] Fix project-filter debounce with a stable ref/cleanup/deferred approach.
- [x] Make filter inputs consistently controlled or URL-derived.
- [x] Remove redundant Apply if filters auto-apply.
- [x] Make All count equal actual repository/result count.
- [x] Move repository filtering to a Labs/Repositories view after flagship curation. The existing `/projects` page keeps one filter bar inside the Labs/archive section after curated projects; it does not alter curated identity or order.
- [x] Reconsider pointer glow and reading progress; keep only if clearly useful. Both global effects were removed because they did not justify global listeners/client state.

Exit: menu no longer needs compatibility UI framework; keyboard/focus/menu state is correct.

## Phase 5 - Homepage and portfolio storytelling

Goal: make engineering evidence the first impression.

Target order:
Hero -> flagship systems -> engineering evidence/decisions -> featured case studies -> recent engineering activity -> about/contact CTA

- [x] Rewrite hero toward concrete engineering scope. The hero now describes systems/platform engineering and explicit state, service, and failure boundaries.
- [x] Use a primary CTA such as Explore flagship systems. The primary action is `View selected work`.
- [x] Use a secondary CTA such as Read engineering case studies. The secondary action is `Read engineering case studies`; CV remains a quieter tertiary action.
- [x] Demote/remove repo count, years coding, contribution-calendar prominence, vanity language statistics, and raw activity stream where they compete with stronger evidence. Counts, language chips, and the calendar were removed; optional activity is now below portfolio-owned sections.
- [x] Present Platen PDF as one multi-service system. The homepage renders the single curated Platen PDF record and its grouped web/API/worker architecture; `platen-document` remains a related standalone SDK.
- [x] Make Termstead a flagship technical story. Termstead is the first curated system and its daemon/session boundary is surfaced in engineering evidence.
- [x] Present Banking Platform as one system across backend, web, Android, and KYC. The homepage renders the single curated Banking Platform record and cross-stack evidence.
- [x] Evaluate whether a fourth system has enough verified evidence for homepage promotion. PolyShop was reviewed and remains curated, secondary, experimental, and non-featured because current source evidence does not establish all README-level architecture or operational claims.
- [x] Replace generic reliable/scalable/high-performance language with decisions, constraints, tests, or measurements in the homepage story. Deeper case-study wording remains a Phase 6 evidence task.
- [x] Resolve PDFNest vs Platen PDF naming before marketing expansion. The public/display name is Platen PDF; the stable project slug remains `/projects/pdfnest`; historical repository names remain unchanged; `platen-document` is a related standalone local-first SDK.

Exit: visitors can understand the strongest engineering areas without reading GitHub statistics.

## Phase 6 - Evidence-rich flagship content

Termstead:
- [x] Cover daemon-owned terminal/session state, GUI-owned layout/focus, IPC boundaries, lifecycle, renderer boundaries, alternatives considered, stress testing, and measured baselines. Phase 6A records claim classifications, source commits, and explicit limits in the validated Termstead evidence record.
- [x] Include methodology/caveats with any memory or latency figures. Measurements retain environment, date/commit, method, sample, and limitations; daemon-side markers are not presented as input-to-display latency.

Platen PDF:
- [x] Explain frontend -> Go API -> worker/processing topology. Phase 6B records the browser/web, Go API, worker, and related standalone SDK ownership boundaries against exact remote default-branch commits.
- [x] Explain sync vs async work, validation, file lifecycle, queueing, OCR, failure handling, preview vs server processing, scaling constraints, and evolved decisions. The record includes workflow/file-lifecycle/processing/failure sections, bounded configuration evidence, explicit limitations, and a `NOT TESTED` benchmark entry rather than unsupported throughput claims.

Banking Platform:
- [x] Show Spring Boot, React, Android/Kotlin, and FastAPI KYC as one project. The curated record now attaches source-pinned evidence for the Spring core, React web client, Android client, and FastAPI KYC boundaries.
- [x] Remove or substantiate false-reject and similar outcome claims. Active and retained legacy Banking case-study copies now describe implemented policy and explicit limitations; accuracy, false-rejection, manual-review, and production outcomes remain unpublished without labeled evidence.

PolyShop or other flagship:
- [x] Verify service boundaries, Kafka/Redis/API gateway, contract/load testing, and saga-related claims directly before publishing. Phase 6D audited public `main` at `2e818de0c772fd186da27640933da71d1cda43e5`, attached source-pinned evidence to the existing PolyShop record, and retained it as curated, experimental, and non-featured. Auth/JWT/rate-limit/audit behavior is separated from design-only gateway/Redis/saga/outbox claims and unexecuted Pact/Newman/k6 assets.

Reusable evidence:
- [x] Architecture/system diagrams. Phase 6A adds an accessible ownership-boundary diagram for Termstead.
- [x] Sequence diagrams where useful. Phase 6A adds a semantic detach/reconnect/termination lifecycle sequence.
- [x] Decision cards/ADRs. Phase 6A records alternatives and classifications for ownership, lifecycle, synchronization, dispatch, and rendering decisions.
- [x] Benchmark/evidence tables with methodology. Phase 6A surfaces only verified resource, boundedness, daemon-side timing, and renderer geometry evidence with caveats.
- [x] Focused code excerpts. Phase 6E adds four short, source-commit-pinned excerpts through the shared validated evidence model and server-rendered presentation component.
- [x] Failure/recovery stories. Phase 6A includes the force_width debugging story and explicit snapshot/reconnect recovery behavior.
- [x] Evaluate screenshots and include them only when they communicate behavior or technical context. Existing candidates were reviewed; no sufficiently valuable technical screenshot was added.

Exit: every flagship has concrete decisions/evidence and no unsupported quantitative claim remains.

## Phase 7 - SEO, quality gates, security headers, measured validation

- [x] Add project-specific branded OG images. Phase 7A adds one shared server-rendered card/data layer, route-local image generation for the homepage, projects, curated projects, case studies, about, and contact, and a validated generic case-study strategy without GitHub dependencies.
- [x] Complete project/case-study metadata and canonical coverage. Phase 7A standardizes branded titles, descriptions, canonical URLs, Open Graph URLs/images, Twitter card images, and the stable Platen PDF `/projects/pdfnest` route.
- [x] Add baseline security/privacy response headers. Phase 7B centrally applies `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a minimal `Permissions-Policy`, and `X-Frame-Options: DENY`, with local production-server verification across HTML, metadata images, sitemap, robots, CV, and current static assets. CSP is evaluated separately below and remains intentionally deferred.
- [!] Evaluate CSP. Phase 7B defers enforcement: production HTML contains Next.js inline bootstrap/Flight scripts and inline style attributes; strict static directives would need nonce/hash work, nonce infrastructure would force request-time rendering and caching trade-offs, and experimental SRI was not adopted. No unsafe-inline/unsafe-eval policy or invented report endpoint was added.
- [x] Add lightweight CI: `.github/workflows/ci.yml` runs one read-only Node 24 quality job on pull requests and pushes to `main`: `npm ci`, lint, TypeScript, the canonical `npm test` suite, and a production build with `GITHUB_USERNAME` unset. No secrets, deployment, or write permissions are used; `npm audit` remains manual/release validation. The workflow is locally validated, but its first remote GitHub Actions run remains pending until a push.
- [x] Add focused tests: route/link smoke, metadata/sitemap, GitHub-failure fallback, accessibility smoke, project filters. Phase 7D adds a dependency-free route/content/filter regression suite; focused browser smoke remains a local validation step, while full axe/contrast/Lighthouse and production checks remain pending below.
- [x] Record a reproducible Lighthouse lab baseline and targeted findings on important routes. Phase 7E records three-run mobile medians/ranges for `/`, `/projects`, Termstead, Platen PDF, Banking Platform, and About, plus desktop comparisons for `/` and Termstead; no CI thresholds were added.
- [x] Check production/field Core Web Vitals availability after deployment. Three mobile Lighthouse sanity runs covered `/`, `/projects`, and `/projects/termstead`; the PageSpeed field-data request returned HTTP 429 because the configured public quota was exhausted, so no field result is inferred from lab data.
- [x] Run axe plus manual keyboard/focus testing. Phase 7F audited representative light/dark routes with temporary `@axe-core/playwright` tooling (zero final violations), then manually exercised SkipLink, mobile dialog focus/escape/navigation, filters, theme control, evidence/source links, landmarks, headings, and touch targets. The audit is local smoke coverage, not a full WCAG or screen-reader claim.
- [x] Run contrast checks. Phase 7F reviewed active light/dark ocean theme text, focus, link, border, gradient, and decorative-background behavior with rendered token ratios plus visual inspection; no active-token change was required. Gradient/pseudo-element cases remain explicitly limited by automated contrast tooling, and the dormant violet declaration is not exposed by the current layout.
- [x] Test mobile breakpoints and diagram scroll/zoom readability. Phase 7F checked representative routes at 320px, 375px, 768px, and 1280px, plus a controlled CSS 2× reflow approximation. Wide evidence tables and code excerpts remain local keyboard-scroll regions without page-level overflow; native browser chrome zoom and full visual breakpoint review remain outside this smoke pass.
- [x] Verify production headers, sitemap, robots, canonical/OG output, and 404 behavior after deploy. Final production checks at `2bfa34a` confirmed the baseline headers, `max-age=63072000` HSTS, `.com` metadata, route-local OG PNGs, curated sitemap/robots output, and real 404 responses for unknown project/case-study routes.
- [x] Verify the production CV/download path after deploy. `https://www.gimesha.com/cv.pdf` returned HTTP 200 with `application/pdf` and a non-empty body; the legacy `/cv` route remains absent from the sitemap.
- [x] Run the live production recheck after deploy. The permanent pre-overhaul branch/tag were verified before merge, PR #3 was merged with a merge commit, two production defects were corrected through PRs #4 and #5, and final browser, route, header, metadata, accessibility-sanity, and Lighthouse-sanity checks were run against the resulting deployment. This deployment-dependent gate is now closed; field data remains unavailable rather than fabricated.

Exit: quality claims are supported by recorded checks and CI protects key correctness issues.

## Phase 8 - High-value features after fundamentals

Only after Phases 1-7 are stable:
- [-] Engineering Notes after there are enough real notes.
- [ ] Reusable Engineering Decision Explorer.
- [ ] Architecture Lens / reusable architecture visualization.
- [ ] Project milestones/history where useful.
- [ ] RSS only when notes are regularly published.
- [ ] Consider Termstead Systems Trace as the signature experience.

Avoid for now:
- fake terminal homepage
- skill percentage bars
- custom cursor
- 3D/particle spectacle
- splash/loading intro
- autoplay audio
- more GitHub vanity dashboards
- fake live counters/status
- generic testimonials
- animated technology clouds
- elaborate global page transitions

## Recommended Codex execution order

1. Baseline commands and plan update.
2. siteConfig and identity normalization.
3. sitemap/robots/link/privacy fixes.
4. repository hygiene and README.
5. curated PortfolioProject model and GitHub enrichment boundary.
6. migrate Termstead/Platen PDF/Banking/PolyShop project data.
7. refactor project/case-study routes.
8. replace FlyonUI navigation and remove compatibility dependencies.
9. accessibility/filter/client cleanup.
10. homepage restructure.
11. evidence-rich flagship content and diagrams.
12. SEO/OG/security headers/tests/CI.
13. measured browser/Lighthouse/accessibility validation.
14. optional signature features.

## Required validation commands

Run the applicable subset after each meaningful change and all before completing a phase:

npm ci
npm run lint
npx tsc --noEmit
npm test   (once a test script exists)
npm run build

Use targeted browser checks for changed routes. Do not mark a browser-dependent item complete from source inspection alone.

## Execution log

Add entries newest-first. Include date, branch/SHA, phase, changes, validation, and remaining concerns.

### 2026-09-27 - Phase 8C Engineering Notes pilot production validation

- Scope/result: the single approved Termstead Engineering Note was pushed from `codex/phase8b-engineering-notes-pilot` at `2e5ba3ff6a313e6d8e7e4ffe8030a6eeb9f07249`, reviewed in PR #7 (`https://github.com/gimesha-adikari/portfolio/pull/7`), and merged into `main` with normal merge commit `fa074c754e37d28c222d389408cb70b36f94f017` at `2026-09-27T16:54:52Z`. No second note or later Phase 8 feature was started. The Engineering Notes checkbox remains `[-]`; one successful pilot is not evidence of a durable publication program.
- PR CI: GitHub Actions `Portfolio CI` run `36334154715` (#10) passed for the PR head SHA. Checkout, Node setup, `npm ci`, lint, TypeScript, tests, and the no-GitHub production build all passed. The accepted local preflight also passed `npm ci`, `npm audit` (0 vulnerabilities), lint, TypeScript, `npm test` (89/89), normal build (46 pages), bounded GitHub build (60 pages), no-GitHub build (46 pages), and `git diff --check`; `package-lock.json` and dependencies were unchanged.
- Preview: Vercel deployment `dpl_FCGb9mLMksq1JxnpAb4PsHih26eq` at `https://portfolio-4vnnrx100-gimeshas-projects.vercel.app` was READY for the pilot SHA. HTML routes, the unknown-note 404, both note OG routes, rendered content, source/claim boundary, metadata, TechArticle JSON-LD, responsive widths (320/375/768/1024/1280/1600), local code scrolling, mobile menu/Escape/focus return, theme control, keyboard focus, and console checks passed. The protected preview's XML/TXT endpoints could not be independently fetched through the provider/browser session: the provider returned the Vercel SSO redirect and the installed browser extension blocked direct XML/TXT navigation. Production sitemap/robots checks below were therefore treated as the authoritative HTTP result for those same generated routes; no application defect was inferred from the protection/tooling limitation.
- Preview content verdict: the note adds a focused standalone question about `forced_cell_width`, per-cell advance versus shaped-run width, wide/combining-cell exclusions, and the named regression test. It is related to but narrower than the Termstead project page and does not expand into daemon/session ownership, snapshots/deltas, RenderReady, reconnect, termination, input-marker latency, or Systems Trace material. Both preview OG cards rendered as readable 1200x630 PNGs without an external font/network dependency.
- Main CI/deployment: push-to-main `Portfolio CI` run `36334980363` (#11) passed for `fa074c754e37d28c222d389408cb70b36f94f017`; the `Quality gates` job succeeded. The resulting Vercel production deployment `dpl_5FfkHuDNuFxRsaDsmX5yibuaSQTT` is READY, sourced from that merge SHA, and carries `www.gimesha.com`, `gimesha.com`, `portfolio-gimeshas-projects.vercel.app`, and the main Git alias.
- Production routes/content: `/engineering-notes` and `/engineering-notes/terminal-cell-width-vs-text-run-width` returned 200 HTML; the unknown note returned a real 404; both OG routes returned 200 `image/png`; `/cv.pdf` remained 200 `application/pdf`; established project, case-study, about, contact, sitemap, and robots routes remained 200. `/sitemap.xml` returned 200 `application/xml` and contains exactly the index and published note URLs without preview hosts, OG routes, RSS, or tag/category routes. `/robots.txt` returned 200 and references `https://www.gimesha.com/sitemap.xml`; `/rss.xml` and `/engineering-notes/rss.xml` remain 404.
- Production metadata/UX: the detail page retained the exact title/date/project relationship, pinned source `0776a19f39539c396df76038c55a14bb55948a53` at `crates/terminal-render/src/renderer.rs`, one short Rust excerpt, limitations, production canonical/OG/Twitter URLs, and bounded `TechArticle` JSON-LD. Fresh browser checks found no console errors or hydration failures. Responsive checks at 320/375/768/1024/1280/1600 found no page-level horizontal overflow; long code/table regions scroll locally. Light/dark theme, mobile menu/Escape/focus return, reduced-motion emulation, source/project links, and code-region keyboard focus were exercised.
- Accessibility/lab data: a full-page axe sanity found no violations on the note article itself. The page-level mobile-light run reported one incomplete shared menu `aria-controls` check, and the dark run reported nine existing shared header/footer navigation contrast findings; these are outside the pilot article and were not introduced by the Phase 8B files, so no unrelated shared-shell fix was mixed into this pilot. Three production mobile Lighthouse runs on the detail scored Performance 92/94/97 (median 94), Accessibility/Best Practices/SEO 100 each run, LCP 1.72–2.11s (median 1.81s), TBT 33.5–39.5ms (median 35ms), and CLS 0.00237–0.00341. These are lab data only, not field Core Web Vitals or WCAG compliance.
- Value decision/remaining boundary: `KEEP PILOT AS-IS`. The one-note index is intentionally limited, the note is technically useful and visually integrated, and no pilot-specific production defect remains. This validation does not justify a second note, RSS, a CMS, search/filtering/categories, Decision Explorer, Architecture Lens, project milestones/history, or Termstead Systems Trace. The documentation-only follow-up is being carried on `codex/phase8c-production-record` from the merged main SHA; runtime behavior is not being changed.

### 2026-09-27 - Phase 8B Engineering Notes limited pilot

- Scope: one limited pilot only. Added the published Termstead note `When a Terminal Cell Width Is Not a Text-Run Width` at `/engineering-notes/terminal-cell-width-vs-text-run-width`; no second note, Platen note, Decision Explorer, Architecture Lens, Systems Trace, RSS, CMS, search, comments, or publishing workflow was started. The Phase 8 Engineering Notes checkbox is `[-]`, not complete.
- Starting state: branch `codex/phase8b-engineering-notes-pilot` was created from the accepted Phase 8A checkpoint `2fae1aa264d4f4f1d5a5c87c7ae2f52c296c224f` on `codex/phase8-engineering-notes-readiness`. The Phase 8A commit and protected `origin/main` base were not modified.
- Content/evidence: the note is project-associated with `termstead`, asks one narrow renderer question, and links only to public Termstead source pinned to commit `0776a19f39539c396df76038c55a14bb55948a53`, `crates/terminal-render/src/renderer.rs#L916-L920`. The note uses a short `forced_cell_width` excerpt and the focused `forced_width_is_one_cell_per_glyph_not_the_full_run_width` regression-test evidence. It explicitly does not claim pixel-golden, cross-device, physical-input/IME, complete-Unicode, performance, frame-rate, input-latency, production-scale, or complete GPUI-shell proof.
- Architecture: local `content/engineering-notes/*.mdx` is loaded by the typed/runtime-validated `lib/engineering-notes.ts`; only published notes are rendered, linked, emitted to the sitemap, and eligible for metadata/OG generation. The index and detail route reuse existing site metadata, MDX, project identity, OG, and layout conventions. The project detail page has a generic data-driven Related Engineering Notes section; no global navigation item was added.
- Metadata/discoverability: index/detail metadata, canonical URLs, Twitter/OG metadata, shared 1200x630 branded OG images, `TechArticle` JSON-LD with actual note fields only, and published-note sitemap entries were implemented. Unknown/unpublished slugs return 404. RSS remains deferred until regular publication is justified.
- Validation: `npm ci` completed with 363 packages added and 0 vulnerabilities; `npm audit` reported 0 vulnerabilities; lint, TypeScript, the focused Phase 8B contract suite (14/14), the full test suite (89/89), default build (46 static pages), bounded GitHub build (60 static pages), no-GitHub build (46 static pages), route/metadata/OG/sitemap checks, responsive browser checks at 320/375/768/1024/1280/1600px, mobile-menu/Escape, theme-toggle, keyboard, project-link/back-navigation, and a mobile Lighthouse sanity run were completed. Lighthouse 13.5.0 scored Performance 97, Accessibility 100, Best Practices 100, and SEO 100; LCP was 2.6s, TBT 60ms, and CLS 0.001 in this local run. The only observed browser console error was the existing local `/cv.pdf` proxy returning 403 during shared-footer prefetch; no pilot-route hydration or navigation error was observed.
- Remaining concerns: this is a deliberately limited pilot, not evidence that a durable notes program or RSS is ready. The note has no screenshot because a decorative image would not improve the explanation; its code excerpt and source link are sufficient. Changes remain uncommitted for review; no push, merge, deployment, or later Phase 8 work occurred.

### 2026-09-27 - Phase 8A Engineering Notes readiness audit

- Scope: planning/evidence audit only. No Engineering Notes route, blog UI, RSS, Decision Explorer, Architecture Lens, Systems Trace, dependency, or application-code change was started. The Phase 8 checkbox for Engineering Notes remains `[ ]`.
- Starting state: fetched `origin`; remote `origin/main` resolved to `d7e1a1374b64a689df0c6ed80e7ab67351e4c26d`; the requested branch is `codex/phase8-engineering-notes-readiness` at that SHA. The original checkout had unrelated user changes, so it was preserved and the audit branch was created in a separate clean worktree. `backup/pre-portfolio-overhaul`, `pre-portfolio-overhaul`, and the Phase 7 branch were not altered.
- Discovery method: the configured codebase-memory graph tools were not callable in this session, so the required source fallback was used: exact repository paths, current portfolio source, active case-study loaders, source-pinned evidence records, and read-only remote-ref/raw-source checks. Evidence records were not treated as proof without checking their pinned public commits. Termstead, Platen PDF, BankingSystem/BankApp, and PolyShop pinned commits all resolved to the recorded public default-branch heads during this audit. Dirty external checkouts were not used as evidence.
- Quality bar: a note must be based on work actually done, answer one narrow technical question, stand alone for a reader who has not seen the project, cite public code/docs/measurements/debugging evidence, distinguish implemented behavior from intent, state limitations, and add a materially different question/evidence shape from project marketing and current case studies. Generic tutorials, README rewrites, unsupported metrics, and notes whose only substance is an unexecuted design/configuration claim do not qualify.
- Existing portfolio inventory: `lib/portfolio-projects.ts` is the authoritative project identity source. Termstead, Platen PDF, Banking Platform, and PolyShop attach the validated `ProjectTechnicalEvidence` model from `lib/project-evidence.ts` and the three project evidence modules. Those records already contain ownership/topology, workflow/lifecycle, decisions, failure boundaries, measurements, debugging stories, code excerpts, limitations, and exact source commits. The active case-study route reads the eight YAML files under `content/case-studies/`; retained `site-content/case-studies/*.mdx` and `lib/content.ts`/`components/MDX.tsx` are legacy/supporting material and are not active case-study route sources. `docs/quality/` contains quality evidence for the portfolio UI, not independent engineering-note material.
- Strongest reusable candidates:
  - READY — Termstead, `When a Terminal Cell Width Is Not a Text-Run Width`: `renderer.rs` at `0776a19f39539c396df76038c55a14bb55948a53` (`should_force_cell_width`, `forced_cell_width`, focused tests), the source-pinned debugging story/code excerpt in `lib/project-evidence.ts`, and the GPUI/Wayland acceptance record at `6391d27b29524ea07d6a0afeb3dcdf4edb48000a`. The question is narrow and useful; no pixel-golden, physical-input, or cross-device claim is made.
  - READY — Platen PDF, `Failing Async Dispatch Without Orphaning a Task`: `pdfToMarkdown.go` at `9faae1a42155843e0e5a6e472d6a4109ccaa25a8`, plus the validated dispatch-failure code excerpt/debugging story in `lib/platen-pdf-evidence.ts`. The evidence shows task, reservation, idempotency, and worker-dispatch cleanup without claiming retry rates, throughput, or universal async behavior.
- Held candidates needing a more distinct note narrative or stronger evidence: Termstead `Snapshot, Delta, or Wake Signal?`, `Close Is Not Terminate`, `What Does the Daemon Input Marker Actually Measure?`, and daemon-lifetime persistence; Platen PDF `When Should PDF Work Leave the Request Path?`, stale preview-session recovery, and the `platen-document` engine/application boundary; Banking Platform `Device Security Is Not Server Authorization` and account-opening atomicity; PolyShop `What a Process-Local Rate Limiter Actually Protects` and the implementation-versus-architecture audit. These are real candidates, but most currently repeat the existing project evidence page or case study, lack a new evidence shape, or rely on source inspection without a runtime/fault-injection/measurement record.
- Rejected/deferred candidates: KYC uncertainty/accuracy notes and mobile-payment outcome notes duplicate the current Banking case studies or have explicitly unverified outcomes; PolyShop saga/outbox, k6-threshold, and broad microservice claims remain design/configuration/test assets rather than executed evidence; Runyard has only broad lab-level README/source material in this portfolio; NeuroSim is covered by an existing legacy/current case study and retains an unsupported smooth-60fps-style claim that cannot be reused without a reproducible measurement. PolyShop remains experimental/nonfeatured and is not being promoted to create article content.
- Decision Explorer boundary: current decision cards are planning evidence, not automatic notes. Termstead ownership/lifecycle/synchronization, Platen response-mode selection and SDK boundary, Banking server-owned authorization/KYC policy, and PolyShop source-versus-design classification fit the later reusable Decision Explorer at least as well as prose notes. No explorer was implemented.
- Architecture Lens boundary: ownership boundaries, cross-service topology, request/worker flows, and client/server relationships belong primarily in the later reusable Architecture Lens. A note may cite one such boundary only when it answers a narrower question; it must not reproduce the full project diagram. No Lens was implemented.
- Termstead Systems Trace reservation: reserve the full `session -> attachment -> generation -> revision -> RenderReady -> delta/snapshot -> renderer` path, multi-pane routing, reconnect identity, and close/detach/terminate sequence for the possible Systems Trace signature experience. The renderer-width debugging note is safe for a static note; synchronization and lifecycle candidates can support both only if the note stays text-first and does not consume the interactive trace.
- Public safety: the two READY candidates use public, commit-pinned GitHub sources and portfolio-owned summaries. No secrets, credentials, private repository content, customer/user data, unverifiable metric, production-scale claim, or unsupported security/performance claim is required. The Termstead pilot must retain the distinction between geometry/shaping evidence and pixel/display proof; the Platen note must retain the distinction between source-backed cleanup branches and executed fault-injection/throughput evidence.
- Visual/media: the Termstead pilot benefits from one short Rust excerpt and a compact before/after semantic explanation; no screenshot is justified. The held Platen dispatch note benefits from one short Go excerpt and, if later written, a small request/task/cleanup sequence; no decorative screenshot is justified. Architecture diagrams, live trace interactions, and benchmark charts remain deferred until their respective evidence and feature boundaries are approved.
- Limited-pilot architecture recommendation: if Phase 8B is approved, use local repository-owned `content/engineering-notes/*.mdx` with typed frontmatter for `title`, `description`, `slug`, real publication/update dates, `projectSlug`, a narrow question, limited tags, explicit source IDs/commit links, and related case-study slugs. Keep prose/code/diagrams in the MDX body, derive canonical metadata from `siteConfig`, emit `TechArticle` JSON-LD only for published notes, include only published notes in the sitemap, and expose a small index only after the first note exists. Link back to project detail and case studies without copying their content. Do not add a CMS, GitHub-backed note authoring, or RSS; RSS remains Phase 8-later and requires regular publication.
- Readiness verdict: `READY FOR A LIMITED PILOT`. There is enough genuinely source-backed material for one carefully scoped note and a credible second candidate, but not enough independent, non-overlapping note inventory to justify a durable full notes section or publishing system yet. Do not mark the Phase 8 checkbox complete.
- Validation: documentation-only audit branch; application validation was not run. `git diff --check` passed after this plan entry. No push, merge, deployment, or external-repository mutation was performed.

### 2026-09-27 - Phase 7G backup, merge, production validation, and corrective fixes

- Revalidation: fetched `origin` and confirmed the pre-merge `origin/main` was `b8ea4a7e8fd77c49536bdcb5a58f2a4044053c5e`, PR #3 head was `d28f2db2024b848cd47b06d38e18b8de622080a3`, the working tree was clean, and PR #3 was open against `main` before merge. The permanent recovery references were created and remotely verified: `backup/pre-portfolio-overhaul` and the peeled `pre-portfolio-overhaul` tag both resolve to the old main SHA.
- Merge/recovery: PR #3 was merged with a merge commit `81f9b1b47f6e05bce7217e85e74bbb32b47b1f12` after successful PR CI (`36323443187`) and preview deployment (`dpl_HjLzky3Qgt9vqw5LbwsFxSPfyUcS`). The pre-merge Vercel rollback point was `dpl_691qmR5dzDKTwKtGrdjH41AV9R5D` at the old main SHA; the backup branch/tag were not moved.
- Production corrections: the first production deployment exposed a real 768px header gap where neither usable desktop nor mobile navigation was available. PR #4 changed the responsive boundary, was merged as `06582a0482fec7df2fe3cbf61f7dbc9065145821`, and passed CI (`36324325938`). Production axe sanity then exposed four light-theme contrast issues in dynamic homepage activity dates; PR #5 changed those dates to the active muted token, was merged as `2bfa34adf0bbf4f7fc1d748ea9d797660254688a`, and passed CI (`36325019235`).
- Final deployment: Vercel production deployment `dpl_7nBzurghwDNDntftFo4RNZfAXErF` is READY for `2bfa34adf0bbf4f7fc1d748ea9d797660254688a` with `www.gimesha.com` and `gimesha.com` aliases. The final main CI run was `36325019235`, successful. No rollback was required.
- Production behavior: the final route matrix returned 200 for the homepage, projects, curated project details, case-study index, About, Contact, sitemap, robots, OG images, and `/cv.pdf`; unknown project/case-study routes returned real 404 HTML. `/cv.pdf` returned `application/pdf` with a non-empty body. Sitemap and robots used `https://www.gimesha.com`, excluded `/cv` and OG endpoints, and contained current curated/case-study routes only.
- Headers/metadata: production responses confirmed `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, the minimal camera/microphone/geolocation/payment/usb `Permissions-Policy`, `X-Frame-Options: DENY`, and Vercel-provided `Strict-Transport-Security: max-age=63072000` without `includeSubDomains` or `preload`. CSP remains intentionally deferred. Rendered titles, descriptions, canonicals, OG/Twitter URLs, and the Platen PDF `/projects/pdfnest` identity were correct with no localhost or `.dev` values.
- Browser/accessibility/performance: final production browser checks covered responsive header availability, mobile menu pointer/keyboard/Escape/focus-return/link-close behavior, light/dark theme switching and persistence, reduced motion, route navigation, and zero captured console errors on representative routes. Temporary axe checks found zero violations but retained incomplete dynamic/contrast rule reports; this is not a full WCAG claim. Three mobile Lighthouse runs each covered `/`, `/projects`, and `/projects/termstead`; lab medians/ranges were reviewed, with no CI thresholds added. The PageSpeed field-data request returned HTTP 429 due to public quota exhaustion, so no field Core Web Vitals result was reported.
- Remaining concerns: CSP remains deferred by the static Next.js inline-script/style boundary; no usable field Core Web Vitals data was available; full WCAG/screen-reader review, deeper performance budgets, and Phase 8 work remain outside this closure. The permanent backup branch/tag remain required recovery references.

### 2026-09-27 - Phase 7G remote CI, preview validation, and production deployment gate

- Branch/SHA: `codex/portfolio-improvement-plan` at `f67ac10d4190ad1f47db21867cb20e9848ad62fc`; the feature branch was pushed normally and PR #3 (`https://github.com/gimesha-adikari/portfolio/pull/3`) was opened against `main` without merge authorization. No force-push, merge, or Phase 8 work was performed.
- Remote CI: GitHub Actions run `36321417359` (`https://github.com/gimesha-adikari/portfolio/actions/runs/36321417359`) ran on the pull-request commit and passed. The single `Quality gates` job completed checkout, Node setup, `npm ci`, lint, TypeScript, 73 tests, and the no-GitHub production build successfully.
- Preview: Vercel deployment `dpl_Bt1L7eCJ22bMRAKAwbvB4oyP1Hb9` was READY at `https://portfolio-jbmzpf5om-gimeshas-projects.vercel.app/` for the accepted SHA. Browser checks confirmed the corrected homepage hierarchy, visible theme toggle with a real light/dark visual change, curated project/case-study routes, and evidence content. The preview was not promoted.
- Production gate: the existing Vercel Git integration identifies production as deployment `dpl_691qmR5dzDKTwKtGrdjH41AV9R5D` from `main` at `b8ea4a7e8fd77c49536bdcb5a58f2a4044053c5e`. The project dashboard explicitly states that production is updated by pushing to `main`; therefore production deployment requires merge authorization. The PR remains open and unmerged, and no production deployment or production validation was attempted. A pre-deploy snapshot only confirmed the current production homepage still served the older main-branch UI.
- Local validation before the remote action: `npm run lint`, `npx tsc --noEmit`, `npm test` (73 passing tests), normal build, sequential no-GitHub build, and `git diff --check` passed. The known Node `MODULE_TYPELESS_PACKAGE_JSON` warning remains; no repository code or dependency change was required for the remote gate.
- Remaining concerns: production deployment, production headers/metadata/sitemap/robots/404/CV checks, HSTS decision, production accessibility/Lighthouse checks, field Core Web Vitals, and the live production recheck remain pending because merging to `main` is not authorized. The Phase 7 deployment-dependent checkboxes remain unchanged.

### 2026-09-27 - Phase 7F axe, manual accessibility, contrast, and reflow review

- Branch/SHA: `codex/portfolio-improvement-plan` at the clean Phase 7E checkpoint `fb2dceeae046cb04ffbae96e92ab5ebb671453fe`; Phase 7F changes remain uncommitted. No push, merge, deployment, production validation, Lighthouse gate, or Phase 7G work was performed.
- Automated review: temporary `@axe-core/playwright@4.13.0` with Playwright `1.63.0` and Chrome `154.0.8037.57` covered the homepage, projects, Termstead, Platen PDF, Banking Platform, PolyShop, case-study index/detail, About, and Contact at representative light/dark mobile and desktop sizes. The initial run found focusability defects on wide evidence regions and a case-study heading-order defect; the final 17-job rerun reported zero violations and no captured console errors/warnings. Axe still reports two incomplete rule families: hidden mobile `aria-controls` resolution and gradient/overlap contrast analysis; manual DOM/accessibility-tree checks confirmed the mobile target and open dialog semantics.
- Fixes: added a focusable `main#content` target and solid SkipLink outline, made the filter summary a polite atomic status region, constrained code excerpts to local horizontal scrolling, normalized the mobile-menu, theme, and footer icon controls to touch-sized targets, corrected the Executive Summary heading to `h2`, removed generic card ARIA labels that overrode visible names, kept the mobile dialog target mounted/hidden when closed, and preserved meaningful theme action labels. No new dependency or runtime package was added.
- Manual checks: keyboard tests covered SkipLink focus, mobile-menu open/Tab/Escape/focus return/navigation close, theme action state, filter query/reset, source links, evidence tables/code, and touch targets. Representative routes retained one main landmark, one h1, unique IDs, reduced-motion-visible content, and no page-level overflow at 320/375/768/1280px. Unknown project/case-study routes remained HTTP 404/noindex/image-free. The Termstead code excerpt became a local scroll region at 320px; CSS 2× zoom was used as a documented reflow approximation rather than native browser zoom.
- Contrast/scope: active light/dark ocean token ratios were reviewed and rendered focus indicators were inspected. No full screen-reader session, WCAG conformance claim, production check, or field accessibility result was made. Raw axe reports and screenshots remain outside the repository under `/tmp/portfolio-a11y.LEYMON`.
- Validation: `npm ci`, `npm audit` (0 vulnerabilities), lint, TypeScript, `npm test` (71 tests), normal build (42 generated pages), bounded GitHub build (56 pages), no-GitHub build (42 pages), local route/browser checks, final axe rerun (0 violations across 17 jobs), and `git diff --check` passed. Known Node `MODULE_TYPELESS_PACKAGE_JSON` and FlyonUI informational warnings remain; the prior Edge Runtime warning remains absent.

### 2026-09-27 - Phase 7F correction pass after manual visual review

- Branch/SHA: `codex/portfolio-improvement-plan` at the unchanged Phase 7F checkpoint `e97811bd4ebb4446f2cb9e3449de2a2590552326`; correction changes remain uncommitted. Manual review rejected the prior Phase 7F acceptance because the homepage had excessive vertical dead zones, the theme control was not part of the visible header, and the mobile drawer was visibly constrained to the header. No amend, push, merge, deployment, Phase 7G work, or production claim was made.
- Root causes: the homepage used `space-y-16 md:space-y-24` together with the shared `.section` padding, producing 96px inter-section margins and roughly 264px content-to-content whitespace on the desktop baseline. `ThemeToggle` was mounted only in a fixed bottom-right layout wrapper. The mounted mobile drawer was a fixed descendant of the header's `backdrop-filter` container, so its containing block was the 56px header rather than the viewport; the `hidden={!open}` state itself correctly changed on activation.
- Fixes: introduced homepage-only content-driven spacing (`space-y-6 pb-12 md:space-y-8` and `.homepage-section` padding), moved `ThemeToggle` into the real responsive `Header`, and portaled the existing hidden/aria-controlled mobile drawer to `document.body` after mount so it escapes the filtered header containing block. Added a reduced-motion CSS escape hatch for `MotionSection` wrappers so content remains visible without intersection animation. Added two focused structural correction tests; the Phase 7F test file now passes 8/8.
- Browser revalidation: production `next start` checks at 320×800, 375×812, 390×844, and 430×932 confirmed menu open/close, Enter/Space activation, Escape, Tab/Shift+Tab containment, focus return, backdrop-click focus return, link-close navigation, full-viewport drawer geometry, and body-scroll locking. Header checks at 320/375/390/430/768/1024/1280/1600 confirmed a usable navigation path and visible theme control at every width. Theme pointer/keyboard activation changed `data-theme`, CSS variables, visible colors, cookie/local-storage state, and persisted through reload. Homepage section gaps changed to 32px desktop and 14–34px mobile in the tested production output; CSS-viewport zoom approximations at 80/67/50% retained 32px gaps with no horizontal overflow. Final review captures are outside the repository under `/tmp/portfolio-7f-correction-final`.
- Reduced motion and routes: `prefers-reduced-motion: reduce` left zero hidden homepage/project sections at tested mobile/desktop routes. Required production routes returned 200; unknown project and case-study routes returned 404; OG image endpoints returned image responses; `/cv.pdf` retained the pre-existing local 403. Browser console/page-error collections were empty for the corrected interaction pass. The known Node module-type warning and FlyonUI informational banner remain; no new dependency was added.

### 2026-09-27 - Phase 7E Lighthouse lab baseline and targeted quality fix

- Branch/SHA: `codex/portfolio-improvement-plan` at the clean Phase 7D checkpoint `9f5423ce985280d0fb06d1d8b9ab841e2b3de433`; Phase 7E changes remain uncommitted. No push, merge, deployment, Lighthouse CI gate, or Phase 7F work was performed.
- Measurement: built the GitHub-independent production app with `env -u GITHUB_USERNAME GITHUB_MAX_PAGES=1 npm run build`, served it with `PORT=3100 npm run start`, and collected three Lighthouse 13.5.0 mobile runs for `/`, `/projects`, `/projects/termstead`, `/projects/pdfnest`, `/projects/banking-platform`, and `/about`. Three desktop `--preset=desktop` runs were collected for `/` and Termstead. Chrome was `154.0.8037.57` on Linux 7.0.0-34-generic with Node `v24.11.1` and npm `11.6.2`. Environment, throttling, medians, ranges, findings, and candidate budgets are recorded in `docs/quality/lighthouse-baseline.md`.
- Findings: mobile medians were 91–98 for Performance, 100 for Accessibility/Best Practices/SEO, lab LCP 2,484–3,354 ms, lab CLS 0 on every route, and TBT 36–122 ms. Repeated opportunities were generated CSS render blocking, shared unused/legacy JavaScript, and a `/projects` no-store back/forward-cache limitation. No safe global performance rewrite was justified.
- Targeted fix: Lighthouse found visible-label/accessibility-name mismatches on project and homepage case-study cards because short `aria-label` overrides excluded other visible text. Removed those overrides and added a focused regression assertion. The post-fix reports no longer contain `label-content-name-mismatch`; performance movement was mixed and is not attributed to the accessibility change.
- Browser visual smoke: headless Chrome screenshots at 375×900, 768×900, and 1280×900 covered `/`, `/projects`, Termstead, and Platen PDF with non-empty output, no observed missing content or page-level overflow, and preserved navigation/layout. Playwright wrapper reuse was unavailable in this pass because its temporary npx cache had an `ENOTEMPTY` collision; no new browser dependency was added.
- Validation status: `npm ci`, `npm audit` (0 vulnerabilities), lint, TypeScript, `npm test` (65 tests), normal build (42 pages), bounded GitHub build (56 pages), no-GitHub build (42 pages), and diff checks passed after the fix. The Node `MODULE_TYPELESS_PACKAGE_JSON` warning and FlyonUI build banner remain known. No field Core Web Vitals data was used.
- Remaining concerns: production/field Core Web Vitals, Lighthouse CI thresholds, full axe/manual accessibility, contrast, deployment, HSTS, production CV verification, and live production recheck remain pending.

### 2026-09-27 - Phase 7D focused route, link, fallback, filter, and accessibility smoke coverage

- Branch/SHA: `codex/portfolio-improvement-plan` at the clean Phase 7C checkpoint `1a25d900de0e7021d0e4d0bac2197030490f6a21`; Phase 7D changes remain uncommitted. No push, merge, deployment, Phase 7E work, Lighthouse, Core Web Vitals, axe, or contrast audit was performed.
- Test architecture: added `scripts/portfolio-phase7d.test.mjs` to the canonical `npm test` command. The 14 focused tests derive project routes from `PortfolioProject`, case-study routes from validated YAML, verify internal link targets, canonical/OG/Twitter metadata relationships, sitemap/robots source boundaries, unknown metadata, GitHub failure containment, navigation/motion invariants, project resolution, and new-tab URL safety. Existing phase tests remain separate and were not duplicated wholesale.
- Filter boundary: extracted the existing archive predicate into `filterArchiveRepositories` in `lib/project-filters.ts` and wired `/projects` to use it without changing query, language, or reset semantics. Tests cover all results, case-insensitive name/description matching, language matching, empty results, and reset serialization.
- Browser smoke: local production-server checks returned 200 for the current pages and metadata-image endpoints, 404 for unknown project/case-study routes and unknown image endpoints, 20 current sitemap URLs, canonical robots output, and the pre-existing `/cv.pdf` 403. Playwright checks covered the homepage, projects, Termstead, Platen PDF, Banking Platform, PolyShop, a case study, About, Contact, sitemap, robots, mobile menu/escape/focus return, SkipLink focus, filter debounce/reset, reduced motion, one-main/one-h1 invariants, and 375/768/1280 layouts with no page-level overflow. Normal 200 routes produced no console errors; corrected unknown 404 routes produced only the expected 404 document entry and the known CV 403 prefetch, with no hydration error.
- 404 correction: the production static not-found shell could not agree with the client pathname for unknown nested routes because the header active-state client island was hydrated against a pre-rendered generic 404. `app/not-found.tsx` now uses `force-dynamic`, preserving HTTP 404/noindex/image-free behavior while allowing the request pathname to be reflected consistently. Curated/project/case-study static generation remains unchanged; the build reports 42 generated pages instead of 43 because the global 404 boundary is request-rendered.
- Validation: `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test` (64 tests), `npm run build` (42 generated pages), and `git diff --check` passed for the Phase 7D work; bounded GitHub and no-GitHub builds remain part of final validation. The Node `MODULE_TYPELESS_PACKAGE_JSON` warning remains.
- Remaining concerns: the local CV upstream/source still returns 403, remote CI remains unexecuted until push, and full accessibility/contrast/Lighthouse, HSTS production review, deployment, and live production validation remain pending.

### 2026-09-27 - Phase 7C lightweight CI quality gate

- Branch/SHA: `codex/portfolio-improvement-plan` at the clean Phase 7B checkpoint `5956316`; Phase 7C changes remain uncommitted. No push, merge, deployment, remote workflow trigger, or Phase 7D work was performed.
- Audit: no `.github/` directory or workflow existed. `npm test` already runs the portfolio smoke checks and the dependency-free Phase 2–7B regression suite, including project/link/metadata, evidence, OG, and security-header coverage, so no parallel CI-only assertions were added.
- Workflow: added one `.github/workflows/ci.yml` quality job for pull requests and pushes to `main`, with `contents: read`, `ubuntu-latest`, a 15-minute timeout, obsolete-run cancellation, `actions/checkout@v7` with `persist-credentials: false`, and `actions/setup-node@v7` with Node 24 and npm-lockfile caching. The build runs `env -u GITHUB_USERNAME GITHUB_MAX_PAGES=1 npm run build` and does not receive a GitHub token or application secrets.
- Supply chain/policy: official action major tags were verified against the `actions/checkout` and `actions/setup-node` repositories. Major tags were retained for maintainability; no third-party actions or SHA pins were introduced. `npm audit` was deliberately excluded from the blocking job because advisory availability and future findings are not deterministic for a lightweight content-quality gate; it remains in manual/release validation.
- Documentation/tests: README now documents the CI commands and intentionally has no passing badge. `scripts/portfolio-phase7c.test.mjs` validates high-value workflow invariants without implementing a YAML parser and is included in `npm test`.
- Validation: `npm ci`, lint, TypeScript, 50 tests, no-GitHub build (43 pages), `npm audit` (0 vulnerabilities), normal build (43 pages), bounded GitHub build (57 pages), and `git diff --check` passed. `js-yaml` parsed the workflow and the structural test passed; `actionlint` is not installed. GitHub Actions has not executed the workflow because this task does not push the branch.
- Remaining concerns: the remote workflow result, runner-specific action behavior, and any future action-tag updates remain unverified until the workflow is pushed. Lighthouse, accessibility, deployment, HSTS production review, and live production validation remain untouched.

### 2026-09-27 - Phase 7B baseline security headers and CSP evaluation

- Branch/SHA: `codex/portfolio-improvement-plan` at the clean Phase 7A checkpoint `7ae006619347b88a780923af2bfc1edd7dcbb164`; Phase 7B changes remain uncommitted. No push, merge, deployment, or Phase 7C work was performed.
- Audit: `next.config.mjs` was the only response-header configuration surface. Browser inspection found same-origin Next.js scripts, styles, local `next/font` output, and image requests; GitHub/API/CV traffic remains server/build-time. No browser forms, frames, analytics, third-party widgets, workers, or external resource origins were required.
- Headers: centralized `/(.*)` headers add `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`, and `X-Frame-Options: DENY`. No HSTS, COOP, COEP, CORP, or CSP header was added without a deployment/compatibility basis.
- CSP decision: enforcement is deferred because generated production HTML includes inline Next.js runtime/Flight scripts and inline style attributes. `script-src 'self'`/strict style handling would block current output; `unsafe-inline` would weaken the intended protection; nonce CSP would make the static portfolio request-time rendered with cache implications; experimental SRI was not adopted. `unsafe-eval` was not needed, and no report endpoint exists.
- Validation: `npm ci`, `npm audit` (0 vulnerabilities), lint, TypeScript, 49 tests, normal build (43 generated pages), bounded GitHub build (57 pages), no-GitHub build (43 pages), and `git diff --check` passed. Production-server checks confirmed the four baseline headers on HTML, OG PNGs, sitemap, robots, CV error response, and current static assets; Playwright found no console errors/warnings or blocked same-origin resources on representative routes and verified mobile menu navigation remained functional.
- Remaining concerns: HSTS and cross-origin isolation remain deployment-sensitive/unneeded decisions; CSP needs a future static-compatible nonce/hash/SRI strategy if stronger script/style restrictions are desired; `/cv.pdf` still returns the pre-existing local upstream 403 when the GitHub content source is unavailable; the Node `MODULE_TYPELESS_PACKAGE_JSON` warning remains deferred. Phase 7C and deployment validation were not started.

### 2026-09-27 - Phase 7A branded metadata and Open Graph images

- Branch/SHA: `codex/portfolio-improvement-plan` at the clean Phase 6E checkpoint `bf4da0164ab38447df58d11bd8f7e80ab0be7dbd`; Phase 7A changes remain uncommitted. No push, merge, deployment, or Phase 7B work was performed.
- Metadata architecture: replaced the query-driven `app/og/route.tsx` Edge route with Next.js 16.3.6 route-local `opengraph-image.tsx` files. A shared `lib/portfolio-og-content.ts` derives card data from `siteConfig`, validated case studies, and canonical `PortfolioProject` records; `lib/portfolio-og.tsx` renders one restrained, server-side `ImageResponse` treatment.
- Coverage: added default, listing, curated-project, case-study, about, and contact image routes. Project cards use Termstead, Platen PDF, Banking Platform, and PolyShop portfolio-owned identity; Platen PDF keeps `/projects/pdfnest` and its historical repository identifiers; PolyShop remains explicitly secondary/non-featured. Case-study cards derive their title, summary, tags, and associated project from validated YAML and the canonical project model.
- Metadata cleanup: standardized static and dynamic route metadata through `buildRouteMetadata`, including `.com` canonical URLs, branded social titles, route-matching `openGraph.url`, shared OG/Twitter image paths, and local descriptions. Added the global `app/not-found.tsx` metadata boundary so real 404 responses are noindex and image-free. The root default metadata now uses the same portfolio-owned default image and a systems/backend/platform-oriented description.
- Validation: image endpoints returned HTTP 200, `image/png`, non-empty 1200x630 PNGs for the homepage, project, and case-study cards; unknown project/case image routes returned 404. Generated HTML checks passed for title, canonical, OG, and Twitter fields on all requested representative routes; sitemap/robots remained page-only and canonical. Phase 7A tests increased the suite to 48 passing tests; lint, TypeScript, build, and the bounded GitHub build passed. `npm audit` remained at 0 vulnerabilities and `git diff --check` passed.
- Warning/result boundary: the previous Edge Runtime/static-generation warning disappeared because the deprecated custom Edge route was removed and replaced by static-compatible metadata image conventions. The Node `MODULE_TYPELESS_PACKAGE_JSON` test warning remains deferred; broader headers, CI, Lighthouse, axe, contrast, responsive, and post-deployment checks remain untouched Phase 7 work.

### 2026-09-27 - Phase 6D PolyShop evidence audit

- Branch/SHA: `codex/portfolio-improvement-plan` at the committed Phase 6C checkpoint `81f48c7`; Phase 6D changes remain uncommitted. No push, merge, deployment, or modification of the external PolyShop repository was performed.
- Evidence basis: a fresh read-only shallow clone confirmed public `main` at `2e818de0c772fd186da27640933da71d1cda43e5` (latest commit `Add MIT License to the project`, 2025-11-19). The audit covered service source/build depth, gateway, auth, Kafka/Redis, idempotency, saga/outbox design, shared contracts, Pact/Postman/Newman/k6 assets, Docker/Compose, Kubernetes, observability, README claims, and CI/CD tree state.
- Model/content: added `lib/polyshop-evidence.ts` and attached validated evidence to the existing `PolyShop` `PortfolioProject`. The record distinguishes implemented auth and one optional `KafkaTemplate` audit producer from bootstrap-only service areas, design-only gateway/Redis/saga/outbox claims, and unexecuted QA/infrastructure assets. No new project identity source or homepage flagship was created.
- Promotion decision: PolyShop remains `featured: false`, `experimental`, and absent from homepage flagship selectors. The source audit did not establish executable order orchestration/compensation, Redis client use, a broader Kafka consumer topology, gateway route enforcement, CI/CD execution, deployment, measured performance, or operational scale claims.
- Tests/validation: added Phase 6D assertions and smoke checks for the pinned commit, evidence classifications/limitations, non-featured status, Termstead-first ordering, and homepage exclusion. Final `npm ci`, `npm audit`, lint, TypeScript, tests, build, bounded GitHub build, route/browser checks, and `git diff --check` are recorded in the completion report for this pass.
- Remaining concerns at the Phase 6D checkpoint: focused code excerpts and screenshots were deferred to Phase 6E; external Pact/Newman/k6 suites were not executed because their dependencies/runtimes and service stack were unavailable; the Edge Runtime and Node module-type warnings remain deferred; Phase 7 was not started.

### 2026-09-27 - Phase 6E evidence polish and Phase 6 closure

- Branch/SHA: `codex/portfolio-improvement-plan` at the local Phase 6D checkpoint `6e881b3`; Phase 6E changes remain uncommitted. No push, merge, deployment, or external repository modification was performed.
- Evidence presentation: extended the shared validated `ProjectTechnicalEvidence` model with bounded `ProjectCodeExcerpt` records and added the server-rendered `ProjectCodeExcerpts` component. Four excerpts are attached to the existing Termstead, Platen PDF, Banking Platform, and PolyShop evidence records; each is short, source-linked, and pinned to the already audited commit.
- Selection decisions: the excerpts show the Termstead per-cell GPUI width correction, Platen PDF worker-dispatch cleanup, Banking KYC policy states, and PolyShop's process-local rate limiter. No new engineering claim was added. Existing limitations remain visible beside each excerpt.
- Screenshot audit: reviewed tracked portfolio images and available evidence candidates. No sufficiently valuable technical screenshot was added because the available images were generic UI/decorative assets or temporary portfolio captures rather than source-consistent behavior evidence.
- Plan boundary: removed the deployment-dependent production recheck from the earlier validation checklist and added it to Phase 7's post-deployment gate. It remains pending and does not block Phase 6 closure.
- Validation: `npm ci` and `npm audit` reported 0 vulnerabilities; lint and TypeScript passed; `npm test` passed with 43 tests; both normal and `GITHUB_USERNAME=gimesha-adikari GITHUB_MAX_PAGES=1 npm run build` passed; local route/status checks and 375/768/1280 browser checks passed; `git diff --check` passed. Existing Edge Runtime and Node module-type warnings remain deferred.
- Remaining concerns: external QA assets and deployment-dependent production validation remain unexecuted; Phase 7 implementation was not started.

### 2026-09-27 - Phase 6C Banking Platform evidence

- Branch/SHA: `codex/portfolio-improvement-plan` at the committed Phase 6B checkpoint `e880b1cb35229d6d6f48764ebffc3c6204b49989`; Phase 6C changes remain uncommitted. No push, merge, deployment, or modification of the external BankingSystem or BankApp repositories was performed.
- Evidence basis: fresh read-only shallow clones of BankingSystem and BankApp were checked at their public `main` commits `5afe20e3797191b1f9535185f2caecbe993cdb38` and `1e59a6b4a780a5ff5c73743c57b195538df7b080`. Source paths used by the portfolio evidence record were verified against those snapshots.
- Model/content: added `lib/banking-platform-evidence.ts` and attached it to the existing Banking Platform `PortfolioProject`. The record covers Spring Boot ownership/security/account boundaries, React routes/auth/API behavior, Android storage/network/account/KYC/wallet flows, FastAPI KYC checks and policy, lifecycle/failure boundaries, decisions, calibration tooling, test inventories, and exact source links. No second project identity source or homepage flagship was created.
- Claim discipline: rewrote the active modular KYC and mobile-payment case-study wording plus retained legacy Banking copies to remove unsupported false-rejection, manual-review, reduced-visible-error, resilience, production, and scaling implications. The evidence record explicitly marks labeled accuracy/FAR/FRR, transaction atomicity, external settlement, and production operation as unmeasured or not tested where applicable.
- Tests/validation: added the Phase 6C focused test and included it in `npm test`; smoke checks now verify the Banking evidence attachment, source commits, ownership boundaries, and cleaned case-study claims. Final `npm ci`, audit, lint, TypeScript, tests, build, route/browser checks, and `git diff --check` are recorded in the completion report for this pass.
- Remaining concerns: PolyShop remains non-featured pending Phase 6 evidence; focused code excerpts/screenshots, live production validation, the Edge Runtime warning, and the Node module-type warning remain deferred. The account transaction controller and external payment settlement still need separate evidence before outcome claims are made.

### 2026-09-27 - Phase 6B Platen PDF evidence

- Branch/SHA: `codex/portfolio-improvement-plan` at the Phase 6B checkpoint `e880b1cb35229d6d6f48764ebffc3c6204b49989`; Phase 6B is checkpointed and Phase 6C changes remain uncommitted. No push, merge, deployment, or modification of the external Platen repositories was performed.
- Evidence basis: the Platen PDF frontend, Go backend, worker, and `platen-document` SDK were reviewed from their remote default-branch snapshots (`70db8e8a5a1466ddb154112ed1ddecee6e6cb57e`, `9faae1a42155843e0e5a6e472d6a4109ccaa25a8`, `9d38852e7ca1e7b657f7f644823d400553886ff0`, and `a5a14413ded0daa93a5839b86554f1fe67d92a93`). Local checkouts on unrelated branches were not used as evidence.
- Model/content: extended the validated shared technical-evidence model with workflow modes, file lifecycles, processing paths, and failure boundaries. Added `lib/platen-pdf-evidence.ts` and attached it to the canonical `Platen PDF` project record without creating a second project identity source.
- Platen PDF coverage: documented browser-to-API, API-to-worker, job/artifact, preview, sync, async, OCR, validation, cancellation/stall, cleanup/expiry, and standalone SDK boundaries. The related SDK is explicitly local-first and independent rather than a required web/API/worker service.
- Accuracy cleanup: softened active Platen PDF case-study and legacy project wording that implied unsupported high-performance, scalability, or production-readiness claims. Retained exact source links and explicit `NOT TESTED`/limitation language; no numeric benchmark result was published.
- UI/tests: added reusable server-rendered workflow, processing-path, and failure-boundary sections; added a focused runtime-validator regression test; updated README evidence-architecture guidance. Homepage architecture was not redesigned.
- Validation: Phase 6B checkpoint validation passed for `npm run lint`, `npx tsc --noEmit`, `npm test` (32 tests), and `npm run build` (24 static pages); the checkpoint tree was clean. The Phase 6B completion pass also recorded `npm ci`, `npm audit`, `git diff --check`, and targeted local route/browser checks.
- Remaining concerns at the time: Banking Platform and PolyShop evidence work, focused code excerpts, technical screenshots, live production validation, the Edge Runtime warning, and the Node module-type warning remained deferred.

### 2026-09-27 - Phase 6A Termstead evidence

- Branch/SHA: `codex/portfolio-improvement-plan` at the Phase 5 checkpoint `d0f8bc4`; Phase 6A changes remain uncommitted. No push, merge, deployment, or Termstead-repository modification was performed.
- Evidence basis: the Termstead remote default branch was revalidated as `product-shell-m6-layout-persistence` at `0776a19f39539c396df76038c55a14bb55948a53`. The separate local m8 checkout was dirty and was not used as the evidence basis. Architecture, SessionHub, performance, and GPUI acceptance documents are linked by their exact evidence commits.
- Content architecture: extended the canonical `PortfolioProject` with validated optional technical evidence. Added one Termstead evidence record covering daemon/GUI/IPC ownership, SessionHub bounds, detach/reconnect/termination semantics, architecture alternatives, methodology-bearing measurements, the force_width debugging story, limitations, and exact source links. No second project identity source was introduced.
- UI: added server-rendered ownership and lifecycle diagrams, decision cards, an evidence table, debugging story, limitations, and source-link components to `/projects/termstead`. Curated identity remains available when GitHub enrichment returns no facts; homepage structure was not redesigned.
- Evidence discipline: published IMPLEMENTED, MEASURED, ACCEPTED, DESIGNED / PLANNED, DEFERRED, NOT TESTED, and ENVIRONMENT-LIMITED classifications where supported. Daemon crash/reboot/power persistence, pixel-golden proof, physical input, input-to-display latency, zero-CPU claims, and unconditional production claims remain explicitly excluded.
- Validation: `npm ci` PASS (363 packages added; 364 audited; 0 vulnerabilities); `npm audit` PASS (0 vulnerabilities); lint PASS; TypeScript PASS; `npm test` PASS (25 tests); production build PASS (24 static pages, Next.js 16.3.6); bounded `GITHUB_MAX_PAGES=1` build PASS (38 generated pages); `git diff --check` PASS. Local production checks returned 200 for Termstead, projects, Platen PDF, Banking Platform, case studies, about, contact, and a discovered `i-shop` archive route; an unknown project returned 404. Playwright checks at 375px, 768px, and 1280px found one page-level main, semantic figures/table, no horizontal overflow, and reduced-motion emulation active.
- Remaining concerns: Phase 6 evidence for Platen PDF, Banking Platform, and PolyShop is not started; focused code excerpts and technical screenshots remain unimplemented; live production validation, the Edge Runtime warning, and the Node module-type warning remain deferred.

### 2026-09-27 - Phase 5 naming and fourth-system evaluation

- Branch/SHA: `codex/portfolio-improvement-plan` at Phase 4 checkpoint `3b62822`; Phase 5 changes remain uncommitted. No push, merge, or deployment was performed.
- Naming decision: the current public/display product name is `Platen PDF`. The stable portfolio slug remains `/projects/pdfnest`; `pdfnest`, `pdfnest-backend`, and `pdfnest-worker` remain repository identifiers; `platen-document` is documented as a related standalone local-first SDK and optional processing engine, not a required Platen PDF runtime. A future `/projects/platen-pdf` migration would require separate redirect, canonical, and SEO planning.
- Content changes: the canonical project record, homepage-derived display, About selection, active case-study contexts/links, README, and legacy project display strings now use Platen PDF where they describe the current product. Repository names, stable URLs, and historical execution-log references were retained where they are identifiers or historical records.
- PolyShop decision: evaluated source evidence supports service-oriented structure, gateway/shared-library material, Pact contract-test files, k6 load/stress/spike/soak files, and some Kafka implementation. Current `main` does not contain the README-advertised `.github/workflows` or `docs/architecture/events-and-sagas.md`; source review did not establish meaningful Redis implementation, the broader Kafka consumer architecture, a verified saga implementation, production readiness, or proven scalability. PolyShop remains `featured: false` and is excluded from homepage flagship selectors.
- Tests: added assertions for Platen PDF title/slug/live URL, unchanged repository names, standalone SDK role, singular homepage selection, Termstead-first ordering, Banking grouping, and PolyShop exclusion. Closing validation passed: `npm ci` (363 packages added; 364 audited; 0 vulnerabilities), `npm audit` (0 vulnerabilities), lint, TypeScript, `npm test` (20 passing tests), production build (24/24 static pages), and `git diff --check`.
- Route/output checks: local production checks returned 200 for `/`, `/projects`, `/projects/pdfnest`, `/projects/polyshop`, `/case-studies/modular-document-platform`, `/case-studies/pdf-edge-case-handling`, and `/about`. Homepage output contained Platen PDF and no unintended PDFNest product branding; the project detail retained only documented historical repository-name references.
- Remaining concerns: live production validation, a future `/projects/platen-pdf` redirect/canonical migration if desired, and Phase 6 evidence work remain deferred; Edge Runtime and Node module-type warnings remain documented.

### 2026-09-26 - Phase 5 homepage storytelling and portfolio-first hierarchy

- Branch/SHA: `codex/portfolio-improvement-plan` at Phase 4 checkpoint `3b62822`; Phase 5 changes remain uncommitted. No push, merge, or deployment was performed.
- Homepage audit: the previous order was GitHub-backed profile/hero, live activity, language chips, repository/year metrics, contribution calendar, curated projects, and optional live deployments. The profile gate meant GitHub failure could remove the entire homepage.
- Content architecture: added `lib/homepage-content.ts` as a derived selector over `PortfolioProject` and validated case studies. It does not define project identity. Added a concrete hero, selected systems, derived engineering decisions, three selected case studies, optional supporting GitHub activity/demos, and a contact-oriented next step.
- Content decisions: Termstead, PDFNest, and Banking Platform remain the flagship order from curated `order`; PDFNest appears once as one grouped system; Banking Platform appears once as one grouped system; PolyShop remains non-featured and is not promoted; selected case studies are the modular document platform, PDF edge-case handling, and modular KYC architecture. Repository counts, years coding, language statistics, and contribution calendar were removed from the homepage. GitHub activity remains optional and below portfolio-owned content.
- UI/data changes: removed the GitHub profile dependency and early loading fallback from `app/page.tsx`; optional repository/activity calls still fail closed. Added a homepage-focused project-card variant that shows problem and primary boundary instead of repository/fact metadata. The hero uses `siteConfig.cvPath` for the real CV route.
- Validation: checkpoint validation passed before Phase 5; targeted homepage selectors passed; local production checks returned 200 for `/`, `/projects`, Termstead, PDFNest, Banking Platform, `/case-studies`, `/about`, and `/contact`. Playwright checks at 375px, 768px, and 1280px verified heading/CTA order, no horizontal overflow, desktop navigation, reduced-motion scroll behavior, and mobile menu preservation. Closing validation passed: `npm ci` (363 packages added; 364 audited; 0 vulnerabilities), `npm audit` (0 vulnerabilities), lint, TypeScript, `npm test` (20 passing tests), production build (24/24 static pages), and `git diff --check`.
- Remaining concerns: PDFNest/Platen naming remains blocked on a product decision; PolyShop remains deferred pending deeper evidence; live production validation, the Edge Runtime warning, the Node module-type warning, and Phase 6 evidence work remain out of scope.

### 2026-09-26 - Phase 4 navigation, client runtime, accessibility, and filter cleanup

- Branch/SHA: `codex/portfolio-improvement-plan` at Phase 3 checkpoint `cddb3e0d5cad33c961996d89c4db32c57f0f4d83`; Phase 4 changes remain uncommitted. No push, merge, or deployment was performed.
- Audit and ownership: `Header.tsx` was the client desktop/mobile navigation shell; `MiniSidebar.tsx` depended on FlyonUI `data-overlay`, `HSOverlay`, `HSStaticMethods`, DOM mutation observers, and a separate `SidebarWidthSync` bridge. `FlyonuiScript.tsx` globally loaded jQuery, Lodash, noUiSlider, DataTables, Dropzone, and FlyonUI. `GlobalPointerGlow`, `ReadingProgress`, and the layout-level `MotionWrapper` were global client enhancements. No site source consumed the compatibility globals outside that loader.
- Navigation and accessibility: added `components/MobileNavigation.tsx` with React-owned open state, `aria-expanded`, `aria-controls`, dialog semantics, Escape handling, focus-on-open, focus trapping, focus return, close-on-link, backdrop/body-scroll handling, and 44px controls. Mounted `SkipLink` in the root layout, retained one page-level `main#content`, removed the old FlyonUI sidebar/width bridge, and preserved desktop Header navigation. The mobile implementation was manually checked at 375px; desktop behavior was checked at 768px and 1280px.
- Client/runtime cleanup: removed `FlyonuiScript.tsx`, `MiniSidebar.tsx`, `SidebarWidthSync.tsx`, `GlobalPointerGlow.tsx`, `ReadingProgress.tsx`, `app/(motion)/motion-wrapper.tsx`, and the unused `global.d.ts` browser-global declarations. Removed `jquery`, `lodash`, `nouislider`, `datatables.net`, `dropzone`, and `@types/dropzone`, `@types/jquery`, `@types/lodash`. `flyonui` remains because `app/globals.css` uses its variants/plugin/source for CSS generation; no FlyonUI browser runtime is loaded.
- Motion and filters: corrected `Reveal.tsx` to import React types normally, made its initial state visible, added reduced-motion handling, removed the dynamic `any` in `MotionSection`, respected reduced-motion scroll behavior in CSS, and removed the pointer/progress effects. Added typed `lib/project-filters.ts` helpers and controlled, URL-synchronized, debounced archive filters; moved the single filter bar into the Labs/archive section after curated projects, removed Apply, corrected duplicate field IDs, made All use the server-provided archive length, and left curated project identity/order unaffected. README now documents the client/runtime and archive-filter boundaries.
- Tests and validation: `npm ci` PASS (363 packages added; 364 audited; 0 vulnerabilities); `npm audit` PASS (0 vulnerabilities); `npm run lint` PASS; `npx tsc --noEmit` PASS; `npm test` PASS (portfolio smoke plus 17 dependency-free tests, including 3 Phase 4 filter tests); `npm run build` PASS on Next.js 16.3.6; `git diff --check` PASS. Production-server checks returned 200 for `/`, `/projects`, Termstead, PDFNest, Banking Platform, PolyShop, `/about`, `/case-studies`, and `/contact`; unknown project and case-study routes returned 404. The no-GitHub-discovery build had no archive detail params, so `/projects/i-shop` remained 404 as documented. Playwright checks verified SkipLink focus, mobile menu state/focus/Escape/link close/body scroll at 375px, desktop navigation at 768px/1280px, reduced-motion `scroll-behavior: auto`, debounced URL query updates, controlled synchronization, and Reset.
- Remaining concerns: live production validation was not performed; archive detail availability remains bounded by public GitHub discovery during the build; `flyonui` remains intentionally as a CSS-generation dependency. The existing Edge-runtime deprecation from `app/og/route.ts` and Node `MODULE_TYPELESS_PACKAGE_JSON` test warning remain deferred. The local browser also logged the pre-existing environment-dependent `/cv.pdf` 404 during navigation prefetch.

### 2026-09-26 - Phase 2 content ownership and project architecture

- Branch/SHA: `codex/portfolio-improvement-plan` at Phase 2 checkpoint `28ba2a65d9ec582d9cbed6678824919c060be1df`; Phase 2 changes are checkpointed. No push, merge, or deployment was performed.
- Source decisions: `lib/portfolio-projects.ts` is the authoritative, runtime-validated structured project source; `lib/portfolio-repository-facts.ts` maps only explicit public repository assignments into optional mutable facts; future long-form narratives should use MDX by project slug. YAML case studies remain a separate current case-study source, while `data/projects.ts`, legacy `site-content/`, remote MDX, README parsing, and `.portfolio/story.md` support remain legacy/supporting paths.
- Curated content: added Termstead, PDFNest, Banking Platform, PolyShop, Runyard, and NeuroSim records. PDFNest groups `pdfnest`, `pdfnest-backend`, `pdfnest-worker`, and related `platen-document`; Banking Platform groups `BankingSystem` and `BankApp`. PolyShop is non-featured pending deeper verification; Runyard and NeuroSim remain experimental/lab records. Useful PDFNest/PDFNest Backend content was migrated without unsupported quantitative/production claims.
- UI/boundary changes: curated project cards and detail pages now own identity, order, featured state, narrative, grouped repositories, and case-study links; GitHub facts are optional. `/projects` separates curated projects from the public repository archive, the homepage's existing featured section consumes curated records, raw repository cards no longer imply `Featured`, and curated project slugs are included in the sitemap. The existing repository-detail fallback is explicitly labeled as an archive entry for uncurated repositories until the Phase 3 resolver refactor.
- Files/decisions: added the typed model, enrichment boundary, curated card/detail components, Phase 2 tests, and implementation plan; updated README, project routes, sitemap, smoke checks, legacy `data/projects.ts` annotation, and package test script. No dependency version changed in Phase 2. The existing Next.js and MDX upgrade from 16.2.12 to 16.3.6 was part of the Phase 0/1 checkpoint, together with the ESLint/typecheck setup; it was not repeated or expanded here.
- Validation: `npm ci` PASS (373 packages added; 0 vulnerabilities); `npm audit` PASS (0 vulnerabilities); `npm run lint` PASS; `npx tsc --noEmit` PASS; `npm test` PASS (portfolio smoke plus 5 Phase 2 tests); `npm run build` PASS on Next.js 16.3.6. Local `next start` checks returned content for `/projects`, Termstead, PDFNest, Banking Platform, PolyShop, and an unlisted archive entry; curated pages rendered their local content with GitHub enrichment unavailable; sitemap/robots used the canonical `.com` URLs and curated project routes.
- Remaining concerns: live production recheck was not performed; the build still reports the existing FlyonUI invalid-icon warnings and Edge-runtime deprecation/static-generation warning; the dependency-free Node test emits a `MODULE_TYPELESS_PACKAGE_JSON` warning; PDFNest/Platen naming remains documented as unresolved; PolyShop flagship promotion and legacy-source removal remain deferred. Next's existing dynamic project fallback renders the `ai-verification` not-found payload locally but returned HTTP 200 in the local `next start` check, so route-status cleanup remains a later route-hardening concern.

### 2026-09-26 - Phase 3 type-safety completion

- Branch/SHA: `codex/portfolio-improvement-plan` at checkpoint `28ba2a65d9ec582d9cbed6678824919c060be1df`; all Phase 3 work remains uncommitted. No push, merge, or deployment was performed.
- Usage audit: `lib/content.ts` and `components/MDX.tsx` have no active imports in the App Router; they remain retained legacy/support adapters documented in the README. The active About route reads `content/about.yml` directly, so its YAML boundary was included rather than leaving broad casts behind.
- Boundary changes: `lib/content.ts` now validates environment-derived configuration, treats remote JSON as `unknown`, validates case-index entries through `parseCaseIndex`, decodes API content without broad casts, and preserves API-then-raw fallback behavior. `components/MDX.tsx` now uses `MDXComponents` and concrete React HTML prop types while preserving anchor, heading, image, table, code, and blockquote rendering. `lib/about-content.ts` and `app/about/page.tsx` now normalize known About sections and narrow dynamic legacy sections without `any`.
- Tests: added focused coverage for malformed/valid remote case-index JSON and About YAML normalization; the Phase 3 suite now has 9 passing tests. The dependency-free Node suite still emits the existing `MODULE_TYPELESS_PACKAGE_JSON` warning.
- Validation: `npm ci` PASS (373 packages added; 0 vulnerabilities); `npm audit` PASS (0 vulnerabilities); `npm run lint` PASS; `npx tsc --noEmit` PASS; `npm test` PASS (portfolio smoke plus 14 tests); plain `npm run build` PASS; bounded `GITHUB_USERNAME=gimesha-adikari GITHUB_MAX_PAGES=1 npm run build` PASS (38 generated routes); and `git -c core.whitespace=cr-at-eol diff --check` PASS. The unqualified `git diff --check` only reports the expected CRLF endings in the two preserved legacy adapter files. Curated and unknown route checks passed; the bounded archive follow-up was rate-limit-limited by GitHub HTTP 403 (`X-RateLimit-Remaining: 0`) and produced the deliberate not-found artifact for the affected archive candidate. The existing Edge Runtime warning remains isolated to `app/og/route.ts`, and the Node module-type warning remains in dependency-free tests.
- Remaining concerns: no dependency or lockfile changes were made; archive availability still depends on public GitHub discovery and successful detail enrichment during the build; live production validation, legacy-source removal, and all Phase 4 work remain deferred.

### 2026-09-26 - Phase 3 resolver and route architecture

- Branch/SHA: `codex/portfolio-improvement-plan` at checkpoint `28ba2a65d9ec582d9cbed6678824919c060be1df`; Phase 3 changes remain uncommitted. No push, merge, or deployment was performed.
- Route ownership: `app/projects/[slug]/page.tsx` is now orchestration only. `lib/portfolio-resolver-core.ts` defines the dependency-injected curated/archive discriminated union; `lib/portfolio-resolver.ts` connects it to curated records, optional public facts, and the normalized archive loader. README and `.portfolio/story.md` parsing moved to `lib/portfolio-archive.ts`, and archive rendering moved to `components/RepositoryArchiveDetail.tsx`.
- Curated presentation: `PortfolioProjectDetail` now composes focused hero, context, evidence, gallery, and repository-enrichment components. Curated identity, grouped repository URLs, and SoftwareSourceCode JSON-LD remain portfolio-owned; raw GitHub data is not passed to presentation components.
- Case studies: `lib/case-studies.ts` now validates YAML routing fields, arrays, order values, slugs, and resource URLs at load time; empty resource destinations are filtered and unsafe URLs are rejected. The detail route uses an article, route-specific canonical/OG/Twitter metadata from `siteConfig`, TechArticle JSON-LD, static params, and real not-found behavior.
- Boundary/type changes: removed broad `any` from `lib/github.ts`, typed the consumed GitHub activity/repository/language shapes, made missing privacy metadata fail closed, and typed the resolver/archive/metadata boundaries. Legacy inactive `lib/content.ts` and `components/MDX.tsx` still contain broad types and remain deferred, so the plan item is partial rather than overstated.
- Warning handling: corrected `tabler--blueprint` to `tabler--binary-tree`, `tabler--brand-java` to `tabler--braces`, and `tabler--file-cog` to `tabler--file-settings`. The Edge runtime deprecation remains isolated to `app/og/route.ts`; the Node module-type warning remains in dependency-free TypeScript tests. No dependency versions changed.
- Validation: `npm ci` PASS with 0 vulnerabilities; `npm audit` PASS with 0 vulnerabilities; `npm run lint` PASS; `npx tsc --noEmit` PASS; `npm test` PASS with portfolio smoke plus 12 tests; plain `npm run build` PASS on Next.js 16.3.6 with only the Edge-runtime warning. A bounded `GITHUB_USERNAME=gimesha-adikari GITHUB_MAX_PAGES=1 npm run build` generated 38 pages; local `next start` checks returned 200 for projects, Termstead, PDFNest, Banking Platform, PolyShop, an `i-shop` archive entry, case-study index, and two case-study details, and 404 for unknown project and case-study slugs. Metadata used `https://www.gimesha.com`; sitemap/robots checks passed.
- Remaining concerns: live production validation was not performed; archive route generation depends on successful public GitHub discovery at build time and is deliberately unavailable when no public repository parameter can be generated; inactive legacy content helpers remain; PDFNest/Platen naming, deeper PolyShop evidence, and legacy-source removal remain deferred. Phase 4 was not started.

### 2026-09-26 - Phase 0/1 implementation and local validation

- Branch/SHA: `codex/portfolio-improvement-plan` at `0d6fc0cbd405459bf9d1f01602c30e2bf1d2575d`; changes remain uncommitted.
- Baseline before edits: Node `v24.11.1`, npm `11.6.2`; `npm ci` passed but reported 14 vulnerabilities (4 moderate, 8 high, 2 critical); lint failed because ESLint 9 had no flat config; TypeScript failed on deprecated `baseUrl` without `ignoreDeprecations`; build passed on Next.js 16.2.12 with the pre-existing invalid FlyonUI icon and Edge-runtime warnings.
- Files/decisions: added `lib/siteConfig.ts` and routed layout, OG, vCard, contact, header/footer/sidebar identity through it; corrected `.com`/LinkedIn identity; rebuilt `app/sitemap.ts` from static routes plus `getAllCaseStudies()`; retained `app/robots.ts` and removed `public/robots.txt`; removed or suppressed the requested broken/empty links; added valid-resource filtering; made GitHub discovery public `/users/<username>/repos` only, paginated, fail-closed on `private`, and kept authenticated access for optional enrichment only; removed tracked `.idea/` and ignored it; added a flat ESLint config, TypeScript deprecation compatibility, and `scripts/portfolio-smoke.mjs`; updated README and aligned Next.js/MDX to 16.3.6. No homepage, navigation rewrite, project model, or Phase 2 work was started.
- Validation after edits: clean `npm ci` completed with 0 vulnerabilities; `npm audit` reported 0 vulnerabilities; `npm run lint` passed; `npx tsc --noEmit` passed; `npm test` passed; `npm run build` passed on Next.js 16.3.6. Local `next start` inspection confirmed canonical `.com` sitemap/robots/metadata, `/cv.pdf`, all eight current YAML case-study URLs, no `.dev` identity, and no `/tools` resource output.
- Remaining concerns: live production recheck has not been run and no deployment was performed; the curated repository allowlist remains Phase 2; the build still reports the pre-existing `tabler--blueprint`, `tabler--brand-java`, `tabler--file-cog`, and Edge-runtime warnings. CRLF source files were checked with `core.whitespace=cr-at-eol`.

### 2026-09-26 - Plan creation / revalidation

- Baseline source revalidated against main SHA b8ea4a7e8fd77c49536bdcb5a58f2a4044053c5e.
- No newer commits found.
- Major source-backed audit findings remain present.
- Live custom-domain/browser validation remains required because production could not be fetched with the available tools in this session.
- No implementation fixes have been applied yet.
