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
const header = read("components/Header.tsx");
const footer = read("components/Footer.tsx");
const vcard = read("app/api/vcard/route.tsx");
const portfolioProjects = read("lib/portfolio-projects.ts");
const portfolioFacts = read("lib/portfolio-repository-facts.ts");
const projectsPage = read("app/projects/page.tsx");
const projectDetailPage = read("app/projects/[slug]/page.tsx");
const repoCard = read("components/RepoCard.tsx");
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
check(casePage.includes("link.url?.trim()"), "case-study page does not suppress empty resource destinations");

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
check(footer.includes("siteConfig.name"), "footer branding is not sourced from siteConfig");
check(vcard.includes("siteConfig.name"), "vCard branding is not sourced from siteConfig");

check(portfolioProjects.includes("export type PortfolioProject"), "PortfolioProject model is missing");
check(portfolioProjects.includes("validatePortfolioProjects"), "PortfolioProject runtime validation is missing");
check(portfolioProjects.includes('slug: "termstead"'), "Termstead is not a curated project");
check(portfolioProjects.includes('slug: "pdfnest"'), "PDFNest is not a curated project");
check(portfolioProjects.includes('slug: "banking-platform"'), "Banking Platform is not a curated project");
check(portfolioFacts.includes("selectRepositoryFacts"), "repository allowlist boundary is missing");
check(projectsPage.includes("getAllPortfolioProjects"), "projects listing is not curated-data driven");
check(projectDetailPage.includes("getPortfolioProjectBySlug"), "project detail route does not resolve curated projects first");
check(repoCard.includes("featured = false"), "repository cards do not make Featured conditional");

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
