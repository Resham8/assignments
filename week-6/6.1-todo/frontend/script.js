const API_URL = 'http://localhost:3001/todos';

// Fetch existing todos when the page loads
document.addEventListener('DOMContentLoaded', () => {
  
});

// Fetch todos from backend
function fetchTodos() {

}

// Add a new todo to the DOM
function addTodoToDOM(todo) {
    const todoList = document.getElementById('todo-list');

    const todoItem = document.createElement('li');
    todoItem.classList.add("todo-item");
    todoItem.setAttribute("data-todoId", todo.id);

    const task = document.createElement("span");
    task.textContent = todo.task;

    buttonDiv = document.createElement("div");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.textContent = "✏️";
    editButton.addEventListener('click', () => editTodo(todo.id));

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "🗑️";
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);

    todoItem.appendChild(task);
    todoItem.appendChild(buttonDiv);

    todoList.appendChild(todoItem);
}

// Add a new todo
document.getElementById('add-todo-btn').addEventListener('click', () => {
    const task = document.getElementById("todo-input").value;
    
    if(!task){
        alert("Task is required");
        return;
    }
    
    let data = {
        task: task,
        done: false
    }

    let fetchData = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
          })
    }

    fetch(API_URL,fetchData).then(
        response => response.json()
    ).then(todo => {
        addTodoToDOM(todo),
        task.value = "";
    }).catch(error => console.log(error))

});

// Toggle todo completion
function toggleTodo(id, completed) {
//    write here
}

// Delete a todo
function deleteTodo(id) {
    // write here  
}

function editTodo(id) {
    // write here  
}
