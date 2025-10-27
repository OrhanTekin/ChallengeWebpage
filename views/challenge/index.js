const SERVER_URL = "/api/v1/challenges";

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
        fetchGames();
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
        // deleteBtn.textContent = "Delete"   
        deleteBtn.classList.add("btn");
        deleteBtn.classList.add("delete");
        deleteBtn.onclick = () => deleteGame(game._id);
//         deleteBtn.innerHTML = `
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="currentColor">
//   <g data-name="70-Trash">
//     <path d="m29.89 6.55-1-2A1 1 0 0 0 28 4h-7V2a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v2H4a1 1 0 0 0-.89.55l-1 2A1 1 0 0 0 3 8h2v22a2 2 0 0 0 .47 1.41A2 2 0 0 0 7 32h18a2 2 0 0 0 2-2V8h2a1 1 0 0 0 .89-1.45zM13 2h6v2h-6zm12 28H7V8h18z"/>
//     <path d="M17 26V10a2 2 0 0 0-2 2l.06 14H15v2a2 2 0 0 0 2-2zM22 26V10a2 2 0 0 0-2 2l.06 14H20v2a2 2 0 0 0 2-2zM12 26V10a2 2 0 0 0-2 2l.06 14H10v2a2 2 0 0 0 2-2z"/>
//   </g>
// </svg>
// `;

            

        //li.appendChild(checkbox)
        li.appendChild(label)
        li.appendChild(deleteBtn)
        list.appendChild(li)
    })
}
