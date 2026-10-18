// Post-build: writes a Markdown copy of every indexable page next to its HTML
// (dist/blog/foo/index.html -> dist/blog/foo/index.md) for AI agents.
// Pages advertise it with <link rel="alternate" type="text/markdown">.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const DIST = "dist";

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
turndown.use(gfm);
// Markup with no value as text: icons, embeds, forms and their controls.
turndown.remove(["script", "style", "noscript", "svg", "iframe", "video", "form", "button", "dialog"]);

const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const meta = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1].trim()) : "";
};
const yaml = (s) => JSON.stringify(s);

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (name === "index.html") yield path;
  }
}

let count = 0;
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, "utf8");
  if (/<meta name="robots" content="noindex/.test(html)) continue;

  const main = html.match(/<main id="mainContent"[^>]*>([\s\S]*)<\/main>/);
  if (!main) continue;

  const title = meta(html, /<title>([^<]*)<\/title>/);
  const description = meta(html, /<meta name="description" content="([^"]*)"/);
  const url = meta(html, /<link rel="canonical" href="([^"]*)"/);
  const modified = meta(html, /"dateModified":"([^"]+)"/);

  const body = turndown
    .turndown(main[1])
    .replace(/\]\(\//g, "](https://metromedicslab.com/")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const frontMatter = [
    "---",
    `title: ${yaml(title)}`,
    `description: ${yaml(description)}`,
    `url: ${yaml(url)}`,
    ...(modified ? [`last_modified: ${yaml(modified)}`] : []),
    "---",
  ].join("\n");

  writeFileSync(file.replace(/index\.html$/, "index.md"), `${frontMatter}\n\n${body}\n`);
  count++;
}

console.log(`build-markdown: ${count} Markdown pages written to ${relative(".", DIST).split(sep).join("/")}/`);
