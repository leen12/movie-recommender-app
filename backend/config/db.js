const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Path to our JSON database files
const DB_DIR = path.join(__dirname, '../data');
const USERS_DB = path.join(DB_DIR, 'users.json');
const MOVIES_DB = path.join(DB_DIR, 'movies.json');
const WATCHLIST_DB = path.join(DB_DIR, 'watchlist.json');

// Ensure the data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize empty JSON files if they don't exist
if (!fs.existsSync(USERS_DB)) {
  fs.writeFileSync(USERS_DB, JSON.stringify([], null, 2));
}

if (!fs.existsSync(MOVIES_DB)) {
  fs.writeFileSync(MOVIES_DB, JSON.stringify([], null, 2));
}

if (!fs.existsSync(WATCHLIST_DB)) {
  fs.writeFileSync(WATCHLIST_DB, JSON.stringify([], null, 2));
}

const connectDB = async () => {
  // In development mode, just use JSON database
  if (process.env.NODE_ENV !== 'production') {
    console.log('Using local JSON database for development');
    return; // Exit early, don't try MongoDB connection
  }
  
  // Only try MongoDB in production with valid connection string
  if (process.env.MONGODB_URI && 
      !process.env.MONGODB_URI.includes('<username>')) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      console.log('Falling back to local JSON database');
    }
  } else {
    console.log('No valid MongoDB URI provided, using local JSON database');
  }
};

module.exports = connectDB; 