const express = require("express");
const authMiddleware = require("../middlewares/authentication");
const {validateAddComment} = require("../middlewares/validations");

const router = express.Router();

// Import controller methods
const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

// Define all routes
router.post("/addComment", authMiddleware, validateAddComment,addComment);
router.get("/getComments/:postId", authMiddleware, getComments);
router.delete("/deleteComment/:id", authMiddleware, deleteComment);

module.exports = router;
