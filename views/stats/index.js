const SERVER_URL = "/api/v1/challenges";

const socket = io();
socket.on('refreshGames', () => {fetchGames()});


// Get all games from the database
function fetchGames() {
    //Get games with matching list id
    const params = new URLSearchParams(window.location.search);
    const listId = params.get("id");

    fetch(`${SERVER_URL}/${listId}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        let currentGames = [];
        data.data.games.forEach(game=>{
            currentGames.push({_id: game._id,
                name:game.name,
                status:game.status,
                neededWins: game.neededWins,
                failCount: game.failCount,
                tries: game.tries
            })
        })
        renderGames(currentGames);
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });
}

function renderGames(currentGames){
    const list = document.getElementById('stat-list')
    list.innerHTML = ''

    //A row for each game
    currentGames.forEach((game) => {
        const row = document.createElement('tr');
        // row.classList.add("clickable-row");

        //Label
        const labelCell = document.createElement('td');
        labelCell.textContent = game.name;

        const failCountCell = document.createElement('td');
        failCountCell.textContent = game.failCount;
        failCountCell.classList.add("failCell");

        const statusCell = document.createElement('td');
        statusCell.textContent = game.status;

        row.append(labelCell, failCountCell, statusCell);
        list.appendChild(row);

        // --- Toggle subtable on click
        row.addEventListener("click", () => {
            const subListStats = document.createElement("tbody");

            game.tries.forEach((tryEntry, index) => {
                const tryRow = document.createElement("tr");

                const attemptCell = document.createElement("td");
                attemptCell.textContent = tryEntry.attempt;

                const streakCell = document.createElement("td");
                streakCell.textContent = tryEntry.streak;

                const resultCell = document.createElement("td");
                resultCell.textContent = tryEntry.result;

                const failureReasonCell = document.createElement("td");
                failureReasonCell.textContent = tryEntry.failureReason;

                tryRow.append(attemptCell, streakCell, resultCell, failureReasonCell);
                subListStats.appendChild(tryRow);
                list.appendChild(subListStats)
            });
        });

    })
}

function setListBtn(){
    const params = new URLSearchParams(window.location.search);
    const listId = params.get("id");

    const aList = document.getElementById('list');
    aList.href = `/challenge/index.html?id=${listId}`;
}