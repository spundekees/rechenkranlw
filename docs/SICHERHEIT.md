# Sicherheitsprüfung

Stand: 26.11.2026 · geprüft: `index.html`, `einmaleins-test.html` (Repo `rechenkranlw`)

## Durchgeführte Prüfungen

| Prüfung | Werkzeug (Lizenz) | Ergebnis |
|---|---|---|
| Secret-Scan der gesamten Git-Historie | Gitleaks 8.21.2 (MIT) | ✅ keine Funde (`rechenkranlw`: 17 Commits, `rechenkran`: 7 Commits) |
| Lint + SAST | ESLint 10.15.0 mit `eslint-plugin-security` (Apache-2.0), `eslint-plugin-no-unsanitized` (MPL-2.0) | vorher **40 Fehler / 58 Warnungen** → nachher **0** (Berichte in `pruefberichte/`) |
| SAST mit eigenen Regeln | Semgrep 1.187.0 (LGPL-2.1), Regeln in `.semgrep/rules.yml` | ✅ 0 Funde. Gegenprobe `tests/fixtures/semgrep-gegenprobe.js`: alle 7 Regeln schlagen an |
| Abhängigkeiten | `npm audit` | ✅ 0 Schwachstellen (ESLint auf 10.15.0 angehoben, weil 10.14.0 über `minimatch` eine mittlere Schwachstelle enthielt) |
| Sicherheitstests | Playwright-Tests mit manipulierten Daten (`tests/`) | ✅ bestanden |

Die Anwendungen selbst haben **keine Laufzeit-Abhängigkeiten**. Die Werkzeuge oben sind nur Entwicklungswerkzeuge.

## Gefundene und behobene Schwachstellen

| # | Schwachstelle | Risiko | Behebung |
|---|---|---|---|
| 1 | Einstellungen aus `appTemplate`, Speicherstand und `localStorage` wurden ungeprüft übernommen. Ein manipulierter Wert (z. B. eine „Reihe“ mit HTML) landete über die Sprechblase als HTML in der Seite → **XSS** | mittel (Lehrkraft-Einstellungen gelten als vertrauenswürdig; ein Kind kann aber seinen eigenen Speicherstand manipulieren) | `sanitizeSettings` / `sanitizeCfg`: nur bekannte Schlüssel, Zahlen in festen Bereichen, Werte aus festen Listen |
| 2 | Speicherstände der Kinder wurden in der **Lehrkraft-Ansicht** ungeprüft ausgewertet. Ein manipulierter Datensatz (z. B. `row: "__proto__"`) konnte die **Klassenübersicht zum Absturz bringen** | mittel (Verfügbarkeit) | `sanitizeState` / `sanitizeData`; Auswertung mit `Object.create(null)`; ungültige Daten werden als „Ungültiger Speicherstand“ angezeigt |
| 3 | HTML wurde an 15 Stellen per `innerHTML` aus Werten zusammengesetzt | niedrig nach #1 | Texte nur noch über `textContent` / DOM-Elemente. Ausnahme: dekoratives SVG aus festen Werten des Codes (markiert mit Begründung) |
| 4 | Leere `catch`-Blöcke verschluckten Fehler | niedrig | Fehler werden jetzt protokolliert (`LOG`) |

## OWASP Top 10 (2021): Bewertung

| Kategorie | Bewertung |
|---|---|
| A01 Broken Access Control | Zugriffsrechte setzt **LearningView** durch (Schüler: nur eigener Stand; Lehrkraft: lesen; Klassendaten nur nach Zustimmung). Die Anwendung erweitert keine Rechte. ✅ |
| A02 Cryptographic Failures | Keine eigenen Geheimnisse oder Passwörter. Übertragung über HTTPS (LearningView, GitHub Pages). ✅ |
| A03 Injection (inkl. XSS) | Behoben (#1, #3). Kein `eval`, keine dynamische Codeausführung (Semgrep-Regel). Namen und gespeicherte Texte nur als Text. ✅ |
| A04 Insecure Design | Speicherstände der Kinder gelten als nicht vertrauenswürdig und werden geprüft (#2). ✅ |
| A05 Security Misconfiguration | `postMessage` nur an `https://learningview.org`, Antworten werden auf Quelle **und** Origin geprüft (Semgrep-Regeln). ✅ |
| A06 Vulnerable Components | Keine Laufzeit-Abhängigkeiten. Entwicklungswerkzeuge: `npm audit` 0 Funde. ✅ |
| A07 Identification & Authentication | Keine eigene Anmeldung; erfolgt über LearningView. – |
| A08 Software & Data Integrity | Gespeicherte Daten werden vor Verwendung geprüft. Kein Nachladen von Fremd-Skripten. ✅ |
| A09 Logging & Monitoring | Logging-Modul mit Log-Leveln (siehe [LOGGING.md](LOGGING.md)). Kein zentrales Monitoring (kein Server). ⚠️ eingeschränkt |
| A10 SSRF | Kein Server. – |

## Bekannte Einschränkungen

- Ein Kind kann seinen **eigenen** Speicherstand mit Browser-Werkzeugen verändern (z. B. bessere Ergebnisse
  vortäuschen). Das lässt sich ohne eigenen Server nicht verhindern; die Daten werden aber so geprüft, dass
  dadurch kein Schaden an der Anwendung oder bei der Lehrkraft entsteht.
- Kein Content-Security-Policy-Header möglich (Auslieferung durch LearningView bzw. GitHub Pages).
- Es wurde **nicht** im echten LearningView getestet, sondern mit einem Nachbau des Elternfensters nach der
  veröffentlichten Schnittstellenbeschreibung.
