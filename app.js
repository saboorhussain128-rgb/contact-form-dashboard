/**
 * Main Application Entry Point
 * Express + EJS + MongoDB Contact Form Project
 */

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware
 * These are required to read form data and serve static files
 */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // IMPORTANT for form data

/**
 * View Engine Setup (EJS)
 */
app.set("view engine", "ejs");

/**
 * MongoDB Connection
 */
mongoose
    .connect("mongodb://127.0.0.1:27017/contact_form_db")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

/**
 * Contact Model
 */
const Contact = require("./models/Contact");

/**
 * GET Route - Show Contact Page
 */
app.get("/", (req, res) => {
    res.render("index", {
        success: req.query.success
    });
});

/**
 * POST Route - Save Contact Form Data
 */
app.post("/contact", async (req, res) => {
    try {
        const contactData = new Contact(req.body);
        await contactData.save();

        console.log("Saved Data:", contactData);

        // Redirect with success flag
        res.redirect("/?success=true");

    } catch (error) {
        console.log("Error saving data:", error);
        res.redirect("/?success=false");
    }
});

/**
 * Start Server
 */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});