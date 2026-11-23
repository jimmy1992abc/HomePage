# AGENTS.md

Canonical instructions for AI coding agents working in this repository. Tool-specific files such as `CLAUDE.md` point here.

## What this is

The source of jimmychen.com.au: a personal site with essays on using AI in finance and notes on projects. It is a static site built with Eleventy and published to GitHub Pages. See [README.md](README.md) for setup, content editing and publishing.

## Commands

```sh
npm ci          # install
npm run dev     # local server with reload
npm test        # build into a temp directory and check the output
npm run build   # write the site to _site/
```

Run `npm test` before every commit. The tests run a real build; there is no separate lint step.

## Layout

| Path | Purpose |
| --- | --- |
| `src/_data/site.json` | Site name, URL, description and the contact email (single source) |
| `src/_data/projects.json` | Projects shown on the homepage and `/projects/` |
| `src/writing/*.md` | Articles; the file name is the URL slug |
| `src/_includes/` | Layouts and the shared article list |
| `src/assets/css/site.css` | All styles and the design tokens |
| `tests/site.test.mjs` | Build and privacy checks |
| `docs/designs/specs/` | Design documents |

## Privacy rules

These are requirements, not preferences. The tests enforce most of them.

- The only contact detail is the email in `src/_data/site.json`. Never add a phone number, street or suburb, or another email address.
- The site may say: CPA, Certified ScrumMaster, UNSW, Sydney. It must not name an employer, client, job title or employment date, and must not link to or mention LinkedIn.
- Never write anything that says or implies the author is available for work.
- Do not commit a list of names to avoid. Supply them through the `PRIVACY_BLOCKLIST` environment variable (comma-separated); the "private blocklist" test checks the build against it and never prints a term.
- Outbound links must be on the allowlist in `tests/site.test.mjs`. Adding a host is a deliberate change to that list.
- Commit with the GitHub no-reply address, not a personal one.

## Content rules

- Articles are first-person opinion. Do not invent figures, results, anecdotes or quotations.
- Describe a project only with facts its author has stated. The trading project stays at the level of structure: no strategy, parameters or performance.
- Plain language, short paragraphs, no marketing tone.

## Engineering rules

- No client-side JavaScript, web fonts, analytics or third-party resources. The tests fail if any appear.
- Eleventy is the only dependency. Justify any addition in the pull request.
- After any dependency change, check that `package-lock.json` has no `"extraneous"` entries; regenerate it with `npx npm@10 install` if it does, or `npm ci` fails on Linux.
- Keep URLs stable: do not rename a published article file.
- Colours come from the custom properties at the top of `site.css`; both the light and dark sets must keep WCAG AA contrast.
- Work on a branch and open a pull request. Do not push to `main`, change repository settings or touch DNS unless asked.
