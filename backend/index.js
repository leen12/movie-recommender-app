const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const tvRoutes = require('./routes/tvRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create data directory structure
const fs = require('fs');
const path = require('path');
const DB_DIR = path.join(__dirname, 'data');
const SAMPLE_DIR = path.join(__dirname, 'data/sample');

// Ensure directories exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

if (!fs.existsSync(SAMPLE_DIR)) {
  fs.mkdirSync(SAMPLE_DIR, { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tv', tvRoutes);
app.use('/api/user', userRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log('Using local JSON database for development');
}); 