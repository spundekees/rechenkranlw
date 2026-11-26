# Rechenkran für LearningView

Lernspiel für Grundschulkinder. Am Kran hängt eine Kiste mit einer Rechenaufgabe. Die Kinder fahren den Kran über den Laster mit dem richtigen Ergebnis und setzen die Kiste dort ab.

**Online spielen:** https://spundekees.github.io/rechenkranlw/
Offline genügt es, `index.html` im Browser zu öffnen. Es braucht keine Installation und kein Internet.

## Was man üben kann
**Einmaleins**
- Mal (·) und/oder Geteilt (:)
- 1er- bis 10er-Reihe, einzeln wählbar und frei kombinierbar

**Plus & Minus**
- Plus und/oder Minus
- Zahlenraum bis 10, bis 20 oder bis 100
- Bis 100 gibt es diese Aufgabenarten (frei kombinierbar):
  - Z ± Z (30 + 40)
  - ZE ± Z (34 + 20)
  - ZE ± E (34 + 5)
  - ZE ± ZE (34 + 25)
- Zehnerübergang: ohne, mit oder beides (bis 20 und bei ZE ± E / ZE ± ZE)

**Jahreszeiten:** Der Hintergrund passt sich automatisch der Jahreszeit an: Frühling mit Kirschblüten, Sommer mit Vögeln, Herbst mit fallendem Laub, Winter mit Schnee und Schneemann. Im Menü lässt sich die Jahreszeit auch fest einstellen.

Gewählte Aufgabenarten kommen ungefähr gleich oft dran. Dazu wählt man 12, 20, 32 oder 48 Aufgaben. Die Einstellungen werden im Browser gespeichert.

## Spielablauf
Fünf Laster fahren vor. Vier davon zeigen die Ergebnisse der nächsten 4 Aufgaben, einer ist ein Ablenker. Die Kisten mit den Aufgaben liegen im roten Container links neben dem Kran. Man fährt den leeren Haken über den Container, lässt ihn herunter und zieht eine Kiste heraus. Erst dann sieht man die Aufgabe und bringt die Kiste zum passenden Laster. Jede richtig abgesetzte Kiste bleibt auf ihrem Laster liegen. Erst wenn alle 4 Kisten aufgeladen sind, fahren die Laster ab und neue kommen.

## Bedienung
- **Computer:** mit `←` `→` fahren, mit `↓` oder der Leertaste absetzen.
- **iPad:** mit den Knöpfen unter dem Bild steuern. Man kann auch direkt auf einen Laster tippen, dann fährt der Kran dorthin.

## Hilfen
- Bei einem Fehler wird der falsche Laster ausgegraut und es erscheint ein Rechentipp. Beispiele: „Erst bis 40: 38 + 2, dann noch 3“ oder „Denk an die Malaufgabe: ? · 4 = 28“.
- Nach zwei Fehlern leuchtet der richtige Laster.
- Falsch gelöste Aufgaben kommen später noch einmal dran.
- Am Ende gibt es 1 bis 3 Sterne und den Knopf „Fehler üben“.

