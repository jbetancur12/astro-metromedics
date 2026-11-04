# AEOTester report

Generated 2026-10-18 by the [AEOTester](https://aeotester.com/?utm_source=plugin&utm_medium=report) plugin, rubric v1.2.0.

| | |
|---|---|
| Stack | astro (astro.config.mjs) |
| Audited | `dist/`, 24 page(s) |
| Site URL | https://metromedicslab.com |

## Summary

**Score: 120 / 127 (94%) - Ready for AI**

6 points do not apply to this site and are left out of the total (max 133).

Not scored: 1 page(s) kept out of search on purpose (noindex, not in the sitemap): `https://metromedicslab.com/evaluacion-servicio/`. They do not need to rank, so page checks leave them out.

| Category | Score |
|---|---:|
| AI crawler access | 18 / 18 |
| Crawlability and indexing | 18 / 18 |
| Structured data | 18.9 / 20 |
| Meta and social tags | 21.1 / 22 |
| Content structure and quality | 31 / 36 |
| Agent readiness | 13 / 13 (6 pts n/a) |

## Issues by points lost

### FAIL Author Signals - 2.1 / 5 (-2.9)

`content.author` | assisted

Missing: expertise credentials, author bio/profile. Found: Author: "Equipo técnico de Metromedics SAS" (schema)

- No author bio section or link to an author/about page - `dist/index.html:41`, `dist/blog/index.html:41`, `dist/contacto/index.html:39`, `dist/mantenimiento/index.html:39`, `dist/nosotros/index.html:39` and 18 more
- Fewer than 3 trust signals; missing: /about, /privacy, /terms - `dist/index.html:41`, `dist/blog/index.html:41`, `dist/contacto/index.html:39`, `dist/mantenimiento/index.html:39`, `dist/nosotros/index.html:39` and 18 more
- No expertise signals (credentials, job title, years of experience) near the author or in the page text - `dist/blog/index.html:41`, `dist/mantenimiento/index.html:39`, `dist/nosotros/index.html:39`, `dist/politica-datos/index.html:39`, `dist/servicios/index.html:39` and 15 more
- Pages losing points: 23 of 23

Fix: Add a JSON-LD Person (name, jobTitle, sameAs) as the author. Add an author bio section with background and qualifications

## Advice (no points)

Worth knowing, but not scored: these can be deliberate choices.

### Content Freshness

`content.freshness`

- Page kept out of search: Missing publish date (article:published_time or JSON-LD datePublished) - `dist/evaluacion-servicio/index.html:1`

### Markdown for Agents

`agent-readiness.markdown`

- Optional: also answer "Accept: text/markdown" requests with the Markdown copy (Cloudflare "Markdown for Agents", or edge middleware serving the .md file). Content negotiation cannot be seen in the repo; verify live with curl -sI -H "Accept: text/markdown" <page url>. - `dist/index.html:1`, `dist/blog/index.html:1`, `dist/contacto/index.html:1`, `dist/mantenimiento/index.html:1`, `dist/nosotros/index.html:1` and 18 more

## All checks

| Check | Status | Score | Fix |
|---|---|---:|---|
| AI Bot Crawlability | PASS | 12 / 12 | auto-fix |
| llms.txt Detection | PASS | 6 / 6 | auto-fix |
| Content Signals | PASS | not scored | auto-fix |
| Indexability | PASS | 8 / 8 | auto-fix |
| Sitemap Detection | PASS | 5 / 5 | auto-fix |
| SSL / HTTPS | PASS | 2 / 2 | assisted |
| HTTP Behavior | PASS | 3 / 3 | assisted |
| Structured Data | PASS | 13.9 / 15 | auto-fix |
| Schema Validation | PASS | 5 / 5 | auto-fix |
| Meta Title | PASS | 4.7 / 5 | auto-fix |
| Meta Description | PASS | 4.4 / 5 | auto-fix |
| Open Graph | PASS | 3 / 3 | auto-fix |
| Twitter Cards | PASS | 3 / 3 | auto-fix |
| Language Tags | PASS | 3 / 3 | auto-fix |
| Mobile Friendly | PASS | 3 / 3 | auto-fix |
| Semantic Headings | PASS | 7.6 / 8 | auto-fix |
| Content Quality | PASS | 4.4 / 5 | assisted |
| Content Freshness | PASS | 4 / 5 | assisted |
| Author Signals | FAIL | 2.1 / 5 | assisted |
| Image Alt Text | PASS | 5 / 5 | assisted |
| Internal Linking | PASS | 4 / 4 | assisted |
| Accessibility | PASS | 3.9 / 4 | auto-fix |
| Server-Rendered Content | PASS | 6 / 6 | assisted |
| Markdown for Agents | PASS | 3 / 3 | assisted |
| Agent-Usable Controls | PASS | 4 / 4 | assisted |
| Agent Protocol Discovery | N/A | - | assisted |

## Notes

- Scores come from the repo, not a live page. Tags injected by JavaScript, headers set by your host, and server behaviour can differ in production; checks marked "predicted from config" or "inconclusive" are the ones to confirm live: ask your coding agent to audit the live URL (`/aeotester:audit https://your-site.com` in Claude Code).
- Run the AEOTester fix skill (`/aeotester:fix` in Claude Code) to apply the auto-fixable items. It shows a diff and asks before writing anything.

---

Check a live URL: https://aeotester.com/?utm_source=plugin&utm_medium=report
