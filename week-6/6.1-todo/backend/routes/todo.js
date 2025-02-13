let todos = []; // in memory space
let Id = 1;

export async function getAllTodo(req, res, next) {
  res.json(todos);
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
  const { task, done } = req.body;

  const todoIndex = todos.findIndex((todo) => todo.Id === parseInt(id, 10));

  if (todoIndex !== -1) {
    todos[todoIndex] = {
      ...todos[todoIndex],
      task: task || todos[todoIndex].task,
      done: done !== undefined ? done : todos[todoIndex].done, 
    };

    res.status(200).json({     
      todo: todos[todoIndex],
    });
  } else {
    res.status(404).json({      
      error: "Todo not found",
    });
  }
}

export async function deleteTodoById(req, res, next) {
  const { id } = req.params;

  // console.log(`todo : ${id}`)
  const todoIndex = todos.findIndex((todo) => todo.Id === parseInt(id, 10));
  // console.log(`todoIndex : ${todoIndex}`)

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
