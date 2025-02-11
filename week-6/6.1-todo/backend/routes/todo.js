let todos = []; // in memory space
let Id = 1;

export async function getAllTodo(req, res, next) {
  res.json({ todos });
}

export async function createTodo(req, res, next) {
  const task = req.body.task;
  const done = req.body.done;

  if (!task) {
    res.status(400).json({
      error: "Task is required",
    });
  }

  const newTodo = {
    Id: Id++,
    task: task,
    done: done || false,
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
}

export async function updateTodo(req, res, next) {
  const { id } = req.params;

  const task = req.body.task;
  const done = req.body.done;

  console.log(`todo : ${id}`)
  const todoIndex = todos.findIndex(todo => todo.Id === parseInt(id, 10));

  console.log(`todoIndex : ${todoIndex}`)
  if (todoIndex !== -1) {

    todos[todoIndex] = {
      ...todos[todoIndex],
      task: task || todos[todoIndex].task,
      done: done || todos[todoIndex].done,
    };

    res.status(201).json({
      todos: todos[todoIndex],
    });
  } else {
    res.status(400).json({
      error: "Todo not found",
    });
  }
}

export async function deleteTodoById(req, res, next) {
  const { id } = req.params;

  const todoIndex = todos.findIndex(todo => todos.Id === parseInt(id));
  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    res.status(200).json({
      msg: "Todo deleted successfully",
    });
  } else {
    res.status(400).json({
      error: "Todo not found",
    });
  }
}

export async function searchTodo(req, res, next) {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({
      msg: "Search parameter missing",
    });
  }

  const filteredTodos = todos.filter((todo) =>
    todo.task.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filteredTodos);
}
