import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
    const filePath = join(root, relativePath);
    return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
}

function check(condition, message) {
    if (!condition) failures.push(message);
}

const siteConfig = read("lib/siteConfig.ts");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const github = read("lib/github.ts");
const aboutPage = read("app/about/page.tsx");
const casePage = read("app/case-studies/[slug]/page.tsx");
const caseStudies = read("lib/case-studies.ts");
const header = read("components/Header.tsx");
const layout = read("app/layout.tsx");
const notFoundPage = read("app/not-found.tsx");
const routeMetadataCore = read("lib/route-metadata-core.ts");
const ogContent = read("lib/portfolio-og-content.ts");
const ogRenderer = read("lib/portfolio-og.tsx");
const mobileNavigation = read("components/MobileNavigation.tsx");
const filters = read("components/ProjectsFilters.tsx");
const reveal = read("components/Reveal.tsx");
const motionSection = read("components/MotionSection.tsx");
const globals = read("app/globals.css");
const packageJson = read("package.json");
const footer = read("components/Footer.tsx");
const vcard = read("app/api/vcard/route.tsx");
const portfolioProjects = read("lib/portfolio-projects.ts");
const projectEvidence = read("lib/project-evidence.ts");
const bankingEvidence = read("lib/banking-platform-evidence.ts");
const polyshopEvidence = read("lib/polyshop-evidence.ts");
const portfolioFacts = read("lib/portfolio-repository-facts.ts");
const projectsPage = read("app/projects/page.tsx");
const projectDetailPage = read("app/projects/[slug]/page.tsx");
const projectDetail = read("components/PortfolioProjectDetail.tsx");
const technicalEvidence = read("components/PortfolioProjectTechnicalEvidence.tsx");
const codeExcerpts = read("components/ProjectCodeExcerpts.tsx");
const architectureDiagram = read("components/ProjectArchitectureDiagram.tsx");
const lifecycleSequence = read("components/ProjectLifecycleSequence.tsx");
const repoCard = read("components/RepoCard.tsx");
const homepage = read("app/page.tsx");
const homepageContent = read("lib/homepage-content.ts");
const homepageHero = read("components/HomepageHero.tsx");
const homepageEvidence = read("components/HomepageEngineeringEvidence.tsx");
const homepageCaseStudies = read("components/HomepageCaseStudies.tsx");
const portfolioProjectCard = read("components/PortfolioProjectCard.tsx");
const gitFiles = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" });

check(siteConfig.includes('canonicalUrl: "https://www.gimesha.com"'), "siteConfig canonical URL is not the .com URL");
check(siteConfig.includes('displayDomain: "www.gimesha.com"'), "siteConfig display domain is missing");
check(siteConfig.includes('github: "https://github.com/gimesha-adikari"'), "siteConfig GitHub URL is missing");
check(siteConfig.includes("linkedin: \"https://www.linkedin.com/in/gimesha-nirmal-490245343\""), "siteConfig LinkedIn URL is missing");
check(siteConfig.includes('email: "gimeshanirmal23@gmail.com"'), "siteConfig email is missing");
check(siteConfig.includes('cvPath: "/cv.pdf"'), "siteConfig CV path is missing");

check(sitemap.includes('import { siteConfig } from "@/lib/siteConfig"'), "sitemap does not use siteConfig");
check(sitemap.includes('import { getAllCaseStudies } from "@/lib/case-studies"'), "sitemap does not use case-study source");
check(sitemap.includes('import { getAllPortfolioProjects } from "@/lib/portfolio-projects"'), "sitemap does not use curated project source");
check(sitemap.includes("getAllCaseStudies()"), "sitemap does not derive case-study routes from content");
check(sitemap.includes("getAllPortfolioProjects()"), "sitemap does not derive project routes from curated content");
check(sitemap.includes("siteConfig.cvPath"), "sitemap does not include the configured CV route");
check(!sitemap.includes("/cv`"), "sitemap still includes the stale /cv route");
check(!sitemap.includes("fetchAllRepos"), "sitemap still derives routes from GitHub repositories");
check(!sitemap.includes("/case-studies/banking-system"), "sitemap still includes a legacy case-study route");
check(robots.includes('siteConfig.canonicalUrl'), "robots does not use siteConfig");
check(!robots.includes("gimesha.dev"), "robots still references gimesha.dev");
check(!existsSync(join(root, "public/robots.txt")), "duplicate public/robots.txt still exists");

const caseStudyFiles = readdirSync(join(root, "content/case-studies"))
    .filter((file) => file.endsWith(".yml"))
    .sort();
