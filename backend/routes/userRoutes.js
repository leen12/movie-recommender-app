const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { findUserById, findWatchlistByUserId, createWatchlist, updateWatchlist } = require('../config/jsonDb');
const WatchHistory = require('../models/WatchHistory');
const CustomList = require('../models/CustomList');
const Rating = require('../models/Rating');
const Review = require('../models/Review');
const Badge = require('../models/Badge');
const User = require('../models/User');

const router = express.Router();

// @desc    Get user watchlist
// @route   GET /api/user/watchlist
// @access  Private
router.get('/watchlist', protect, async (req, res) => {
  try {
    // Find user's watchlist
    const watchlist = findWatchlistByUserId(req.user.id);

    if (watchlist) {
      res.json(watchlist.items || []);
    } else {
      // Create empty watchlist if it doesn't exist
      const newWatchlist = createWatchlist({
        userId: req.user.id,
        items: []
      });
      res.json(newWatchlist.items);
    }
  } catch (error) {
    console.error('Error fetching watchlist:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add item to watchlist
// @route   POST /api/user/watchlist
// @access  Private
router.post('/watchlist', protect, async (req, res) => {
  try {
    const { id, title, poster_path, media_type, release_date, first_air_date } = req.body;

    if (!id || !title || !media_type) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Find user's watchlist
    let watchlist = findWatchlistByUserId(req.user.id);

    if (watchlist) {
      // Check if item already exists in watchlist
      const itemExists = watchlist.items.some(item => item.id === id && item.media_type === media_type);

      if (itemExists) {
        return res.status(400).json({ message: 'Item already in watchlist' });
      }

      // Add item to watchlist
      const updatedItems = [
        ...watchlist.items,
        {
          id,
          title,
          poster_path,
          media_type,
          added_at: new Date().toISOString(),
          release_date: release_date || first_air_date
        }
      ];

      // Update watchlist
      const updatedWatchlist = updateWatchlist(watchlist.id, { items: updatedItems });
      res.status(201).json(updatedWatchlist.items);
    } else {
      // Create new watchlist with item
      const newWatchlist = createWatchlist({
        userId: req.user.id,
        items: [
          {
            id,
            title,
            poster_path,
            media_type,
            added_at: new Date().toISOString(),
            release_date: release_date || first_air_date
          }
        ]
      });
      res.status(201).json(newWatchlist.items);
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Remove item from watchlist
// @route   DELETE /api/user/watchlist/:id
// @access  Private
router.delete('/watchlist/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { media_type } = req.query;

    if (!media_type) {
      return res.status(400).json({ message: 'Please provide media_type' });
    }

    // Find user's watchlist
    const watchlist = findWatchlistByUserId(req.user.id);

    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    // Remove item from watchlist
    const updatedItems = watchlist.items.filter(
      item => !(item.id === parseInt(id) && item.media_type === media_type)
    );

    // Update watchlist
    const updatedWatchlist = updateWatchlist(watchlist.id, { items: updatedItems });
    res.json(updatedWatchlist.items);
  } catch (error) {
    console.error('Error removing from watchlist:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add to watch history
// @route   POST /api/user/watch-history
// @access  Private
router.post('/watch-history', protect, async (req, res) => {
  try {
    const { contentId, contentType, title, posterPath, progress } = req.body;

    // Check if already in watch history
    const existingEntry = await WatchHistory.findOne({
      user: req.user._id,
      contentId,
      contentType,
    });

    if (existingEntry) {
      // Update existing entry
      existingEntry.watchedDate = Date.now();
      existingEntry.progress = progress || existingEntry.progress;
      await existingEntry.save();
      
      res.status(200).json(existingEntry);
    } else {
      // Create new entry
      const watchHistoryEntry = await WatchHistory.create({
        user: req.user._id,
        contentId,
        contentType,
        title,
        posterPath,
        progress: progress || 100,
      });
      
      res.status(201).json(watchHistoryEntry);
    }
  } catch (error) {
    console.error('Error adding to watch history:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user watch history
// @route   GET /api/user/watch-history
// @access  Private
router.get('/watch-history', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, contentType } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { user: req.user._id };
    if (contentType) query.contentType = contentType;
    
    const watchHistory = await WatchHistory.find(query)
      .sort({ watchedDate: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await WatchHistory.countDocuments(query);
    
    res.json({
      watchHistory,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    console.error('Error fetching watch history:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete from watch history
// @route   DELETE /api/user/watch-history/:id
// @access  Private
router.delete('/watch-history/:id', protect, async (req, res) => {
  try {
    const watchHistoryEntry = await WatchHistory.findById(req.params.id);
    
    if (!watchHistoryEntry) {
      return res.status(404).json({ message: 'Watch history entry not found' });
    }
    
    // Check if the entry belongs to the user
    if (watchHistoryEntry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await watchHistoryEntry.remove();
    
    res.json({ message: 'Watch history entry removed' });
  } catch (error) {
    console.error('Error deleting from watch history:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a custom list
// @route   POST /api/user/lists
// @access  Private
router.post('/lists', protect, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    
    const customList = await CustomList.create({
      user: req.user._id,
      name,
      description: description || '',
      isPublic: isPublic || false,
      items: [],
    });
    
    res.status(201).json(customList);
  } catch (error) {
    console.error('Error creating custom list:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user's custom lists
// @route   GET /api/user/lists
// @access  Private
router.get('/lists', protect, async (req, res) => {
  try {
    const customLists = await CustomList.find({ user: req.user._id });
    
    res.json(customLists);
  } catch (error) {
    console.error('Error fetching custom lists:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get a specific custom list
// @route   GET /api/user/lists/:id
// @access  Private/Public (depends on list privacy)
router.get('/lists/:id', async (req, res) => {
  try {
    const customList = await CustomList.findById(req.params.id)
      .populate('user', 'username profilePicture');
    
    if (!customList) {
      return res.status(404).json({ message: 'Custom list not found' });
    }
    
    // Check if the list is private and if the user is authorized
    if (!customList.isPublic && (!req.user || customList.user._id.toString() !== req.user._id.toString())) {
      return res.status(401).json({ message: 'Not authorized to view this list' });
    }
    
    res.json(customList);
  } catch (error) {
    console.error('Error fetching custom list:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add item to custom list
// @route   POST /api/user/lists/:id/items
// @access  Private
router.post('/lists/:id/items', protect, async (req, res) => {
  try {
    const { contentId, contentType, title, posterPath } = req.body;
    
    const customList = await CustomList.findById(req.params.id);
    
    if (!customList) {
      return res.status(404).json({ message: 'Custom list not found' });
    }
    
    // Check if the list belongs to the user
    if (customList.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if item already exists in the list
    const itemExists = customList.items.some(item => 
      item.contentId === contentId && item.contentType === contentType
    );
    
    if (itemExists) {
      return res.status(400).json({ message: 'Item already in list' });
    }
    
    // Add item to list
    customList.items.push({
      contentId,
      contentType,
      title,
      posterPath,
    });
    
    await customList.save();
    
    res.status(201).json(customList);
  } catch (error) {
    console.error('Error adding item to custom list:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Remove item from custom list
// @route   DELETE /api/user/lists/:id/items/:itemId
// @access  Private
router.delete('/lists/:id/items/:itemId', protect, async (req, res) => {
  try {
    const customList = await CustomList.findById(req.params.id);
    
    if (!customList) {
      return res.status(404).json({ message: 'Custom list not found' });
    }
    
    // Check if the list belongs to the user
    if (customList.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Remove item from list
    customList.items = customList.items.filter(item => 
      item._id.toString() !== req.params.itemId
    );
    
    await customList.save();
    
    res.json(customList);
  } catch (error) {
    console.error('Error removing item from custom list:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete custom list
// @route   DELETE /api/user/lists/:id
// @access  Private
router.delete('/lists/:id', protect, async (req, res) => {
  try {
    const customList = await CustomList.findById(req.params.id);
    
    if (!customList) {
      return res.status(404).json({ message: 'Custom list not found' });
    }
    
    // Check if the list belongs to the user
    if (customList.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await customList.remove();
    
    res.json({ message: 'Custom list removed' });
  } catch (error) {
    console.error('Error deleting custom list:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Rate a movie or TV show
// @route   POST /api/user/ratings
// @access  Private
router.post('/ratings', protect, async (req, res) => {
  try {
    const { contentId, contentType, rating, title, posterPath } = req.body;
    
    // Check if already rated
    const existingRating = await Rating.findOne({
      user: req.user._id,
      contentId,
      contentType,
    });
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();
      
      res.json(existingRating);
    } else {
      // Create new rating
      const newRating = await Rating.create({
        user: req.user._id,
        contentId,
        contentType,
        rating,
        title,
        posterPath,
      });
      
      res.status(201).json(newRating);
    }
  } catch (error) {
    console.error('Error rating content:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user's ratings
// @route   GET /api/user/ratings
// @access  Private
router.get('/ratings', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, contentType } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { user: req.user._id };
    if (contentType) query.contentType = contentType;
    
    const ratings = await Rating.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Rating.countDocuments(query);
    
    res.json({
      ratings,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a rating
// @route   DELETE /api/user/ratings/:id
// @access  Private
router.delete('/ratings/:id', protect, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    // Check if the rating belongs to the user
    if (rating.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await rating.remove();
    
    res.json({ message: 'Rating removed' });
  } catch (error) {
    console.error('Error deleting rating:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a review
// @route   POST /api/user/reviews
// @access  Private
router.post('/reviews', protect, async (req, res) => {
  try {
    const { contentId, contentType, reviewText, title, posterPath } = req.body;
    
    // Check if already reviewed
    const existingReview = await Review.findOne({
      user: req.user._id,
      contentId,
      contentType,
    });
    
    if (existingReview) {
      // Update existing review
      existingReview.reviewText = reviewText;
      await existingReview.save();
      
      res.json(existingReview);
    } else {
      // Create new review
      const newReview = await Review.create({
        user: req.user._id,
        contentId,
        contentType,
        reviewText,
        title,
        posterPath,
      });
      
      res.status(201).json(newReview);
    }
  } catch (error) {
    console.error('Error creating review:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user's reviews
// @route   GET /api/user/reviews
// @access  Private
router.get('/reviews', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, contentType } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { user: req.user._id };
    if (contentType) query.contentType = contentType;
    
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Review.countDocuments(query);
    
    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get reviews for a specific content
// @route   GET /api/user/reviews/content/:contentId
// @access  Public
router.get('/reviews/content/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    const { contentType, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { contentId };
    if (contentType) query.contentType = contentType;
    
    const reviews = await Review.find(query)
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Review.countDocuments(query);
    
    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    console.error('Error fetching content reviews:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a review
// @route   DELETE /api/user/reviews/:id
// @access  Private
router.delete('/reviews/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if the review belongs to the user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await review.remove();
    
    res.json({ message: 'Review removed' });
  } catch (error) {
    console.error('Error deleting review:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Like a review
// @route   POST /api/user/reviews/:id/like
// @access  Private
router.post('/reviews/:id/like', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user already liked the review
    const alreadyLiked = review.likedBy.includes(req.user._id);
    
    if (alreadyLiked) {
      // Unlike
      review.likes -= 1;
      review.likedBy = review.likedBy.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      review.likes += 1;
      review.likedBy.push(req.user._id);
    }
    
    await review.save();
    
    res.json(review);
  } catch (error) {
    console.error('Error liking review:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user badges
// @route   GET /api/user/badges
// @access  Private
router.get('/badges', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('badges');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.badges);
  } catch (error) {
    console.error('Error fetching user badges:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 