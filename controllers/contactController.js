const Contact = require("../models/Contact");

/**
 * Home Page
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

    if (!firstName || !lastName || !email || !message) {
      return res.render("index", {
        success: false,
        error: "All fields are required",
        formData: req.body,
      });
    }

    await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    res.redirect("/?success=true");
  } catch (err) {
    console.log(err);
    res.redirect("/?success=false");
  }
};

/**
 * Messages Dashboard (WITH STATS + SAFE QUERY)
 */
exports.getMessages = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

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
      .skip((page - 1) * limit)
      .limit(limit);

    const totalMessages = await Contact.countDocuments(query);

    // ---------- SAFE STATS ----------
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
      totalMessages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),

      stats: stats || {},

      // ✅ VERY IMPORTANT FIX (prevents toast crash)
      query: req.query || {},
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading messages");
  }
};

/**
 * Delete Message
 */
exports.deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect("/messages?deleted=true");
  } catch (err) {
    console.log(err);
    res.redirect("/messages?error=delete");
  }
};

/**
 * Edit Page
 */
exports.getEditMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) return res.redirect("/messages?error=notfound");

    res.render("editMessage", { message });
  } catch (err) {
    console.log(err);
    res.redirect("/messages?error=server");
  }
};

/**
 * Update Message
 */
exports.updateMessage = async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/messages?updated=true");
  } catch (err) {
    console.log(err);
    res.redirect("/messages?error=update");
  }
};

/**
 * Message Detail Page
 */
exports.getMessageDetail = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) return res.redirect("/messages?error=notfound");

    res.render("messageDetail", { message });
  } catch (err) {
    console.log(err);
    res.redirect("/messages?error=server");
  }
};