const SERVER_URL = "/api/v1/challenges";


const socket = io();

socket.on("refreshGames", () => {
    fetchGames();
});

// Get all games from the database
function fetchGames() {
    fetch(`${SERVER_URL}/`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        let currentGames = [];
        data.data.games.forEach(game=>{
            currentGames.push({_id: game._id, name:game.name, finished: game.finished})
        })
        renderGames(currentGames);
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });
}

//Add game in the database
function callbackAddGame(){
    const input = document.getElementById('new-game')
    const name = input.value.trim()
    if (!name) return;

    fetch(`${SERVER_URL}/add-game`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name:name, finished:false}),
    })
    .then(response => response.json())
    .then(() => {
        // fetchGames();

    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });

}

//Delete a game from the database
function deleteGame(pStrId){
    fetch(`${SERVER_URL}/delete-game`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({_id: pStrId}),
    })
    .then(response => response.json())
    .then(() => {
        fetchGames();
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });
}

function toggleFinished(pGame){
    const name = pGame.name;
    const oldFinishedValue = pGame.finished;
    
    const finishedValue = !oldFinishedValue;

    fetch(`${SERVER_URL}/update-game`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: name, finished: finishedValue}),
    })
    .then(response => response.json())
    .then(() => {
        fetchGames();
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });
}

//Render all games from the database in a list
function renderGames(currentGames) {
    const list = document.getElementById('game-list')
    list.innerHTML = ''

    currentGames.forEach((game, idx) => {
        const li = document.createElement('li')

        const label = document.createElement('label')
        label.textContent = game.name
        label.onclick = () => toggleFinished(game);
        // Durchgeschrichene Linie
        if (game.finished) {
            label.classList.add("finished");
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn");
        deleteBtn.classList.add("delete");
        deleteBtn.onclick = () => deleteGame(game._id);
            
        li.appendChild(label)
        li.appendChild(deleteBtn)
        list.appendChild(li)
    })
}
