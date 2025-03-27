const express = require("express");
const { getStoriesWithMediaInfo,getUserStories,getMediaInfo,uploadStoryToInstagram } = require("../controllers/storiesInsta");

const router = express.Router();

// Route to get Instagram Stories with media info
router.get("/getstories", getUserStories);
router.get("/getmedia", getMediaInfo);
router.get("/getstorymedia", getStoriesWithMediaInfo);
router.get("/uploadStory",uploadStoryToInstagram );

module.exports = router;
 

