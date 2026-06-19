// Guard against AI-tell typography. The em dash (—) is the giveaway the brief
// called out, so we forbid it everywhere in source — comments included — leaving
// no trace in rendered copy. Numeric en-dash ranges (25–150) are standard and
// allowed. Run via npm test; it prints every offending file:line.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTS = [".ts", ".tsx"];
const BANNED = "—"; // em dash

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return EXTS.some((e) => full.endsWith(e)) ? [full] : [];
  });
}

let offenders = 0;
for (const root of ROOTS) {
  for (const file of walk(root)) {
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      if (line.includes(BANNED)) {
        offenders++;
        console.error(`  FAIL ${file}:${i + 1}  ${line.trim().slice(0, 80)}`);
      }
    });
  }
}

if (offenders === 0) console.log("  ok   no em dashes in app/components/lib");
console.log(`\n${offenders === 0 ? 1 : 0} passed, ${offenders} failed`);
process.exit(offenders > 0 ? 1 : 0);
