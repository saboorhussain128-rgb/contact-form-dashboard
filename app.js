require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: "your_secret_key", // change this to a random string in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true only if using HTTPS
}));

// View engine
app.set("view engine", "ejs");

// Routes
const contactRoutes = require("./routes/contactRoutes");
app.use("/", contactRoutes);

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("❌ MongoDB Connection Error:", error);
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});