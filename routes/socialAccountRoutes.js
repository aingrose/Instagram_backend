const express = require('express');
const { connectAccount, getAccounts } = require('../controllers/socialAccountController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, connectAccount);
router.get('/', protect, getAccounts);

module.exports = router;