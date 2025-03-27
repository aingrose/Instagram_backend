const Analytics = require('../models/Analytics');

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.find({ userId: req.user.id });
    res.status(200).json(analytics);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
} 
 