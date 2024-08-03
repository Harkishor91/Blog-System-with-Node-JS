const express = require("express");
const authMiddleware = require("../middlewares/authentication");
const { validateRegisterUser } = require("../middlewares/validations");
const imageUpload = require("../middlewares/Imageupload");

const router = express.Router();

//  import controller methods here
const {
  registerUser,
  loginUser,
  getAllUsers,
  forgotPassword,
  resetPassword
} = require("./../controllers/userController");

// define all routes
router.post(
  "/registerUser",
  validateRegisterUser,
  // imageUpload.single("profileImage"),
  registerUser
);
router.post("/loginUser", loginUser);
// use authentication for get user list
router.get("/getAllUsers", authMiddleware, getAllUsers);
router.post("/forgotPassword", authMiddleware, forgotPassword);
router.post("/resetPassword", authMiddleware, resetPassword);

module.exports = router;
