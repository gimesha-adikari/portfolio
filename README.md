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

Curated records currently include Termstead, PDFNest, Banking Platform, PolyShop, Runyard, and NeuroSim. PDFNest groups the `pdfnest`, `pdfnest-backend`, `pdfnest-worker`, and related `platen-document` repositories. Banking Platform groups `BankingSystem` and `BankApp`. Runyard, NeuroSim, and non-featured PolyShop remain in the labs/secondary layer.

To add a repository to an existing project, add its public name, role, and source URL to that project's `repositories` array in `lib/portfolio-projects.ts`. To make a project featured, set its portfolio-owned `featured` field to `true` and give it the intended unique `order`; do not feature a repository from GitHub discovery. The enrichment boundary fetches only those explicit names and rejects private records even when authenticated GitHub data is available. If GitHub is unavailable, the curated project still renders from local content.

Structured TypeScript metadata is the canonical project source for this phase. The preferred long-form direction is validated structured metadata plus MDX narratives/evidence associated by project slug. YAML files in `content/case-studies/` remain the current case-study source, but they do not define project identity. `data/projects.ts`, legacy `site-content/` MDX, remote MDX loading, README parsing, and `.portfolio/story.md` support remain legacy/supporting paths until a later phase removes them after useful content has been migrated.

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

`npm test` runs the lightweight portfolio smoke checks plus dependency-free Phase 2 model tests for curated slugs/order, multi-repository grouping, allowlisting, private-repository rejection, and GitHub-failure fallback.

## Content editing

- Update site identity and default metadata in `lib/siteConfig.ts`.
- Add or edit curated project records in `lib/portfolio-projects.ts`.
- Add or edit YAML case studies in `content/case-studies/`; associate their slugs from the relevant `PortfolioProject.caseStudies` array.
- Edit the structured about content in `content/about.yml`.
- Keep project identity, order, featured status, repository grouping, and case-study destinations portfolio-owned; GitHub repository data is mutable enrichment, not the source of portfolio project identity.

## Production

Build the production bundle locally with `npm run build`, then run it with `npm run start`. Deploy the generated Next.js application using the hosting provider's configured Next.js deployment workflow and the required environment variables above.
