const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");

/**
 * Home Page
 */
router.get("/", (req, res) => {
  res.render("index", {
    success: req.query.success,
    error: null,
    formData: {},
  });
});

/**
 * Save Contact Form
 */
router.post("/contact", async (req, res) => {
  try {
    // Extract form data from request body
    const { firstName, lastName, email, phone, message } = req.body;

    /**
     * Server-side validation
     */
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.render("index", {
        success: false,
        error: "All fields are required.",
        formData: req.body,
      });
    }

    /**
     * Create new contact document
     */
    const contactData = new Contact({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    /**
     * Save to MongoDB
     */
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