check(caseStudyFiles.length > 0, "no case-study content files were found");
for (const file of caseStudyFiles) {
    const relativePath = `content/case-studies/${file}`;
    check(!/url:\s*(?:""|'')\s*$/m.test(read(relativePath)), `${relativePath} contains an empty resource URL`);
}
check(!read("content/about.yml").includes("/projects/banking-platform"), "about content still links to Banking Platform route");
check(!read("content/about.yml").includes("/projects/ai-verification"), "about content still links to AI Verification route");
check(!read("content/case-studies/dynamic-tool-routing-system.yml").includes('url: "/tools"'), "case study still links to /tools");
check(aboutPage.includes("work.link &&"), "about page does not suppress missing work destinations");
check(casePage.includes("const validLinks = data.links"), "case-study page does not use validated resource destinations");
check(caseStudies.includes("Empty resource destinations are ignored"), "case-study loader does not suppress empty resource destinations");

check(!github.includes('GITHUB_INCLUDE_PRIVATE ?? "true"'), "GitHub private repositories still default to included");
check(!github.includes("/user/repos"), "public repository discovery still calls the authenticated /user/repos endpoint");
check(github.includes("mapPublicRepo"), "GitHub fetching has no explicit public-repository guard");
check(github.includes("repo.private !== false"), "GitHub public-repository guard is not fail-closed");
check(github.includes("page=${page}"), "GitHub public repository discovery is not paginated");

check(!gitFiles.split("\n").some((file) => file === ".idea" || file.startsWith(".idea/")), ".idea remains tracked");
check(read(".gitignore").split(/\r?\n/).some((line) => line.trim() === ".idea/"), ".idea/ is not ignored");
check(read("README.md").includes("Next.js 16.3.6"), "README does not document the current Next.js version");
check(read("README.md").includes("npm ci"), "README does not document dependency installation");
check(header.includes("siteConfig.displayDomain"), "header branding is not sourced from siteConfig");
check(!header.includes("data-overlay"), "desktop header still delegates mobile navigation to FlyonUI");
check(!header.includes('aria-expanded="false"'), "mobile navigation state is still hard-coded closed");
check(layout.includes("<SkipLink />"), "SkipLink is not mounted in the root layout");
check(layout.includes('<main id="content"'), "root layout has no stable skip-link target");
check(notFoundPage.includes("buildNotFoundMetadata"), "global not-found boundary does not use safe metadata");
check(notFoundPage.includes("Page not found"), "global not-found boundary has no user-facing fallback");
check(layout.includes("/opengraph-image"), "root metadata does not use the default OG image convention");
check(!layout.includes("/og?"), "root metadata still uses the query-driven OG route");
check(!existsSync(join(root, "app/og/route.tsx")), "legacy query-driven OG route still exists");
check(routeMetadataCore.includes("opengraph-image"), "route metadata does not use route-local OG image paths");
check(routeMetadataCore.includes("brandedTitle"), "route metadata does not brand social titles consistently");
check(ogContent.includes("getPortfolioProjectOgCard"), "project OG cards are not derived from curated projects");
check(ogContent.includes("getCaseStudyOgCard"), "case-study OG cards are not derived from validated content");
check(ogRenderer.includes("ImageResponse"), "shared OG renderer does not use ImageResponse");
check(ogRenderer.includes("siteConfig.displayDomain"), "shared OG renderer does not use siteConfig branding");
check(mobileNavigation.includes("aria-expanded={open}"), "mobile navigation does not expose its React state");
check(mobileNavigation.includes('role="dialog"'), "mobile navigation has no dialog semantics");
check(mobileNavigation.includes('aria-modal="true"'), "mobile navigation is not marked modal");
check(mobileNavigation.includes('event.key === "Escape"'), "mobile navigation has no Escape handling");
check(!mobileNavigation.includes("data-overlay"), "mobile navigation still depends on FlyonUI overlay attributes");
check(!layout.includes("FlyonuiScript"), "FlyonUI runtime script remains mounted globally");
check(!filters.includes("typingTimer"), "project filters still use a render-local timer");
check(!filters.includes(">Apply<"), "project filters still render a redundant Apply button");
check(filters.includes("value={q}"), "project search input is not controlled");
check(filters.includes("totalCount"), "project filters do not receive an archive result count");
check(reveal.includes('from "react"'), "Reveal still imports React types from node_modules");
check(reveal.includes("useReducedMotion"), "Reveal does not respect reduced motion");
check(!motionSection.includes("as any"), "MotionSection still uses a broad dynamic-element cast");
check(globals.includes("scroll-behavior: auto"), "reduced motion does not disable smooth scrolling");
for (const packageName of ["jquery", "lodash", "nouislider", "datatables.net", "dropzone"]) {
    check(!packageJson.includes(`\"${packageName}\"`), `${packageName} remains in package.json after runtime removal`);
}
check(footer.includes("siteConfig.name"), "footer branding is not sourced from siteConfig");
check(vcard.includes("siteConfig.name"), "vCard branding is not sourced from siteConfig");

