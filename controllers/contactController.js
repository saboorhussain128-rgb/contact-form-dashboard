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
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !message?.trim()
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
 * Get Messages Page (SEARCH + PAGINATION + STATS)
 */
exports.getMessages = async (req, res) => {
  try {
    const search = req.query.search || "";

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Search filter
    const query = {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ],
    };

    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Contact.countDocuments(query);

    res.render("messages", {
      messages,
      search,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
      totalMessages,
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