const mongoose = require("mongoose");

const formResponseSchema = new mongoose.Schema({
    title: String,
    headerImage: String,
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
            response: mongoose.Schema.Types.Mixed,
            options: [String],
            rows: [String],
            columns: [String],
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("FormResponse", formResponseSchema);
