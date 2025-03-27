const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, required: true },
  content: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, default: 'scheduled' },
});

module.exports = mongoose.model('Post', postSchema);