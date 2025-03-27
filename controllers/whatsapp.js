

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

const API_URL = ` https://graph.facebook.com/v22.0/577874205411500/messages `;

exports.sendmessage = async (req, res) => {
    const { phone, message } = req.body;
    console.log("Received Phone Number:", phone);  // Debugging log
    console.log("Received Message:", message)
    try {
        const response = await axios.post(API_URL, {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'text',
            text: { body: message }
        }, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
        });
        res.json(response.data);
    } catch (error) {
        console.error("WhatsApp API Error:", error.response?.data || error.message);
        res.status(500).json(error.response?.data || { error: 'Failed to send message' });
    }
}


 app.post('/send-image', async (req, res) => {
    try {
        const formData = new FormData();
        formData.append("messaging_product", "whatsapp");
        formData.append("file", fs.createReadStream(__dirname + "/image.jpg")); // Replace with your image path
        formData.append("type", "image/jpeg");

        const uploadResponse = await axios.post(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/media`, formData, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}`, ...formData.getHeaders() }
        });

        const mediaId = uploadResponse.data.id;

        const messageResponse = await axios.post(API_URL, {
            messaging_product: 'whatsapp',
            to: req.body.phone,
            type: 'image',
            image: { id: mediaId }
        }, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
        });

        res.json(messageResponse.data);
    } catch (error) {
        res.status(500).json(error.response ? error.response.data : { error: 'Failed to send image' });
    }
}); 

