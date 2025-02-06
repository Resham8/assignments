const { Router } = require("express");
const adminMiddleware = require("../middleware/user");
const { User, Todo } = require("../database/index");
const { z } = require("zod");
const mongoose = require("mongoose");
const router = Router();

const ObjectId = mongoose.ObjectId;

const todoSchema = z.object({
  title: z.string().trim().min(3),
  isDone: z.boolean(),
});

// todo Routes
router.post("/", adminMiddleware, async (req, res) => {
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
      userId,
      title,
      isDone,
    });
    res.json({
      msg: "todo addes suscussfully",
      userId: userId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

router.put("/:id", adminMiddleware, async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.id;

  const { title, isDone } = req.body;
  try {
    const existingTodo = await Todo.findOne({
      _id: todoId,
    });

    if (existingTodo) {
      const newTodo = {
        title: title || existingTodo.title,
        isDone: isDone !== undefined ? isDone : existingTodo.isDone,
      };

      const result = await Todo.updateOne({ _id: todoId }, { $set: newTodo });

      if (result.modifiedCount > 0) {
        res.status(200).json({
          msg: "todo updated Successfully",
        });
      }
    } else {
      res.status(403).json({
        error: "todo not found ",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete("/", adminMiddleware, async (req, res) => {
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

router.delete("/:id", adminMiddleware, async (req, res) => {
  const todoId = req.params.id;

  try {
    const result = await Todo.deleteOne({
      _id: todoId,
    });

    if (result.deletedCount === 1) {
      res.status(200).json({
        msg: "todo deleted Successfully",
      });
    } else {
      res.status(403).json({
        error: "todo not found ",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/", adminMiddleware, async (req, res) => {
  const userId = req.userId;
  
  try {
    const todos = await Todo.find({
      userId: userId,
    });
    
    res.status(200).json({
      todos: todos,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", adminMiddleware, async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.id;

  try {
    const todos = await Todo.findOne({
      _id: todoId,
    });

    if (todoId) {
      res.status(200).json({
        todos: todos,
      });
    } else {
      res.status(403).json({
        error: "Id not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
