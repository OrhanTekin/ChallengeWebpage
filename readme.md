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
1.Man kann nicht mehr bei vollen Wins mit nächsten Klick zurücksetzen, sondern neuer "Fail"-Button. Speicher in Datenbank wie oft gefailed wurde und wie viele wins man hatte beim fail
2.Stats page
    - Tabelle mit: Game Name, FailCount, Status: Completed, Failed
    - wenn game completed wird -> tries einen erfolgereichen hinzufügen
    - Aufklappbar: Reihe mit Einträgen z.B. Fail Nr: 1, Erreichte Wins: 3/5, 
3.Button unten links führen zu Stats von dieser einen Win Challenge
4.Was wenn jmd ausversehen die Wins um einen erhöht hat? -> Kann man einen zurückgehen? denk an togglen
5.Bei Reset und Delete einen Confirm Dialog einfügen + (nicht mehr nachfragen Option) + (Reason of Failure Eingbe bei Reset)
6.Wenn alle Games completed werden, kommt z.B. Konfetti Animation und die Win Challenge wird auf Completed gesetzt


todo home:
1.Home Zeichen verbessern mit mehr Farben + Wind?
2.Liste von Win Challenges anzeigen und auswählbar
3.Neue Listen können angelegt und gelöscht werden
4.Listen werden als Tabelle angezeigt: Nr. , Name, Status: Completed oder Failed 
5.Stretch Namen der List auf die gleiche Länge

