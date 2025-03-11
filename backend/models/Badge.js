const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    criteria: {
      type: {
        type: String,
        enum: ['watchCount', 'listCount', 'reviewCount', 'genreWatch'],
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
      genre: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge; 