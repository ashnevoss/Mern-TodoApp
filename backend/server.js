require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS Configuration - Allow all origins (DEVELOPMENT ONLY)
app.use(cors({
  origin: '*',
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MERN Todo API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS enabled for all origins (development mode)');
});
