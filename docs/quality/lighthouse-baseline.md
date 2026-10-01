# Lighthouse lab baseline

Measurement date: 2026-09-27

This is a local, undeployed Lighthouse lab baseline. It is not field data and does not establish production Core Web Vitals.

## Environment

- Commit: `9f5423ce985280d0fb06d1d8b9ab841e2b3de433`
- OS: Linux 7.0.0-34-generic, x86_64
- CPU: Intel Core i5-8500 @ 3.00 GHz, 6 logical CPUs
- Memory: 14 GiB total; approximately 2.9 GiB available at capture
- Node: `v24.11.1`
- npm: `11.6.2`
- Chrome: `154.0.8037.57`
- Lighthouse: `13.5.0`, installed temporarily outside the repository
- Build: `env -u GITHUB_USERNAME GITHUB_MAX_PAGES=1 npm run build`
- Server: `PORT=3100 npm run start`
- Reports: JSON retained temporarily under `/tmp/portfolio-lighthouse.pbg47M`; raw reports are not committed

Mobile used Lighthouse's default mobile preset with simulated throttling: 412×823 emulation, device scale factor 1.75, 150 ms RTT, 1,638.4 Kbps throughput, and 4× CPU slowdown. Desktop used `--preset=desktop` with 1350×940 emulation, 40 ms RTT, 10,240 Kbps throughput, and 1× CPU slowdown. Every route/configuration was run three times and reported by median and range.

## Final mobile medians

Times are milliseconds except CLS. Category scores are percentages.

| Route | Performance | Accessibility | Best Practices | SEO | FCP | Lab LCP | Speed Index | TBT | Lab CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 98 (98–98) | 100 | 100 | 100 | 909 (908–916) | 2,484 (2,483–2,491) | 909 (908–916) | 40 (39–45) | 0 (0–0) |
| `/projects` | 95 (95–95) | 100 | 100 | 100 | 908 (906–909) | 2,932 (2,862–2,938) | 1,026 (992–1,171) | 41 (37–86) | 0 (0–0) |
| `/projects/termstead` | 95 (93–95) | 100 | 100 | 100 | 1,055 (1,055–1,057) | 2,920 (2,782–3,185) | 1,057 (1,055–1,345) | 68 (45–103) | 0 (0–0) |
| `/projects/pdfnest` | 95 (92–95) | 100 | 100 | 100 | 1,057 (1,056–1,057) | 2,904 (2,898–3,202) | 1,057 (1,057–1,390) | 36 (33–119) | 0 (0–0) |
| `/projects/banking-platform` | 91 (90–95) | 100 | 100 | 100 | 1,205 (1,205–1,207) | 3,354 (2,930–3,373) | 1,256 (1,205–1,257) | 122 (67–137) | 0 (0–0) |
| `/about` | 96 (96–96) | 100 | 100 | 100 | 905 (905–907) | 2,850 (2,841–2,851) | 905 (905–907) | 47 (43–48) | 0 (0–0) |

## Desktop comparison

| Route | Performance | FCP | Lab LCP | Speed Index | TBT | Lab CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 100 | 247 (247–248) | 599 (598–605) | 263 (261–268) | 0 | 0 |
| `/projects/termstead` | 100 | 287 (287–287) | 661 (660–692) | 307 (300–380) | 0 | 0 |

Desktop uses a different preset and must not be compared directly with mobile scores.

## Findings and decisions

- The repeated actionable accessibility finding was `label-content-name-mismatch` on project and homepage case-study card links. Their shorter `aria-label` values excluded other visible card text. The labels were removed so the visible link content supplies the accessible name. The post-fix finding is absent; Lighthouse accessibility was already 100 because this audit did not reduce the category score.
- Repeated performance opportunities were estimated unused JavaScript (approximately 50–57 KiB), render-blocking generated CSS (approximately 130–260 ms), and approximately 13 KiB of legacy JavaScript. These point to framework/build output shared across routes; no low-risk application fix was established in this pass.
- `/projects` reported a back/forward-cache failure because its dynamic response uses `Cache-Control: no-store`. This is consistent with the query-driven/dynamic archive route and was not changed without a separate caching design.
- About and homepage runs sometimes reported an unattributed forced-reflow insight around 31–35 ms. The source was not attributable to a safe application change.
- The LCP element was text on every sampled route: the homepage hero heading, project-card or project-detail copy, or the About blockquote. No image preload change was justified.
- Image routes were not the LCP on the sampled pages. One local Inter font request was present; no unused font-weight fix was established.

## Before/after interpretation

The post-fix measurements were collected with the same production build mode, Lighthouse configuration, browser, server port, and three-run method. The accessible-name fix was not a performance optimization. Changes such as homepage median lab LCP moving from 2,761 ms to 2,484 ms and Banking Platform moving from 3,058 ms to 3,354 ms are treated as run/build noise or route variability, not causal improvements or regressions.

## Candidate future budgets

These are proposals only, not CI gates:

| Metric | Observed mobile baseline | Possible future budget | Confidence |
| --- | --- | --- | --- |
| Performance score | Median 91–98 | Keep important routes at or above 90 | Low; local lab only |
| Lab LCP | Median 2,484–3,354 ms | Investigate routes above 3,500 ms | Low; no field data |
| Lab CLS | Median 0 on all routes | Require ≤ 0.10 after visual review | Medium for this build, not production |
| TBT | Median 36–122 ms | Investigate above 150 ms | Low; local lab only |

No Lighthouse CI assertion or performance threshold was added.

## Limitations

- No deployment was performed.
- No field/RUM or CrUX/PageSpeed result was used.
- The local CV source still returns its known 403 and was not part of the primary route set.
- Lighthouse Accessibility is not a substitute for the planned axe/manual accessibility phase.
- Raw Lighthouse JSON/HTML and review screenshots are temporary analysis artifacts and are intentionally not part of the repository.
