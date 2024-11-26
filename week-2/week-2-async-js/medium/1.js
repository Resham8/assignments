const fs = require("fs");

fs.readFile("b.txt", "utf-8", (err, data) => {
    if (err) {
        console.error("Error while reading: ", err);
    }
    console.log(data.replace(/\s+/g, ' ').trim());
})

