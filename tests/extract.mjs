// Zieht das JavaScript aus den HTML-Dateien in tests/.extracted/*.js (für Semgrep und Syntaxprüfung).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'tests', '.extracted');
mkdirSync(out, { recursive: true });
for (const file of ['index.html', 'einmaleins-test.html']) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- feste Dateinamen aus der Liste oben
  const html = readFileSync(join(root, file), 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  if (!scripts.length) throw new Error(`${file}: kein <script>-Block gefunden`);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- Ziel liegt fest in tests/.extracted
  writeFileSync(join(out, file.replace(/\.html$/, '.js')), scripts.join('\n;\n'));
  console.log(`${file}: ${scripts.length} Skript-Block(e) herausgezogen`);
}
