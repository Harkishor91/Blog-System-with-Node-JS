const mongoose = require("mongoose");
const connectDb = (url) => {
  return mongoose
    .connect(url, {})
    .then()
    .catch((er) => {
      console.log("Db connection error");
    });
};
module.exports = connectDb;
