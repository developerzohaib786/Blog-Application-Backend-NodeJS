require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { checkForCookie } = require("../middlewares/authentication");
const userRoute = require("../routes/user");
const blogRoute = require("../routes/blog");
const Blog = require("../models/blog");

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForCookie("token"));
app.use(express.static(path.resolve(__dirname, "../public")));
app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "../views"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI) // use env variable
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

// Routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.get("/getblog/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  return res.render("updateBlog", {
    user: req.user,
    blog,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Export as serverless handler
module.exports = (req, res) => {
  return app(req, res);
};
