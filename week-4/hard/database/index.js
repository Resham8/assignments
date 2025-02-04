const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

// Connect to MongoDB
const connectionString = process.env.connection-string
mongoose.connect(connection-string);

// Define schemas

const UserSchema = new mongoose.Schema({
    email: String,
    password : String,
    name: String
});

const TodoSchema = new mongoose.Schema({
    title: String,
    done: Boolean,
    userId : ObjectId
});

const User = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
    User,
    Todo
}