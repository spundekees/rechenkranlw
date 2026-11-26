# Datenschutz (DSGVO)

> Diese Übersicht ist eine technische Beschreibung als Grundlage für die Schule bzw. den Datenschutzbeauftragten.
> Sie ersetzt keine rechtliche Prüfung.

## Welche Daten wo gespeichert werden

| Daten | Wo | Wer sieht sie | Personenbezug |
|---|---|---|---|
| Speicherstand Rechenkran: je Runde Datum, Übung, Anzahl Aufgaben, Fehler, sofort richtig, Dauer, falsch gerechnete Aufgaben, Sterne | LearningView (`answerData`, pro Kind und Aufgabe) | das Kind selbst, die Lehrkraft | ja, über die Zuordnung in LearningView |
| Speicherstand 1·1-Test: je Durchgang die Aufgaben, die gewählten Antworten, Antwortzeiten, Datum | LearningView (`answerData`) | das Kind selbst, die Lehrkraft | ja, über die Zuordnung in LearningView |
| Ansicht „Dunkel“/„Größer“ (1·1-Test) | im Speicherstand des Kindes | das Kind | ja, kann auf eine Sehbeeinträchtigung hindeuten (siehe unten) |
| Einstellungen der Lehrkraft | LearningView (`appTemplate`, pro Aufgabe) | alle in der Aufgabe | nein |
| Ergebnis in Prozent | LearningView (Aufgabenkachel) | Kind, Lehrkraft | ja |
| Einstellungen (Reihen, Ton, Jahreszeit) bei Nutzung **ohne** LearningView | `localStorage` des Geräts | nur auf diesem Gerät | nein |
| Namen und IDs der Kinder | **nur in LearningView**. Die Anwendungen erhalten sie in der Klassenübersicht nach Zustimmung der Lehrkraft, zeigen sie an und **speichern sie nicht** | Lehrkraft | ja |

**Datensparsamkeit:** In den Speicherständen stehen keine Namen und keine IDs. Die Logs enthalten keine
personenbezogenen Daten (siehe [LOGGING.md](LOGGING.md)).

## Weitergabe an Dritte

| Dienst | Wann | Welche Daten |
|---|---|---|
| **LearningView** (PH Schwyz) | immer in LearningView | alle Speicherstände; Verantwortung und Vertrag wie bei der übrigen Nutzung von LearningView |
| **GitHub Pages** (GitHub Inc. / Microsoft, USA) | Aufruf von `spundekees.github.io` – also bei Nutzung ohne LearningView **und** wenn ein Kind im 1·1-Test auf **„Jetzt üben“** tippt | Beim Laden der Seite übermittelt der Browser technisch die **IP-Adresse** und Browserdaten an GitHub. GitHub protokolliert IP-Adressen. Es werden **keine** Ergebnisse oder Namen übertragen; die Adresse enthält nur die zu übenden Reihen (z. B. `?rows=7,8&ops=mul`). |

⚠️ **Handlungsbedarf für die Schule:** Die Übermittlung der IP-Adresse an GitHub (Drittland USA) sollte mit dem
Datenschutzbeauftragten geklärt werden. Alternativen:
1. In den Einstellungen des 1·1-Tests **„Nach dem Test üben: nicht anbieten“** wählen. Dann wird GitHub nicht aufgerufen.
2. Den Rechenkran **zusätzlich als eigene Aufgabe in LearningView** hochladen und die Kinder dort üben lassen.
   Dann läuft alles in LearningView (und die Übung wird auch gespeichert).
3. Den Rechenkran auf einem Server der Schule bzw. des Schulträgers bereitstellen und `PRACTICE_URL` in
   `einmaleins-test.html` anpassen.

## Löschkonzept

| Daten | Löschung |
|---|---|
| Speicherstände in LearningView | über LearningView (Löschen der Aufgabe bzw. des Kurses, Löschfristen von LearningView). Die Anwendungen speichern nichts außerhalb von LearningView. |
| Begrenzung innerhalb des Speicherstands | Rechenkran: ältere Runden werden entfernt, wenn der Speicher (1 MiB) knapp wird. 1·1-Test: höchstens 200 Durchgänge werden ausgewertet. |
| `localStorage` (nur ohne LearningView) | Browserdaten des Geräts löschen. Enthält nur Einstellungen. |
| Logs | nur im Arbeitsspeicher des Browsers; weg beim Schließen. Heruntergeladene Log-Dateien löscht, wer sie gespeichert hat. |
| GitHub-Server-Logs (IP-Adressen) | liegen bei GitHub; Löschung nach deren Richtlinien, nicht durch die Schule steuerbar. |

## Besondere Kategorien (Art. 9 DSGVO)

Die Wahl von „Dunkel“/„Größer“ im 1·1-Test kann Rückschlüsse auf eine **Sehbeeinträchtigung** zulassen
(Gesundheitsdaten). Gespeichert wird sie nur im Speicherstand des Kindes in LearningView und **nicht** in der
Auswertung angezeigt. Soll auch das vermieden werden, kann die Speicherung dieser Ansicht entfernt werden
(dann muss das Kind sie bei jedem Öffnen neu wählen).
