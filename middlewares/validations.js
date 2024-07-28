const { body } = require("express-validator");

// Validation middleware for user registration
const validateRegisterUser = [
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("userRole").notEmpty().withMessage("User role is required"),
];

// Validation middleware for creating a post
const validateCreatePost = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  // body("blogImage").notEmpty().withMessage("Blog image is required"),
];
const validateAddComment = [
  body("postId").notEmpty().withMessage("PostId is required"),
  body("content").notEmpty().withMessage("Content is required"),
];

module.exports = {
  validateRegisterUser,
  validateCreatePost,
  validateAddComment,
};
