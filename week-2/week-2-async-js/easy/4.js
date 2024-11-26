const fs = require("fs")

const data = "hello, this is written from js side";

fs.writeFile("a.txt", data, "utf-8", (err) => {
    if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('File written successfully!');
      }
})

// fs.readFile("a.txt", "utf-8", (err, data) => {
//     if(err){
//         console.error("Error while reading the file: ", err);
//     }

//     console.log(data);
// })