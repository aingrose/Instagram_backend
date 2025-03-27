const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, required: true },
  accessToken: { type: String, required: true },
  username: { type: String, required: true },
  connectedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SocialAccount', socialAccountSchema);