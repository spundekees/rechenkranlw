# Projektvorgaben und Entwicklungsrichtlinien

## Grundsätzliche Anforderungen

### Vor Beginn der Entwicklung

1. **Vor der Erstellung von Code sind zunächst ausreichend Rückfragen zu stellen**, um alle fachlichen und technischen Anforderungen vollständig zu verstehen.
2. **Es darf nicht unmittelbar mit der Programmierung begonnen werden.**
3. Vor Projektstart ist ein **Vorschlag für die technische Architektur sowie das zu verwendende Framework** zu erstellen und zu begründen.
4. Die Lösung muss über ein **Logging- und Debugging-Konzept** verfügen, sodass Fehler nachvollziehbar protokolliert werden können.
5. Es dürfen **ausschließlich kostenfreie und Open-Source-Komponenten** verwendet werden. Der Einsatz kostenpflichtiger Software, Bibliotheken, APIs oder SaaS-Dienste ist ausgeschlossen.

---

# Technologievorschlag

Vor Projektbeginn soll ein geeigneter Technologie-Stack vorgeschlagen und mit folgenden Kriterien begründet werden:

- Wartbarkeit
- Erweiterbarkeit
- Performance
- Community-Support
- Langfristige Verfügbarkeit
- Lizenzmodell (Open Source)

Beispielsweise sollten folgende Punkte bewertet werden:

- Backend-Framework
- Frontend-Framework (falls erforderlich)
- Datenbank
- Logging-Lösung
- Test-Framework
- CI/CD-Werkzeuge
- Containerisierung (z.B. Docker)

---

# Logging und Fehlersuche

## Anforderungen

- Sämtliche Fehler, Warnungen und relevante Systemereignisse müssen protokolliert werden.
- Log-Dateien müssen dauerhaft gespeichert werden können.
- Log-Level müssen konfigurierbar sein:
  - DEBUG
  - INFO
  - WARNING
  - ERROR
  - CRITICAL

- Jeder Fehler muss mindestens folgende Informationen enthalten:
  - Zeitstempel
  - betroffene Komponente
  - Fehlermeldung
  - Stacktrace (sofern verfügbar)

### Beispiel

```text
2026-10-29 13:15:22 | ERROR | auth.py | Login fehlgeschlagen
Traceback:
...
```

---

# Teststrategie

## Grundprinzip

Der Agent darf nur die tatsächlich betroffenen Komponenten testen und muss unnötige Testläufe vermeiden.

### Regeln

#### 1. Änderungsprüfung vor jedem Testlauf

Vor Ausführung von Tests muss geprüft werden:

- Welche Dateien seit dem letzten erfolgreichen Test verändert wurden.
- Welche Abhängigkeiten dadurch betroffen sind.

#### 2. Wiederverwendung erfolgreicher Testergebnisse

Komponenten, die:

- seit dem letzten erfolgreichen Test nicht verändert wurden und
- deren Abhängigkeiten unverändert geblieben sind,

dürfen nicht erneut getestet werden.

#### 3. Minimalprinzip

Es ist stets der kleinstmögliche Testumfang auszuführen.

| Änderung | Zulässiger Test |
|-----------|----------------|
| auth.py geändert | nur Authentifizierungs-Tests |
| API-Endpunkt geändert | nur entsprechende API-Tests |
| UI-Komponente geändert | nur zugehörige UI-Tests |

#### 4. Vollständige Test-Suites

Komplette Test-Suites sind ausschließlich zulässig:

- vor einem Release
- vor einem Merge nach main
- vor einem Merge nach master
- bei ausdrücklicher Anweisung

#### 5. Persistente Speicherung von Testergebnissen

Beispiel:

```json
{
  "auth.py": {
    "last_test": "2026-10-29T13:00:00",
    "result": "passed"
  },
  "database.py": {
    "last_test": "2026-10-29T13:02:00",
    "result": "passed"
  }
}
```

#### 6. Verpflichtende Nutzung von Test-Caching

- Incremental Testing
- Test-Caching
- Änderungsbasierte Testauswahl

