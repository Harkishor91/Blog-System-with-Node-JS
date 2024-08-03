const User = require("./../models/User");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationMessage = errors.array()[0].msg;
    return res.status(400).json({ status: 400, message: validationMessage });
  }

  try {
    const { firstName, lastName, email, password, userRole } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: 400, message: "Email already exists" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      userRole,
    });
    await user.save();
    res
      .status(200)
      .json({ status: 200, message: "User Registered Successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Register User Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ status: 400, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ status: 404, message: "User not found!" });
    }
    const isMatchPassword = await user.comparePassword(password);
    if (!isMatchPassword) {
      res.status(400).json({ status: 400, message: "Invalid Credentials" });
    }
    //   generate token to login user
    const token = user.createJWT();
    res.status(200).json({
      status: 200,
      message: "User Login Successfully",
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userRole: user.userRole,
      },
      token,
    });
  } catch (err) {
    res.send("loginUser failed");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.userId; // get current login  user
    const users = await User.find({ _id: { $ne: userId } }); // remove current login user from list
    res.status(200).json({
      status: 200,
      message: "User List found",
      users,
      totalUser: users.length,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Get User List Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ status: 400, message: "Please provide a valid email" });
  }

  const user = await User.findOne({ email });

  if (user) {
    const payload = {
      userId: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JwtTokenKey, { expiresIn: '10m' });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = passwordTokenExpirationDate;
    await user.save();

    // For development/testing, send the token back in the response
    res.status(200).json({ msg: "Password reset token generated", token });
  } else {
    res.status(404).json({ status: 404, message: "User not found!" });
  }
};


const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    return res.status(400).json({ status: 400, message: "Please provide all values" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ status: 404, message: "User not found!" });
  }

  if (user.resetPasswordExpires <= Date.now()) {
    return res.status(400).json({ status: 400, message: "Reset token has expired" });
  }

  try {
    const payload = jwt.verify(token, process.env.JwtTokenKey);
    if (payload.email !== email) {
      return res.status(400).json({ status: 400, message: "Invalid token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ status: 200, message: "Password reset successful" });
  } catch (err) {
    return res.status(400).json({ status: 400, message: "Invalid or expired token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  forgotPassword,
  resetPassword
};
