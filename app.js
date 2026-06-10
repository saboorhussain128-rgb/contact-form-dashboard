/**
 * Main application entry point
 * Express server + EJS setup
 */

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

/**
 * Set EJS as view engine
 */
app.set("view engine", "ejs");

/**
 * Home route
 * Renders UI from views/index.ejs
 */
app.get("/", (req, res) => {
    res.render("index");
});

/**
 * Start server
 */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});