---

# Anti-Hallucination- und Ausführungsrichtlinien

## 1. Grounding und Zero-Guesswork

### Ehrlichkeit vor Vollständigkeit

Wenn unklar ist:

- wie eine Funktion aussieht,
- welche Parameter sie erwartet,
- welche Version einer Bibliothek verwendet wird,
- welche interne Hilfsfunktion existiert,

muss dies ausdrücklich kommuniziert werden.

> „Ich weiß es nicht. Die Information muss zuerst überprüft werden.“

### Keine spekulative Entwicklung

Nicht erlaubt sind:

- frei erfundene Funktionen
- frei erfundene Klassen
- angenommene Module
- angenommene API-Endpunkte
- nicht nachgewiesene Bibliotheken

### Verifizierung bestehender Funktionen

Vor Verwendung bestehender interner Funktionen müssen deren Definitionen mittels grep, find oder rg geprüft werden.

---

## 2. Strikter Verifizierungsprozess

### „Beweise es“-Regel

Eine Aufgabe gilt nicht als abgeschlossen, nur weil Code geschrieben wurde.

Vor Abschluss müssen relevante Prüfungen erfolgreich durchgeführt werden:

- Linter
- Type Checker
- Unit Tests
- Integrationstests

### Teste jede Änderung

Existiert kein Test, ist dies ausdrücklich mitzuteilen und zu fragen, ob einer erstellt werden soll.

### Minimale Änderungen (Diff Constraints)

Nicht erlaubt sind:

- unnötige Refactorings
- großflächige Umstrukturierungen
- Änderungen außerhalb des beauftragten Umfangs

---

## 3. Wahrheitskalibrierung und Fehlerbehandlung

### Annahmen offenlegen

Bei jeder Lösung müssen genannt werden:

- Annahmen
- mögliche Nebenwirkungen
- potenzielle Breaking Changes
- bekannte Einschränkungen

### Fail-Fast-Prinzip

Falls ein Build oder Testlauf zweimal hintereinander fehlschlägt:

1. Sofort stoppen.
2. Unveränderten Fehlerlog präsentieren.
3. Keine weiteren automatischen Korrekturversuche.
4. Auf Anweisungen warten.

---

# Definition von „Fertig“

Eine Aufgabe gilt erst dann als abgeschlossen, wenn:

- alle Anforderungen geklärt wurden,
- nur notwendige Änderungen vorgenommen wurden,
- alle relevanten Prüfungen erfolgreich waren,
- Testergebnisse dokumentiert wurden,
- Risiken kommuniziert wurden,
- keine offenen Fehler bekannt sind.

Erst dann darf der Status **„Fertig“** vergeben werden.


## IT-Sicherheitsrichtlinien

### Security by Design

- Sicherheitsanforderungen sind bereits während der Architekturplanung zu berücksichtigen.
- Security hat denselben Stellenwert wie Funktionalität und Performance.
- Neue Features dürfen keine bestehenden Sicherheitsmechanismen umgehen oder abschwächen.

### Geheimnisse und Zugangsdaten

#### Verbot

Niemals im Quellcode speichern:

- Passwörter
- API-Keys
- Tokens
- Zertifikate
- Datenbankzugänge
- SSH-Keys

#### Verpflichtend

- Nutzung von .env-Dateien oder Secret Stores
- Sensible Werte ausschließlich über Umgebungsvariablen laden
- .env-Dateien müssen in .gitignore enthalten sein

### Logging

#### Nicht protokollieren

- Passwörter
- JWT-Tokens
- Session-IDs
- Kreditkartendaten
- personenbezogene Daten, soweit nicht erforderlich

#### Maskierung

Sensible Daten sind vor dem Schreiben in Logs zu maskieren.

### Abhängigkeiten

Vor Einsatz neuer Bibliotheken prüfen:

- Lizenz
- Wartungsstatus
- bekannte CVEs
- letzte Releases

Nicht einsetzen:

