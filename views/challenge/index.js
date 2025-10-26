const SERVER_URL = "http://localhost:5500/api/v1/challenges";

function callbackAddGame(){
    const input = document.getElementById('new-game')
    const name = input.value.trim()
    if (!name) return;
    console.log(SERVER_URL);

    fetch(`${SERVER_URL}/add-game`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name:name, finished:false}),
    })
    .then(response => response.json())
    .then(data => {
        fetchGames();
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });

}

async function fetchGames() {
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

function renderGames(currentGames) {
    const list = document.getElementById('game-list')
    list.innerHTML = ''

    currentGames.forEach((game, idx) => {
        const li = document.createElement('li')
        if (game.finished) li.classList.add('checked')

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = game.finished

        const label = document.createElement('label')
        label.textContent = game.name

        li.appendChild(checkbox)
        li.appendChild(label)
        list.appendChild(li)
    })
}
