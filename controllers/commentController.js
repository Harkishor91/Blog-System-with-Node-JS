const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { validationResult } = require("express-validator");

const addComment = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationMessage = errors.array()[0].msg;
    return res.status(400).json({ status: 400, message: validationMessage });
  }

  try {
    const { content, postId } = req.body;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user.userId, // Assuming user is authenticated
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find comments associated with the post
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "firstName lastName email userRole"
    );

    res.status(200).json({
      message: "Comments fetched successfully",
      comments,
      totalComment: comments.length,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the comment
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};
