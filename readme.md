What I used:

* node.js and npm (npx)
* express.js 
* nodemon
* npx eslint --init
* mongodb
* socket.io
* UptimeRobot to ping site all 5 min


Start Server locally:
npm run dev

todo Games List:
(Bearbeite Local)
4.Was wenn jmd ausversehen die Wins um einen erhöht hat? -> Kann man einen zurückgehen? denk an togglen
5.Bei Reset und Delete einen Confirm Dialog einfügen + (nicht mehr nachfragen Option) + (Reason of Failure Eingbe bei Reset) + (Reason failure bei stats muss scrollbar sein)
6.Wenn alle Games completed werden, kommt z.B. Konfetti Animation und die Win Challenge wird auf Completed gesetzt
8. Neue listen element unten anlegen -> wenn du League hast und dann nochmal was mit L schreibst wird es nicht unten platziert
9.Verbessere Timer (chatgpt vorschlag) + feature card verbessern + Timer kurz vor Ende rot machen
10. Bei Liste anlegen mach Button wo du sagen kannst wie lange Challenge gehen kann (3 Tag,6 Tage, eigene Auswahl)
11. Vielleicht Header in Liste anzeigen reinpacken (füge auch Start und End Datum hinzu)


todo home:
1.Home Zeichen verbessern mit mehr Farben + Wind?
6. Start und End Datum (+ Zeit) von Nutzer auswählbar -> in win challenge list ist oben dann ein timer -> wenn timer auf 0 setz status von liste auf failed sonst auf (complete oder running)
7. Pack Status feld links rein: Setze svg icons für complete, ongoing, failed
8. End date einfügen + Länge der Felder fixen
9. Fix Timer: setTimer wird nur aufgerufen wenn Liste ausgewählt wird -> wenn Timer gleich 0 ist wird das Feld erst von "Ongoing" auf "Failed" gesetzt wenn die Liste ausgewählt wird

