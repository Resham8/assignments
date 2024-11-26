const fs = require('fs');

function sum(n) {
    let result = 0;
    for (let i = 0; i < n; i++) {
        result += 1;
    }
    return result;
}


fs.readFile("a.txt", "utf-8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    console.log(data); 
});
