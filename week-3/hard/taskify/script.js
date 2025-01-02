let currentColumn = null;
let tasks = loadTasks();

const modal = document.getElementById("taskModal");

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  const defaultTasks = {
    inbox: [],
    "in-progress": [],
    "under-view": [],
    done: [],
  };

  try {
    return savedTasks ? JSON.parse(savedTasks) : defaultTasks;
  } catch (er) {
    console.error("Error loading tasks: ", er);
    return defaultTasks;
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function openModal(column) {
  currentColumn = column;

  const taskInput = document.getElementById("taskTitle");

  modal.style.display = "flex";
  taskInput.value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskPriority").value = "low";

  taskInput.focus();
}

function closeModal() {
  modal.style.display = "none";
  currentColumn = null;
}

function addTask() {
  const Title = document.getElementById("taskTitle").value.trim();
  const Description = document.getElementById("taskDescription").value.trim();
  const Priority = document.getElementById("taskPriority").value;

  if (!Title) {
    alert("Please add a task");
    return;
  }

  const task = {
    Title,
    Description,
    Priority,
    created: new Date().toString(),
  };

  tasks[currentColumn].push(task);
  console.log(task);

  renderTasks();
  closeModal();
}

function renderTasks() {
  Object.keys(tasks).forEach((column) => {
    const taskList = document.querySelector(`#${column} .task-list`);
    taskList.innerHTML = "";
    tasks[column].forEach((task, index) => {
      const taskElement = createTaskElement(task, index, column);
      taskList.appendChild(taskElement);
    });
  });

  updateTaskCounts();
  saveTasks();
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e, column) {
  e.preventDefault();
  try {
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const task = tasks[data.column][data.index];

    tasks[data.column].splice(data.index, 1);
    tasks[column].push(task);
    renderTasks();
  } catch (error) {
    console.error("Error handling drop:", error);
  }
}

function createTaskElement(task, index, column) {
  const div = document.createElement("div");
  div.className = "task";
  div.draggable = true;
  div.setAttribute("data-index", index);
  div.setAttribute("data-column", column);

  const priorityClass = `priority-${task.Priority || "low"}`;
  const priorityText = `${(task.Priority || "low").charAt(0).toUpperCase()}${(
    task.Priority || "low"
  ).slice(1)} Priority`;

  div.innerHTML = `
    <span class="priority-badge ${priorityClass}">${priorityText}</span>
    <h3>${task.Title}</h3>
    <p>${task.Description}</p>
    <div class="task-footer">
        <span>${new Date(task.created).toLocaleDateString()}</span>
        <div class="task-actions">
        <i class="fas fa-edit" onclick="editTask(event, '${column}', ${index})"></i>
                <i class="fas fa-trash" onclick="deleteTask(event, '${column}', ${index})"></i>
        </div>
    </div>`;

  div.addEventListener("dragstart", (e) => {
    div.classList.add("dragging");
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        column,
        index,
      })
    );
  });

  div.addEventListener("dragend", () => {
    div.classList.remove("dragging");
  });

  return div;
}

function updateTaskCounts() {
  Object.keys(tasks).forEach((column) => {
    const count = document.querySelector(`#${column} .task-count`);
    count.textContent = tasks[column].length;
  });
}

function editTask(e, column, index) {
  e.stopPropagation();
  const task = tasks[column][index];
  currentColumn = column;

  document.getElementById("taskTitle").value = task.Title;
  document.getElementById("taskDescription").value = task.Description;
  document.getElementById("taskPriority").value = task.Priority || "low";
  document.getElementById("taskModal").style.display = "flex";

  tasks[column].splice(index, 1);
  renderTasks();
}

function deleteTask(e, column, index) {
  e.stopPropagation();
  if (confirm("Are you sure you want to delete this task?")) {
    tasks[column].splice(index, 1);
    renderTasks();
  }
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById("taskModal");
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("click", (e) => {
  const modal = document.getElementById("taskModal");
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});
