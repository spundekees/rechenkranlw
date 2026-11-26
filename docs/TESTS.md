# Tests und Prüfungen

## Einrichten (einmalig)

```bash
npm ci
npx playwright install chromium   # nur nötig, wenn noch kein passender Chromium installiert ist
pip install semgrep               # für die SAST-Prüfung
```

## Befehle

| Befehl | Was |
|---|---|
| `npm run lint` | ESLint mit Sicherheitsregeln über alle HTML- und Testdateien |
| `node tests/extract.mjs && npm run sast` | JavaScript aus den HTML-Dateien ziehen und mit den eigenen Semgrep-Regeln prüfen |
| `npm test` | **nur geänderte** Testdateien ausführen (Test-Cache) |
| `npm run test:all` | **alle** Tests (vor einem Release und vor jedem Merge nach `main`) |
| `npm run check` | Lint, SAST und geänderte Tests nacheinander |

## Test-Cache (änderungsbasierte Testauswahl)

Jede Testdatei nennt in ihrer ersten Zeile, welche Dateien sie prüft, z. B. `// deps: index.html`.
`tests/run.mjs` bildet einen SHA-256-Hash über die Testdatei, `tests/helpers.mjs` und diese Abhängigkeiten.
Ist der Hash gleich wie beim letzten **erfolgreichen** Lauf, wird die Testdatei übersprungen.
Die Ergebnisse stehen dauerhaft in `tests/test-results.json`:

```json
"tests/rechenkran.test.mjs": { "last_test": "2026-11-26T17:47:35", "result": "passed", "hash": "…", "deps": ["index.html"] }
```

## Testdateien

| Datei | prüft | Inhalt |
|---|---|---|
| `rechenkran.test.mjs` | `index.html` | Spielablauf mit Container und Lastern bis zum Ende, Übung per Link, Eingabeprüfung (Link, localStorage), Logging |
| `rechenkran-lv.test.mjs` | `index.html` | in nachgebautem LearningView: Speichern und Ergebnis, Klassenübersicht mit manipulierten Daten, Einzelansicht, Einstellungen, manipuliertes appTemplate |
| `einmaleins-test.test.mjs` | `einmaleins-test.html` | Testablauf, Ergebnis mit Prozent und Rückmeldung, Übergabe an den Rechenkran, „nur einmal“, Klassenübersicht mit Prozent und manipulierten Daten, Einstellungen, Darstellung von 270 px bis 1180 px Breite, Logging |
| `fixtures/semgrep-gegenprobe.js` | `.semgrep/rules.yml` | absichtlich unsicherer Code; jede Semgrep-Regel muss hier anschlagen |

**LearningView-Nachbau:** `tests/helpers.mjs` stellt das Elternfenster nach der veröffentlichten
[Embed API](https://learningview.org/embed-api.php) nach (`saveAnswerData`, `getAnswerData`, `saveAppTemplate`,
`getClassAnswerData` inkl. `classDataConsentPending`). Das echte LearningView wird **nicht** getestet.

## Letzter vollständiger Lauf

Siehe `tests/test-results.json` und die GitHub-Actions-Läufe (`.github/workflows/pruefung.yml`).
