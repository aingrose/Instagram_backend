const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config(); 

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PAGE_ID = process.env.PAGE_ID; 
const IG_BUSINESS_ID = process.env.INSTAGRAM_BUSINESS_ID; 


// this is the url to fetch user id from username 

// GET https://graph.facebook.com/v19.0/17841472944056091?fields=business_discovery.username(karthi_freeqizz){id,username}&access_token=EAAWdeAr5kTQBO5STVNpELn9HZBIZBOqJZAjZBoyemEPRXa3SR4O4pT2b4m7TLOHvwSnOdNjWMi9CN0NBtb9gfYUX6lc0ZCMoneT3Or5y0ESkrWgND7YoO52wMtZACgYmGY3Lab2I9LsL7aitBNUDZAMZBvb6EBBck4Gm1Ygqa8uzt3W5yPzI0oGZCtPcO26T2kMQO

//resposnse
// {
//   "business_discovery": {
//      "id": "17841451032786853",
//      "username": "karthi_freeqizz"
//   },
//   "id": "17841472944056091"
// }  

// to check permisson is granted nor not
//https://graph.facebook.com/v19.0/me/permissions?access_token=EAAWdeAr5kTQBO5STVNpELn9HZBIZBOqJZAjZBoyemEPRXa3SR4O4pT2b4m7TLOHvwSnOdNjWMi9CN0NBtb9gfYUX6lc0ZCMoneT3Or5y0ESkrWgND7YoO52wMtZACgYmGY3Lab2I9LsL7aitBNUDZAMZBvb6EBBck4Gm1Ygqa8uzt3W5yPzI0oGZCtPcO26T2kMQO

router.get('/getIdByname', async (req, res) => {
  try {
     const {username} =  req.query.username // Default username if not provided

      const url = `https://graph.facebook.com/v19.0/${IG_BUSINESS_ID}?fields=business_discovery.username(${username}){id,username}&access_token=${ACCESS_TOKEN}`;

      const response = await axios.get(url);
      res.json(response.data);

  } catch (error) {
      console.error("Error fetching business discovery data:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.post("/send-messages", async (req, res) => {
  const { recipientId, message } = req.body;

  if (!recipientId || !message) {
      return res.status(400).json({ error: "Recipient ID and message are required" });
  }

  try {
      const response = await axios.post(
          `https://graph.facebook.com/v18.0/${IG_BUSINESS_ID}/messages`,
          {
              recipient: { id: recipientId },
              message: { text: message }
          },
          {  
              headers: {
                  Authorization: `Bearer ${ACCESS_TOKEN}`,
                  "Content-Type": "application/json"
              }
          }
      );

      res.json({ success: true, data: response.data });
  } catch (error) {
      res.status(500).json({
          error: error.response ? error.response.data : error.message
      });
  }
});



router.get("/getusersid", async (req, res) => {
  if (!ACCESS_TOKEN || !IG_BUSINESS_ID) {
    return res.status(400).json({ error: "Missing API credentials" });
  }

  const url =  `https://graph.facebook.com/v18.0/me/accounts?access_token=${ACCESS_TOKEN}`
;


  try {
    const response = await axios.get(url);
    console.log("User Conversations:", response.data);

    res.json({
      success: true,
      data: response.data.data || [],
    });
  } catch (error) {
    console.error("Error fetching conversations:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

//get  recipient  id 

router.get("/get-user-id/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const url = `https://graph.facebook.com/v18.0/${IG_BUSINESS_ID}?fields=business_discovery.username(${username}){id,username}&access_token=${ACCESS_TOKEN}`;

    const response = await axios.get(url);

  
    if (!response.data.business_discovery) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userId = response.data.business_discovery.id;

    res.json({ success: true, user_id: userId, username: response.data.business_discovery.username });
  } catch (error) {
    console.error("Error fetching user ID:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});   


router.get("/get-recipients", async (req, res) => {
  try {
      const url = `https://graph.facebook.com/v22.0/${IG_BUSINESS_ACCOUNT_ID}/conversations?fields=participants&access_token=${ACCESS_TOKEN}`;

      const response = await axios.get(url);

      console.log("API Response:", response.data); // Debugging

      if (!response.data.data || response.data.data.length === 0) {
          return res.status(404).json({ success: false, message: "No conversations found." });
      }

      const recipients = response.data.data.map(convo => ({
          conversation_id: convo.id,
          user_id: karthi_freeqizz, 
          name: convo.participants.data[0]?.name || "Unknown"
      }));

      res.json({ success: true, recipients });
  } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});
 
router.post("/send-message", async (req, res) => {
  const { recipientId, messageText } = req.body;

  if (!recipientId || !messageText) {
    return res.status(400).json({ error: "Recipient ID and message text are required" });
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${PAGE_ID}/messages`,
      {
        recipient: { id: recipientId },
        message: { text: messageText },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    res.status(200).json({ success: true, response: response.data });
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Failed to send message" });
  }
})


router.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "YOUR_VERIFY_TOKEN";
  
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
})


router.post("/webhook", (req, res) => {
  let body = req.body;

  if (body.object === "instagram") {
    body.entry.forEach(entry => {
      let messaging = entry.messaging[0];

   
      let sender_psid = messaging.sender.id;
      console.log("Received PSID:", sender_psid);

    
      res.status(200).send("EVENT_RECEIVED");
    });
  } else {
    res.sendStatus(404);
  }
});
module.exports = router