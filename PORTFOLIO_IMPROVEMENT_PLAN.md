# Portfolio Improvement Plan

Permanent execution plan for improving gimesha-adikari/portfolio with Codex.

Plan created: 2026-09-26
Revalidated baseline: main at b8ea4a7e8fd77c49536bdcb5a58f2a4044053c5e
Implementation branch baseline: codex/portfolio-improvement-plan at 0d6fc0cbd405459bf9d1f01602c30e2bf1d2575d
Primary production domain: https://www.gimesha.com
Status: Phase 0 through Phase 6E are checkpointed and locally validated at `bf4da01`; Phase 7A metadata/OG work is locally complete enough for review and remains uncommitted. The old query-driven OG route was replaced with route-local branded image generation; broader Phase 7 quality/security work remains pending.

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
- [ ] Verify production/field Core Web Vitals after deployment if data is available. Lighthouse lab LCP/CLS/TBT values are documented separately and are not field results.
- [ ] Run axe plus manual keyboard/focus testing.
- [ ] Run contrast checks.
- [ ] Test mobile breakpoints and diagram scroll/zoom readability.
- [ ] Verify production headers, sitemap, robots, canonical/OG output, and 404 behavior after deploy.
- [ ] Run the live production recheck after deploy; this deployment-dependent gate was moved here from the earlier validation checklist and remains pending.

Exit: quality claims are supported by recorded checks and CI protects key correctness issues.

## Phase 8 - High-value features after fundamentals

Only after Phases 1-7 are stable:
- [ ] Engineering Notes after there are enough real notes.
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
