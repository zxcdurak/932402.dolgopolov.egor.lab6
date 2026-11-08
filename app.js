const express = require("express");
const app = express();
const PORT = 3000;

const PagesRouter = require("./routes/pages");
const TasksRouter = require("./routes/tasks");

app.use(express.json())
app.use(express.static("public"))
app.use("/", PagesRouter);
app.use("/", TasksRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});