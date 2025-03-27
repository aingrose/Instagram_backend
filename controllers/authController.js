const User = require('../models/User');
const jwt = require('jsonwebtoken');
 


exports.register = async (req, res) => {
  const {confirmPassword ,email, firstName,lastName,password } = req.body;
  console.log("From frontEnd",confirmPassword ,email, firstName,lastName,password);
  
  try { 

    const user = await User.create({  email, password, confirmPassword,firstName,lastName,password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token })

     
  } catch (err) {
    res.status(400).json({ message: err.message });
  }  
} 



exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


exports.instagramLogin = (req, res) => {
  const authURL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authURL);
};


exports.instagramCallback = async (req, res) => {
  const { code } = req.query; 
  
  if (!code) {
    return res.status(400).json({ message: "Authorization code not found" });
  }

  try {
   
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', null, {
      params: {
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code: code
      }
    });

    const accessToken = tokenResponse.data.access_token;
    const userId = tokenResponse.data.user_id;

   
    const userResponse = await axios.get(`https://graph.instagram.com/${userId}?fields=id,username,account_type,media_count&access_token=${accessToken}`);

  
    const token = jwt.sign({ id: userId, username: userResponse.data.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: userResponse.data });
  } catch (error) {
    res.status(500).json({ message: error.response?.data || error.message });
  }
};



// Get Instagram Business Account ID
// exports.instagetInd = async (req, res) => {
//   try {
//     const response = await axios.get(
//       `https://graph.facebook.com/v22.0/me/accounts?fields=id,name,instagram_business_account&access_token=${ACCESS_TOKEN}`
//     );
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json(error.response?.data || error.message);
//   }
// }




