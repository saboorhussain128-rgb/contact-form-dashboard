/**
 * Contact Model
 * Stores contact form submissions
 */

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Contact", contactSchema);