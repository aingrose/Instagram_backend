// const express = require("express");
// const axios = require("axios");
// const {getInstaId} =require("../controllers/")
// const { ACCESS_TOKEN } = require("../config/credentials");

// const router = express.Router();

// router.get("/me", async (req, res) => {
//   try {
//     const response = await axios.get(
//       `https://graph.facebook.com/v22.0/me/accounts?fields=id,name,instagram_business_account&access_token=${ACCESS_TOKEN}`
//     );
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json(error.response?.data || error.message);
//   }
// });


// module.exports = router;
