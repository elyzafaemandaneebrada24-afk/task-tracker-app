const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

app.use(express.json());
app.use(express.static('public')); 

function checkLogin() {
    const pass = document.getElementById('passwordInput').value;
    const correctPassword = "1234"; // password can be change

    if (pass === correctPassword) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        
        loadTasks();
    } else {
        alert("Incorrect password. Please try again.");
    }
}

const getTasks = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE));
};

app.get('/api/tasks', (req, res) => {
    res.json(getTasks());
});

app.post('/api/tasks', (req, res) => {
    const tasks = getTasks();
    const newTask = { id: Date.now(), ...req.body };
    tasks.push(newTask);
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
    res.json(newTask);
});

app.delete('/api/tasks/:id', (req, res) => {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id != req.params.id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
    res.send({ message: "Deleted" });
});

app.put('/api/tasks/:id', (req, res) => {
    let tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id.toString() === req.params.id.toString());
    
    if (taskIndex !== -1) {
        tasks[taskIndex].text = req.body.text; 
        tasks[taskIndex].priority = req.body.priority; 
        fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).send("Task not found");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📂 Saving tasks to: ${DATA_FILE}`);
});