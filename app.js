/**
 * Main entry point of the application
 * Sets up Express server
 */

const express = require("express");

// Create Express app
const app = express();

// Port from environment or default 3000
const PORT = process.env.PORT || 3000;

// Test route (homepage)
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});