check(portfolioProjects.includes("export type PortfolioProject"), "PortfolioProject model is missing");
check(portfolioProjects.includes("validatePortfolioProjects"), "PortfolioProject runtime validation is missing");
check(portfolioProjects.includes('slug: "termstead"'), "Termstead is not a curated project");
check(portfolioProjects.includes("technicalEvidence: termsteadTechnicalEvidence"), "Termstead technical evidence is not attached to the canonical project record");
check(projectEvidence.includes("EVIDENCE_CLASSIFICATIONS"), "technical evidence classifications are not defined");
check(projectEvidence.includes("validateProjectTechnicalEvidence"), "technical evidence runtime validation is missing");
check(portfolioProjects.includes('slug: "pdfnest"'), "Platen PDF is not a curated project");
check(portfolioProjects.includes('title: "Platen PDF"'), "Platen PDF display identity is missing");
check(portfolioProjects.includes('liveUrl: "https://platenpdf.com"'), "Platen PDF live URL is not canonical");
check(portfolioProjects.includes('role: "Related standalone local-first document/OCR SDK and optional processing engine"'), "platen-document is not described as a related standalone SDK");
check(portfolioProjects.includes('slug: "banking-platform"'), "Banking Platform is not a curated project");
check(portfolioProjects.includes("technicalEvidence: bankingPlatformTechnicalEvidence"), "Banking Platform technical evidence is not attached to the canonical project record");
check(bankingEvidence.includes('owner: "BankingSystem / Spring backend"'), "Banking evidence is missing the Spring ownership boundary");
check(bankingEvidence.includes('owner: "bank-web / Next.js web"'), "Banking evidence is missing the Next.js ownership boundary");
check(bankingEvidence.includes('owner: "banking-service / FastAPI KYC"'), "Banking evidence is missing the FastAPI ownership boundary");
check(bankingEvidence.includes('owner: "BankApp / Android client"'), "Banking evidence is missing the Android ownership boundary");
check(bankingEvidence.includes('classification: "NOT TESTED"'), "Banking evidence does not mark unverified outcomes as not tested");
check(bankingEvidence.includes("609e7f567720ec1edf186d5803fbd744e063e34b"), "Banking evidence does not pin the BankingSystem source commit");
check(bankingEvidence.includes("b7d62497452733894a6f42216ea83e767406b8f3"), "Banking evidence does not pin the bank-web source commit");
check(bankingEvidence.includes("7e4beb846c65afc99966a6e4edc9dfd3c9311250"), "Banking evidence does not pin the banking-service source commit");
check(bankingEvidence.includes("770afcff097a58cfadf2be47e4c71fca301ca8ac"), "Banking evidence does not pin the BankApp source commit");
check(portfolioProjects.includes('name: "bank-web"') && portfolioProjects.includes('name: "banking-service"'), "Banking Platform repository membership is incomplete");
check(!bankingEvidence.includes("BankingSystem monorepo"), "Banking evidence still describes a monorepo");
check(!bankingEvidence.includes("React/Vite"), "Banking evidence still describes the current web runtime as React/Vite");
check(!bankingEvidence.includes("web-frontend/my-bank-ui"), "Banking evidence still points to the archived web path");
check(!bankingEvidence.includes("ai-service/bank-ai-service"), "Banking evidence still points to the archived KYC path");
check(polyshopEvidence.includes("2e818de0c772fd186da27640933da71d1cda43e5"), "PolyShop evidence does not pin the audited source commit");
check(polyshopEvidence.includes("KafkaTemplate"), "PolyShop evidence does not distinguish the narrow executable Kafka producer");
check(polyshopEvidence.includes("process-local"), "PolyShop evidence does not qualify the auth rate limiter boundary");
check(polyshopEvidence.includes("DESIGNED / PLANNED"), "PolyShop evidence does not classify design-only claims");
check(polyshopEvidence.includes("Pact") && polyshopEvidence.includes("k6"), "PolyShop evidence does not cover the QA asset boundary");
check(!polyshopEvidence.match(/production-ready|proven scalability|enterprise-grade|bank-grade/i), "PolyShop evidence contains unsupported promotion language");
check(portfolioFacts.includes("selectRepositoryFacts"), "repository allowlist boundary is missing");
check(projectsPage.includes("getAllPortfolioProjects"), "projects listing is not curated-data driven");
check(projectDetailPage.includes("resolvePortfolioProject"), "project detail route does not use the normalized resolver");
check(projectDetailPage.includes("dynamicParams = false"), "project detail route leaves unknown-slug fallback dynamic");
check(projectDetail.includes('"@type": "SoftwareSourceCode"'), "curated project detail has no structured data");
check(projectDetail.includes("PortfolioProjectTechnicalEvidence"), "curated project detail does not render technical evidence");
check(technicalEvidence.includes("ProjectArchitectureDiagram"), "technical evidence route does not render an ownership diagram");
check(technicalEvidence.includes("ProjectLifecycleSequence"), "technical evidence route does not render a lifecycle sequence");
check(technicalEvidence.includes("ProjectCodeExcerpts"), "technical evidence route does not render focused code excerpts");
check(codeExcerpts.includes("<pre"), "focused code excerpts do not use semantic preformatted code");
check(codeExcerpts.includes("overflow-x-auto"), "focused code excerpts do not scroll locally");
check(codeExcerpts.includes("View exact source"), "focused code excerpts do not expose exact source links");
check(architectureDiagram.includes("<figure"), "ownership diagram has no semantic figure");
check(lifecycleSequence.includes("<ol"), "lifecycle sequence has no ordered-list semantics");
check(casePage.includes('"@type": "TechArticle"'), "case-study detail has no article structured data");
check(repoCard.includes("featured = false"), "repository cards do not make Featured conditional");

