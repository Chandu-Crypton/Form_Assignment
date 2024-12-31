const express = require('express');
const multer = require('multer'); // For handling file uploads
const Form = require('../models/Form'); // Import the Form model
const router = express.Router();
const Response = require("../models/Response");
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate unique filenames
  },
});
const upload = multer({ storage });

router.post('/save', upload.single('headerImage'), async (req, res) => {
  try {
    const { title, questions } = req.body;

    
    const newForm = new Form({
      title,
      headerImage: req.file ? req.file.path : null, 
      questions: JSON.parse(questions), 
    });

   
    const savedForm = await newForm.save();

    res.status(201).json({
      message: 'Form saved successfully!',
      formId: savedForm._id,
    });
  } catch (error) {
    console.error('Error saving form:', error);
    res.status(500).json({ error: 'Failed to save the form.' });
  }
});

router.get("/form/:formId", async (req, res) => {
    try {
        console.log("Form ID:", req.params.formId);
        const form = await Form.findById(req.params.formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }
        res.status(200).json(form);
    } catch (error) {
        console.error("Error fetching form:", error);
        res.status(500).json({ error: "Failed to fetch form" });
    }
});



router.post("/:formId/responses", async (req, res) => {
    const { responses } = req.body;
  
    try {
      const form = await Form.findById(req.params.formId);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
  
      const newResponse = new Response({
        formId: req.params.formId,
        responses,
      });
  
      await newResponse.save();
      res.status(201).json({ message: "Responses saved successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
module.exports = router;
