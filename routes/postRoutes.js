const express = require("express");
const multer = require("multer");
const {
  createPost,
  getPosts,
  deletePost,
} = require("../controllers/postController");
const authMiddleware = require("../middlewares/authentication");
const {validateCreatePost} = require("../middlewares/validations");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route to create a new post with an image
router.post(
  "/createPost",
  authMiddleware,
  upload.single("blogImage"),
  validateCreatePost,
  createPost
);
router.get("/getPosts", authMiddleware, getPosts);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
