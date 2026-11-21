# The Pilgrim's Folio

A companion website for Ali's 100-hour Shakespeare journey, 21 November to 31 December 2026.

You study in your Claude Project. This website **shows** your progress: the map of the road, your words, your sonnets, your notes on *Macbeth*, your finished work. Everything it shows comes from one file: [`src/data/program.ts`](src/data/program.ts).

**Contents**

1. [After each session](#after-each-session): the update, step by step
2. [If the update does not go online](#if-the-update-does-not-go-online)
3. [Things to set once](#things-to-set-once)
4. [Your practice is saved in your browser](#your-practice-is-saved-in-your-browser)
5. [Putting the site online the first time](#putting-the-site-online-the-first-time)
6. [For developers](#for-developers)

---

## After each session

It takes about five minutes, and works on a phone or a laptop.

1. **Ask Claude.** At the end of a session, write **site update** in your Claude Project. Claude replies with a block of text and a short list of where each part goes.
   (Claude knows the format because of the [instructions for your Claude Project](docs/CLAUDE-PROJECT.md). Add them once.)

2. **Open the file on GitHub.** Go to your repository on github.com, open `src` → `data` → `program.ts`, and press the **pencil** (Edit).

3. **Paste and change what Claude's list says.** Usually:
   - paste the new session under the line `// ↓ NEW SESSIONS GO HERE` in the right module;
   - change `hoursDone` for that module;
   - replace the `record: { … },` block;
   - change `updated:` near the top to today's date.

   To find a line, use **Find**: Ctrl+F on a laptop, or "Find in page" in the phone browser's menu. Search for `NEW SESSIONS` or for `id: "m0"`.

4. **Save.** Press **Commit changes…**, write a few words such as `Session 22 November`, and press **Commit changes** again.

5. **Wait two minutes.** Open the **Actions** tab of the repository. A yellow dot means it is building; a green tick means your site is updated. Reload the site to see it.

> Always paste **all** of a part, from its first line to its last, including the comma at the end.

### What else you can update

| On the site | In `program.ts` | Who writes it |
|---|---|---|
| A session on a module page, words in the Lexicon | `sessions` inside a module | Claude's update |
| Hours, the map, the quill, the seals | `hoursDone` and `status` of each module | Claude's update |
| The progress record on the Prologue | `record` | Claude's update |
| Lines memorized (Sonnet Chamber) | `memorizedLines` of each poem | Claude's update |
| Scene progress and the thou/you log (Scottish Play) | `macbeth` → `scenes`, `thouYouLog` | Claude's update |
| The Final Folio | `finalWorks` → `status`, `link` | Claude's update |
| A page in the Commonplace Book | `journal` | **You** |
| The Journey | `journey` | **You** |

**A page in your Commonplace Book.** Paste this under `// ↓ NEW JOURNAL ENTRIES GO HERE` and write your own words. Use a blank line between paragraphs as `\n\n`. For a page in Arabic, add `lang: "ar",`.

```ts
{
  id: "2026-11-22-first-thoughts",
  date: "2026-11-22",
  title: "Your title",
  body: "Your words.\n\nA second paragraph.",
  mood: "curious", // optional
},
```

---

## If the update does not go online

Nothing breaks. If `program.ts` has a mistake, the build stops and **the site that is already online stays as it was**.

To see why it stopped: **Actions** tab → the run with the red cross → **build** → open the step that failed. (On Netlify or Vercel, the same message is in the deploy log.) The message says what to fix. For example:

```
program.ts needs fixing before the site can be built:
  • M0: hoursDone is 11, but it must be between 0 and 10.
```

Fix that line in `program.ts` and commit again. Or copy the message into your Claude Project: Claude will tell you which lines to change.

| The message says… | What to do |
|---|---|
| `` `,` or `}` expected `` and a line number | A comma is missing at the **end of the line just above** the line it shows. |
| `hoursDone is …, but it must be between 0 and …` | The hours for that module are too many. |
| `is marked "done" but only … hours are done` | Either finish the hours or keep the status `"current"`. |
| `… modules are marked "current". Only one can be.` | Set the finished module to `"done"`. |
| `… appears twice` | A snippet was pasted twice. Delete one copy. |
| `needs one of the four labels` | A Two Traditions card needs its `label`. |
| `is not in the cast list` | A thou/you line uses a name the cast list does not know (for example `lady-macbeth`). |

Some messages are only **notes** (the build still finishes), such as "6 example entries are still in program.ts". They are reminders, not errors.

---

## Things to set once

Each of these is in `program.ts`.

- **The "Continue this lesson in Claude" button.** Near the top, under `config`, replace `claudeProjectUrl` with the address of your Claude Project (open the project and copy the address from the browser). A module can have its own chat: add `claudeUrl: "…",` to that module.
- **The week plan.** Under `weeks`, `moduleIds` says which modules each week covers. They are spread evenly for now; copy the plan from your syllabus.
- **Objectives and concepts** of each module: copy them from your syllabus into `objectives: [ … ]` and `concepts: [ … ]`.
- **Arabic titles** (`titleAr`) and all Arabic wording on the site are drafts. Change anything that does not sound right; your wording wins. The interface words are in `src/i18n/strings.ts` and `src/i18n/rooms.ts`.
- **The examples.** Everything marked `// EXAMPLE — replace` and `placeholder: true` is not real. The site shows it with a "Specimen" stamp and leaves it out of every count. Delete each example when your real ones arrive.
- **The Journey.** `journey: { story: "" }` is empty on purpose: only you should write it. Add `storyAr: "…"` for the Arabic page.
- **Recordings.** A poem can have `recordingUrl: "…"` with a link to an audio file of you reciting it; a player then appears in the Sonnet Chamber.

> **The site is public.** Anyone with the address can read it, including your assessment results and the weaknesses in the progress record, and anyone can read `program.ts` on GitHub if the repository is public. Write only what you are happy to share.

---

## Your practice is saved in your browser

Your Lexicon reviews, recite practice and settings are saved **in the browser you use**, not on the website. So:

- your phone and your laptop keep separate histories;
- clearing your browser's data deletes them.

Open **Settings** (the gear at the top) → **Export my data** now and then to keep a backup file. **Import a backup file** puts it back, on the same device or another one. Before replacing anything it shows what the file holds, and you can undo it once.

---

## Putting the site online the first time

Choose **one** host. GitHub Pages is the simplest, because you need GitHub for your updates anyway.

### GitHub Pages (recommended)

1. **Put the project on GitHub.** (On a free account, GitHub Pages needs a **public** repository.)
   - **With GitHub Desktop** (desktop.github.com, the easiest way): sign in → **File** → **Add local repository** → choose this project's folder (if it offers to **create a repository** here, accept) → in **Changes**, write a summary such as `The Pilgrim's Folio` and press **Commit to main** → **Publish repository** → name it, for example `pilgrims-folio`, and **untick "Keep this code private"** → Publish. GitHub Desktop makes the repository on github.com for you. The `node_modules` and `build` folders are left out by themselves.
   - **With the command line:** on github.com make a **New repository** named `pilgrims-folio`, Public, with nothing in it (no README). Then, in this project's folder:
     ```bash
     git init
     git add .
     git commit -m "The Pilgrim's Folio"
     git branch -M main
     git remote add origin https://github.com/YOUR-NAME/pilgrims-folio.git
     git push -u origin main
     ```
2. **Turn on Pages.** In the repository on github.com: **Settings** → **Pages** → under "Build and deployment", **Source: GitHub Actions**.
3. **Publish.** Open the **Actions** tab → **Publish the site** → **Run workflow**. (A first run with a red cross, from before Pages was on, is normal; this new run is the one that counts.) After about two minutes your site is at
   `https://YOUR-NAME.github.io/pilgrims-folio/`

   From now on it publishes by itself after every commit.

The site knows by itself that it lives in the `/pilgrims-folio/` folder. If you name the repository `YOUR-NAME.github.io`, or add your own domain, it lives at the root instead; that works too, with no change.

### Netlify or Vercel (alternatives)

Both are free for a site like this, and both rebuild by themselves after every commit.

- **Netlify:** app.netlify.com → **Add new site** → **Import an existing project** → GitHub → choose the repository → **Deploy**. The settings come from [`netlify.toml`](netlify.toml).
- **Vercel:** vercel.com → **Add New…** → **Project** → import the repository → **Deploy**. The settings come from [`vercel.json`](vercel.json).

If you use one of these, you can switch GitHub Pages off (Settings → Pages), so there is only one copy of your site.

---

## For developers

### Run it

```bash
npm install
npm run dev          # http://localhost:5173  ·  style guide: /style-guide
npm run build        # checks program.ts, prerenders every page to build/client, writes 404.html
npm run preview      # serves the build the way the hosts do: http://localhost:4173
npm test             # program.ts rules, review scheduling, saved data, dates, Arabic counts, boot script
npm run typecheck
```

Node 22.12 or newer (the hosts use Node 24).

**Windows with Smart App Control:** Windows may block the native modules of the build tools ("An Application Control policy has blocked this file"). Run this once after every `npm install`; it adds the official WebAssembly build of Rolldown, so nothing native is needed:

```bash
npm run setup:wasm
```

(lightningcss is already swapped for its WebAssembly build through `overrides` in `package.json`.) Not needed on macOS, Linux or the hosts.

### How it is built

- **React Router 8 in framework mode with `ssr: false`:** every page, in English and in Arabic (`/ar/…`), is prerendered to its own HTML file, so the first paint never waits for JavaScript. There is no server and no database.
- [`react-router.config.ts`](react-router.config.ts) runs the rules in [`src/data/validate.ts`](src/data/validate.ts) before building, so a mistake in `program.ts` stops the build with a plain message.
- [`scripts/postbuild.mjs`](scripts/postbuild.mjs) saves the 404 page as `404.html` (served by all three hosts) and, for a GitHub Pages project site, moves the pages out of the extra folder React Router writes them into.
- **Sub-folder hosting:** `BASE_PATH` (e.g. `pilgrims-folio`) sets both Vite's `base` and React Router's `basename` ([`src/lib/base.ts`](src/lib/base.ts)). The GitHub workflow sets it from the repository; elsewhere it is empty. To rehearse GitHub Pages locally:
  ```bash
  BASE_PATH=pilgrims-folio npm run build
  BASE_PATH=pilgrims-folio HOST=github npm run preview   # http://localhost:4173/pilgrims-folio/
  ```
- Saved browser data lives under one `localStorage` key, `pilgrims-folio:v1` ([`src/lib/storage.ts`](src/lib/storage.ts)); imports are checked and damaged parts dropped.
- [`src/lib/boot.ts`](src/lib/boot.ts) is the small script that runs before first paint (theme, reduced motion, language and direction).

### Where things live

```
src/data/program.ts      all content (the only file Ali edits)
src/data/types.ts        its shape · validate.ts its rules · index.ts derived numbers
src/i18n                 interface words in English and Arabic
src/routes               one file per page
src/scenes               the larger drawings: curtain, skyline, hourglass, map, candle and fog
src/components/ornament  drop caps, fleurons, Tudor rose, wax seals, shields, icons
src/components/ui        buttons, switches, progress, flip cards, print furniture
src/components/layout    the shell: header, ribbon, contents, settings, colophon
src/theme/app.css        design tokens, both themes, components, motion and reduced motion
src/lib                  language, dates, review scheduling, storage, motion helpers
docs/PLAN.md             the approved plan · docs/CLAUDE-PROJECT.md the Claude instructions
```

### Style guide shortcuts

- `/style-guide?plate=ornaments` shows one plate on its own (ids: colour, letters, ornaments, icons, furniture, controls, surfaces, measures, labels, themes, arabic, motion)
- `?theme=macbeth` opens in the candlelight theme · `?dir=rtl` mirrors the page

### Credits

Shakespeare's lines follow the Folger Shakespeare edition (CC BY-NC 3.0). Fonts: IM Fell English, IM Fell DW Pica, EB Garamond, UnifrakturMaguntia and Amiri, all under the SIL Open Font License, served from this site. All drawings are original SVG.
