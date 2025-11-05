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
            currentLists.push({_id: list._id, number: list.number, name:list.name, status: list.status, startDate: list.startDate, endDate: list.endDate})
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

    const startDateInput = document.getElementById("new-start-date");
    const startDate = startDateInput.value;

    const endDateInput = document.getElementById("new-end-date");
    const endDate = endDateInput.value;

    let index = 1;
    const lastList = currentLists.at(-1) ?? null;
    if(lastList) index = lastList.number + 1;

    if(!name) return; //Name muss gesetzt werden


    fetch(`${SERVER_URL}/add-list`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({number: index, name:name, status: "Ongoing", startDate: startDate, endDate: endDate}),
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

        const a = document.createElement("a");
        a.classList.add("btn");
        a.href = `/challenge/index.html?id=${list._id}`;
        a.innerHTML = `
            ${list.name} <span class="arrow"></span>
        `;
        
        const startDateSpan = document.createElement("span");
        startDateSpan.classList.add("date");
        const startDate = new Date(list.startDate);
        startDateSpan.textContent = `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}`;

        const endDateSpan = document.createElement("span");
        endDateSpan.classList.add("date");
        const endDate = new Date(list.endDate);
        endDateSpan.textContent = `${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString()}`;
        

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "delete");
        deleteBtn.onclick = () => deleteList(list._id);

        row.appendChild(listNumberSpan);
        row.appendChild(statusSpan);
        row.append(a);
        row.append(startDateSpan);
        row.append(endDateSpan);
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
    const startDateInput = document.getElementById("new-start-date");
    const now = new Date();

    // Format as YYYY-MM-DDTHH:MM (the "T" is required)
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    startDateInput.value = `${yyyy}-${mm}-${dd}T${hh}:${min}`;

    const endDateInput = document.getElementById("new-end-date");
    endDateInput.value = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}