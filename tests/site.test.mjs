import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, sep } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const eleventyCli = join(root, "node_modules/@11ty/eleventy/cmd.cjs");
const site = JSON.parse(await readFile(join(root, "src/_data/site.json"), "utf8"));
const projects = JSON.parse(await readFile(join(root, "src/_data/projects.json"), "utf8"));
const articleSources = (await readdir(join(root, "src/writing"))).filter((name) => name.endsWith(".md"));

const OUTBOUND_ALLOWLIST = [
  "https://github.com/jimmy1992abc/afk",
  "https://nestliapp.com",
  "https://github.com/XeroAPI/xero-mcp-server",
];
const TEXT_EXTENSIONS = /\.(html|xml|txt|css|svg)$/;

let out;
let files;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => (entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)])),
  );
  return nested.flat();
}

function decodeEntities(text) {
  let previous;
  let current = text;
  do {
    previous = current;
    current = current
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
      .replace(/&(lt|gt|quot|apos|commat|amp);/g, (_, name) => ({ lt: "<", gt: ">", quot: '"', apos: "'", commat: "@", amp: "&" })[name]);
  } while (current !== previous);
  return current;
}

const visibleText = (html) => decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ");
const attributes = (html, name) => [...html.matchAll(new RegExp(`\\s${name}="([^"]*)"`, "g"))].map((match) => match[1]);
const page = (route) => files.get(route.endsWith("/") ? `${route}index.html` : route);
const htmlPages = () => [...files].filter(([path]) => path.endsWith(".html"));
const textFiles = () => [...files].filter(([path]) => TEXT_EXTENSIONS.test(path));
const articleRoutes = () => articleSources.map((name) => `/writing/${name.replace(/\.md$/, "")}/`);

before(async () => {
  out = await mkdtemp(join(tmpdir(), "homepage-"));
  execFileSync(process.execPath, [eleventyCli, "--input=src", `--output=${out}`, "--quiet"], { cwd: root, stdio: "pipe" });
  files = new Map();
  for (const file of await walk(out)) {
    const route = `/${relative(out, file).split(sep).join("/")}`;
    files.set(route, TEXT_EXTENSIONS.test(route) ? await readFile(file, "utf8") : null);
  }
});

after(async () => {
  await rm(out, { recursive: true, force: true });
});

test("expected routes exist", () => {
  const routes = ["/", "/finance/", "/about/", "/writing/", "/projects/", "/404.html", "/feed.xml", "/sitemap.xml", "/robots.txt", ...articleRoutes()];
  for (const route of routes) assert.ok(page(route), `missing ${route}`);
});

