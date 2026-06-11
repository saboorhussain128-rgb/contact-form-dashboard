const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");

/**
 * Home Page
 */
router.get("/", (req, res) => {
  res.render("index", {
    success: req.query.success,
  });
});

/**
 * Save Contact Form
 */
router.post("/contact", async (req, res) => {
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
router.get("/messages", async (req, res) => {
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
router.post("/messages/delete/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    console.log("🗑️ Message Deleted");

    res.redirect("/messages");
  } catch (error) {
    console.log("Delete Error:", error);

    res.send("Failed to delete message");
  }
});

module.exports = router;