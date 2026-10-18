# Handoff: Manan Wadhwa's academic site

Written 2026-10-12 at the end of the first session. This file lives in `_notes/`, which is committed to the public repo so a phone-driven or cloud session can read it. GitHub Pages runs Jekyll, and Jekyll skips folders starting with `_`, so `_notes/` isn't served on the site. It is still readable on github.com, so keep anything private out of it. Don't add a `.nojekyll` file, because that would publish `_notes/`.

## Goal

This is a personal academic website hosted on GitHub Pages. The main readers are academics: potential PhD advisors, admissions committees and collaborators. AI safety orgs and fellowships come second. The site will be used in applications.

The style is modelled on Tim Hua's site (https://timhua.me, source at https://github.com/tim-hua-01/tim-hua-01.github.io). It's plain and academic, and the personality comes from hover tooltips.

## Where things are

- **Site folder:** `/home/manan/Projects/files/manan-wadhwa.github.io/`. It's its own git repo, and the parent repo `/home/manan/Projects/files` ignores it. The parent's `.gitignore` edit is not committed yet.
- **GitHub:** https://github.com/Manan-Wadhwa/Manan-Wadhwa.github.io (public, branch `main`). Pages is on, serving `main` at the root, at https://manan-wadhwa.github.io.
- **Remote state:** everything is committed and pushed, including `cv.pdf` and `resume.pdf` (commit `8a6fd6a`). `index.html` loads `style.css?v=1` and `site.js?v=1`.
- **Preview is GitHub Pages.** Manan works from a phone, so there's no localhost preview.
  - After each change, commit and push to `main`. Wait for the build (`gh api repos/Manan-Wadhwa/Manan-Wadhwa.github.io/pages/builds --jq '.[0].status'` should say `built`, usually within a minute). Then send Manan `https://manan-wadhwa.github.io/?v=<short commit sha>`.
  - Pages sends `cache-control: max-age=600`. Whenever `style.css` or `site.js` changes, bump the `?v=N` on its `<link>`/`<script>` tag in `index.html` so phones don't keep the old file. Do the same for any image that's replaced in place.
  - The site is public. Don't push half-finished changes or anything private.
  - Fallback, if a change needs to stay private until approved: publish it as a private claude.ai Artifact with the Artifact tool. Use `index.html` as the page, pass `style.css`, `site.js`, `resume.txt` and `img/*` through `files`, and republish to the same URL each time.
- **Local testing:** `_notes/hover.mjs` needs `python3 -m http.server 8000 --bind 127.0.0.1` running in the repo root, plus `chromium`.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site, on one page. Tooltips are plain `title="..."` attributes. |
| `style.css` | Colours as CSS variables. Light is palette A, dark is palette D. Includes the mobile layout and tooltip styles. |
| `site.js` | Theme toggle, email assembly and the custom tooltip. |
| `resume.txt` | The "for clankers" resume: plain text and minimal. |
| `cv.pdf`, `resume.pdf` | Copies of the old PDFs, with the phone number and stale statuses. Already pushed (see "Old PDFs are public"). |
| `img/okabe.webp` | Sidebar placeholder image. |
| `img/redarc.webp`, `img/mars.webp`, `img/bluedot.webp` | Logos shown in tooltips. |
| `_notes/hover.mjs` | Headless hover test. Usage: `node _notes/hover.mjs '<css selector>' out.png light\|dark [width] [height]`. Needs the local server on port 8000 and `chromium`. It prints whether the tooltip showed, its text, and how many `title` attributes are left (should be 0). |

## Decisions already made (don't reopen without being asked)

- **Build:** hand-written HTML, CSS and JS. No framework and no build step.
- **Layout:** one page. A bio, then a sidebar on the right (image, contact, links). Papers and a "Before this" line come after the bio. On phones the sidebar moves under the bio.
- **Nav:** Home · CV · Resume: for humans · for clankers · a ☾/☀ toggle.
- **Colours:**
  - Light (palette A): `#f8f3e8` background, `#2a2420` text, `#8a2b1c` accent.
  - Dark (palette D): `#1c1a17` background, `#e8e2d6` text, `#e0a36b` accent.
  - The theme follows the visitor's system setting until they click the toggle. Their choice is saved in localStorage.
