const addBoardBtn = document.getElementById('add-board-btn');
const containers = document.querySelector('.containers');
const inputField = document.getElementById('inputField');
const saveBtn = document.getElementById('save-btn');
const modalContainer = document.querySelector('.modalContainer'); 
const modalCancelBtn = document.querySelector('.modalCancelBtn');
let currentTasksContainer = null;
let tasks = JSON.parse(localStorage.getItem("Tasks")) || [];

function attachDragEvents(target) {
    target.addEventListener('dragstart', () => target.classList.add('flying'));
    target.addEventListener('dragend', () => target.classList.remove('flying'));
}

document.querySelectorAll('.task').forEach(task => attachDragEvents(task));

document.querySelectorAll('.tasks').forEach(tasks => {
    tasks.addEventListener('dragover', (event) => {
        event.preventDefault();
        const flyingElement = document.querySelector('.flying');
        if (flyingElement) tasks.appendChild(flyingElement);
    });
});

function createTask(taskContent) {
    const input = taskContent;
    if (!input) return;

    const newTask = document.createElement('div');
    newTask.classList.add('task');
    newTask.setAttribute('draggable', true);

    const para = document.createElement('p');
    para.innerText = input;
    newTask.appendChild(para);

    const divButton = document.createElement('div');

    const editBtn = document.createElement('button');
    editBtn.innerText = "🖋️";
    editBtn.classList.add('task-btn');
    editBtn.style.background = 'transparent';
    editBtn.style.border = 'none';
    editBtn.style.padding = '8px';
    editBtn.style.cursor = 'pointer';
    editBtn.style.fontSize = '18px';
    editBtn.style.transition = '0.3s ease';
    editBtn.style.borderRadius = '5px';

    editBtn.addEventListener('click', () => {
        const editInput = prompt('Edit the task : ', para.innerText);
        if (editInput) {
            para.innerText = editInput;
            updateLocalStorage();
        }
    });
    divButton.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = "🗑️";
    deleteBtn.classList.add('task-btn');
    deleteBtn.style.background = 'transparent';
    deleteBtn.style.border = 'none';
    deleteBtn.style.padding = '8px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '18px';
    deleteBtn.style.transition = '0.3s ease';
    deleteBtn.style.borderRadius = '5px';
    deleteBtn.addEventListener('click', () => {
        newTask.remove();
        updateLocalStorage();
    });
    divButton.appendChild(deleteBtn);

    newTask.appendChild(divButton);
    attachDragEvents(newTask);
    return newTask;
}

function openModal(container) {
    currentTasksContainer = container;
    modalContainer.classList.add('show');
}

document.getElementById('add-todo-btn').addEventListener('click', () => openModal(document.getElementById('todo-tasks')));
document.getElementById('add-progress-btn').addEventListener('click', () => openModal(document.getElementById('progress-tasks')));
document.getElementById('add-done-btn').addEventListener('click', () => openModal(document.getElementById('done-tasks')));


// Load tasks from localStorage when the page loads
window.addEventListener('load', () => {
    tasks.forEach(taskContent => {
        const taskElement = createTask(taskContent);
        if (currentTasksContainer) {
            currentTasksContainer.appendChild(taskElement);
        }
    });
});


// Function to update local storage
function updateLocalStorage() {
    localStorage.setItem("Tasks", JSON.stringify(tasks));
}

saveBtn.addEventListener('click', () => {
    if (!currentTasksContainer) return;
    const taskContent = inputField.value.trim();
    
    if (taskContent) {
        tasks.push(taskContent); // Add new task to the array
        updateLocalStorage(); // Update local storage

        let newTask = createTask(taskContent);
        if (newTask) currentTasksContainer.appendChild(newTask);
        
        inputField.value = "";
        modalContainer.classList.remove('show');
    } else {
        alert("Please enter a task.");
    }
});

function createBoard(containerTitle) {
    const newContainer = document.createElement('div');
    newContainer.classList.add('container');

    const divCont = document.createElement('div');
    divCont.classList.add('container-title');

    const titleElement = document.createElement('h3');
    titleElement.textContent = containerTitle;
    divCont.appendChild(titleElement);

    const delBoard = document.createElement('button');
    delBoard.innerText = "🗑";
    delBoard.classList.add('delete-board-btn');
    delBoard.addEventListener('click', () => newContainer.remove());
    divCont.appendChild(delBoard);

    newContainer.appendChild(divCont);

    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasks');
    newContainer.appendChild(tasksContainer);

    const divBottom = document.createElement('div');
    divBottom.classList.add("container-bottom");

    const addTaskBtn = document.createElement('button');
    addTaskBtn.innerText = "Add Items";
    addTaskBtn.classList.add('add-btn');
    addTaskBtn.addEventListener('click', () => openModal(tasksContainer));
    divBottom.appendChild(addTaskBtn);

    newContainer.appendChild(divBottom);
    containers.appendChild(newContainer);
    tasksContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
        const flyingElement = document.querySelector('.flying');
        if (flyingElement) tasksContainer.appendChild(flyingElement);
    });
}

addBoardBtn.addEventListener('click', () => {
    const containerTitle = prompt('Enter title : ');
    if (containerTitle) createBoard(containerTitle);
    else alert("Please enter a board name.");
});

document.querySelectorAll('.add-btn').forEach(addBtn => {
    addBtn.addEventListener('click', () => openModal(currentTasksContainer));
});

modalCancelBtn.addEventListener('click', () => modalContainer.classList.remove('show'));
