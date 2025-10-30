const SERVER_URL = "/api/v1/challenges";

const socket = io();
socket.on('refreshGames', () => {fetchGames()});

// Get all games from the database
function fetchGames() {
    fetch(`${SERVER_URL}/`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        let currentGames = [];
        data.data.games.forEach(game=>{
            currentGames.push({_id: game._id, name:game.name, finished: game.finished, currentStreak: game.currentStreak, neededWins: game.neededWins})
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
    const inputGame = document.getElementById('new-game')
    const name = inputGame.value.trim();

    const inputWins = document.getElementById('needed-wins');
    const wins = inputWins.value;
    if(!name || !wins) return; //Name and wins müssen gesetzt werden

    fetch(`${SERVER_URL}/add-game`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name:name, finished:false, currentStreak: 0, neededWins: wins}),
    })
    .then(response => response.json())
    .then(() => {
        // Clear the input after the game is added
        inputGame.value = "";  
        inputWins.value = 1;
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

function setFinished(pGame, pFinishedValue){
    const name = pGame.name;
    updateGame({ name: name, finished: pFinishedValue});

}

function updateGame(pGame){
    fetch(`${SERVER_URL}/update-game`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pGame),
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

    currentGames.forEach((game) => {
        // const li = document.createElement('li')
        const row = document.createElement('tr');

        //Name of game
        // const label = document.createElement('label');
        const labelCell = document.createElement('td');
        const labelSpan = document.createElement('span'); //span needed for finished class 
        labelSpan.textContent = game.name;
        labelCell.appendChild(labelSpan);
        // Durchgeschrichene Linie
        if (game.finished) {
            labelSpan.classList.add("finished");
        }

        //Counter: Current value / maxValue
        const counterCell = document.createElement('td');
        const winCounter = document.createElement("counter-label");
        winCounter.classList.add("score");
        winCounter.classList.add("btn");
        winCounter.textContent = `${game.currentStreak} / ${game.neededWins}`;
        winCounter.onclick = () => {
            let newStreakValue;
            if(game.currentStreak === game.neededWins){
                //Reset
                newStreakValue = 0;
                setFinished(game, false);
            }else{
                //Increase by 1
                newStreakValue = game.currentStreak + 1;
                if(newStreakValue === game.neededWins){
                    setFinished(game, true);
                    showRandomWinGif();
                }
            }
            updateGame({ name: game.name, currentStreak: newStreakValue});
        }
        counterCell.appendChild(winCounter);

        //Delete Button          
        const deleteCell = document.createElement('td');
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "delete");
        deleteBtn.onclick = () => deleteGame(game._id);
        deleteCell.appendChild(deleteBtn);

        row.appendChild(labelCell);
        row.appendChild(counterCell);
        row.appendChild(deleteCell);
        list.appendChild(row);
    })
}



//Gifs

const gifMap = [
    {name: "noice", src: "https://tenor.com/de/view/noice-nice-click-gif-8843762.gif"}
]

function showRandomWinGif() {
    const gif = document.createElement("img");
    gif.src = "https://tenor.com/de/view/noice-nice-click-gif-8843762.gif";
    gif.alt = "You Win!";
    gif.classList.add("win-gif");
    document.body.appendChild(gif);

    // Remove it after 3 seconds
    setTimeout(() => gif.remove(), 3000);
}