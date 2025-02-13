const API_URL = "http://localhost:3001/todos";

// Fetch existing todos when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchTodos();
});

// Fetch todos from backend
function fetchTodos() {
  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        console.log(response.status);
      }
      return response.json();
    })
    .then((todos) => {
      todos.forEach((todo) => addTodoToDOM(todo));
    })
    .catch((error) => console.log(error));
}

function addTodoToDOM(todo) {
  const todoList = document.getElementById("todo-list");

  let todoItem = document.querySelector(`[data-todoId='${todo.Id}']`);

  if (!todoItem) {
    todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    todoItem.setAttribute("data-todoId", todo.Id);

    const task = document.createElement("span");
    task.textContent = todo.task;

    const buttonDiv = document.createElement("div");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.textContent = "✏️";
    editButton.addEventListener("click", () => editTodo(todo.Id));

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "🗑️";
    deleteButton.addEventListener("click", () => deleteTodo(todo.Id));

    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);

    todoItem.appendChild(task);
    todoItem.appendChild(buttonDiv);

    if (todo.done) {
      todoItem.classList.add("completed");
    }

    todoItem.addEventListener("click", () => toggleTodo(todo.Id, todo.done));

    todoList.appendChild(todoItem);
  } else {
    todoItem.querySelector("span").textContent = todo.task;
    if (todo.done) {
      todoItem.classList.add("completed");
    } else {
      todoItem.classList.remove("completed");
    }
  }
}

// Add a new todo
document.getElementById("add-todo-btn").addEventListener("click", () => {
  const task = document.getElementById("todo-input");

  if (!task) {
    alert("Task is required");
    return;
  }

  let data = {
    task: task.value,
    done: false,
  };

  let fetchData = {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json; charset=UTF-8",
    }),
  };

  fetch(API_URL, fetchData)
    .then((response) => response.json())
    .then((todo) => {
      addTodoToDOM(todo);
      task.value = "";
    })
    .catch((error) => console.log(error));
});

// Toggle todo completion
function toggleTodo(id, completed) {
  const todoItem = document.querySelector(`[data-todoId='${id}']`);

  let data = {
    done: !completed,
  };

  let fetchData = {
    method: "PUT",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json; charset=UTF-8",
    }),
  };

  fetch(`${API_URL}/${id}`, fetchData)
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.todo) {
        if (responseData.todo.done) {
          todoItem.classList.add("completed");
        } else {
          todoItem.classList.remove("completed");
        }
      } else {
        console.error(responseData);
      }
    })
    .catch((error) => console.log(error));
}

// Delete a todo
function deleteTodo(id) {
  confirm("Are you sure you want to delete this");

  let fetchData = {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json; charset=UTF-8",
    }),
  };

  fetch(`${API_URL}/${id}`, fetchData)
    .then((response) => response.json())
    .then(function () {
      const todoItem = document.querySelector(`[data-todoId='${id}']`);
      todoItem.remove();
      // fetchTodos()
    })
    .catch((error) => console.log(error));
}

function editTodo(id) {
  const task = prompt("Task: ");

  if (!task) {
    alert("Task is required");
    return;
  }

  let data = {
    task: task,
  };

  let fetchData = {
    method: "PUT",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json; charset=UTF-8",
    }),
  };

  fetch(`${API_URL}/${id}`, fetchData)
    .then((response) => response.json())
    .then(() => {
      fetchTodos();
    })
    .catch((error) => console.log(error));
}
