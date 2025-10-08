const express = require('express');
const Todo = require('../models/Todo');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create todo
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Todo title is required' });
    }

    const todo = new Todo({
      userId: req.user.userId,
      title: title.trim()
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update todo
router.put('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
