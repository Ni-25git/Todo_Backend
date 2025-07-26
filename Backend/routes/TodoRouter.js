const express = require('express');
const TodoModel = require('../model/TodoModel');
const authMiddleware = require('../middleware/authMiddleware');
const todo = express.Router();

// Get all todos for the authenticated user
todo.get("/", authMiddleware, async (req, res) => {
    try {
        const todos = await TodoModel.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).send({ message: 'Todos fetched successfully', todos });
    } catch (error) {
        console.error('Error fetching todos', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Add new todo
todo.post('/add', authMiddleware, async (req, res) => {
    try {
        const { title, description, priority } = req.body;
        const newTodo = new TodoModel({
            title,
            description,
            priority: priority || 'medium',
            userId: req.user.userId
        });
        await newTodo.save();
        res.status(201).send({ message: 'Todo added successfully', newTodo });
    } catch (error) {
        console.error('Error adding todo', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Update todo
todo.put('/update/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;
        const todo = await TodoModel.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            { title, description, status, priority },
            { new: true }
        );
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        res.status(200).send({ message: 'Todo updated successfully', todo });
    } catch (error) {
        console.error('Error updating todo', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Toggle todo status
todo.patch('/toggle/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await TodoModel.findOne({ _id: id, userId: req.user.userId });
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        todo.status = !todo.status;
        await todo.save();
        res.status(200).send({ message: 'Todo status toggled successfully', todo });
    } catch (error) {
        console.error('Error toggling todo status', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Delete todo
todo.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await TodoModel.findOneAndDelete({ _id: id, userId: req.user.userId });
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        res.status(200).send({ message: 'Todo deleted successfully', todo });
    } catch (error) {
        console.error('Error deleting todo', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get todos by filter (all, completed, pending)
todo.get('/filter/:status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.params;
        let query = { userId: req.user.userId };
        
        if (status === 'completed') {
            query.status = true;
        } else if (status === 'pending') {
            query.status = false;
        }
        
        const todos = await TodoModel.find(query).sort({ createdAt: -1 });
        res.status(200).send({ message: 'Todos filtered successfully', todos });
    } catch (error) {
        console.error('Error filtering todos', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = todo;