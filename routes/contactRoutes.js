const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");

/**
 * AUTH MIDDLEWARE
 */
function isAuth(req, res, next) {
  if (req.session.isAuth) return next();
  return res.redirect("/login");
}

/**
 * HOME PAGE (CONTACT FORM)
 */
router.get("/", contactController.getHome);

/**
 * SUBMIT CONTACT FORM
 */
router.post("/contact", contactController.submitContact);

/**
 * LOGIN PAGE
 */
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

/**
 * LOGIN HANDLER
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Debug logs (optional)
  console.log("LOGIN ATTEMPT:");
  console.log(username, password);

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    req.session.isAuth = true;
    return res.redirect("/messages");
  }

  return res.render("login", {
    error: "Invalid credentials",
  });
});

/**
 * LOGOUT
 */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

/**
 * MESSAGES DASHBOARD (PROTECTED)
 */
router.get("/messages", isAuth, contactController.getMessages);

/**
 * MESSAGE DETAIL PAGE (PROTECTED)
 */
router.get("/messages/:id", isAuth, contactController.getMessageDetail);

/**
 * DELETE MESSAGE (PROTECTED)
 */
router.post(
  "/messages/delete/:id",
  isAuth,
  contactController.deleteMessage
);

/**
 * EDIT MESSAGE PAGE (PROTECTED)
 */
router.get(
  "/messages/edit/:id",
  isAuth,
  contactController.getEditMessage
);

/**
 * UPDATE MESSAGE (PROTECTED)
 */
router.post(
  "/messages/edit/:id",
  isAuth,
  contactController.updateMessage
);

module.exports = router;