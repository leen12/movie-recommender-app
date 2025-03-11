const mongoose = require('mongoose');

const customListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    items: [
      {
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
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CustomList = mongoose.model('CustomList', customListSchema);

module.exports = CustomList; 