- verwaiste Projekte
- Bibliotheken ohne Community-Support
- Libraries mit bekannten kritischen Sicherheitslücken

### Eingabevalidierung

Alle Benutzereingaben müssen validiert werden.

Besondere Risiken:

- SQL Injection
- Command Injection
- Path Traversal
- XSS
- Deserialisierung

Niemals Benutzereingaben ungeprüft ausführen.

### Datenbankzugriffe

- Ausschließlich parametrisierte Queries verwenden.
- String-Konkatenation für SQL-Statements ist verboten.

### Dateizugriffe

Vor jedem Zugriff prüfen:

- Existenz
- Berechtigung
- erlaubtes Verzeichnis

Keine ungeprüften Pfadangaben von Benutzern verwenden.

### Kryptographie

Verpflichtend:

- TLS 1.2 oder höher
- AES-256 für ruhende Daten
- bcrypt, scrypt oder Argon2 für Passwort-Hashes

Verboten:

- MD5 zur Passwortspeicherung
- SHA1 zur Passwortspeicherung
- selbst entwickelte Kryptographie

### Sicherheitsprüfungen vor Abschluss

Vor Status „Fertig“:

- Dependency Scan
- Secret Scan
- SAST-Analyse
- relevante Security-Tests

Beispielwerkzeuge:

- Trivy
- Gitleaks
- Semgrep
- SonarQube Community
- OWASP Dependency Check

### OWASP-Anforderungen

Neue Webanwendungen müssen mindestens gegen die OWASP Top 10 geprüft werden.

### Datenschutz

- Datensparsamkeit beachten
- nur erforderliche Daten speichern
- Löschkonzepte berücksichtigen
- DSGVO-Anforderungen dokumentieren

### Definition von „Sicher Fertig"

Eine Aufgabe gilt nicht als abgeschlossen, wenn:

- Secrets im Repository enthalten sind
- kritische Sicherheitswarnungen ignoriert wurden
- Abhängigkeiten bekannte Critical CVEs enthalten
- Security-Tests fehlgeschlagen sind
- Anforderungen aus den OWASP-Prüfungen nicht erfüllt wurden

---

# Projektkontext: Rechenkran für LearningView

Antworte und kommentiere auf **Deutsch**. Zielgruppe: Grundschulkinder und ihre Lehrkräfte.

## Aufbau
- `index.html`: Rechenkran (Einmaleins, Plus/Minus) mit LearningView-Anbindung. `einmaleins-test.html`: 1·1-Test mit Auswertung nach Reihen.
- Je **eine HTML-Datei ohne Framework und ohne Laufzeit-Abhängigkeiten** (Begründung: `docs/ARCHITEKTUR.md`).
- LearningView-Schnittstelle: https://learningview.org/embed-api.php (vor Änderungen an der Anbindung lesen).
- Logging-Modul `LOG` und Eingabeprüfung (`sanitize*`) stehen in **beiden** HTML-Dateien und müssen gleich bleiben (`docs/LOGGING.md`).
- Alles, was von außen kommt (appTemplate, Speicherstände, localStorage, Adresse), wird geprüft. Speicherstände der Kinder gelten als **nicht vertrauenswürdig**.

## Prüfungen (siehe `docs/TESTS.md`)
- `npm run lint`, `node tests/extract.mjs && npm run sast`, `npm test` (nur geänderte, Test-Cache in `tests/test-results.json`).
- `npm run test:all` nur vor Release / Merge nach `main`.
- Secret-Scan: Gitleaks. Ergebnisse und OWASP-Bewertung in `docs/SICHERHEIT.md`; Datenschutz in `docs/DATENSCHUTZ.md`.

## Veröffentlichen
- `main` wird über GitHub Pages veröffentlicht (`https://spundekees.github.io/rechenkranlw/`). Änderungen zuerst auf einem eigenen Zweig; nach `main` erst nach vollständiger Testsuite.
- Lehrkräfte laden die HTML-Dateien in LearningView hoch (Abgabeform „keine“). Anleitung: `Anleitung-Einmaleins-Test.pdf`.
