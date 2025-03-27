const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const cron = require("node-cron");
const User = require('./models/User')
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs'); 
const instagramMessage = require("./controllers/instagramMessage")
const postOnInsta =require("./controllers/postController")
const instagramRoutesstorie =  require("./routes/InstagramRoutes")

const { connectDB, getCollection } = require("./config/db");

dotenv.config();

connectDB().then(() => {
  console.log("🚀 Server is ready to handle requests!");
}).catch(err => console.error("DB Connection Failed:", err.message));


const app = express();



// Middleware
app.use(express.json());
app.use(cors()); 
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true })); // 


 

app.get('/', (req, res) => {
  res.send('Social Media Management Tool Backend');
});

// Auth Routes 

app.use('/api', authRoutes)
app.use("/instagram", instagramMessage);
app.use("/post",postOnInsta)
app.use("/instagramStorie", instagramRoutesstorie)

const PORT = process.env.PORT || 3000;



// register
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log("Incoming User Data:", firstName, lastName, email, password);

    const usersCollection = getCollection("users"); 

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newUser = await usersCollection.insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Request:", email, password);

    const usersCollection = getCollection("users");

    // Check if user exists
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.status(200).json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
})


// to get a insta bussiness id =  GET "https://graph.facebook.com/v22.0/633624523156835?fields=instagram_business_account&access_token=EAAWdeAr5kTQBO0yCQJcXuYjNgrLM6A04sBt9XnIXPx0BM5DzJMWL85BPWmAXBagyB1CbDZCeQmJl8eDjuH71mbO5F5Uibp0acvZAs5Gt5UaVig4XMZBayKZCXbkb0qcpZCUcgNnLFK77ZAaXODlFtn7Q2aOiVrUtz5aJ0WvhRgV4nDLNcCwi7a9ZBiaAeYafACBNl2BTcfT"

// to get all data of id for linked accounts  https://graph.facebook.com/v18.0/me/accounts?access_token=EAAWdeAr5kTQBO5STVNpELn9HZBIZBOqJZAjZBoyemEPRXa3SR4O4pT2b4m7TLOHvwSnOdNjWMi9CN0NBtb9gfYUX6lc0ZCMoneT3Or5y0ESkrWgND7YoO52wMtZACgYmGY3Lab2I9LsL7aitBNUDZAMZBvb6EBBck4Gm1Ygqa8uzt3W5yPzI0oGZCtPcO26T2kMQO

//https://graph.facebook.com/v18.0/17841472944056091/conversations?access_token=EAAWdeAr5kTQBO5STVNpELn9HZBIZBOqJZAjZBoyemEPRXa3SR4O4pT2b4m7TLOHvwSnOdNjWMi9CN0NBtb9gfYUX6lc0ZCMoneT3Or5y0ESkrWgND7YoO52wMtZACgYmGY3Lab2I9LsL7aitBNUDZAMZBvb6EBBck4Gm1Ygqa8uzt3W5yPzI0oGZCtPcO26T2kMQO

// instagram  

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ID = process.env.INSTAGRAM_BUSINESS_ID;



app.get("/auth/me", async (req, res) => {
  console.log(" /auth/me route hit");
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/me/accounts?fields=id,name,instagram_business_account&access_token=${ACCESS_TOKEN}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});


app.post('/post-image', async (req, res) => {
  const { imageUrl, caption } = req.body;
  try {
      const response = await axios.post(`https://graph.instagram.com/me/media?image_url=${imageUrl}&caption=${caption}&access_token=${ACCESS_TOKEN}`);
      res.json({ success: true });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
})

const mediaConfig = {
  user_id: process.env.INSTAGRAM_BUSINESS_ID, 
  access_token: process.env.ACCESS_TOKEN, 
};


// Route to upload Instagram Story

//story 


// app.post("/uploadd-story", async (req, res) => {
//   const { image_url } = req.body;

//   console.log({ "Received image_url": image_url });

//   try {
//     if (!image_url) {
//       return res.status(400).json({ error: "image_url is required" });
//     } 
//     // Step 1: Create the story container
//     const containerResponse = await axios.post(
//       `https://graph.facebook.com/v19.0/${mediaConfig.user_id}/media`,
//       null,
//       {
//         params: {
//           image_url,
//           media_type: "STORIES",
//           access_token: mediaConfig.access_token,
//         },
//       }
//     )

//     const containerId = containerResponse.data.id;
//     console.log(" Story Container Created:", containerId);

//     // Step 2: Publish the story
//     const publishResponse = await axios.post(
//       `https://graph.facebook.com/v19.0/${mediaConfig.user_id}/media_publish`,
//       null,
//       {
//         params: {
//           creation_id: containerId, // Use the container ID to publish
//           access_token: mediaConfig.access_token,
//         },
//       }
//     );

//     console.log("Story Published:", publishResponse.data);
    
//     res.json({ 
//       success: true, 
//       storyId: publishResponse.data.id,
//       media_url:publishResponse.data.media_url || image_url 
//     });

//   } catch (error) {
//     console.error(" Error uploading story:", error.response?.data || error.message);
//     res.status(500).json({ error: error.response?.data || "Something went wrong" });
//   }
// })

const { MongoClient } = require("mongodb");
const mongoURL = process.env.MONGO_URI;
const dbName = "Social_media_platform";
let db;

// Connect to MongoDB
MongoClient.connect(mongoURL)
  .then(client => {
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB");
  })
  .catch(error => console.error("❌ MongoDB Connection Error:", error));

// Story Upload API
app.post("/uploadd-story", async (req, res) => {
  const { image_url } = req.body;

  console.log({ "Received image_url": image_url });

  try {
    if (!image_url) {
      return res.status(400).json({ error: "image_url is required" });
    }

    // Step 1: Create the story container
    const containerResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${mediaConfig.user_id}/media`,
      null,
      {
        params: {
          image_url,
          media_type: "STORIES",
          access_token: mediaConfig.access_token,
        },
      }
    );

    const containerId = containerResponse.data.id;
    console.log("✅ Story Container Created:", containerId);

    // Step 2: Publish the story
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${mediaConfig.user_id}/media_publish`,
      null,
      {
        params: {
          creation_id: containerId, // Use the container ID to publish
          access_token: mediaConfig.access_token,
        },
      }
    );

    console.log("✅ Story Published:", publishResponse.data);

    
    const storyData = {
      image_url,
      storyId: publishResponse.data.id,
      media_url: publishResponse.data.media_url || image_url,
      createdAt: new Date(),
    };

    await db.collection("stories").insertOne(storyData);

    res.json({
      success: true,
      storyId: storyData.storyId,
      media_url: storyData.media_url,
    });
  } catch (error) {
    console.error("❌ Error uploading story:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Something went wrong" });
  }
});