## Einbindung in LearningView
Diese Version ist an die [Embed API von LearningView](https://learningview.org/embed-api.php) angebunden. Außerhalb von LearningView funktioniert sie wie die normale Version, nur ohne Datenübertragung.

**Einrichten**
1. `index.html` herunterladen und in LearningView als HTML-Inhalt an eine Aufgabe anhängen.
2. Als Abgabeform der Aufgabe **„keine“** wählen. Sonst stehen Speicherstand und Klassenübersicht nicht zur Verfügung.
3. Im Aufgaben-Editor auf **„Einstellungen“** klicken und die Übung wählen: Einmaleins (Reihen, Mal/Geteilt) oder Plus & Minus (Zahlenraum, Aufgabenarten, Zehnerübergang) sowie die Anzahl der Aufgaben. Außerdem lässt sich festlegen:
   - **🔒 Übung fest:** Die Kinder rechnen genau diese Übung.
   - **🔓 Kinder dürfen ändern:** Die Übung ist voreingestellt, die Kinder können sie anpassen.
   
   Die Einstellungen werden automatisch gespeichert und gelten für diese Aufgabe. So lassen sich z. B. verschiedene Aufgaben für verschiedene Niveaus anlegen.

**Was gespeichert wird**
- Pro Kind jede gespielte Runde: Datum, Übung, Anzahl Aufgaben, Fehler, sofort richtig gelöste Aufgaben, Dauer und die falsch gerechneten Aufgaben.
- Abgebrochene Runden werden ebenfalls gespeichert und als „abgebrochen“ markiert.
- Die Jahreszeit richtet sich in LearningView immer automatisch nach dem Datum. Die Kinder können sie nicht auswählen.
- An LearningView gemeldet wird der Anteil der sofort richtig gelösten Aufgaben der letzten Runde. Er erscheint als Prozentwert auf der Aufgabenkachel.

**Übung per Link vorgeben:** Mit `?rows=7,8&ops=mul,div&count=20` in der Adresse startet der Rechenkran direkt mit dieser Übung (Einmaleins, Reihen, Mal/Geteilt, Anzahl 12/20/32/48). Die Kinder können sie dann nicht ändern.

**Ansicht für Lehrpersonen**
- **Einzelne Schülerlösung:** alle Runden des Kindes mit Übung, Fehlern und den falsch gerechneten Aufgaben.
- **Klassenübersicht** (Aufgabe im Kurs ohne ausgewählte Person öffnen): eine Tabelle mit allen Kindern, nämlich Runden, Aufgaben, Fehler, Anteil sofort richtig und die zuletzt gespielte Übung. Ein Tipp auf einen Namen zeigt alle Runden. LearningView fragt beim ersten Mal um Zustimmung, die Klassendaten anzuzeigen.

---

# 1 · 1 Test für LearningView (`einmaleins-test.html`)

Ein schlichter Einmaleins-Test mit großen Antwortknöpfen und hohem Kontrast, gedacht auch für Kinder, die schlecht sehen. Die Lehrkraft bekommt eine **Auswertung nach Reihen**.

**Für die Kinder**
- Sehr große Aufgaben und vier große Antwortknöpfe mit dicken Rahmen, ohne Animationen.
- Knöpfe „Dunkel“ (gelb auf schwarz) und „A+ Größer“. Die Wahl wird im Speicherstand gemerkt.
- Bedienbar per Antippen oder mit den Tasten 1–4. Die Aufgaben werden für Bildschirmleser angesagt.
- Keine sichtbare Zeit und kein Zeitdruck. Die Zeit wird nur für die Auswertung gemessen.
- Ein angefangener Test kann später fortgesetzt werden.

**Einstellungen der Lehrkraft** (im Aufgaben-Editor über „Einstellungen“)
- Reihen 1–10, Mal und/oder Geteilt.
- Aufgaben je Reihe: alle 10, 5 zufällige oder 3 zufällige.
- Den Test einmal oder beliebig oft machen lassen.
- Rückmeldung nach jeder Aufgabe (richtig/falsch) oder keine, also als echter Test.
- Das Ergebnis am Ende zeigen oder nicht.

**Auswertung**
- **Einzelne Schülerlösung:** jeder Testdurchgang mit einer Tabelle je Reihe: Mal und Geteilt (richtig/gesamt), Median der Antwortzeit und die Fehler samt Antwort des Kindes (z. B. „7 · 8 → 54“).
- **Klassenübersicht:** Kinder × Reihen als farbige Tabelle (grün ab 90 %, gelb 70–89 %, rot unter 70 %) mit Gesamtwert, Zeit und Datum, dazu eine Zeile „Klasse“ und die häufigsten Fehler in der Klasse. Ein Tipp auf einen Namen öffnet die Einzelauswertung.
- An die Aufgabenkachel wird der Anteil richtiger Antworten gemeldet.

**Ergebnis und Übungsempfehlung für das Kind**
- Am Ende sieht das Kind den Gesamtwert und jede Reihe mit Anzahl und Prozent. Dazu gibt es eine Rückmeldung: grün (ab 90 %) mit Lob, gelb (70–89 %) mit wohlwollendem Lob und dem Hinweis auf kleine Lücken, rot (unter 70 %) mit „Hier musst du noch üben.“
- Über **„Jetzt üben“** zeigt ein Übergabe-Dialog, was das Kind üben soll. Danach startet er den Rechenkran genau mit diesen Reihen und Rechenarten: zuerst die roten Reihen, sonst die gelben, sonst alle gemischt. Abschaltbar in den Einstellungen („Nach dem Test üben“).
- Der Rechenkran wird dafür über GitHub Pages geöffnet: `https://spundekees.github.io/rechenkranlw/?rows=7,8&ops=mul,div&count=20&from=test`. Die Übung dort wird nicht in LearningView gespeichert. GitHub Pages muss für dieses Repo eingeschaltet sein.


📄 **Anleitung für Lehrkräfte (PDF):** [Anleitung-Einmaleins-Test.pdf](Anleitung-Einmaleins-Test.pdf)

Die Einrichtung ist gleich wie beim Rechenkran: Datei an eine Aufgabe anhängen, Abgabeform **„keine“** wählen, dann über „Einstellungen“ den Test festlegen. Direkt geöffnet (ohne LearningView) erscheinen erst die Einstellungen, dann kann man den Test ohne Speichern ausprobieren.

---

## Entwicklung, Qualität und Sicherheit

| Thema | Dokument |
|---|---|
| Architektur und Technologie-Entscheidung | [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md) |
| Logging und Debug-Modus (`?debug=1` oder Strg+Alt+D) | [docs/LOGGING.md](docs/LOGGING.md) |
| Sicherheitsprüfung und OWASP Top 10 | [docs/SICHERHEIT.md](docs/SICHERHEIT.md) |
| Datenschutz (DSGVO) und Löschkonzept | [docs/DATENSCHUTZ.md](docs/DATENSCHUTZ.md) |
| Tests und Prüfbefehle | [docs/TESTS.md](docs/TESTS.md) |
| Projektvorgaben für die Entwicklung | [CLAUDE.md](CLAUDE.md) |

