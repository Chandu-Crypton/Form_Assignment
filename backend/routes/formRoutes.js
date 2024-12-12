const express = require("express");
const router = express.Router();
const FormResponse = require("../models/FormResponse");

const multer = require("multer");
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



module.exports = router;
