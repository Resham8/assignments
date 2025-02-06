const mongoose = require('mongoose');
const { z } = require('zod');
const Schema = mongoose.Schema;
require("dotenv").config();

// Connect to MongoDB
const connectionString = process.env.connection_string
mongoose.connect(connectionString);

// Define schemas
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    name: {type: String, unique: true},
    email:  String,
    password : String
    
});

const TodoSchema = new Schema({    
    title: String,
    isDone: Boolean,
    userId : ObjectId    
});

const User = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
    User,
    Todo
}