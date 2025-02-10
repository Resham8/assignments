const authDiv = document.getElementById("auth-container");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authButton = document.getElementById("register");
const authAtag = document.getElementById("show-signin");

const todoSection = document.getElementById("todo");
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

todoSection.style.display = "none";

authAtag.addEventListener("click", (e) => {
  e.preventDefault();
  const isSignUp = authAtag.getAttribute("data-isSignUp") === "true";

  authTitle.textContent = isSignUp ? "Log In" : "Sign Up";
  authButton.textContent = isSignUp ? "Log In" : "Sign Up";
  authAtag.innerHTML = isSignUp ? "Sign Up" : "Log In";
  authAtag.setAttribute("data-isSignUp", isSignUp ? "false" : "true");
  document.querySelector("#auth-container p").innerHTML = isSignUp
    ? "Don't have an account? <a href='#' id='show-signin' data-isSignUp='false'>Sign Up</a>"
    : "Already have an account? <a href='#' id='show-signin' data-isSignUp='true'>Log In</a>";
});

const userUrl = "http://localhost:3000/user";
const todoUrl = "http://localhost:3000/todo";

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const isSignUp = authAtag.getAttribute("data-isSignUp") === "true";
  const endpoint = isSignUp ? "signup" : "login";

  try {
    const response = await fetch(`${userUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      if (isSignUp) {
        document.getElementById("response-message").innerText =
          result.message || "Signup successful, please sign in";
      } else {
        localStorage.setItem("token", result.token);
        authDiv.style.display = "none";
        todoSection.style.display = "block";
        loadTodos();
      }
    } else {
      document.getElementById("response-message").innerText =
        result.message || "Signup/Login failed";
    }
  } catch (error) {
    console.error("Network error:", error);
    document.getElementById("response-message").innerText =
      "An error occurred. Please try again.";
  }
});

todoForm.addEventListener("submit", saveTodo);

async function saveTodo(e) {
  e.preventDefault();
  const title = todoInput.value;
  const isDone = false;

  const body = JSON.stringify({ title:title, isDone:isDone });
  console.log("Request Body:", body);

  const response = await fetch(`${todoUrl}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
    body: body,
  });
  const result = await response.json();

  if (response.ok) {
    loadTodos();
    todoInput.value = "";
  } else {
    alert("Please login.");
    authDiv.style.display = "block";
    todoSection.style.display = "none";
  }
}

async function loadTodos() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${todoUrl}/`, {
      method: "GET",
      headers: {
        token: token,
      },
    });

    const { todos } = await response.json();
    todoList.innerHTML = "";

    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.setAttribute("class", "todo-item");
      li.setAttribute("data-todoId", todo._id);
      li.setAttribute("data-isdone", todo.isDone);
      const contentDiv = document.createElement("div");
      contentDiv.setAttribute("class", "todo-content");

      const Titlespan = document.createElement("span");
      Titlespan.setAttribute("class", "todo-text");
      Titlespan.innerHTML = todo.title;

      contentDiv.appendChild(Titlespan);
      li.appendChild(contentDiv);

      const btnDiv = document.createElement("div");
      btnDiv.setAttribute("class", "action-buttons");

      const editBtn = document.createElement("button");
      editBtn.classList.add("action-btn", "edit");
      editBtn.setAttribute("id", "editBtn");

      const editIcon = document.createElement("i");
      editIcon.classList.add("fas", "fa-pen");

      editBtn.appendChild(editIcon);
      btnDiv.appendChild(editBtn);
      
      editBtn.addEventListener("click", (e) => {  
        e.stopPropagation();      
        if (Titlespan.querySelector('input')) return;
      
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.title;
        input.classList.add('inline-edit-input');
        
        input.addEventListener('blur', async () => {
          const newText = input.value.trim();
          if (newText && newText !== todo.title) {
            try {
              const token = localStorage.getItem("token");
              const res = await fetch(`${todoUrl}/${todo._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  token: token,
                },
                body: JSON.stringify({ title: newText }),
              });
      
              if (res.ok) {
                loadTodos();
              }
            } catch (error) {
              console.error("Failed to update todo", error);
              Titlespan.textContent = todo.title;
            }
          } else {
            Titlespan.textContent = todo.title;
          }
        });
      
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            input.blur();
          }
        });
      
        Titlespan.innerHTML = '';
        Titlespan.appendChild(input);
        input.focus();
      });
      

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("action-btn", "delete");
      deleteBtn.setAttribute("id", "deleteBtn");

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fas", "fa-trash");
      deleteBtn.appendChild(deleteIcon);
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTodo(todo._id);
      });

      btnDiv.appendChild(deleteBtn);
      li.appendChild(btnDiv);

      li.addEventListener("click", () => toggleTodo(todo._id, li));

      todoList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading todos:", error);
  }
}

async function toggleTodo(id, li) {
  try{
    let currentStatus = li.getAttribute("data-isdone") === "true";
  let newStatus = !currentStatus;
  const token = localStorage.getItem("token");
  const res = await fetch(`${todoUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({ isDone: newStatus }),
  });
  const result = await res.json();
  li.setAttribute("data-isdone", newStatus);
    
  const todoText = li.querySelector(".todo-text");
  todoText.style.textDecoration = newStatus ? "line-through" : "none";
  } catch(err){
    console.error('Error in toggleTodo:', err);        
  }
  
}

async function updateTodo(id) {
  const todoItem = document.querySelector(`li[data-todoid="${id}"]`);
  const todoText = todoItem.querySelector(".todo-text").textContent;
  todoInput.value = todoText;

  const token = localStorage.getItem("token");
  const res = await fetch(`${todoUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({
      title: todoInput.value,
    }),
  });

  if (res.ok) {
    todoInput.value = "";
    loadTodos();
  }
}

async function deleteTodo(id) {  
  const token = localStorage.getItem("token");
  const res = await fetch(`${todoUrl}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  const result = await res.json();
  if (res.ok) {
    alert("Are you sure you want to delete Todo.");
    loadTodos();
  }
}
