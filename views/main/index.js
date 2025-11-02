const SERVER_URL = "/api/v1";

const socket = io();
socket.on('refreshLists', () => {fetchLists()});

let currentLists = [];

function fetchLists() {
    fetch(`${SERVER_URL}/`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {

        currentLists = [];
        data.data.lists.forEach(list=>{
            currentLists.push({_id: list._id, number: list.number, name:list.name, status: list.status, date: list.date})
        })
        renderLists();
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });
}


function addList(){
    const inputList = document.getElementById('new-list')
    const name = inputList.value.trim();

    const dateInput = document.getElementById("new-date");
    const date = dateInput.value;

    let index = 1;
    const lastList = currentLists.at(-1) ?? null;
    if(lastList) index = lastList.number + 1;

    if(!name) return; //Name muss gesetzt werden


    fetch(`${SERVER_URL}/add-list`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({number: index, name:name, status: "Ongoing", date:date}),
    })
    .then(response => response.json())
    .then(() => {
        // Clear the input after the list is added
        inputList.value = "";
        setDateDefault();
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });
}

//List the games in a table
function renderLists() {
    const container = document.getElementById("lists-container");
    container.classList.add("container")
    container.innerHTML = "";

    currentLists.forEach(list => {
        const row = document.createElement('div');
        row.classList.add("list-row");

        const listNumberSpan = document.createElement("span");
        listNumberSpan.classList.add("status");
        listNumberSpan.textContent = list.number;

        const statusSpan = document.createElement("span");
        statusSpan.classList.add("status", list.status.toLowerCase());
        statusSpan.textContent = list.status;

        const a = document.createElement("a");
        a.classList.add("btn");
        a.href = `/challenge/index.html?id=${list._id}`;
        a.innerHTML = `
            ${list.name} <span class="arrow"></span>
        `;
        
        const dateSpan = document.createElement("span");
        dateSpan.classList.add("date");
        const date = new Date(list.date);
        dateSpan.textContent = date.toLocaleDateString();

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "delete");
        deleteBtn.onclick = () => deleteList(list._id);

        row.appendChild(listNumberSpan);
        row.appendChild(statusSpan);
        row.append(a);
        row.append(dateSpan)
        row.append(deleteBtn);
        container.appendChild(row);
    });
}


//Delete a list by its Id
function deleteList(pStrListId){
    fetch(`${SERVER_URL}/delete-list`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({_id: pStrListId}),
    })
    .then(response => response.json())
    .then(() => {
        fetchLists();
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });

    //Lösche auch alle Spiele unter dieser ListId!
    fetch(`${SERVER_URL}/challenges/delete-games/${pStrListId}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({_id: pStrListId}),
    })
    .then(response => response.json())
    .then(() => {
        fetchLists();
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });
}



//Default:heute von Date Input setzen
function setDateDefault() {
    const dateInput = document.getElementById("new-date");
    const today = new Date();

    // Format date as YYYY-MM-DD
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    dateInput.value = `${yyyy}-${mm}-${dd}`;
}