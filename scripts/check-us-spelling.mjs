// Fails when the docs use a British spelling: a word the US dictionary rejects, the matched
// British one accepts, and that has a close US spelling the British dictionary rejects
// (organisation/organization). Names and jargon are in neither dictionary, so they pass.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const dictDir = process.env.SPELLING_DICT_DIR ?? ".cache/dictionaries";
const US = join(dictDir, "en_US");
const GB = join(dictDir, "en_GB-ise");
const IGNORE = "spelling-ignore-next-line";
const WORD = /\p{L}+(?:['’]\p{L}+)*/gu;

const blank = (s) => s.replace(/[^\n]/g, " ");

// Code, link targets, URLs and tag attributes are not prose; blank them so line numbers hold.
function prose(markdown) {
  return markdown
    .replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, blank)
    .replace(/`[^`\n]*`/g, blank)
    .replace(/\]\([^)\n]*\)/g, blank)
    .replace(/https?:\/\/\S+/g, blank)
    .replace(/<[^>]*>/g, blank);
}

function hunspell(args, words) {
  return execFileSync("hunspell", args, { input: words.join("\n") + "\n", encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
}

const files = execFileSync("git", ["ls-files", "*.md", ".vitepress/config.mts"], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const occurrences = [];
for (const file of files) {
  const raw = readFileSync(file, "utf8");
  const lines = (file.endsWith(".md") ? prose(raw) : raw).split("\n");
  const rawLines = raw.split("\n");
  lines.forEach((line, i) => {
    if (i > 0 && rawLines[i - 1].includes(IGNORE)) return;
    for (const [word] of line.matchAll(WORD)) occurrences.push({ file, line: i + 1, word });
  });
}

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const next = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = row[j];
      row[j] = next;
    }
  }
  return row[b.length];
}

const unique = [...new Set(occurrences.map((o) => o.word))];
const rejectedByUs = hunspell(["-d", US, "-l"], unique);
const candidates = rejectedByUs.length ? hunspell(["-d", GB, "-G"], rejectedByUs) : [];

// The dictionaries also differ on a few non-variant words (prev, coastguard), so require a
// close US form, same first three letters, that British English rejects.
// `hunspell -a` answers "& word n offset: s1, s2" for each misspelling.
const isClose = (a, b) => a.slice(0, 3) === b.slice(0, 3) && distance(a, b) <= 2;
const closeUs = new Map();
for (const row of candidates.length ? hunspell(["-d", US, "-a"], candidates) : []) {
  const m = row.match(/^& (\S+) \d+ \d+: (.+)$/);
  if (!m) continue;
  const near = m[2].split(", ").filter((s) => isClose(s.toLowerCase(), m[1].toLowerCase()));
  if (near.length) closeUs.set(m[1], near);
}
const rejectedByGb = new Set(closeUs.size ? hunspell(["-d", GB, "-l"], [...new Set([...closeUs.values()].flat())]) : []);
const suggestion = new Map();
for (const [word, near] of closeUs) {
  const us = near.find((s) => rejectedByGb.has(s));
  if (us) suggestion.set(word, us);
}

if (suggestion.size === 0) process.exit(0);

for (const { file, line, word } of occurrences.filter((o) => suggestion.has(o.word))) {
  console.log(`${file}:${line}: '${word}' is British spelling; US: ${suggestion.get(word)}`);
}
console.log(`\nUse American spelling. For a deliberate exception, put '${IGNORE}' in a comment on the line above.`);
process.exit(1);
