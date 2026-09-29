import { readdir, readFile } from "node:fs/promises";
import { relative, join, sep } from "node:path";

const ROOT = process.cwd();
const APP = join(ROOT, "app");
const SOURCE_DIRS = ["app", "components"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

function extname(path) {
  const index = path.lastIndexOf(".");
  return index >= 0 ? path.slice(index) : "";
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

function pageToRoute(file) {
  let value = relative(APP, file).split(sep).join("/");
  value = value.replace(/\/page\.tsx$/, "");
  if (value === "page.tsx") return "/";
  if (value === "") return "/";
  return "/" + value;
}

function matchesDynamic(route, target) {
  const routeParts = route.split("/").filter(Boolean);
  const targetParts = target.split("/").filter(Boolean);
  if (routeParts.length !== targetParts.length) return false;

  return routeParts.every((part, index) => {
    if (/^\[.*\]$/.test(part)) return targetParts[index].length > 0;
    return part === targetParts[index];
  });
}

const appFiles = await walk(APP);
const routes = appFiles
  .filter((file) => file.endsWith("/page.tsx") || file === join(APP, "page.tsx"))
  .map(pageToRoute);

const sourceFiles = [];
for (const dir of SOURCE_DIRS) {
  sourceFiles.push(...(await walk(join(ROOT, dir))));
}

const violations = [];
const hrefPattern = /href\s*=\s*["'](\/[^"'#]*)["']/g;

for (const file of sourceFiles) {
  if (!EXTENSIONS.has(extname(file))) continue;

  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(hrefPattern)) {
    const raw = match[1];
    if (!raw || raw.startsWith("//")) continue;

    const target = raw.split("?")[0].replace(/\/$/, "") || "/";
    if (target.startsWith("/api/")) continue;

    const exists =
      routes.includes(target) ||
      routes.some((route) => route.includes("[") && matchesDynamic(route, target));

    if (!exists) {
      violations.push({
        file: relative(ROOT, file).split(sep).join("/"),
        href: raw,
      });
    }
  }
}

if (violations.length) {
  console.error("Broken static internal links found:");
  for (const item of violations) {
    console.error(`- ${item.file}: ${item.href}`);
  }
  process.exit(1);
}

console.log(`Internal link gate passed (${routes.length} app routes checked).`);
