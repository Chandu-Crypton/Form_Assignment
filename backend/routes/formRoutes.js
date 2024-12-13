const express = require("express");
const router = express.Router();
const FormResponse = require("../models/FormResponse");
const FormSubmission = require("../models/FormSubmission");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    res.json("Hello")
})
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

router.get("/form/:formId", async (req, res) => {
    try {
        const form = await FormResponse.findById(req.params.formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }
        res.status(200).json(form);
    } catch (error) {
        console.error("Error fetching form:", error);
        res.status(500).json({ error: "Failed to fetch form" });
    }
});


router.post("/form/:formId/response", async (req, res) => {
    try {
        const { responses } = req.body;


        const newResponse = new FormSubmission({
            formId: req.params.formId,
            responses,
        });

        const savedResponse = await newResponse.save();
        res.status(201).json(savedResponse);
    } catch (error) {
        console.error("Error saving response:", error);
        res.status(500).json({ error: "Failed to save response" });
    }
});


module.exports = router;
