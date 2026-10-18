// Last-modified date of a page, from the last git commit that touched its
// source file. Used for the sitemap <lastmod> and the pages' dateModified.
// Needs the full git history at build time (fetch-depth: 0 in CI).
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const cache = new Map();

/** "/blog/foo/" -> "src/pages/blog/foo.astro" (or .../foo/index.astro) */
export function sourceFileFor(pathname) {
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  const candidates = clean
    ? [`src/pages/${clean}.astro`, `src/pages/${clean}/index.astro`]
    : ["src/pages/index.astro"];
  return candidates.find((file) => existsSync(file));
}

/** ISO date (YYYY-MM-DD) of the last commit for the page, or undefined. */
export function lastModified(pathname) {
  if (cache.has(pathname)) return cache.get(pathname);
  const file = sourceFileFor(pathname);
  let date;
  if (file) {
    try {
      date = execSync(`git log -1 --format=%cs -- "${file}"`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
      // Not a git checkout: leave the date out rather than guess.
    }
  }
  // Blog posts can be committed before their publish date: never report a
  // last-modified date earlier than the publication.
  const published = file && readFileSync(file, "utf8").match(/publishedTime="(\d{4}-\d{2}-\d{2})"/)?.[1];
  if (published && (!date || published > date)) date = published;
  const result = date || undefined;
  cache.set(pathname, result);
  return result;
}
