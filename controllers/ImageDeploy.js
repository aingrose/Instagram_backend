const fs = require("fs");
const axios = require("axios");
const express = require("express");

const app = express();
const PORT = 3000;

// Function to download and save image
async function downloadImage(url, path) {
  const response = await axios({
    url,
    
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}


app.use("/uploads", express.static("uploads"));

app.get("/download", async (req, res) => {
  const imageUrl =
    "https://unsplash.com/photos/programming-code-abstract-technology-background-of-software-developer-and-computer-script-ltpb_WinC3Y";
  const imagePath = "uploads/image.jpg";

  try {
    await downloadImage(imageUrl, imagePath);
    res.send(`Image saved! Access it at: http://localhost:${PORT}/uploads/image.jpg`);
  } catch (error) {
    res.status(500).send("Error downloading image: " + error.message);
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
