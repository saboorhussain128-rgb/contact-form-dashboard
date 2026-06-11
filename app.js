require("dotenv").config();

/**
 * Main Application Entry Point
 * Contact Form Project
 */

const express = require("express");
const mongoose = require("mongoose");

const app = express();

/**
 * Configuration
 */
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

/**
 * Middleware
 */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

/**
 * View Engine
 */
app.set("view engine", "ejs");

/**
 * Database Connection
 */
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("❌ MongoDB Connection Error:", error);
  });

/**
 * Model
 */
const Contact = require("./models/Contact");

/**
 * Home Page
 */
app.get("/", (req, res) => {
  res.render("index", {
    success: req.query.success,
  });
});

/**
 * Save Contact Form
 */
app.post("/contact", async (req, res) => {
  try {
    const contactData = new Contact(req.body);

    await contactData.save();

    console.log("📩 Message Saved Successfully");

    res.redirect("/?success=true");
  } catch (error) {
    console.log("Save Error:", error);

    res.redirect("/?success=false");
  }
});

/**
 * View All Messages
 */
app.get("/messages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({
      createdAt: -1,
    });

    res.render("messages", {
      messages,
    });
  } catch (error) {
    console.log("Fetch Error:", error);

    res.send("Error loading messages");
  }
});

/**
 * Delete Message
 */
app.post("/messages/delete/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    console.log("🗑️ Message Deleted");

    res.redirect("/messages");
  } catch (error) {
    console.log("Delete Error:", error);

    res.send("Failed to delete message");
  }
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});