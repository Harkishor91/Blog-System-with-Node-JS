const Post = require("../models/Post");
const { validationResult } = require('express-validator');


const createPost = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationMessage = errors.array()[0].msg;
    return res.status(400).json({ status: 400, message: validationMessage });
  }

  try {
    const { title, content } = req.body;
    const blogImage = req.file ? req.file.path : null;

    const newPost = await Post.create({
      title,
      content,
      author: req.user.userId,
      blogImage,
    });

    // Example of aggregation
    const populatedPost = await Post.aggregate([
      { $match: { _id: newPost._id } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      { $unwind: "$authorDetails" },
      {
        $project: {
          title: 1,
          content: 1,
          blogImage: 1,
          author: 1,
          authorDetails: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            userRole: 1,
            email: 1, // Include fields you want
            // Exclude password and other sensitive fields
          },
          createdAt: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      message: "Post created successfully",
      post: populatedPost[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


const getPosts = async (req, res) => {
    try {
      // Fetch all posts with populated author details
      const posts = await Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails",
          },
        },
        { $unwind: "$authorDetails" },
        {
          $project: {
            title: 1,
            content: 1,
            blogImage: 1,
            author: 1,
            authorDetails: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              userRole: 1,
              email: 1, // Include fields you want
              // Exclude password and other sensitive fields
            },
            createdAt: 1,
          },
        },
      ]);
  
      res.status(200).json({
        status: 200,
        message: "Posts fetched successfully",
        posts,
        totalPost:posts.length
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  };

  const deletePost = async (req, res) => {
    try {
      const { id } = req.params; // Get the post ID from request parameters
  
      // Find and delete the post
      const deletedPost = await Post.findByIdAndDelete(id);
  
      if (!deletedPost) {
        return res.status(404).json({
          status: 404,
          message: "Post not found",
        });
      }
  
      res.status(200).json({
        status: 200,
        message: "Post deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  };

module.exports = {
  createPost,
  getPosts,
  deletePost
};
