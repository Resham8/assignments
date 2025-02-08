const express = require("express");
const cors = require('cors')
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const todoRoutes = require("./routes/todo");
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/todo", todoRoutes);

app.listen(port, ()=> console.log(`server is running at http://localhost:${port}`));