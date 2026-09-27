# Gimesha Nirmal — Portfolio

The portfolio is a Next.js 16.3.6 App Router site using React 19, Tailwind CSS v4, and MDX support. Curated project identity is owned by `lib/portfolio-projects.ts`; GitHub supplies optional mutable facts for the repositories explicitly grouped on those records.

## Content architecture

The project flow is intentionally normalized:

```text
PortfolioProject (portfolio-owned)
        ↓
optional RepositoryFacts (public GitHub enrichment)
        ↓
project listing and detail UI
```

`PortfolioProject` controls the slug, title, tagline, status, featured state, order, role, problem, constraints, architecture, decisions, evidence, repository membership, case-study associations, and optional live URL. A GitHub repository is not a portfolio project by itself.

Evidence-rich project pages attach validated technical evidence to the same `PortfolioProject` record. The shared validator in `lib/project-evidence.ts` covers ownership boundaries, topology/workflow matrices, lifecycle sequences, processing paths, failure boundaries, decision cards, methodology-bearing measurements, debugging stories, focused source-pinned code excerpts, limitations, and exact source commits. Termstead, Platen PDF, Banking Platform, and PolyShop use this same model. PolyShop's record separates implemented auth/narrow audit messaging from scaffolded service areas, design-only saga/Redis/gateway claims, and unexecuted QA assets. Future long-form narratives can be associated by project slug through the validated metadata plus MDX direction without creating a second project identity source.

Curated records currently include Termstead, Platen PDF, Banking Platform, PolyShop, Runyard, and NeuroSim. Platen PDF groups the `pdfnest`, `pdfnest-backend`, and `pdfnest-worker` repositories, with `platen-document` retained as a related standalone local-first SDK. The stable project route remains `/projects/pdfnest`; repository names remain unchanged. Banking Platform groups `BankingSystem` and `BankApp`. Runyard, NeuroSim, and non-featured PolyShop remain in the labs/secondary layer.

To add a repository to an existing project, add its public name, role, and source URL to that project's `repositories` array in `lib/portfolio-projects.ts`. To make a project featured, set its portfolio-owned `featured` field to `true` and give it the intended unique `order`; do not feature a repository from GitHub discovery. The enrichment boundary fetches only those explicit names and rejects private records even when authenticated GitHub data is available. If GitHub is unavailable, the curated project still renders from local content.

Structured TypeScript metadata is the canonical project source for this phase. The preferred long-form direction is validated structured metadata plus MDX narratives/evidence associated by project slug. YAML files in `content/case-studies/` remain the current case-study source, but they do not define project identity. `data/projects.ts`, legacy `site-content/` MDX, remote MDX loading, README parsing, and `.portfolio/story.md` support remain legacy/supporting paths until a later phase removes them after useful content has been migrated.

Project detail routes use `lib/portfolio-resolver.ts`: curated records resolve first, then explicitly public repository archive entries resolve through the normalized `RepositoryArchiveProject` boundary. The route does not fetch or parse GitHub data directly. `lib/portfolio-archive.ts` retains README and `.portfolio/story.md` parsing only for archive entries; it cannot add or override curated identity. Unknown slugs return a real not-found response. Because archive route parameters depend on public GitHub discovery at build time, a GitHub outage leaves curated routes available but may leave archive detail routes unavailable until the next successful build.

Case-study YAML enters through the runtime validator in `lib/case-studies.ts`. It validates routing fields, arrays, ordering, and resource URLs before the detail route renders them. Route metadata and JSON-LD are generated from the validated case-study or curated project record using `lib/route-metadata.ts` and `lib/siteConfig.ts`.

Navigation is split between the server-rendered layout and small React islands: desktop links remain in `components/Header.tsx`, while `components/MobileNavigation.tsx` owns the mobile drawer's state, focus, Escape handling, and body-scroll lock. The former FlyonUI browser runtime is not loaded; `flyonui` remains only as the Tailwind/CSS plugin used by `app/globals.css`.

Projects filtering applies to the Labs/repository archive rather than changing curated project identity or order. Query, language, and sort state are URL-backed, debounced, controlled inputs, and the archive result count is supplied by the server page.

The homepage is portfolio-first: `lib/homepage-content.ts` derives flagship projects, engineering evidence, and a small case-study selection from the canonical project/case-study sources. The homepage presents those records before optional GitHub activity or external-demo evidence, so GitHub failure does not remove the core story. The helper contains presentation selectors and associations only; it does not define project identity.

## Local development

Requirements:

- Node.js 22 or newer
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

The site is available at `http://localhost:3000` during local development. The public canonical URL remains configured in `lib/siteConfig.ts` as `https://www.gimesha.com`.

## Environment variables

The repository/projects view uses `GITHUB_USERNAME` to identify the public GitHub account. An optional `GITHUB_TOKEN` can improve GitHub API rate limits for enrichment requests; public portfolio discovery still uses the public user repositories endpoint and rejects private repositories.

Optional GitHub controls include `GITHUB_INCLUDE_FORKS`, `GITHUB_INCLUDE_ARCHIVED`, `GITHUB_MAX_PAGES`, `GITHUB_ENABLE_README_EXTRAS`, `GITHUB_TIMEOUT_MS`, and `GITHUB_README_TIMEOUT_MS`.

The optional remote content/CV adapter accepts `CONTENT_OWNER`, `CONTENT_REPO`, `CONTENT_BRANCH`, `CONTENT_TOKEN`, `CONTENT_REVALIDATE`, and `CV_PATH`. `GITHUB_TOKEN` is also accepted as a fallback token for those remote reads.

Do not commit local `.env` files or tokens.

## Useful commands

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run start
```

`npm test` runs the lightweight portfolio smoke checks plus dependency-free Phase 2/3/4/5/6 tests for curated slugs/order, multi-repository grouping, resolver precedence, archive/private-repository boundaries, case-study validation, metadata canonical URLs, GitHub-failure fallback, project-filter URL/count behavior, homepage content selection, and evidence-model validation. Phase 6D/6E tests also protect PolyShop's source-pinned classifications, non-featured status, homepage exclusion, bounded evidence excerpts, and exact source-commit links.

## Continuous integration

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`. The single read-only quality job runs `npm ci`, lint, TypeScript, `npm test`, and a production build with `GITHUB_USERNAME` unset so curated local content is validated without optional GitHub enrichment. `npm audit` remains part of manual/release validation rather than a blocking step in this lightweight workflow. No passing-status badge is published until the workflow has run remotely.

## Content editing

- Update site identity and default metadata in `lib/siteConfig.ts`.
- Add or edit curated project records in `lib/portfolio-projects.ts`.
- Add or edit YAML case studies in `content/case-studies/`; associate their slugs from the relevant `PortfolioProject.caseStudies` array.
- Edit the structured about content in `content/about.yml`.
- Add only short, source-pinned technical excerpts to the shared evidence records; keep their explanations and limitations adjacent, and do not add screenshots unless they communicate verified behavior or technical context.
- Keep project identity, order, featured status, repository grouping, and case-study destinations portfolio-owned; GitHub repository data is mutable enrichment, not the source of portfolio project identity.

## Production

Build the production bundle locally with `npm run build`, then run it with `npm run start`. Deploy the generated Next.js application using the hosting provider's configured Next.js deployment workflow and the required environment variables above.
