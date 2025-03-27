const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, required: true },
  metrics: {
    followers: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analytics', analyticsSchema);