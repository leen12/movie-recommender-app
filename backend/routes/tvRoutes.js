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
const SAMPLE_TRENDING_PATH = path.join(SAMPLE_DATA_DIR, 'trending_tv.json');
const SAMPLE_POPULAR_PATH = path.join(SAMPLE_DATA_DIR, 'popular_tv.json');
const SAMPLE_SEARCH_PATH = path.join(SAMPLE_DATA_DIR, 'search_tv_results.json');

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
        id: 101,
        name: 'Sample TV Show 1',
        overview: 'This is a sample TV show for development.',
        poster_path: null,
        first_air_date: '2023-01-01',
        vote_average: 8.5
      },
      {
        id: 102,
        name: 'Sample TV Show 2',
        overview: 'Another sample TV show for development.',
        poster_path: null,
        first_air_date: '2023-02-01',
        vote_average: 7.9
      }
    ],
    total_pages: 1,
    total_results: 2
  };
  fs.writeFileSync(SAMPLE_TRENDING_PATH, JSON.stringify(sampleTrending, null, 2));
}

if (!fs.existsSync(SAMPLE_POPULAR_PATH)) {
  // Copy the same data for popular TV shows
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

// @desc    Search TV shows
// @route   GET /api/tv/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (isTmdbApiKeySet()) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}&include_adult=false`
      );
      
      res.json(response.data);
    } else {
      // Use sample data if API key is not set
      console.log('TMDB API key not set, using sample data');
      const sampleData = JSON.parse(fs.readFileSync(SAMPLE_SEARCH_PATH, 'utf8'));
      res.json(sampleData);
    }
  } catch (error) {
    console.error('Error searching TV shows:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get trending TV shows
// @route   GET /api/tv/trending
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    if (isTmdbApiKeySet()) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/trending/tv/week?api_key=${process.env.TMDB_API_KEY}&page=${page}`
      );
      
      res.json(response.data);
    } else {
      // Use sample data if API key is not set
      console.log('TMDB API key not set, using sample data');
      const sampleData = JSON.parse(fs.readFileSync(SAMPLE_TRENDING_PATH, 'utf8'));
      res.json(sampleData);
    }
  } catch (error) {
    console.error('Error getting trending TV shows:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get popular TV shows
// @route   GET /api/tv/popular
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    if (isTmdbApiKeySet()) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/tv/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`
      );
      
      res.json(response.data);
    } else {
      // Use sample data if API key is not set
      console.log('TMDB API key not set, using sample data');
      const sampleData = JSON.parse(fs.readFileSync(SAMPLE_POPULAR_PATH, 'utf8'));
      res.json(sampleData);
    }
  } catch (error) {
    console.error('Error getting popular TV shows:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get TV show details
// @route   GET /api/tv/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isTmdbApiKeySet()) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/tv/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,similar`
      );
      
      res.json(response.data);
    } else {
      // Use sample data if API key is not set
      console.log('TMDB API key not set, using sample data');
      const sampleData = JSON.parse(fs.readFileSync(SAMPLE_TRENDING_PATH, 'utf8'));
      // Return the first TV show from sample data
      res.json({
        ...sampleData.results[0],
        credits: { cast: [], crew: [] },
        videos: { results: [] },
        similar: { results: [] }
      });
    }
  } catch (error) {
    console.error(`Error getting TV show details for ID ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get TV show season details
// @route   GET /api/tv/:id/season/:seasonNumber
// @access  Public
router.get('/:id/season/:seasonNumber', async (req, res) => {
  try {
    const { id, seasonNumber } = req.params;
    
    const response = await axios.get(
      `${TMDB_BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${process.env.TMDB_API_KEY}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TV show season details:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get TV show episode details
// @route   GET /api/tv/:id/season/:seasonNumber/episode/:episodeNumber
// @access  Public
router.get('/:id/season/:seasonNumber/episode/:episodeNumber', async (req, res) => {
  try {
    const { id, seasonNumber, episodeNumber } = req.params;
    
    const response = await axios.get(
      `${TMDB_BASE_URL}/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${process.env.TMDB_API_KEY}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TV show episode details:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get TV show genres
// @route   GET /api/tv/genres/list
// @access  Public
router.get('/genres/list', async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/genre/tv/list?api_key=${process.env.TMDB_API_KEY}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TV show genres:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Discover TV shows by genre
// @route   GET /api/tv/discover
// @access  Public
router.get('/discover', async (req, res) => {
  try {
    const { 
      with_genres, 
      sort_by = 'popularity.desc', 
      page = 1,
      first_air_date_year,
      with_networks,
      with_keywords,
      with_runtime_gte,
      with_runtime_lte
    } = req.query;
    
    let url = `${TMDB_BASE_URL}/discover/tv?api_key=${process.env.TMDB_API_KEY}&page=${page}&sort_by=${sort_by}&include_adult=false`;
    
    if (with_genres) url += `&with_genres=${with_genres}`;
    if (first_air_date_year) url += `&first_air_date_year=${first_air_date_year}`;
    if (with_networks) url += `&with_networks=${with_networks}`;
    if (with_keywords) url += `&with_keywords=${with_keywords}`;
    if (with_runtime_gte) url += `&with_runtime.gte=${with_runtime_gte}`;
    if (with_runtime_lte) url += `&with_runtime.lte=${with_runtime_lte}`;
    
    const response = await axios.get(url);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error discovering TV shows:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 