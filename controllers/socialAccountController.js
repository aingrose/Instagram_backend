const SocialAccount = require('../models/SocialAccount');


exports.connectAccount = async (req, res) => {
  const { platform, accessToken, username } = req.body;
  try {
    const account = await SocialAccount.create({
      userId: req.user.id,
      platform,
      accessToken,
      username,
    });
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 


exports.getAccounts = async (req, res) => {
  try {
    const accounts = await SocialAccount.find({ userId: req.user.id });
    res.status(200).json(accounts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};