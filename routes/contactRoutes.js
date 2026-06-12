const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

/**
 * Middleware to protect routes
 */
function isAuth(req, res, next) {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
}

/**
 * Home Page (Contact Form)
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
  res.render("login", { error: null });
});

/**
 * Handle Login
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    req.session.isAuth = true;
    res.redirect("/messages");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

/**
 * Logout
 */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/login");
  });
});

/**
 * Messages Dashboard (Protected)
 */
router.get("/messages", isAuth, contactController.getMessages);

/**
 * Delete Message (Protected)
 */
router.post("/messages/delete/:id", isAuth, contactController.deleteMessage);

module.exports = router;