app.get("/stories", async (req, res) => {
  try {
    const stories = await db.collection("stories").find().sort({ createdAt: -1 }).toArray();
    res.json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
})

// sample image  https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png


//sample id which is created//
//  Story Container Created: 18491403619006532
//Story Published: { id: '18039621281187744' } 
 
app.get("/get-stories", async (req, res) => {  
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${mediaConfig.user_id}/stories`,
      {
        params: {
          fields: "id,media_url,timestamp",
          access_token: mediaConfig.access_token,
        },
      }
    );

    console.log(" Fetched Stories:", response.data.data)
    res.json({
      success: true,
      stories: response.data.data,
    });

  } catch (error) {
    console.error(" Error fetching stories:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || "Something went wrong" });
  }
})

app.get("/gets-stories", async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${config.user_id}/stories`,
      {
        params: {
          fields: "id,media_url,timestamp",
          access_token: config.access_token,
        },
      }
    );

  //  console.log(" User Stories:", response.data.data);
    res.json({ success: true, stories: response.data.data });

  } catch (error) {
    console.error(" Error fetching stories:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || "Something went wrong" });
  }
}) 

https://graph.facebook.com/v18.0/{ig_user_id}/insights?metric=impressions,reach,profile_views&period=day&access_token={ACCESS_TOKEN}

//notification 
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "hello";

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
      console.log("Webhook Verified ");
      res.status(200).send(challenge ,);
  } else {
      res.sendStatus(403);
  }
});


app.post('/webhook', (req, res) => {
  console.log("🔔 Instagram Notification Received:", JSON.stringify(req.body, null, 2));


  if (req.body.entry) {
      req.body.entry.forEach((entry) => {
          entry.changes.forEach((change) => {
              if (change.field === "comments") {
                  console.log("💬 New Comment:", change.value);
              }
          });
      });
  }

  res.sendStatus(200);
});

// https://3083-2409-408d-1e87-e9ec-4905-2c4a-b0b1-92c.ngrok-free.app/webhook


//https://planet-prickle-slipper.glitch.me/webhooks

app.get('/get-notifications', async (req, res) => {
  try {
      const response = await axios.get(`https://graph.instagram.com/me/notifications?access_token=${ACCESS_TOKEN}`);
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



app.post('/send-message', (req, res) => {
    const { userId, message } = req.body;
    messages.push({ userId, message, timestamp: new Date() });
    res.json({ success: true, messages });
})

app.get('/get-messages', (req, res) => {
    res.json(messages);
})

//  user profile 

app.get("/user/profile", async (req, res) => {
  try {
    const url = `https://graph.facebook.com/v22.0/${INSTAGRAM_BUSINESS_ID}?fields=name,username,profile_picture_url,followers_count&access_token=${ACCESS_TOKEN}`

    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: error.message });
  } 
})  
 

//followers and following
app.get("/user/followers-following", async (req, res) => {
   try { 
       const response = await axios.get(
      `https://graph.facebook.com/v22.0/${INSTAGRAM_BUSINESS_ID}?fields=followers_count,follows_count&access_token=${ACCESS_TOKEN}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching followers and following:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || error.message);
  }
});
 
//schedule post

let scheduledPosts = [];

// Schedule a post  

app.post('/schedule-post', (req, res) => {
    const { media_url, caption, postTime } = req.body;
    
    scheduledPosts.push({ media_url, caption, postTime });
    
    res.json({ message: "Post scheduled successfully!", scheduledPosts });
});
  
cron.schedule('* * * * *', async () => {
    const currentTime = new Date().toISOString().slice(0, 16);
    const postsToPublish = scheduledPosts.filter(p => p.postTime === currentTime);

    for (let post of postsToPublish) {
        try {
            const response = await axios.post(`https://graph.instagram.com/me/media`, {
                image_url: post.media_url,
                caption: post.caption,
                access_token: ACCESS_TOKEN
            });
            console.log("Post Published:", response.data);
        } catch (error) {
            console.error("Error publishing post:", error.message);
        }
    }

    scheduledPosts = scheduledPosts.filter(p => p.postTime !== currentTime);
});

const IMAGE_URL = "https://i.ibb.co/PVFy5cN/logo-png.jpg"; // Change this to your image URL
const CAPTION = "Superheroes in action.";


const config = {
  user_id: INSTAGRAM_BUSINESS_ID,
  username: 'demo.page001', // Instagram account username
  access_token: ACCESS_TOKEN
}


const PAGE_ID = "122096946722801172"; 


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



