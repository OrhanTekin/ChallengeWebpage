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
2.Stats page
    - wenn game completed wird -> tries einen erfolgereichen hinzufügen
    - Aufklappbar: Reihe mit Einträgen z.B. Fail Nr: 1, Erreichte Wins: 3/5, 
    - Wenn ich auf Reihe klicke soll sich Untertabelle öffnen und schließen -> oder rechts im Popup
4.Was wenn jmd ausversehen die Wins um einen erhöht hat? -> Kann man einen zurückgehen? denk an togglen
5.Bei Reset und Delete einen Confirm Dialog einfügen + (nicht mehr nachfragen Option) + (Reason of Failure Eingbe bei Reset)
6.Wenn alle Games completed werden, kommt z.B. Konfetti Animation und die Win Challenge wird auf Completed gesetzt
7.Wenn Enter in Games-Feld gedrückt wird dann füg auch Game hinzu
8. Neue listen element unten anlegen -> wenn du League hast und dann nochmal was mit L schreibst wird es nicht unten platziert


todo home:
1.Home Zeichen verbessern mit mehr Farben + Wind?
6. Start und End Datum (+ Zeit) von Nutzer auswählbar -> in win challenge list ist oben dann ein timer -> wenn timer auf 0 setz status von liste auf failed sonst auf (complete oder running)
7. Pack Status feld links rein: Setze svg icons für complete, ongoing, failed
8. Wenn Enter in List-Feld gedrückt wird dann füg auch Liste hinzu

