/**
 * Windows with Smart App Control / Application Control blocks the native
 * modules some build tools ship. This script adds the official WebAssembly
 * build of Rolldown (Vite's bundler) next to the native one, so it falls back
 * to WebAssembly. (lightningcss is swapped for lightningcss-wasm through
 * "overrides" in package.json.)
 *
 * It unpacks the packages straight into node_modules instead of running
 * `npm install --force`, which would rebuild the whole tree.
 * Not needed on Linux or macOS, or in CI. Run: npm run setup:wasm
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("Run this through npm: npm run setup:wasm");
// Windows' own tar (bsdtar) understands C:\ paths; Git Bash's GNU tar does not.
const tar = process.platform === "win32" ? join(process.env.SystemRoot ?? "C:\\Windows", "System32", "tar.exe") : "tar";

const nm = join(process.cwd(), "node_modules");
const rolldown = JSON.parse(readFileSync(join(nm, "rolldown", "package.json"), "utf8")).version;
const work = mkdtempSync(join(tmpdir(), "pf-wasm-"));
const npm = (args) =>
  execFileSync(process.execPath, [npmCli, ...args], { cwd: work, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });

const queue = [["@rolldown/binding-wasm32-wasi", rolldown]];
const done = new Set();
try {
  while (queue.length) {
    const [name, range] = queue.shift();
    if (done.has(name)) continue;
    done.add(name);
    const dest = join(nm, ...name.split("/"));
    if (existsSync(join(dest, "package.json"))) {
      const present = JSON.parse(readFileSync(join(dest, "package.json"), "utf8"));
      console.log(`= ${name}@${present.version} already present`);
      for (const [dep, r] of Object.entries(present.dependencies ?? {})) queue.push([dep, r]);
      continue;
    }
    const versions = [JSON.parse(npm(["view", `${name}@${range}`, "version", "--json"]))].flat();
    const version = versions.at(-1);
    const deps = JSON.parse(npm(["view", `${name}@${version}`, "dependencies", "--json"]) || "{}");
    const meta = { version, dependencies: deps };
    const [{ filename }] = JSON.parse(npm(["pack", `${name}@${meta.version}`, "--json", "--silent"]));
    mkdirSync(dest, { recursive: true });
    execFileSync(tar, ["-xzf", join(work, filename), "-C", dest, "--strip-components=1"]);
    console.log(`+ ${name}@${meta.version}`);
    for (const [dep, r] of Object.entries(meta.dependencies ?? {})) queue.push([dep, r]);
  }
  console.log("WebAssembly fallback ready.");
} finally {
  rmSync(work, { recursive: true, force: true });
}
