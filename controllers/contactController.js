const Contact = require("../models/Contact");

/**
 * Show Contact Page
 */
exports.getHome = (req, res) => {
  res.render("index", {
    success: req.query.success,
    error: null,
    formData: {},
  });
};

/**
 * Save Contact Form
 */
exports.submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    // Validation
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

    const contact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    await contact.save();

    res.redirect("/?success=true");
  } catch (error) {
    console.log("Save Error:", error);
    res.redirect("/?success=false");
  }
};

/**
 * Get Messages Page
 */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.render("messages", {
      messages,
    });
  } catch (error) {
    console.log("Fetch Error:", error);
    res.send("Error loading messages");
  }
};

/**
 * Delete Message
 */
exports.deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.redirect("/messages");
  } catch (error) {
    console.log("Delete Error:", error);
    res.send("Failed to delete message");
  }
};

exports.deleteMessage = async (req, res) => {
  console.log("🔥 DELETE ROUTE HIT:", req.params.id);

  await Contact.findByIdAndDelete(req.params.id);

  res.redirect("/messages");
};