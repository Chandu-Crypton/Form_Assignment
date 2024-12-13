const mongoose = require("mongoose");

const FormSubmissionSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FormResponse",
        required: true,
    },
    responses: [
        {
            questionId: String,
            answer: mongoose.Schema.Types.Mixed, // Store text, checkbox values, etc.
        },
    ],
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("FormSubmission", FormSubmissionSchema);
