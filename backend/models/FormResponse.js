const mongoose = require("mongoose");

const formResponseSchema = new mongoose.Schema({
    title: String,
    headerImage: String, // Save image as a file path or URL
    questions: [
        {
            type: {
                type: String,
                required: true,
            },
            label: {
                type: String,
                required: true,
            },
            response: mongoose.Schema.Types.Mixed, // Can store text, boolean, or other types
            options: [String], // For checkboxes
            rows: [String], // For grid rows
            columns: [String], // For grid columns
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("FormResponse", formResponseSchema);
