const Contact = require("../models/Contact");

/**
 * HOME PAGE
 */
exports.getHome = (req, res) => {
  res.render("index", {
    success: req.query.success || null,
    error: null,
    formData: {},
    isAuth: req.session.isAuth || false,
  });
};

/**
 * SAVE CONTACT FORM
 */
exports.submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.render("index", {
        success: null,
        error: "All required fields must be filled.",
        formData: req.body,
        isAuth: req.session.isAuth || false,
      });
    }

    await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    return res.redirect("/?success=true");

  } catch (err) {
    console.log("SAVE ERROR:", err);

    return res.render("index", {
      success: null,
      error: "Failed to submit message.",
      formData: req.body,
      isAuth: req.session.isAuth || false,
    });
  }
};

/**
 * MESSAGES DASHBOARD
 */
exports.getMessages = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = 6;

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

    const now = new Date();

    const startOfToday = new Date();
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

    return res.render("messages", {
      messages,
      search,
      stats,
      totalMessages,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalMessages / limit)),
      query: req.query || {},
    });

  } catch (err) {
    console.log("FETCH ERROR:", err);

    return res.status(500).send("Error loading messages");
  }
};

/**
 * DELETE MESSAGE
 */
exports.deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    return res.redirect("/messages?deleted=true");

  } catch (err) {
    console.log("DELETE ERROR:", err);

    return res.redirect("/messages?error=delete");
  }
};

/**
 * EDIT MESSAGE PAGE
 */
exports.getEditMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.redirect("/messages?error=notfound");
    }

    return res.render("editMessage", {
      message,
    });

  } catch (err) {
    console.log("EDIT ERROR:", err);

    return res.redirect("/messages?error=server");
  }
};

/**
 * UPDATE MESSAGE
 */
exports.updateMessage = async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.redirect("/messages?updated=true");

  } catch (err) {
    console.log("UPDATE ERROR:", err);

    return res.redirect("/messages?error=update");
  }
};

/**
 * VIEW SINGLE MESSAGE
 */
exports.getMessageDetail = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.redirect("/messages?error=notfound");
    }

    return res.render("messageDetail", {
      message,
    });

  } catch (err) {
    console.log("DETAIL ERROR:", err);

    return res.redirect("/messages?error=server");
  }
};