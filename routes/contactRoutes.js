const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");

/**
 * Home Page
 */
router.get("/", contactController.getHome);

/**
 * Submit Contact Form
 */
router.post("/contact", contactController.submitContact);

/**
 * Messages Page
 */
router.get("/messages", contactController.getMessages);

/**
 * Delete Message
 */
router.post("/messages/delete/:id", contactController.deleteMessage);

module.exports = router;