const express = require('express');
const { schedulePost, getPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');


const multer = require('multer');
const { schedulePost } = require('../controllers/postController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' }); 


router.post('/schedule', upload.single('image'), schedulePost);

router.post('/', protect, schedulePost);
router.get('/', protect, getPosts);

module.exports = router;