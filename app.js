/**
 * Main Application Entry Point
 * Contact Form Project (Node + Express + MongoDB + EJS)
 */

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// =========================
// CONFIG
// =========================
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/contact_form_db";

// =========================
// MIDDLEWARE
// =========================
app.use(express.static("public")); // CSS, images, JS
app.use(express.urlencoded({ extended: true })); // form data parser

// =========================
// VIEW ENGINE
// =========================
app.set("view engine", "ejs");

// =========================
// DATABASE CONNECTION
// =========================
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

// =========================
// MODEL
// =========================
const Contact = require("./models/Contact");

// =========================
// ROUTES
// =========================

/**
 * Home Page (Contact Form)
 */
app.get("/", (req, res) => {
    res.render("index", {
        success: req.query.success
    });
});

/**
 * Handle Contact Form Submission
 */
app.post("/contact", async (req, res) => {
    try {
        const contactData = new Contact(req.body);
        await contactData.save();

        console.log("Saved Data:", contactData);

        // redirect with success message
        res.redirect("/?success=true");

    } catch (error) {
        console.log("Error saving data:", error);
        res.redirect("/?success=false");
    }
});

/**
 * Admin Page - View All Messages
 */
app.get("/messages", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });

        res.render("messages", {
            messages: messages
        });

    } catch (error) {
        console.log("Error fetching messages:", error);
        res.send("Error loading messages");
    }
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});