import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const FORBIDDEN = [
  "encontreum.com.br",
  "www.encontreum.com.br",
];

const IGNORED_DIRS = new Set([
  ".git",
  ".next",
  "node_modules",
  ".vercel",
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }

  return files;
}

const files = await walk(ROOT);
const violations = [];

for (const file of files) {
  if (file.endsWith("check-brand-domain.mjs")) continue;

  let content;
  try {
    content = await readFile(file, "utf8");
  } catch {
    continue;
  }

  for (const term of FORBIDDEN) {
    if (content.includes(term)) {
      violations.push({ file: file.slice(ROOT.length + 1), term });
    }
  }
}

if (violations.length) {
  console.error("Forbidden legacy EncontreUm domain reference(s) found:");
  for (const violation of violations) {
    console.error(`- ${violation.file}: ${violation.term}`);
  }
  process.exit(1);
}

console.log("Brand/domain gate passed.");
