const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    posterPath: {
      type: String,
      default: '',
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only review a content once
reviewSchema.index({ user: 1, contentId: 1, contentType: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 