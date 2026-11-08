let { tasks, getNextId } = require("../data/tasks");
const express = require("express");
const router = express.Router();

router.get("/api/tasks", (req, res) => {
    if (req.query.completed === "true" || req.query.completed === "false") {
        const flag = req.query.completed === "true";
        return res.json(tasks.filter((t) => t.completed === flag));
    }
    res.json(tasks);
});

router.post("/api/tasks", (req, res) => {
    if (typeof req.body?.title !== "string" || req.body?.title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }
    let task = { id: getNextId(), title: req.body.title.trim(), completed: false }
    tasks.push(task);
    return res.status(201).json(task);
});


module.exports = router;