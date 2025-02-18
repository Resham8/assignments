const API_URL = "http://localhost:3001/bookmarks";

// Fetch bookmarks when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchBookmarks();
});

// Fetch bookmarks from the backend
function fetchBookmarks() {
  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        console.log(response.status);
      }
      return response.json();
    })
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => addBookmarkToDOM(bookmark));
    })
    .catch((error) => console.log(error));
}

// Add a bookmark to the DOM
function addBookmarkToDOM(bookmark) {
  const bookmarkList = document.getElementById("bookmark-list");
  const bookmarkItem = document.createElement("li");
  bookmarkItem.setAttribute("data-id", bookmark.id);

  const span = document.createElement("span");
  span.textContent = `${bookmark.url} (${bookmark.category})`;

  const buttonDiv = document.createElement("div");
  const favoriteBtn = document.createElement("button");
  favoriteBtn.textContent = "⚝";
  favoriteBtn.classList.add("favorite-btn");
  favoriteBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    favoriteBtn.classList.toggle("favorite");
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "✖️";
  deleteBtn.addEventListener("click", () => deleteBookmark(bookmark.id));
console.log(bookmark.id)
  buttonDiv.appendChild(favoriteBtn);
  buttonDiv.appendChild(deleteBtn);

  bookmarkItem.appendChild(span);
  bookmarkItem.appendChild(buttonDiv);

  bookmarkList.appendChild(bookmarkItem);
}

// Add a new bookmark
document.getElementById("add-bookmark-btn").addEventListener("click", async () => {
    const urlInput = document.getElementById("bookmark-url");
    const categoryInput = document.getElementById("bookmark-category");

    if (!urlInput.value || !categoryInput.value) {
      alert("Please fill in both the URL and the category.");
      return;
    }

    try {
      let data = {
        url: urlInput.value,
        category: categoryInput.value,
      };

      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(API_URL, config);
      if (response.ok) {
        const json = await response.json();
        console.log("successfull", json);
        fetchBookmarks()
      } else {
        console.error("Failed to fetch bookmarks");
      }
    } catch (error) {
      console.log(error);
    }
  });

// Delete a bookmark
function deleteBookmark(id) {
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
        const bookmarkItem = document.querySelector(`[data-id='${id}']`);
        bookmarkItem.remove();
        // fetchTodos()
      })
      .catch((error) => console.log(error));
}
