

async function createListMenu() {
    var listMenu = document.createElement("div");
    listMenu.id = "listMenu";
    listMenu.className = "listMenu";

    createListMenuHeader();

    const lists = await getLists();
    lists.forEach(list => {
        const listMenuElement = createListMenuElement(list);
        listMenu.appendChild(listMenuElement);
    });

    document.body.appendChild(listMenu);
}

function createListMenuHeader() {
    const header = document.getElementById("header");
    header.innerHTML = "";
    header.classList = "header";

    const listMenuTitle = document.createElement("h1");
    listMenuTitle.textContent = "Lists";

    header.appendChild(listMenuTitle);
}

function createListMenuElement(list) {
    var listMenuElement = document.createElement("div");
    listMenuElement.className = "listMenuElement";
    listMenuElement.onclick = () => {
        removeListMenu();
        createList(list);
    }

    const listName = document.createElement("p");
    listName.textContent = list.name;
    listMenuElement.appendChild(listName);

    const itemCount = document.createElement("p");
    itemCount.textContent = list.elements.length;
    listMenuElement.appendChild(itemCount);

    return listMenuElement;
}

function removeListMenu() {
    var listMenu = document.getElementById("listMenu");
    listMenu.remove();
}

async function getLists() {
    return await fetch("/api/lists/getLists").then(response => response.json());
};

function createList(listInfo) {
    document.title = listInfo.name;
    const listElement = document.createElement("article");
    listElement.className = "list";

    listInfo.elements.forEach(element => {
        listElement.appendChild(createListElement(element, listInfo));
    });

    createListHeader(listInfo, listElement);

    document.body.appendChild(listElement);
}

function createListHeader(list, listElements) {
    const header = document.getElementById("header");
    header.innerHTML = "";
    header.classList.add("listHeader");

    const backButton = document.createElement("img");
    backButton.classList.add("backButton");
    backButton.src = "img/icons/back.svg";

    backButton.onclick = () => {
        listElements.remove();
        createListMenu();
    }
    header.appendChild(backButton);

    const listTitle = document.createElement("h1");
    listTitle.className = list.name;
    listTitle.textContent = list.name;
    header.appendChild(listTitle);

    const hiddenbackButton = document.createElement("img");
    hiddenbackButton.classList.add("backButton", "invisible");
    hiddenbackButton.src = "img/icons/back.svg";
    header.appendChild(hiddenbackButton);
};


function createListElement(element, list) {
    const listElement = document.createElement("div");
    listElement.className = "listElement";

    const statusElement = document.createElement("img");
    if (element.checked === true) {
        statusElement.src = "img/icons/checked-circle.svg";
    } else {
        statusElement.src = "img/icons/circle.svg";
    }
    statusElement.onclick = async () => {
        const newList = await updateCheckStatus(element, list);
        console.log(newList);
        listElement.parentElement.remove();
        createList(newList);
    }

    listElement.appendChild(statusElement);

    const name = document.createElement("p");
    name.className = "name";
    name.textContent = element.name;

    listElement.appendChild(name);

    return listElement;
}

async function updateCheckStatus(element, list) {
    list.elements.find(e => e.name === element.name).checked = !element.checked;
    return await updateList(list);

}

async function updateList(list) {
    const response = await fetch("/api/lists/updateList", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ list }),
    });

    // Check if the response was successful
    if (!response.ok) {
        // Handle error
        throw new Error("Failed to update list");
    }

    // Parse the JSON response and return it
    return response.json();
}







document.addEventListener("DOMContentLoaded", () => {
    createListMenu();
});
