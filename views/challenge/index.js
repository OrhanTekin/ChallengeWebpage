const SERVER_URL = "/api/v1/challenges";

const socket = io();
socket.on('refreshGames', () => {fetchGames()});
socket.on('showWinGif', (data) => {
    showWinGif(data.index);
});

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
            currentGames.push({_id: game._id, name:game.name, gifLink: game.gifLink,
                status: game.status, currentStreak: game.currentStreak,
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

//Add game in the database
function callbackAddGame(){
    const inputGame = document.getElementById('new-game')
    const name = inputGame.value.trim();

    const inputGif = document.getElementById('new-gif');
    let gifInputValue = inputGif.value.trim();
    if(gifInputValue !== ""){
        if(!gifInputValue.endsWith(".gif")){
            gifInputValue = `${gifInputValue}.gif`;
        }
    }

    const inputWins = document.getElementById('needed-wins');
    const wins = inputWins.value;
    if(!name || !wins) return; //Name and wins müssen gesetzt werden

    //Add game with list id
    const params = new URLSearchParams(window.location.search);
    const listId = params.get("id");

    fetch(`${SERVER_URL}/add-game/${listId}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name:name, gifLink: gifInputValue, currentStreak: 0, neededWins: wins}),
    })
    .then(response => response.json())
    .then(() => {
        // Clear the input after the game is added
        inputGame.value = "";
        inputGif.value = "";  
        inputWins.value = 1;
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });

}

//Delete a game from the database
function deleteGame(pStrId){
    const params = new URLSearchParams(window.location.search);
    const listId = params.get("id");

    fetch(`${SERVER_URL}/delete-game/${listId}`, {
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


//Reset the streak of a game
function resetGame(pGame){
    //Only reset if game is not completed and currentStreak is >0
    if(pGame.status !== "Completed" && pGame.currentStreak > 0){
        //Reset currentStreak to 0
        //Increase failCount
        //Add a failed try to the list 
        const tries = [
            ... pGame.tries,
            {attempt: pGame.tries.length + 1, streak: pGame.currentStreak, result: "Failed"}
        ]
        const newGame = { name: pGame.name, currentStreak: 0, status: "Ongoing", failCount: pGame.failCount + 1, tries: tries}
        updateGame(newGame);
    }
}


function updateGame(pGame){
    const params = new URLSearchParams(window.location.search);
    const listId = params.get("id");

    fetch(`${SERVER_URL}/update-game/${listId}`, {
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

    //A row for each game
    currentGames.forEach((game) => {
        const row = document.createElement('tr');

        //Label + gif cell
        const labelCell = document.createElement('td');
        const labelSpan = document.createElement('span'); //span needed for completed class 
        labelSpan.textContent = game.name;
        labelSpan.classList.add("status")
        if (game.status === "Completed") labelSpan.classList.add("completed"); // Durchgeschrichene Linie

        if (game.gifLink && game.gifLink.trim() !== "") {
            // GIF
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";

            // Game label          
            labelSpan.style.marginBottom = "5px"; // space between label and GIF
            container.appendChild(labelSpan);

            // GIF
            const gifImg = document.createElement("img");
            gifImg.src = game.gifLink;
            gifImg.style.width = "200px";
            gifImg.style.height = "200px";
            container.appendChild(gifImg);
            labelCell.appendChild(container);
        } else {
            //No gif
            labelCell.appendChild(labelSpan);
        }

        //Counter: Current value / maxValue
        const counterCell = document.createElement('td');
        const winCounter = document.createElement("counter-label");
        winCounter.classList.add("score");
        winCounter.classList.add("btn");
        winCounter.textContent = `${game.currentStreak} / ${game.neededWins}`;
        winCounter.onclick = () => {
            let newStreakValue = game.currentStreak;
            let status = "Ongoing";
            if(game.currentStreak < game.neededWins){
                //Increase by 1
                newStreakValue = game.currentStreak + 1;
                if(newStreakValue === game.neededWins){
                    status = "Completed";

                    const index = Math.floor(Math.random() * gifMap.length);
                    socket.emit("showWinGif", { index });
                }
            }
            if(game.currentStreak !== newStreakValue){
                updateGame({ name: game.name, currentStreak: newStreakValue, status: status});
            }
        }
        counterCell.appendChild(winCounter);

        //Reset Game Button
        const resetCell = document.createElement('td');
        const resetBtn = document.createElement("button");
        resetBtn.classList.add("btn", "reset");
        resetBtn.onclick = () => resetGame(game);
        resetCell.appendChild(resetBtn);

        //Delete Button          
        const deleteCell = document.createElement('td');
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "delete");
        deleteBtn.onclick = () => deleteGame(game._id);
        deleteCell.appendChild(deleteBtn);

        row.appendChild(labelCell);
        row.appendChild(counterCell);
        row.appendChild(resetCell);
        row.appendChild(deleteCell);
        list.appendChild(row);
    })
}



//Gifs
const gifMap = [
    {name: "noice", src: "https://tenor.com/de/view/noice-nice-click-gif-8843762.gif", duration: 2000},
    {name: "Doggers Win", src: "https://tenor.com/de/view/lightsaber-shohei-ohtani-50-50-club-home-run-major-league-baseball-gif-10321730214287179009.gif", duration:4000},
    {name: "Advantures1", src: "https://tenor.com/de/view/groovy-dancing-sombrero-mexican-hat-drunk-gif-17809378.gif", duration: 3000},
    {name: "Faker", src: "https://tenor.com/de/view/faker-calling-faker-calling-faker-is-calling-goat-gif-84264726571740911.gif", duration:4000},
    {name: "Dodgeball", src: "https://tenor.com/de/view/saquon-saquon-barkley-barkley-hurdle-saquon-barkley-philadelphia-eagles-gif-5902988451416277264.gif", duration: 10000}
]

function showWinGif(pIndex) {
    const isMuted = localStorage.getItem('isMuted') === 'true';
    if(isMuted) return;

    //play gif if they are not muted
    const chosenGif = gifMap[pIndex];

    const gifOverlay = document.getElementById("gif-overlay");
    const gif = document.getElementById("popup-gif");
    gif.src = chosenGif.src;
    gif.alt = chosenGif.name;
    gifOverlay.style.display = "flex"; // show overlay
    gifOverlay.onclick = () => {
        gifOverlay.style.display = "none";
        gif.src = "";
    }

    //Hide overlay after duration
    setTimeout(() => {
        gifOverlay.style.display = "none";
        gif.src = "";
        gifOverlay.onclick = null;
    }, chosenGif.duration);
}

// Load mute Settings
function loadSettings(){
    const isMuted = localStorage.getItem('isMuted') === 'true';
    const button = document.getElementById('muteBtn');
    
    if (isMuted) {
        button.classList.add('muted');
    } else {
        button.classList.remove('muted');
    }
}

function setStatsBtn(){
    const params = new URLSearchParams(window.location.search);
    const listId = params.get("id");

    const aStats = document.getElementById('stats');
    aStats.href = `/stats/index.html?id=${listId}`;
}

//Mute gif popups when toggled 
function toggleMute() {
    const button = document.getElementById('muteBtn');
    const isMuted = button.classList.toggle('muted');

    localStorage.setItem('isMuted', isMuted);
}