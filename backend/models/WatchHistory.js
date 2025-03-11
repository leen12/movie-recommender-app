const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema(
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
    watchedDate: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 100, // Percentage of content watched
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can't have duplicate entries for the same content
watchHistorySchema.index({ user: 1, contentId: 1, contentType: 1 }, { unique: true });

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);

module.exports = WatchHistory; 