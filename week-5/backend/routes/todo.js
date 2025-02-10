const { Router } = require("express");
const authMiddleware = require("../middleware/user");
const { User, Todo } = require("../db/index");
const { z } = require("zod");
const mongoose = require("mongoose");
const router = Router();

const ObjectId = mongoose.ObjectId;

const todoSchema = z.object({
  title: z.string().trim().min(3).max(200),
  isDone: z.boolean(),
});

router.post("/", authMiddleware, async function (req, res) {
  const parsedData = todoSchema.safeParse(req.body);
  const userId = req.userId;

  if (!parsedData.success) {
    return res.status(400).json({
      error: parsedData.error,
    });
  }

  const title = req.body.title;
  const isDone = req.body.isDone;

  try {
    await Todo.create({
      title: title,
      isDone: isDone || false,
      userId: req.userId,
    });

    res.status(201).json({
      msg: "Todo created successfuly",
      userId: userId,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", authMiddleware, async function (req, res) {
  const userId = req.userId;

  try {
    const todos = await  Todo.find({
      userId: userId,
    });

    res.status(200).json({
      todos: todos,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", authMiddleware, async function (req, res) {
  const todoId = req.params.id;
  try {
    const todo = await Todo.findOne({
      _id: todoId,
    });

    if (!todo) {
      res.status(403).json({
        msg: "Todo not found",
      });
    } else {
      res.json({
        todo: todo,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", authMiddleware, async function (req, res) {
  const todoId = req.params.id;

  const { title, isDone } = req.body;
  try {
    const existingTodo = await Todo.findOne({
      _id: todoId,
    });

    if (!existingTodo) {
      res.status(403).json({
        msg: "Todo not found",
      });
    }

    const newTodo = {
      title: title || existingTodo.title,
      isDone: isDone !== undefined ? isDone : existingTodo.isDone,
    };

    const response = await Todo.updateOne({ _id: todoId }, { $set: newTodo });

    if (response.modifiedCount > 0) {
      res.status(200).json({
        msg: "Todo Updated successfully",
      });
    } else {
      return res.status(200).json({ msg: "No changes applied" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/", authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await Todo.deleteMany({
      userId: userId,
    });

    if (result.deletedCount === 1) {
      res.status(200).json({
        msg: "todos deleted Successfully",        
      });
      console.log(result.deletedCount);
    } else {
      res.status(403).json({
        error: "todo not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", authMiddleware, async function (req, res) {
  const todoId = req.params.id;

  try {
    const result = await Todo.deleteMany({
      _id: todoId,
    });

    if (result.deletedCount === 1) {
      res.status(200).json({
        msg: "todos deleted Successfully",
      });
      console.log(result.deletedCount);
    } else {
      res.status(403).json({
        error: "todo not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;