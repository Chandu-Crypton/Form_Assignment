const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'categorize', 'cloze', 'passage'
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // Flexible structure for different question types
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  headerImage: { type: String }, // Path or URL of the uploaded header image
  questions: [questionSchema], // Array of questions
}, { timestamps: true });

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
 