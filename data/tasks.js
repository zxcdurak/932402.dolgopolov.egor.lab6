const tasks = [
  { id: 1, title: "Инициализировать проект (npm init, express)", completed: true },
  { id: 2, title: "Написать маршруты / и /about", completed: true },
  { id: 3, title: "Реализовать GET и POST /api/tasks", completed: false },
  { id: 4, title: "Добавить manifest.json", completed: false },
  { id: 5, title: "Подключить service worker", completed: false },
];
let nextId = tasks.length + 1;

module.exports = {
  tasks,
  getNextId: () => nextId++,
};
