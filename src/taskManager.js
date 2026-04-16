let _nextId = 1;

export function resetId() {
  _nextId = 1;
}

export function validateTitle(title) {
  if (typeof title !== 'string') return false;
  return title.trim().length >= 3;
}

export function createTask(title) {
  return { id: _nextId++, title: title.trim(), completed: false };
}

export function addTask(tasks, title) {
  if (!validateTitle(title)) {
    throw new Error('Título inválido: deve ser uma string com pelo menos 3 caracteres.');
  }
  return [...tasks, createTask(title)];
}

export function removeTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

export function toggleTask(task) {
  return { ...task, completed: !task.completed };
}

export function filterTasks(tasks, status) {
  switch (status) {
    case 'completed': return tasks.filter((t) => t.completed === true);
    case 'pending':   return tasks.filter((t) => t.completed === false);
    case 'all':
    default:          return [...tasks];
  }
}