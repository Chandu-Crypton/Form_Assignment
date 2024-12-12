const express = require("express");
const router = express.Router();
const FormResponse = require("../models/FormResponse");

// Save Form Response
// router.post("/save", async (req, res) => {
//     try {
//         const { title, headerImage, questions } = req.body;

//         // Create new form response
//         const newResponse = new FormResponse({
//             title,
//             headerImage,
//             questions,
//         });

//         // Save to MongoDB
//         const savedResponse = await newResponse.save();
//         res.status(200).json(savedResponse);
//     } catch (err) {
//         res.status(500).json({ error: "Failed to save response", details: err });
//     }
// });

const multer = require("multer");

// Set up storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/save", upload.single("headerImage"), async (req, res) => {
    try {
        const { title, questions } = req.body;
        const headerImage = req.file ? req.file.buffer.toString("base64") : null;

        const parsedQuestions = JSON.parse(questions); // Parse questions array from JSON

        const newForm = new FormResponse({
            title,
            headerImage,
            questions: parsedQuestions,
        });

        const savedForm = await newForm.save();
        res.status(200).json(savedForm);
    } catch (error) {
        console.error("Error saving form:", error);
        res.status(500).json({ error: "Failed to save form", details: error });
    }
});




// Fetch All Responses
router.get("/", async (req, res) => {
    try {
        const responses = await FormResponse.find();
        res.status(200).json(responses);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch responses", details: err });
    }
});

module.exports = router;
