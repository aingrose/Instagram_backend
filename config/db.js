// const mongoose = require('mongoose');
// require("dotenv").config(); 

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB Atlas ✅");
//   } catch (err) {
//     console.error('MongoDB Connection Error:', err.message);
//     process.exit(1);
//   }  
// }; 


// const { MongoClient } = require("mongodb");

// const client = new MongoClient(process.env.MONGO_URI);
// let db;

// async function connectMongDB() {
//   try {
//     await client.connect();
//     db = client.db("Social_media_platform"); // Database Name
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB Connection Error:", err.message);
//   }
// }

// // Function to get the database instance
// function getDB() {
//   if (!db) {
//     throw new Error("❌ Database not initialized. Call connectDB() first.");
//   }
//   return db;
// }

// // Function to get a collection
// function getCollection(name) {
//   return getDB().collection(name);
// }

// module.exports = { connectMongDB, getDB, getCollection };

require("dotenv").config(); 
const { MongoClient } = require("mongodb");

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  throw new Error("❌ MONGO_URI is missing! Check your .env file.");
}

const client = new MongoClient(mongoURI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("Social_media_platform"); // Database Name
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
}

// Function to get the database instance
function getDB() {
  if (!db) {
    throw new Error("❌ Database not initialized. Call connectDB() first.");
  }
  return db;
}

// Function to get a collection
function getCollection(name) {
  return getDB().collection(name);
}

module.exports = { connectDB, getDB, getCollection };
