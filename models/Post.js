const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  blogImage: { type: String, required: false }, // URL/path to the image
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
