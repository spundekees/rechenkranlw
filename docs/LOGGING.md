# Logging- und Debugging-Konzept

Beide Anwendungen (`index.html`, `einmaleins-test.html`) enthalten dasselbe Logging-Modul `LOG`.
Es braucht keinen Server und keine Bibliothek.

## Format

```text
2026-11-26 17:46:28 | ERROR | lv | Speichern fehlgeschlagen: SAVE_FAILED
2026-11-26 17:46:30 | ERROR | window | Cannot read properties of undefined
Traceback:
TypeError: Cannot read properties of undefined
    at drop (…)
```

Jeder Eintrag enthält **Zeitstempel | Level | Komponente | Meldung** und bei Fehlern den **Stacktrace**.

## Log-Level

| Level | Verwendung (Beispiele) |
|---|---|
| `DEBUG` | Nachrichten an LearningView gesendet/empfangen, Speichervorgänge |
| `INFO` | Start und Modus, Runde/Test gestartet und beendet, Speicherstand geladen, Übungsempfehlung |
| `WARNING` | ungültige Daten verworfen, Klassendaten nicht verfügbar, Audio nicht verfügbar |
| `ERROR` | Speichern fehlgeschlagen, alle unbehandelten Fehler (`window.onerror`, `unhandledrejection`) |
| `CRITICAL` | vorgesehen für Zustände, in denen die Anwendung nicht weiterlaufen kann |

**Einstellen:**
- Standard: `WARNING` (im Alltag erscheinen nur Probleme in der Browser-Konsole)
- Über die Adresse: `?log=DEBUG` | `INFO` | `WARNING` | `ERROR` | `CRITICAL`
- `?debug=1` oder Tastenkombination **Strg + Alt + D**: Level `DEBUG` und ein **Log-Fenster** auf der Seite

## Dauerhaft speichern

Im Log-Fenster gibt es **„Herunterladen“**. Damit wird das Log als Datei gespeichert
(`Rechenkran-2026-11-26-17-46-28.log`). **„Kopieren“** legt es in die Zwischenablage,
z. B. für eine E-Mail an den Support. Im Speicher bleiben die letzten 1.000 Einträge.

**Einschränkung:** In LearningView laufen Inhalte in einer Sandbox ohne eigene Adresse. Dort lässt sich der
Debug-Modus nur mit **Strg + Alt + D** einschalten (Tastatur nötig). Ob LearningView Downloads aus dem
eingebetteten Inhalt zulässt, ist nicht geprüft; „Kopieren“ ist der Ausweichweg.
Ein automatisches Hochladen von Logs auf einen Server ist bewusst **nicht** vorgesehen (Datenschutz, kein Server).

## Was nicht protokolliert wird

Keine Namen, keine Schüler-IDs, keine Speicherstände, keine Antworten der Kinder.
Protokolliert werden nur Zustände, Zähler (z. B. „Speicherstand geladen: 3 Runden“) und Fehlermeldungen.
