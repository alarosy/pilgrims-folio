import type { Config } from "@react-router/dev/config";
import { program } from "./src/data/program";
import { check } from "./src/data/validate";
import { normalizeBase } from "./src/lib/base";

// Check program.ts before anything is built, so a mistake stops the build
// with a plain message (and the site that is already online stays as it was).
const { errors } = check(program);
if (errors.length) {
  throw new Error(`\n\nprogram.ts needs fixing before the site can be built:\n  • ${errors.join("\n  • ")}\n`);
}

export default {
  // The brief keeps all source under src/ (src/data/program.ts is the file Ali edits).
  appDirectory: "src",
  // "/" on Netlify, Vercel or a custom domain; "/<repository>/" on a GitHub Pages
  // project site (the GitHub workflow sets BASE_PATH). See src/lib/base.ts.
  basename: normalizeBase(process.env.BASE_PATH),
  // No server: every page is prerendered to a static HTML file at build time.
  ssr: false,
  // Every fixed path, plus one page per module and per poem, in both languages.
  async prerender({ getStaticPaths }) {
    const both = (p: string) => [p, `/ar${p}`];
    const modules = program.modules.flatMap((m) => both(`/modules/${m.id}`));
    const poems = program.poems.flatMap((p) => both(`/sonnets/${p.id}`));
    return [...getStaticPaths(), ...modules, ...poems];
  },
} satisfies Config;
