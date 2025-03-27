const mongoose = require("mongoose");


const ScheduledPostSchema = new mongoose.Schema({
    containerId:{type:String,require:true},
    scheduledTimestamp: { type: Number, required: true },
    status: { type: String, default: "pending" },
},{ collection: "scheduledPosts" })

module.exports =  mongoose.model("ScheduledPost",ScheduledPostSchema)