check(homepage.includes("HomepageHero"), "homepage does not use a portfolio-owned hero component");
check(homepage.includes("getHomepageFlagshipProjects"), "homepage flagship systems are not selected through the homepage content helper");
check(homepage.includes("getHomepageEngineeringEvidence"), "homepage does not surface derived engineering evidence");
check(homepage.includes("getHomepageCaseStudies"), "homepage does not surface selected case studies");
check(homepage.includes("fetchAllRepos().catch"), "homepage repository enrichment is not failure-tolerant");
check(homepage.includes("fetchRecentActivity().catch"), "homepage activity enrichment is not failure-tolerant");
check(!homepage.includes("fetchProfile"), "homepage hero still depends on GitHub profile fetching");
check(!homepage.includes("if (!profile)"), "homepage still gates portfolio content on GitHub profile availability");
check(!homepage.includes("Public Repositories"), "homepage still foregrounds repository-count vanity metrics");
check(!homepage.includes("Years Coding"), "homepage still foregrounds years-coding vanity metrics");
check(!homepage.includes("GithubCalendar"), "homepage still foregrounds the GitHub contribution calendar");
check(homepageContent.includes("modular-document-platform"), "homepage case-study selection is missing the document platform study");
check(homepageContent.includes("modular-kyc-architecture"), "homepage case-study selection is missing the KYC study");
check(homepageHero.includes("View selected work"), "homepage primary CTA is missing");
check(homepageHero.includes("Read engineering case studies"), "homepage secondary CTA is missing");
check(homepageHero.includes("siteConfig.cvPath"), "homepage CV CTA does not use the configured CV route");
check(homepageEvidence.includes("Decision"), "homepage engineering evidence does not expose decisions");
check(homepageCaseStudies.includes("project.title"), "homepage case-study cards do not expose project association");
check(portfolioProjectCard.includes('variant === "homepage"'), "homepage project cards do not have a narrative-focused presentation variant");
check(packageJson.includes("portfolio-phase6c.test.mjs"), "Phase 6C tests are not included in npm test");
check(packageJson.includes("portfolio-phase6d.test.mjs"), "Phase 6D tests are not included in npm test");
check(packageJson.includes("portfolio-phase6e.test.mjs"), "Phase 6E tests are not included in npm test");
check(packageJson.includes("portfolio-phase7a.test.mjs"), "Phase 7A tests are not included in npm test");

const bankingCaseStudySources = [
    read("content/case-studies/modular-kyc-architecture.yml"),
    read("content/case-studies/resilient-mobile-payments.yml"),
    read("site-content/case-studies/multi-platform-banking-system.mdx"),
    read("site-content/case-studies/banking-system.mdx"),
    read("site-content/case-studies/bank-app.mdx"),
].join("\n");
check(!/Improved KYC false-reject rate|Reduced KYC false rejects|Fewer KYC false-rejects|Fewer manual reviews|reduced visible errors|robust retries/i.test(bankingCaseStudySources), "Banking case-study content still contains unsupported outcome language");

const activeFiles = gitFiles
    .split("\n")
    .filter((file) => /^(app|components|content|data|lib|public)\//.test(file));
const activeText = activeFiles.map((file) => read(file)).join("\n");
check(!activeText.includes("gimesha.dev"), "active source still contains gimesha.dev");
check(!activeText.includes("http://localhost:3000"), "active source still contains a localhost production URL");
check(!read("components/Footer.tsx").includes("All systems operational"), "unsupported operational status remains visible");

if (failures.length > 0) {
    console.error("Portfolio smoke checks failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
} else {
    console.log("Portfolio smoke checks passed.");
}
