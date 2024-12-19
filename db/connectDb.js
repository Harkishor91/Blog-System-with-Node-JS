const mongoose = require("mongoose");
const connectDb = (url) => {
  return mongoose
    .connect(url)
    .then((res) => {
      console.log("Database connected successfully");
    })
    .catch((er) => {
      console.log("Database connection error", er);
    });
};
module.exports = connectDb;
