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

**Ansicht für Lehrpersonen**
- **Einzelne Schülerlösung:** alle Runden des Kindes mit Übung, Fehlern und den falsch gerechneten Aufgaben.
- **Klassenübersicht** (Aufgabe im Kurs ohne ausgewählte Person öffnen): eine Tabelle mit allen Kindern, nämlich Runden, Aufgaben, Fehler, Anteil sofort richtig und die zuletzt gespielte Übung. Ein Tipp auf einen Namen zeigt alle Runden. LearningView fragt beim ersten Mal um Zustimmung, die Klassendaten anzuzeigen.
