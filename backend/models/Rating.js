const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentId: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ['movie', 'tv'],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    posterPath: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only rate a content once
ratingSchema.index({ user: 1, contentId: 1, contentType: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating; 