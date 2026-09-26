# Gimesha Nirmal — Portfolio

The portfolio is a Next.js 16.3.6 App Router site using React 19, Tailwind CSS v4, and MDX support. Portfolio-owned case studies live in `content/case-studies/*.yml`; GitHub is used as optional public repository enrichment for the repository/projects view.

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

`npm test` runs the lightweight portfolio smoke checks for canonical identity, metadata routes, links, GitHub privacy boundaries, and repository hygiene.

## Content editing

- Update site identity and default metadata in `lib/siteConfig.ts`.
- Add or edit YAML case studies in `content/case-studies/`.
- Edit the structured about content in `content/about.yml`.
- Keep project identity and case-study destinations portfolio-owned; GitHub repository data is mutable enrichment, not the source of portfolio project identity.

## Production

Build the production bundle locally with `npm run build`, then run it with `npm run start`. Deploy the generated Next.js application using the hosting provider's configured Next.js deployment workflow and the required environment variables above.
