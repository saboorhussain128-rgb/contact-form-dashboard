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
 * Get Messages Page (SEARCH + PAGINATION + STATS FIXED)
 */
exports.getMessages = async (req, res) => {
  try {
    const search = req.query.search || "";

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { message: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Contact.countDocuments(query);

    /**
     * ✅ DASHBOARD STATS (FIX FOR "stats is not defined")
     */
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const startOfMonth = new Date(now);
    startOfMonth.setMonth(now.getMonth() - 1);

    const stats = {
      total: await Contact.countDocuments(),
      today: await Contact.countDocuments({
        createdAt: { $gte: startOfToday },
      }),
      week: await Contact.countDocuments({
        createdAt: { $gte: startOfWeek },
      }),
      month: await Contact.countDocuments({
        createdAt: { $gte: startOfMonth },
      }),
    };

    res.render("messages", {
      messages,
      search,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
      totalMessages,
      query: req.query,
      stats, // ✅ IMPORTANT FIX
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
    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.redirect("/messages?error=notfound");
    }

    return res.redirect("/messages?deleted=true");

  } catch (error) {
    console.log("Delete Error:", error);
    return res.redirect("/messages?error=server");
  }
};

/**
 * Show Edit Page
 */
exports.getEditMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.redirect("/messages?error=notfound");
    }

    res.render("editMessage", {
      message,
    });

  } catch (error) {
    console.log("Edit Page Error:", error);
    res.redirect("/messages?error=server");
  }
};

/**
 * Update Message
 */
exports.updateMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        phone,
        message,
      },
      { new: true }
    );

    if (!updated) {
      return res.redirect("/messages?error=notfound");
    }

    res.redirect("/messages?updated=true");

  } catch (error) {
    console.log("Update Error:", error);
    res.redirect("/messages?error=server");
  }
};