test("every page has a unique title, a description, a canonical URL and one h1", () => {
  const titles = new Set();
  for (const [path, html] of htmlPages()) {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title, `${path}: title`);
    assert.ok(!titles.has(title), `${path}: duplicate title`);
    titles.add(title);
    assert.match(html, /<meta name="description" content="[^"]{40,}">/, `${path}: description`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
    assert.ok(canonical?.startsWith(`${site.url}/`), `${path}: canonical`);
    assert.equal(html.match(/<h1[\s>]/g)?.length, 1, `${path}: h1 count`);
    assert.doesNotMatch(html, /\{\{|\{%/, `${path}: unrendered template syntax`);
  }
});

test("internal links resolve", () => {
  for (const [path, html] of htmlPages()) {
    for (const reference of [...attributes(html, "href"), ...attributes(html, "src")]) {
      if (!reference.startsWith("/")) continue;
      const [target, fragment] = reference.split("#");
      const resolved = target.endsWith("/") ? `${target}index.html` : target;
      assert.ok(files.has(resolved), `${path}: broken link ${reference}`);
      if (fragment) assert.ok(files.get(resolved).includes(`id="${fragment}"`), `${path}: missing anchor ${reference}`);
    }
  }
});

test("only the approved email", () => {
  const found = new Set();
  for (const [, content] of textFiles()) {
    for (const [email] of decodeEntities(content).matchAll(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g)) found.add(email);
  }
  assert.deepEqual([...found], [site.email]);
  for (const [path, html] of htmlPages()) {
    for (const href of attributes(html, "href").filter((value) => value.startsWith("mailto:"))) {
      assert.equal(href, `mailto:${site.email}`, path);
    }
  }
});

test("no phone numbers", () => {
  for (const [path, content] of textFiles()) {
    assert.doesNotMatch(decodeEntities(content), /(?:\+61|\b0)[2-478](?:[ -]?\d){8}\b/, path);
  }
});

test("no career or job-seeking language", () => {
  const patterns = [
    /open to work/,
    /hire me/,
    /available for (work|hire)/,
    /(looking for|seeking) (a |my )?(new |next )?(role|job|position|opportunit)/,
    /curriculum vitae/,
    /\bcv\b/,
    /\br[eé]sum[eé]\b/,
  ];
  for (const [path, content] of textFiles()) {
    assert.doesNotMatch(decodeEntities(content).toLowerCase(), /linkedin/, path);
    const text = visibleText(content).toLowerCase();
    for (const pattern of patterns) assert.doesNotMatch(text, pattern, path);
  }
});

test("outbound links are allowlisted", () => {
  for (const [path, html] of htmlPages()) {
    const anchors = [...html.matchAll(/<a\s[^>]*href="([^"]*)"/g)].map((match) => match[1]);
    for (const href of anchors) {
      if (href.startsWith("/") || href.startsWith("#") || href.startsWith("mailto:")) continue;
      assert.ok(OUTBOUND_ALLOWLIST.includes(href), `${path}: outbound link ${href}`);
    }
  }
});

test("no scripts or third-party resources", () => {
  for (const [path, html] of htmlPages()) {
    assert.doesNotMatch(html, /<(script|iframe|object|embed)[\s>]/i, path);
    assert.doesNotMatch(html, /\s(on\w+|style)="/i, `${path}: inline handler or style`);
    for (const src of attributes(html, "src")) assert.ok(src.startsWith("/"), `${path}: src ${src}`);
    for (const [tag, href] of html.matchAll(/<link\s[^>]*href="([^"]*)"[^>]*>/g)) {
      const sameSite = href.startsWith("/") || (tag.includes('rel="canonical"') && href.startsWith(`${site.url}/`));
      assert.ok(sameSite, `${path}: link ${href}`);
    }
  }
  for (const [path, content] of textFiles().filter(([name]) => name.endsWith(".css"))) {
    assert.doesNotMatch(content, /@import|url\(/, path);
  }
});

test("no generator or author metadata", () => {
  for (const [path, html] of htmlPages()) {
    assert.doesNotMatch(html, /<meta name="(generator|author)"/i, path);
  }
  const authors = [...files.get("/feed.xml").matchAll(/<author>(.*?)<\/author>/gs)].map((match) => match[1]);
  assert.deepEqual(authors, [`<name>${site.title}</name>`]);
});

test("private blocklist", (t) => {
  const terms = (process.env.PRIVACY_BLOCKLIST ?? "").split(",").map((term) => term.trim().toLowerCase()).filter(Boolean);
  if (terms.length === 0) return t.skip("PRIVACY_BLOCKLIST is not set");
  const hits = [];
  for (const [path, content] of textFiles()) {
    const text = decodeEntities(content).toLowerCase();
    terms.forEach((term, index) => {
      if (text.includes(term)) hits.push(`${path} (entry ${index + 1})`);
    });
  }
  assert.ok(hits.length === 0, `blocklisted term found in: ${hits.join(", ")}`);
});

test("feed and sitemap list every article with absolute URLs", () => {
  for (const route of articleRoutes()) {
    assert.ok(files.get("/feed.xml").includes(`<link href="${site.url}${route}"/>`), `feed: ${route}`);
    assert.ok(files.get("/sitemap.xml").includes(`<loc>${site.url}${route}</loc>`), `sitemap: ${route}`);
  }
  for (const route of ["/", "/finance/", "/about/", "/writing/", "/projects/"]) {
    assert.ok(files.get("/sitemap.xml").includes(`<loc>${site.url}${route}</loc>`), `sitemap: ${route}`);
  }
  assert.ok(!files.get("/sitemap.xml").includes("404"), "sitemap lists the 404 page");
});

test("every article and project is rendered", () => {
  assert.ok(articleSources.length >= 5, "at least five articles");
  for (const route of articleRoutes()) {
    assert.ok(page("/writing/").includes(`href="${route}"`), `writing index: ${route}`);
  }
  assert.equal(projects.length, 4);
  for (const project of projects) {
    assert.ok(page("/projects/").includes(`<article class="project" id="${project.id}">`), `projects page: ${project.id}`);
  }
  for (const route of ["/finance/", "/writing/", "/projects/", "/about/"]) {
    assert.ok(page("/").includes(`href="${route}"`), `homepage links to ${route}`);
  }
  const numbers = articleRoutes().map((route) => page(route).match(/No\. (\d+)/)?.[1]);
  assert.equal(new Set(numbers).size, articleSources.length, "article numbers are unique");
});

test("robots.txt names the sitemap", () => {
  assert.ok(files.get("/robots.txt").includes(`Sitemap: ${site.url}/sitemap.xml`));
});

test("CLAUDE.md points at AGENTS.md", async () => {
  assert.ok(existsSync(join(root, "AGENTS.md")));
  assert.match(await readFile(join(root, "CLAUDE.md"), "utf8"), /AGENTS\.md/);
});
