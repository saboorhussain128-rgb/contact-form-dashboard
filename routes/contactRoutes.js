const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");

/**
 * Authentication Middleware
 * Protects admin routes
 */
function isAuth(req, res, next) {
  if (req.session.isAuth) {
    return next();
  }

  res.redirect("/login");
}

/**
 * Home Page
 */
router.get("/", contactController.getHome);

/**
 * Submit Contact Form
 */
router.post("/contact", contactController.submitContact);

/**
 * Login Page
 */
router.get("/login", (req, res) => {
  res.render("login", {
    error: null,
  });
});

/**
 * Handle Login
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("========== LOGIN DEBUG ==========");
  console.log("Entered Username:", username);
  console.log("Entered Password:", password);
  console.log("ENV Username:", process.env.ADMIN_USER);
  console.log("ENV Password:", process.env.ADMIN_PASS);
  console.log("=================================");

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    req.session.isAuth = true;

    console.log("✅ Login Success");

    return res.redirect("/messages");
  }

  console.log("❌ Login Failed");

  res.render("login", {
    error: "Invalid credentials",
  });
});

/**
 * Logout
 */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }

    res.redirect("/login");
  });
});

/**
 * Messages Dashboard
 * Protected Route
 */
router.get(
  "/messages",
  isAuth,
  contactController.getMessages
);

/**
 * Delete Message
 * Protected Route
 */
router.post(
  "/messages/delete/:id",
  isAuth,
  contactController.deleteMessage
);

/**
 * ================================
 * ✏️ EDIT MESSAGE ROUTES (NEW)
 * ================================
 */

/**
 * Show Edit Page
 */
router.get(
  "/messages/edit/:id",
  isAuth,
  contactController.getEditMessage
);

/**
 * Update Message
 */
router.post(
  "/messages/edit/:id",
  isAuth,
  contactController.updateMessage
);

module.exports = router;