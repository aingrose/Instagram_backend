const axios = require("axios");

const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const getUserStories = async () => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${INSTAGRAM_ACCOUNT_ID}/stories`,
      {
        params: { access_token: ACCESS_TOKEN },
      }
    )

    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching stories:", error.response?.data || error.message);
    return [];
  }
}  


const getMediaInfo = async (mediaId) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/v19.0/${mediaId}`, {
      params: {
        fields: "id,caption,media_type,media_url,permalink,timestamp,username",
        access_token: ACCESS_TOKEN,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching media info for ${mediaId}:`, error.response?.data || error.message);
    return null;
  }
};


const getStoriesWithMediaInfo = async (req, res) => {
  const stories = await getUserStories();

  const storiesWithMediaInfo = await Promise.all(
    stories.map(async (story) => {
      const mediaInfo = await getMediaInfo(story.id);
      return { ...story, mediaInfo };
    })  
  );

  res.json({ stories: storiesWithMediaInfo });
};




const mediaConfig = {
  user_id: INSTAGRAM_ACCOUNT_ID, 
  access_token: ACCESS_TOKEN, 
};


const uploadStoryToInstagram = async (req, res) => {
  const { caption, image_url } = req.body; //
   console.log({"image_url ": image_url});
   
  try {
    if (!image_url) {
      return res.status(400).json({ error: "image_url is required" });
    }  
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${mediaConfig.user_id}/media`,
      null, 
      {
        params: {
          image_url,
          caption,
          is_story: true,
          access_token: mediaConfig.access_token,
        },
      }
    )

    res.json({ success: true, containerId: response.data.id });

  } catch (error) {
    console.error("Error creating story container:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Something went wrong" });
  }
}


http://jsutinstolpe.com/sandbox/me-and_bubbles_1080.jpg
 


module.exports = { getStoriesWithMediaInfo,getUserStories,getMediaInfo,uploadStoryToInstagram };
