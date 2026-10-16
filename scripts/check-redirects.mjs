#!/usr/bin/env node
//
// The redirects are declared twice, and each platform reads only its own file:
//
//   vercel.json        serves docs.getoptimum.xyz (production)
//   public/_redirects  serves the Cloudflare Workers preview, via .vitepress/dist
//
// Vercel ignores `_redirects`; Workers ignores `vercel.json`. So a rule added to
// one and not the other means a link that works on the preview and 404s in
// production, or the reverse -- and the preview is where the rule gets tested.
// This asserts the two tables agree.
//
// Run: node scripts/check-redirects.mjs   (or `make check-redirects`)

import { readFileSync } from 'node:fs'
// Imported rather than taken from the global: eslint's config for this repo
// declares no node globals, so a bare `process` is a lint error.
import process from 'node:process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Vercel writes a wildcard as `/:path*`, Workers as `/*`. Compared in the
 * Workers spelling so the two are the same key.
 */
const normalise = (source) => source.replace(/\/:[A-Za-z_]+\*$/, '/*')

/** Both platforms treat `/x` and `/x/` as the same route, so compare without it. */
const withoutTrailingSlash = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

function vercelTable() {
  const config = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'))
  const table = new Map()
  for (const r of config.redirects ?? []) {
    table.set(withoutTrailingSlash(normalise(r.source)), r.destination)
  }
  return table
}

function workersTable() {
  const table = new Map()
  const lines = readFileSync(join(ROOT, 'public/_redirects'), 'utf8').split('\n')
  for (const [i, raw] of lines.entries()) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const [source, destination, status] = line.split(/\s+/)
    if (!source || !destination) {
      throw new Error(`public/_redirects:${i + 1}: expected "<from> <to> [status]", got ${JSON.stringify(raw)}`)
    }
    // A redirect nothing can follow is worse than none: it reads as a working
    // rule in review and sends the reader nowhere.
    if (status && !/^3\d\d$/.test(status)) {
      throw new Error(`public/_redirects:${i + 1}: ${status} is not a redirect status`)
    }
    table.set(withoutTrailingSlash(source), destination)
  }
  return table
}

const vercel = vercelTable()
const workers = workersTable()
const problems = []

for (const [source, destination] of vercel) {
  if (!workers.has(source)) {
    problems.push(`${source} redirects in production but 404s on the preview (missing from public/_redirects)`)
  } else if (workers.get(source) !== destination) {
    problems.push(`${source} goes to ${destination} in production and ${workers.get(source)} on the preview`)
  }
}
for (const source of workers.keys()) {
  if (!vercel.has(source)) {
    problems.push(`${source} redirects on the preview but 404s in production (missing from vercel.json)`)
  }
}

if (problems.length > 0) {
  console.error('Redirect tables disagree:\n')
  for (const p of problems) console.error(`  - ${p}`)
  console.error('\nEvery rule belongs in BOTH vercel.json and public/_redirects.')
  process.exit(1)
}

console.log(`redirects OK: ${vercel.size} rules, identical in vercel.json and public/_redirects`)
