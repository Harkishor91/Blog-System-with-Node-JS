const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware function for user authentication
const auth = async (req, res, next) => {
  // Check if the Authorization header is present and starts with "Bearer"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({status:401, message:"Authentication invalid"})
  }
  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the JWT token using the secret key
    const userInfo = jwt.verify(token, process.env.JwtTokenKey);

    const user = User.findById(userInfo.id).select("-password");
    req.user = user;

    // Set the authenticated user information in the request object
    req.user = {
      userId: userInfo.userId,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      userRole:userInfo.userRole,
    };
    next();
  } catch (err) {
    res.status(401).json({status:401, message:"Authentication invalid"})

  }
};

module.exports = auth;
