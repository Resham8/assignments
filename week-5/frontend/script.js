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
    document.querySelector("#auth-container p").innerHTML = isSignUp ? 
        "Don't have an account? <a href='#' id='show-signin' data-isSignUp='false'>Sign Up</a>" : 
        "Already have an account? <a href='#' id='show-signin' data-isSignUp='true'>Log In</a>";
});

const url = "http://localhost:3000/user";

authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const isSignUp = authAtag.getAttribute("data-isSignUp") === "true";
    const endpoint = isSignUp ? "signup" : "login";

    try {
        const response = await fetch(`${url}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            if (isSignUp) {
                document.getElementById('response-message').innerText = result.message || 'Signup successful, please sign in';
            } else {
                localStorage.setItem("token", result.token);
                authDiv.style.display = "none";
                todoSection.style.display = "block";
            }
        } else {
            document.getElementById('response-message').innerText = result.message || 'Signup/Login failed';
        }
    } catch (error) {
        console.error("Network error:", error);
        document.getElementById('response-message').innerText = "An error occurred. Please try again.";
    }
});

todoForm.addEventListener('submit', async function(e){
    e.preventDefault();
    if()
})