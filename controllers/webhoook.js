const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = "your_verify_token"; 

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        console.log("Webhook Verified ");
        res.status(200).send(challenge);
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


app.listen(5000, () => console.log("🚀 Webhook Server Running on Port 5000"));
