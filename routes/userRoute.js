const express = require("express");
const authMiddleware = require("../middlewares/authentication");
const {validateRegisterUser} = require("../middlewares/validations");

const router = express.Router();

//  import controller methods here
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("./../controllers/userController");

// define all routes
router.post("/registerUser", validateRegisterUser, registerUser);
router.post("/loginUser", loginUser);
// use authentication for get user list
router.get("/getAllUsers", authMiddleware, getAllUsers);

module.exports = router;
