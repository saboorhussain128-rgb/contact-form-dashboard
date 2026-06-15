const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const contactController = require("../controllers/contactController");

/**
 * AUTH MIDDLEWARE
 */
function isAuth(req, res, next) {
  if (req.session.isAuth) {
    return next();
  }
  return res.redirect("/login");
}

/**
 * HOME PAGE
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
  res.render("login", {
    error: null,
  });
});

/**
 * LOGIN HANDLER (FINAL FIXED VERSION)
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("LOGIN ATTEMPT:", username);

    // STEP 1: check username
    if (username !== process.env.ADMIN_USER) {
      console.log("❌ Invalid username");
      return res.render("login", {
        error: "Invalid credentials",
      });
    }

    // STEP 2: check if env hash exists
    if (!process.env.ADMIN_HASH_PASSWORD) {
      console.log("❌ Missing ADMIN_HASH_PASSWORD in .env");

      return res.render("login", {
        error: "Server configuration error",
      });
    }

    // STEP 3: bcrypt password check
    const isPasswordValid = await bcrypt.compare(
      password,
      process.env.ADMIN_HASH_PASSWORD
    );

    if (!isPasswordValid) {
      console.log("❌ Invalid password");

      return res.render("login", {
        error: "Invalid credentials",
      });
    }

    // STEP 4: SUCCESS LOGIN
    req.session.isAuth = true;
    console.log("✅ Login Success");

    return res.redirect("/messages");

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.render("login", {
      error: "Server error. Try again later.",
    });
  }
});

/**
 * LOGOUT
 */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout Error:", err);
    }
    return res.redirect("/login");
  });
});

/**
 * MESSAGES DASHBOARD
 */
router.get("/messages", isAuth, contactController.getMessages);

/**
 * MESSAGE DETAIL PAGE
 */
router.get("/messages/:id", isAuth, contactController.getMessageDetail);

/**
 * DELETE MESSAGE
 */
router.post("/messages/delete/:id", isAuth, contactController.deleteMessage);

/**
 * EDIT MESSAGE PAGE
 */
router.get("/messages/edit/:id", isAuth, contactController.getEditMessage);

/**
 * UPDATE MESSAGE
 */
router.post("/messages/edit/:id", isAuth, contactController.updateMessage);

module.exports = router;