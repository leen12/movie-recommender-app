const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Base URL for TMDB API
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Sample data path for development without API key
const SAMPLE_DATA_DIR = path.join(__dirname, '../data/sample');
const SAMPLE_TRENDING_PATH = path.join(SAMPLE_DATA_DIR, 'trending_movies.json');
const SAMPLE_POPULAR_PATH = path.join(SAMPLE_DATA_DIR, 'popular_movies.json');
const SAMPLE_SEARCH_PATH = path.join(SAMPLE_DATA_DIR, 'search_results.json');

// Ensure sample data directory exists
if (!fs.existsSync(SAMPLE_DATA_DIR)) {
  fs.mkdirSync(SAMPLE_DATA_DIR, { recursive: true });
}

// Create sample data files if they don't exist
if (!fs.existsSync(SAMPLE_TRENDING_PATH)) {
  const sampleTrending = {
    page: 1,
    results: [
      {
        id: 1,
        title: 'Sample Movie 1',
        overview: 'This is a sample movie for development.',
        poster_path: null,
        release_date: '2023-01-01',
        vote_average: 8.5
      },
      {
        id: 2,
        title: 'Sample Movie 2',
        overview: 'Another sample movie for development.',
        poster_path: null,
        release_date: '2023-02-01',
        vote_average: 7.9
      }
    ],
    total_pages: 1,
    total_results: 2
  };
  fs.writeFileSync(SAMPLE_TRENDING_PATH, JSON.stringify(sampleTrending, null, 2));
}

if (!fs.existsSync(SAMPLE_POPULAR_PATH)) {
  // Copy the same data for popular movies
  const trendingData = fs.readFileSync(SAMPLE_TRENDING_PATH, 'utf8');
  fs.writeFileSync(SAMPLE_POPULAR_PATH, trendingData);
}

if (!fs.existsSync(SAMPLE_SEARCH_PATH)) {
  // Copy the same data for search results
  const trendingData = fs.readFileSync(SAMPLE_TRENDING_PATH, 'utf8');
  fs.writeFileSync(SAMPLE_SEARCH_PATH, trendingData);
}

// Helper function to check if TMDB API key is set
const isTmdbApiKeySet = () => {
  return process.env.TMDB_API_KEY && 
         process.env.TMDB_API_KEY !== '<your_tmdb_api_key_here>' && 
         process.env.TMDB_API_KEY.length > 5;
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (isTmdbApiKeySet()) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}&include_adult=false`
      );
      
      res.json(response.data);
    } else {
      // Use sample data if API key is not set
      console.log('TMDB API key not set, using sample data');
      const sampleData = JSON.parse(fs.readFileSync(SAMPLE_SEARCH_PATH, 'utf8'));
      res.json(sampleData);
    }
  } catch (error) {
    console.error('Error searching movies:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    if (isTmdbApiKeySet()) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}&page=${page}`
      );
      
      res.json(response.data);
    } else {
      // Use sample data if API key is not set
      console.log('TMDB API key not set, using sample data');
      const sampleData = JSON.parse(fs.readFileSync(SAMPLE_TRENDING_PATH, 'utf8'));
      res.json(sampleData);
    }
  } catch (error) {
    console.error('Error getting trending movies:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    if (isTmdbApiKeySet()) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`
      );
      
      res.json(response.data);
    } else {
      // Use sample data if API key is not set
      console.log('TMDB API key not set, using sample data');
      const sampleData = JSON.parse(fs.readFileSync(SAMPLE_POPULAR_PATH, 'utf8'));
      res.json(sampleData);
    }
  } catch (error) {
    console.error('Error getting popular movies:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isTmdbApiKeySet()) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,similar`
      );
      
      res.json(response.data);
    } else {
      // Use sample data if API key is not set
      console.log('TMDB API key not set, using sample data');
      const sampleData = JSON.parse(fs.readFileSync(SAMPLE_TRENDING_PATH, 'utf8'));
      // Return the first movie from sample data
      res.json({
        ...sampleData.results[0],
        credits: { cast: [], crew: [] },
        videos: { results: [] },
        similar: { results: [] }
      });
    }
  } catch (error) {
    console.error(`Error getting movie details for ID ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get movie genres
// @route   GET /api/movies/genres/list
// @access  Public
router.get('/genres/list', async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movie genres:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Discover movies by genre
// @route   GET /api/movies/discover
// @access  Public
router.get('/discover', async (req, res) => {
  try {
    const { 
      with_genres, 
      sort_by = 'popularity.desc', 
      page = 1,
      primary_release_year,
      with_cast,
      with_crew,
      with_companies,
      with_keywords,
      with_runtime_gte,
      with_runtime_lte
    } = req.query;
    
    let url = `${TMDB_BASE_URL}/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${page}&sort_by=${sort_by}&include_adult=false`;
    
    if (with_genres) url += `&with_genres=${with_genres}`;
    if (primary_release_year) url += `&primary_release_year=${primary_release_year}`;
    if (with_cast) url += `&with_cast=${with_cast}`;
    if (with_crew) url += `&with_crew=${with_crew}`;
    if (with_companies) url += `&with_companies=${with_companies}`;
    if (with_keywords) url += `&with_keywords=${with_keywords}`;
    if (with_runtime_gte) url += `&with_runtime.gte=${with_runtime_gte}`;
    if (with_runtime_lte) url += `&with_runtime.lte=${with_runtime_lte}`;
    
    const response = await axios.get(url);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error discovering movies:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get personalized movie recommendations
// @route   GET /api/movies/recommendations
// @access  Private
router.get('/recommendations/personalized', protect, async (req, res) => {
  try {
    // This would be a more complex implementation in a real app
    // For now, we'll just return popular movies as a placeholder
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=1`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching personalized recommendations:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 