const fs = require('fs');
const path = require('path');

// Path to our JSON database files
const DB_DIR = path.join(__dirname, '../data');
const USERS_DB = path.join(DB_DIR, 'users.json');
const MOVIES_DB = path.join(DB_DIR, 'movies.json');
const WATCHLIST_DB = path.join(DB_DIR, 'watchlist.json');

// Read data from a JSON file
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading from ${filePath}:`, error);
    return [];
  }
};

// Write data to a JSON file
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
};

// User functions
const getUsers = () => readData(USERS_DB);
const saveUsers = (users) => writeData(USERS_DB, users);
const findUserById = (id) => getUsers().find(user => user.id === id);
const findUserByEmail = (email) => getUsers().find(user => user.email === email);
const createUser = (user) => {
  const users = getUsers();
  const newUser = { ...user, id: Date.now().toString() };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Movie functions
const getMovies = () => readData(MOVIES_DB);
const saveMovies = (movies) => writeData(MOVIES_DB, movies);
const findMovieById = (id) => getMovies().find(movie => movie.id === id);

// Watchlist functions
const getWatchlists = () => readData(WATCHLIST_DB);
const saveWatchlists = (watchlists) => writeData(WATCHLIST_DB, watchlists);
const findWatchlistByUserId = (userId) => getWatchlists().find(watchlist => watchlist.userId === userId);
const createWatchlist = (watchlist) => {
  const watchlists = getWatchlists();
  const newWatchlist = { ...watchlist, id: Date.now().toString() };
  watchlists.push(newWatchlist);
  saveWatchlists(watchlists);
  return newWatchlist;
};
const updateWatchlist = (id, updatedWatchlist) => {
  const watchlists = getWatchlists();
  const index = watchlists.findIndex(watchlist => watchlist.id === id);
  if (index !== -1) {
    watchlists[index] = { ...watchlists[index], ...updatedWatchlist };
    saveWatchlists(watchlists);
    return watchlists[index];
  }
  return null;
};

module.exports = {
  getUsers,
  saveUsers,
  findUserById,
  findUserByEmail,
  createUser,
  getMovies,
  saveMovies,
  findMovieById,
  getWatchlists,
  saveWatchlists,
  findWatchlistByUserId,
  createWatchlist,
  updateWatchlist
}; 