const express = require('express');
const {connectDB} =  require("./mongo/connection");
const cors = require('cors');
const app = express();
const {Task} = require('./entities');
app.use(cors());
app.use(express.json());


connectDB().then(() => console.log("Connected to database!"))

app.get('/task', async (req, res) => {
const tasks = await Task.find().exec();
    res.status(200).json(tasks);
});

app.post('/task', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
});

app.delete('/task/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id).exec();
    res.status(204).send();
});

const server = app.listen(3001, () => {
    console.log('Server is up and running ⚡')
});
