let bookmarks = []; // in memory space
let Id = 1;

export async function addBookmark(req, res, next) {
  try {
    const { url, categoy } = req.body;
    if (!url || !categoy) {
      res.json({
        error: "Url and Category required",
      });
    }

    const newBookmark = {
      id: Id++,
      url: url,
      categoy: categoy,
    };

    bookmarks.push(newBookmark);

    res.status(201).json({
      newBookmark,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteBookmark(req, res, next) {
  const id = req.params.id;

  const findIndex = bookmarks.findIndex((bookmark) => bookmarks.id == id);

  if (findIndex !== -1) {
    bookmarks.splice(findIndex, 1);
    res.status(200).json({
      msg: "bookmark deleted successfully",
    });
  } else {
    res.status(400).json({
      error: "bookmark not found",
    });
  }
}

export async function getAllBookmarks(req, res, next) {
  res.json(bookmarks);
}
