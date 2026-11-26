# Architektur und Technologie-Entscheidung

> Hinweis: Dieses Dokument wurde **nachträglich** erstellt. Die Projektvorgaben (`CLAUDE.md`) verlangen einen
> Architekturvorschlag *vor* Projektbeginn. Das ist beim Rechenkran nicht geschehen. Die Entscheidung wird hier
> rückwirkend begründet und gegen Alternativen abgewogen.

## Anforderungen, die die Architektur bestimmen

| Anforderung | Quelle |
|---|---|
| Läuft als **eine hochgeladene HTML-Datei** in LearningView („Interaktiven Inhalt möglichst als einzelne HTML-Datei erzeugen“) | [LearningView Embed API](https://learningview.org/embed-api.php), Abschnitt 01 |
| Speicherung von Ergebnissen **in LearningView** (`saveAnswerData`), kein eigener Server nötig | Embed API, Abschnitt 03 |
| Läuft auf iPad, Computer und Handy, auch **offline** als Datei | Nutzeranforderung |
| Nur **kostenfreie Open-Source-Komponenten** | `CLAUDE.md` |
| Grundschulkinder: keine Anmeldung, keine Installation | Nutzeranforderung |

## Gewählte Lösung

**Reines HTML, CSS und JavaScript in je einer Datei, ohne Framework, ohne Build-Schritt und ohne Backend.**

```
LearningView (Elternfenster, https://learningview.org)
   │  postMessage (feste Origin, Antworten geprüft)
   ▼
index.html (Rechenkran)              einmaleins-test.html (1·1-Test)
 ├─ Logging-Modul (LOG)               ├─ Logging-Modul (LOG)
 ├─ Eingabeprüfung (sanitize*)        ├─ Eingabeprüfung (sanitize*)
 ├─ Spiel / Aufgabenlogik             ├─ Test / Auswertung nach Reihen
 └─ LearningView-Anbindung            └─ LearningView-Anbindung
        │                                    │ „Jetzt üben“: Link mit ?rows=…&ops=…
        └──────────── GitHub Pages ◄─────────┘
```

Daten liegen ausschließlich in LearningView (`answerData` pro Kind und Aufgabe, `appTemplate` pro Aufgabe).
Ohne LearningView merkt sich der Rechenkran nur Einstellungen im `localStorage` des Geräts.

## Bewertung der Bausteine

| Baustein | Entscheidung | Wartbarkeit | Erweiterbarkeit | Performance | Community | Verfügbarkeit | Lizenz |
|---|---|---|---|---|---|---|---|
| Backend | **keines**: LearningView speichert | entfällt | – | – | – | – | – |
| Frontend | **Vanilla JS** (Web-Standards) | mittel: eine große Datei je Anwendung | mittel | sehr gut: keine Abhängigkeiten, < 100 KB | Web-Standard | unbegrenzt (Browser-Standard) | – |
| Datenbank | **keine**: `answerData`/`appTemplate` von LearningView | – | begrenzt auf 1 MiB je Kind | gut | – | abhängig von LearningView | – |
| Logging | **eigenes Modul** `LOG` (≈ 70 Zeilen), siehe [LOGGING.md](LOGGING.md) | gut | gut | sehr gut | – | – | eigener Code |
| Tests | **Node.js-Test-Runner** (`node:test`) + **Playwright** 1.63.0 | gut | gut | gut | sehr groß | sehr gut (Microsoft / Node.js) | MIT / Apache-2.0 |
| Lint / SAST | **ESLint** 10.15.0 + `eslint-plugin-security` + `eslint-plugin-no-unsanitized` + **Semgrep** (eigene Regeln) | gut | gut | gut | groß | gut | MIT / Apache-2.0 / MPL-2.0 / LGPL-2.1 |
| Secret-Scan | **Gitleaks** 8.21.2 | gut | – | sehr gut | groß | gut | MIT |
| CI/CD | **GitHub Actions** (für öffentliche Repos kostenlos), Hosting **GitHub Pages** | gut | gut | gut | sehr groß | gut | kostenloser Dienst (nicht Open Source) |
| Container | **keiner**: Es gibt keinen Server, der betrieben werden müsste | – | – | – | – | – | – |

### Verworfene Alternativen

| Alternative | Warum nicht |
|---|---|
| React / Vue / Svelte mit Build (Vite) | Mehr Abhängigkeiten und ein Build-Schritt; das Ergebnis müsste wieder zu *einer* Datei gebündelt werden. Für 2 kleine Anwendungen ohne geteilte Komponenten kein Gewinn. Würde bei deutlich mehr Spielen sinnvoll (siehe unten). |
| Eigenes Backend (Node.js/Express, Python/FastAPI) + Datenbank (PostgreSQL/SQLite) | Personenbezogene Daten müssten selbst gespeichert, gesichert und DSGVO-konform betrieben werden. LearningView übernimmt das bereits. |
| Docker | Nur sinnvoll für Server. Für statische Dateien unnötig. |
| Semgrep-Regelsammlung von semgrep.dev | Lizenz „Semgrep Rules License“ ist **nicht Open Source**. Deshalb eigene Regeln in `.semgrep/rules.yml`. |

## Bekannte Schwächen dieser Architektur

1. **Doppelter Code:** Logging-Modul und LearningView-Hilfen stehen in beiden HTML-Dateien. Änderungen müssen
   in beiden Dateien gemacht werden (die Tests prüfen beide).
2. **Große Einzeldateien** (index.html ≈ 1.700 Zeilen). Bei weiterem Wachstum empfiehlt sich ein Build-Schritt
   (z. B. Vite, MIT-Lizenz), der aus mehreren Quelldateien wieder *eine* HTML-Datei erzeugt.
3. **Übung nach dem Test** läuft über GitHub Pages außerhalb von LearningView. Die Übung wird dort nicht
   gespeichert (siehe [DATENSCHUTZ.md](DATENSCHUTZ.md)).
