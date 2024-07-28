const express = require("express");
require("dotenv").config();
const app = express();
const connect = require("./db/connectDb");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoutes");
const commentRoute = require("./routes/commentRoute");


// middleware
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// define APIs endpoints
app.use(`/${process.env.BASE_URl}/auth`, userRoute);
app.use(`/${process.env.BASE_URl}/post`, postRoute);
// app.use(`${process.env.BASE_URl}/comment`, commentRoute);
app.use(`/${process.env.BASE_URL}/comment`, commentRoute);

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connect(process.env.DB_URL); // Corrected the environment variable name
    app.listen(port, () => {
      console.log(`Server running on: http://localhost:${port}`);
    });
  } catch (err) {
    console.error("DB Connection error:", err); // Log the actual error
  }
};

startServer();
