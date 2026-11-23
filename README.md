# jimmychen.com.au

Jimmy Chen's personal site: essays on using AI in finance, and notes on the projects behind them. Static HTML built with [Eleventy](https://www.11ty.dev/) and published to GitHub Pages.

## Local development

Requires Node 20 or later.

```sh
npm ci
npm run dev     # http://localhost:8080 with live reload
npm test        # builds into a temp directory and checks the output
npm run build   # writes _site/
```

The tests cover routes, titles and descriptions, internal links, the feed and sitemap, and the privacy rules in [AGENTS.md](AGENTS.md). They check the build, not the deployed site.

To check the build against names that must never appear, without committing them:

```sh
PRIVACY_BLOCKLIST="Name One,Name Two" npm test
```

The same value can be stored as a repository secret called `PRIVACY_BLOCKLIST`; both workflows pass it to the tests. A failure reports the file only, never the term.

## Editing content

### Add an article

Create `src/writing/<slug>.md`. The file name becomes the URL, `/writing/<slug>/`.

```yaml
---
title: "A clear claim"
description: "One or two sentences shown in lists, search results and the feed."
date: 2027-01-16
order: 6
---
```

`order` is the article number shown beside the title; use the next unused number. Lists show the newest first. Write the body in Markdown below the front matter.

### Edit a project

Projects live in `src/_data/projects.json`. Each has an `id` (its anchor on `/projects/`), `name`, `kind`, `summary`, `insight`, `body` paragraphs, `lessons` and an optional `link`. A new link host must also be added to the allowlist in `tests/site.test.mjs`.

### Change the name, description or email

Edit `src/_data/site.json`. Every page, the feed and the footer read from it.

## Structure

| Path | Purpose |
| --- | --- |
| `src/index.njk` | Homepage |
| `src/writing/` | Articles and the writing index |
| `src/projects/index.njk` | Projects page |
| `src/_includes/layouts/` | Page shell and article layout |
| `src/assets/css/site.css` | Styles; colour and type tokens are at the top |
| `src/feed.njk`, `src/sitemap.njk`, `src/robots.njk` | Atom feed, sitemap, robots.txt |
| `tests/site.test.mjs` | Build and privacy checks |
| `.github/workflows/` | `ci.yml` tests pull requests; `deploy.yml` publishes `main` |

The site ships no JavaScript, no web fonts and no third-party requests. Light and dark colour schemes follow the visitor's system setting.

## Publishing

`deploy.yml` builds and publishes on every push to `main`. One-time setup, in this order:

1. **Enable Pages.** Repository Settings → Pages → Source: **GitHub Actions**. Do this before merging the first pull request; otherwise the first deploy run fails (nothing is published by a failed run).
2. **Verify the domain.** Account Settings → Pages → Add a domain → `jimmychen.com.au`, and add the TXT record GitHub shows. This stops anyone else claiming the domain on Pages.
3. **Set the custom domain.** Repository Settings → Pages → Custom domain: `jimmychen.com.au`. With an Actions deployment a `CNAME` file in the repository is not used.
4. **Point DNS** at GitHub (VentraIP → DNS management for the domain):

   | Type | Host | Value |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `jimmy1992abc.github.io` |

   These are the addresses in [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site); check that page if a record is rejected.
5. **Enforce HTTPS** in the Pages settings once the certificate has been issued.

After the first deploy, open the live site and check the homepage, one article, `/feed.xml` and a missing URL (the 404 page).
