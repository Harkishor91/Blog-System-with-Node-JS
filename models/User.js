const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  userSchema.methods.createJWT = function () {
    return jwt.sign(
      {
        userId: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        userRole: this.userRole, 
      },
      process.env.JwtTokenKey,
      { expiresIn: "30d" }
    );
  };
  
  userSchema.methods.comparePassword = async function (comparePassword) {
    const isMatchPassword = await bcrypt.compare(comparePassword, this.password);
    return isMatchPassword;
  };
module.exports = mongoose.model("User", userSchema);
