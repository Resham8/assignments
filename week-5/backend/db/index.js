const mongoose = require("mongoose");
require("dotenv").config();

const ObjectId = mongoose.ObjectId;

const mongoConnect = process.env.MONGO_URI;
mongoose.connect(mongoConnect);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


const TodoSchema = new mongoose.Schema({
    title:{type:String, required:true},
    done:Boolean,
    userId : ObjectId
});

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

module.exports = {
    User,
    Todo
}