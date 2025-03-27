const express =  require("express");
const axios = require("axios");
const router =  express.Router()
require("dotenv").config()
const cron = require("node-cron")
const ScheduledPost = require("../models/scheduledPost")
const INSTAGRAM_BUSINESS_ID = process.env.INSTAGRAM_BUSINESS_ID
const ACCESS_TOKEN =process.env.ACCESS_TOKEN


const config = {
  user_id: INSTAGRAM_BUSINESS_ID,
  username: 'demo.page001', 
  access_token: ACCESS_TOKEN
}

router.get('/business-discovery', async (req, res) => {
  try {
      const response = await axios.get(`https://graph.facebook.com/v18.0/${config.user_id}?fields=business_discovery.username(${config.username})&access_token=${config.access_token}`);
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

const mediaConfig = {
  user_id: INSTAGRAM_BUSINESS_ID,
  access_token: ACCESS_TOKEN
}
//sample image url  =https://i.ibb.co/PVFy5cN/logo-png.jpg
router.post('/create-container', async (req, res) => {
  const { caption, imageUrl } = req.body;
  try {
      const response = await axios.post(`https://graph.facebook.com/v18.0/${mediaConfig.user_id}/media`, {
          image_url: imageUrl,
          caption: caption,
          access_token: mediaConfig.access_token
      });
      res.json({ containerId: response.data.id });
  } catch (error) {
      res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
}) 

//container id ={"containerId":"18060676673008400"}

router.post('/publish-media', async (req, res) => {
  const { containerId } = req.body;
  console.log(containerId);
  
  try {
      const response = await axios.post(`https://graph.facebook.com/v18.0/${mediaConfig.user_id}/media_publish`, {
          creation_id: containerId,
          access_token: mediaConfig.access_token
      });
      
       res.json(response.data);

  } catch (error) {
      res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});
let scheduledPosts = []; 
console.log("scheduled posts",scheduledPosts);

router.get("/posts", async (req, res) => {
  try {
   
    const postsResponse = await axios.get(
      `https://graph.facebook.com/v22.0/${INSTAGRAM_BUSINESS_ID}/media`,
      {
        params: {
          fields: "id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count",
          access_token: ACCESS_TOKEN,
        },
      }
    );

    const posts = postsResponse.data.data;

    res.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || error.message);
  }
});

router.get("/insights/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${postId}/insights`,
      {
        params: {
          metric: "likes,comments,shares,profile_visits,total_interactions",
          metric_type: "total_value", 
          period: "lifetime", //
          access_token: ACCESS_TOKEN,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching insights:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || error.message);
  }
})

 
router.post("/comment-post", async (req, res) => {
 
  const { postId,message } = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${postId}/comments`,
      null,
      { params: { message, access_token: ACCESS_TOKEN } }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
})

router.get("/get-comments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${postId}/comments`,
      {
        params: {
           fields: "id,text,timestamp,from{id,username},username",
          access_token: ACCESS_TOKEN,
        },
      }
    );

    res.json(response.data);
    
  } catch (error) {
    res.status(500).json(error.response?.data || { error: "Failed to fetch comments" });
  }
});

router.post("/reply-comment", async (req, res) => {
  const { commentId, message } = req.body;
  
  if (!commentId || !message) {
    return res.status(400).json({ error: "commentId and message are required" });
  }

  console.log("Replying to comment:", commentId, "Message:", message);

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${commentId}/comments`, // Ensure API version is correct
      null,
      { params: { message, access_token: ACCESS_TOKEN } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error replying to comment:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: "Failed to reply to comment" });
  }
});


router.get('/get-comment-author/:commentId', async (req, res) => {
  try {
      const { commentId } = req.params;
       

      if (!accessToken) {
          return res.status(500).json({ error: "Access token is missing in the environment variables" });
      }

      const url = `https://graph.facebook.com/v18.0/${commentId}?fields=from&access_token=${ACCESS_TOKEN}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
          return res.status(400).json({ error: data.error.message });
      }

      res.json(data);
  } catch (error) {
      console.error('Error fetching comment author:', error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});




const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);
let db, scheduledPostsCollection;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("Social_media_platform"); 
    scheduledPostsCollection = db.collection("scheduledPosts"); 
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
} 

connectDB()

router.post("/schedule-media", async (req, res) => {
  try {
    const { containerId, scheduledTime } = req.body;
    console.log("containerId:", containerId, "scheduledTime:", scheduledTime);

    if (!containerId || !scheduledTime) {
      return res.status(400).json({ error: "containerId and scheduledTime are required." });
    }

    let scheduledTimestamp =
      typeof scheduledTime === "number" ? scheduledTime : Math.floor(new Date(scheduledTime).getTime() / 1000);
    
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (scheduledTimestamp < currentTimestamp + 1200) {
      return res.status(400).json({ error: "Scheduled time must be at least 20 minutes in the future." });
    }

 
    const newPost = {
      containerId,
      scheduledTimestamp,
      status: "pending",
      createdAt: new Date()
    };

    const result = await scheduledPostsCollection.insertOne(newPost);
    if (!result.acknowledged) {
      console.error("❌ ERROR: Post was not saved in DB.");
      return res.status(500).json({ error: "Post could not be saved. Try again." });
    }

    console.log(`✅ Post successfully scheduled: ${containerId}`);
    res.json({ message: "Post scheduled successfully", containerId, scheduledTimestamp });

  } catch (error) {
    console.error("❌ Error scheduling media:", error.message);
    res.status(500).json({ error: error.message });
  }
})

async function checkAndPublishPosts() {
  setInterval(async () => {
   // console.log("🔍 Checking for scheduled posts to publish...");

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const postsToPublish = await scheduledPostsCollection.find({
      scheduledTimestamp: { $lte: currentTimestamp },
      status: "pending"
    }).toArray() 

    for (const post of postsToPublish) {
      console.log(`🚀 Publishing post with containerId: ${post.containerId}`);
      const published = await publishPost(post.containerId);

      if (published) {
        await scheduledPostsCollection.updateOne(
          { _id: post._id },
          { $set: { status: "published" } }
        );
        console.log(`✅ Post published successfully: ${post.containerId}`);
      } else {
        console.error(`❌ Failed to publish post: ${post.containerId}`);
      }
    }
  }, 60 * 1000); 
}

async function publishPost(containerId) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${INSTAGRAM_BUSINESS_ID}/media_publish`,
      {
        creation_id: containerId,
        access_token: ACCESS_TOKEN,
      }
    );

    console.log(` Post published successfully: ${response.data.id}`);
    return true; 
  } catch (error) {
    console.error(" Error publishing post:", error.response?.data || error.message);
    return false;
  }
}


checkAndPublishPosts();

module.exports = router