- **Font:** Libron v0.31 (https://github.com/nicoverbruggen/libron), self-hosted in `fonts/` from the official `Libron_Web.zip` release, with its OFL licence as `fonts/OFL.txt`. Chosen 2026-10-12 over Source Serif 4 (the previous font) and Newsreader. It has only weights 400 and 700, so the CSS uses only those. Don't subset or edit the files: "Libron" is a Reserved Font Name, so a modified copy would need a new name.
- **Tooltips:** at load, `site.js` converts every `title=` into a themed box that appears on hover, focus or tap, then removes the attribute so the native tooltip never shows. Adding `data-tip-img="img/x.webp"` puts a picture above the text. Logos display at natural size, up to the box width and 140px high.
- **Notes toggle:** a "notes" button in the nav shows every tooltip in `main` at once, grouped in a box under its paragraph or list item. It lets readers see everything without hovering. The choice is saved in localStorage.
- **Affiliation logos:** Redarc, MARS, SAFL, GSoC, AISI (Georgia Tech) and BlueDot have logo tooltips. HumanAI gets text only, so GSoC and HumanAI don't both show logos.
- **Touch:** on a phone the first tap on a link shows its tip and a second tap follows it. Mouseover is ignored after touch input.
- **Paper summaries:** all six paper titles have plain-language summaries as tooltips. Tips over 160 characters get the wider, upright `#tip.long` style.
- **Resumes:** `resume.pdf` ("for humans") is minimal: one page, no rules, one muted line per paper, built from `_notes/manan_wadhwa_resume.tex`. `resume.txt` ("for clankers") is the ATS version: plain ASCII, standard headings (SUMMARY, EDUCATION, EXPERIENCE, PUBLICATIONS, AWARDS, SKILLS), full month names, one fact per line, keyword-heavy SKILLS. `llms.txt` is the bio plus `resume.txt`; regenerate it when `resume.txt` changes.
- **Steins;Gate references:** only one cluster is allowed.
  - The Okabe image sits in the sidebar with the caption "Placeholder until I find a real photo." The caption's tooltip makes the "held hostage" joke.
  - The Redarc Labs link tooltip shows the Redarc logo and "Future Gadget Laboratory. El Psy Kongroo."
  - The Okabe image itself has no tooltip. Add no other Steins;Gate references.
- **Dead Poets Society reference:** Shivam Dubey's name in the Dead Salmons paper has the tooltip "O Captain! My Captain!".
- **Email:** `wadhwamanan56@gmail.com`. `site.js` assembles it from `data-user` and `data-domain`, and the plain HTML shows "[at] gmail [dot] com". Keep the phone number off the site.
- **Removed:** the Springer/ICAIN object detection paper is off the site and, since 2026-10-12, off the CV too.
- **Not wanted on the site:** links to code repos, side pages, a hobbies section.
- **Analytics:** GoatCounter (cookie-free), added 2026-10-18 at Manan's request. Script tag at the end of `index.html`; stats at https://manan-wadhwa.goatcounter.com.
- **Bio framing:** the research thread is "catching false positives in interpretability methods, including our own". The affiliations come one sentence each: Redarc Labs co-founder, MARS research fellow, Secure AI Futures Lab special projects fellow, and GSoC 2026 with HumanAI. The GSoC link goes to HumanAI's GSoC 2026 page.

## Papers as shown on the site (in this order)

| Paper | Authors | Status |
|---|---|---|
| Known by Construction: Calibrating Model-State Instruments... | Wadhwa*, Dubey* | New in ML, NeurIPS 2026 |
| Dead Salmons Have a False-Positive Rate... | Wadhwa*, Dubey* | Interpretability as a Science, NeurIPS 2026 |
| Steered Affect Moves a Partner Agent's Activations... | Wadhwa*, Dubey*, Ghosh, Kumar, Garg | Interpreting Agent Behavior, NeurIPS 2026 |
| Toxin Circuits in ESM-2... | Wadhwa*, Dubey* (Manan asked for this order) | GenBio Workshop, ICML 2026 |
| Distance to the Boundary Is Not Steering Resistance | Wadhwa*, Dubey* | Under review, UniReps |
| Doubt Is a Decision... | Mehta*, Chadha*, Singhal*, Wadhwa, Dubey | arXiv preprint, coming soon |

## Unconfirmed facts (ask Manan before treating these as final)

1. **UniReps vs arXiv.** Manan first said "Distance" is under review at UniReps and "Doubt" goes to arXiv. A later message was ambiguous and never got a clear confirmation.
2. **ESM-2 title.** The resume says "Toxin Circuits in ESM-2: Mechanistic Interpretability for Biosecurity Screening", but redarclabs.com says "Toxin Feature Hierarchy in ESM-2".
3. **OpenReview link.** The ESM-2 link `openreview.net/forum?id=Nb3y9BzCOi` came from redarclabs.com. OpenReview's bot challenge blocked verification.
4. **"Doubt" authorship.** redarclabs.com lists Manan fourth and not co-first. The resume says co-first. The site follows redarclabs.com.
5. **Start dates and Lokachakra.** `resume.txt` uses "2026" for the Redarc and SAFL start dates. The Lokachakra internship is still listed.
6. **Other profiles.** Google Scholar and X (`wadhwamanan1` from the GitHub README) aren't linked. Manan never said whether to add them.

## Old PDFs are public

`cv.pdf` and `resume.pdf` are copies of `/home/manan/Downloads/resume_comprehensive_3p.pdf` and `/home/manan/Downloads/resume_ais.pdf`. Both contain Manan's **phone number** and old paper statuses: [3] still says TAE, and everything is listed as "under review". They were pushed in `8a6fd6a`, so they're public now. The handoff session raised this with Manan, who hasn't decided yet. The choices are: keep them, replace them in a new commit (the old versions stay in git history), or rewrite history and force-push. Don't force-push without Manan's explicit OK.

## Next tasks (agreed, not started)

1. **Regenerate the PDFs from `_notes/manan_wadhwa_master_cv.tex` (a copy of `~/Downloads/manan_wadhwa_master_cv.tex` with the phone number removed):**
   - `resume.pdf`: one page in the style of Tim Hua's resume (https://timhua.me/Resume.pdf). Single column with no icons. Sections are Education, Research (title, authors, venue, one bullet), Experience (one line each, no bullets) and Awards. Use the same content as `resume.txt`.
   - `cv.pdf`: the full CV with corrected statuses. Keep the Springer paper.
   - For both: no phone number and no icon-font glyphs. Run `pdftotext` on each output and check that it parses cleanly.
2. **Add `llms.txt`** with the same content as `resume.txt` plus the bio, for LLM agents.
3. **Check the live site** at https://manan-wadhwa.github.io after each push (see "Preview is GitHub Pages").
4. **Small polish (optional):**
   - On phones the ☾ button wraps onto its own line.
   - The white-background logos (Redarc, BlueDot) show as white tiles in dark mode.
   - Possible tooltip images: a Dead Poets still for Shivam, or the 2009 dead-salmon fMRI figure.
5. **Real photo:** when Manan provides one, it replaces `img/okabe.webp` and the caption.

## Sources used

- **Resumes:** `_notes/manan_wadhwa_master_cv.tex` is the LaTeX source, without the phone number. The old PDFs are `cv.pdf` (3 pages) and `resume.pdf` (1 page) in the repo root. The originals are in `~/Downloads` on Manan's laptop.
- **Lab and fellowship sites:**
  - https://redarclabs.com: the lab Manan co-founded with Shivam Dubey. Source for author lists, the thesis and teaching cohorts.
  - https://secureaifutureslab.com: SAFL, where Manan is a special projects fellow.
- **GitHub:** https://github.com/Manan-Wadhwa. The profile README mentions music and writing as hobbies.

## How Manan works

- Messages are short and fast, often with typos, and sometimes sent mid-task. Read them generously.
- Manan works from a phone and checks every change on the live site (see "Preview is GitHub Pages"), not in long design write-ups.
- Manan wants results shown instead of clarifying questions. A multiple-choice question was rejected in favour of keeping the current state.
- The writing-style rules in `~/.claude/CLAUDE.md` apply to everything, site copy included. A cloud session may not have that file, so the short version is: no em dashes, plain words, active voice, sentence-case headings, no filler or hype.
