// Testlauf mit Test-Cache: Es laufen nur Testdateien, deren Inhalt oder Abhängigkeiten sich seit dem
// letzten erfolgreichen Lauf geändert haben. Ergebnisse stehen in tests/test-results.json.
// Aufruf: node tests/run.mjs        → nur geänderte
//         node tests/run.mjs --all  → alle (vor Release / Merge nach main)
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './helpers.mjs';

const RESULTS = join(ROOT, 'tests', 'test-results.json');
const all = process.argv.includes('--all');
// eslint-disable-next-line security/detect-non-literal-fs-filename -- fester Pfad im Repo
const cache = existsSync(RESULTS) ? JSON.parse(readFileSync(RESULTS, 'utf8')) : {};
// eslint-disable-next-line security/detect-non-literal-fs-filename -- fester Ordner im Repo
const files = readdirSync(join(ROOT, 'tests')).filter(f => f.endsWith('.test.mjs')).sort();

// eslint-disable-next-line security/detect-non-literal-fs-filename -- nur Dateien aus dem Repo
const read = (rel) => readFileSync(join(ROOT, rel));
function hashFor(testFile) {
  const src = read(`tests/${testFile}`).toString();
  const deps = ((src.match(/^\/\/ deps: (.+)$/m) || [])[1] || '').split(',').map(s => s.trim()).filter(Boolean);
  const h = createHash('sha256');
  for (const f of [`tests/${testFile}`, 'tests/helpers.mjs', ...deps]) h.update(f).update(read(f));
  return { hash: h.digest('hex'), deps };
}

let failed = 0, ran = 0;
for (const f of files) {
  const { hash, deps } = hashFor(f);
  const key = `tests/${f}`, prev = cache[key];
  if (!all && prev && prev.result === 'passed' && prev.hash === hash) {
    console.log(`⏭  ${f}: unverändert seit ${prev.last_test}, übersprungen`);
    continue;
  }
  console.log(`▶  ${f} (prüft: ${deps.join(', ')})`);
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=spec', join(ROOT, 'tests', f)], { stdio: 'inherit' });
  ran++;
  const result = r.status === 0 ? 'passed' : 'failed';
  if (result === 'failed') failed++;
  cache[key] = { last_test: new Date().toISOString().slice(0, 19), result, hash, deps };
}
// eslint-disable-next-line security/detect-non-literal-fs-filename -- fester Pfad im Repo
writeFileSync(RESULTS, JSON.stringify(cache, null, 2) + '\n');
console.log(`\n${ran} Testdatei(en) ausgeführt, ${files.length - ran} aus dem Cache, ${failed} fehlgeschlagen.`);
process.exit(failed ? 1 : 0);
