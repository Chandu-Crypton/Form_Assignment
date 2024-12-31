import React, { useState } from "react";
import CategorizeBuilder from "./CategorizeBuilder";
import ClozeQuestionBuilder from "./ClozeQuestionBuilder";
import ComprehensionQuestion from "./ComprehensionQuestion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormEditor = () => {
  const [title, setTitle] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState("categorize");
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    let newQuestion = { type: selectedQuestionType, data: {} };

    switch (selectedQuestionType) {
      case "categorize":
        newQuestion.data = {
          items: [""],  
          belongsTo: [""], 
        };
        break;
      case "cloze":
        newQuestion.data = {
          question: "",
          blanks: [""], 
        };
        break;
      case "passage":
        newQuestion.data = {
          passage: "",
          mcqs: [
            {
              question: "",
              options: ["", "", "", ""],
              correctAnswer: "0",
            },
          ],
        };
        break;
      default:
        break;
    }

    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, updatedData) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].data = updatedData;
    setQuestions(updatedQuestions);
  };

  const handleSaveForm = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("headerImage", headerImage);
      formData.append("questions", JSON.stringify(questions));

      const response = await axios.post(
        "http://localhost:5001/api/forms/save",
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const formId = response.data.formId;
      alert("Form saved successfully!");
      navigate(`/form/${formId}`);
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save the form.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <input
        type="text"
        placeholder="Enter form title"
        className="border p-2 rounded w-full mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="mb-4">
        <label className="block mb-2 font-bold">Header Image:</label>
        <input
          type="file"
          onChange={(e) => setHeaderImage(e.target.files[0])}
          className="block w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-bold">Select Question Type:</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedQuestionType}
          onChange={(e) => setSelectedQuestionType(e.target.value)}
        >
          <option value="categorize">Categorize Question</option>
          <option value="cloze">Cloze Question</option>
          <option value="passage">Passage-based Question</option>
        </select>
      </div>

      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          {question.type === "categorize" && (
            <CategorizeBuilder
              data={question.data}
              onChange={(updatedData) => handleQuestionChange(index, updatedData)}
            />
          )}

          {question.type === "cloze" && (
            <ClozeQuestionBuilder
              data={question.data}
              onChange={(updatedData) => handleQuestionChange(index, updatedData)}
            />
          )}

          {question.type === "passage" && (
            <ComprehensionQuestion
              data={question.data}
              onChange={(updatedData) => handleQuestionChange(index, updatedData)}
            />
          )}

          <button onClick={() => handleRemoveQuestion(index)}>Remove</button>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleAddQuestion}
      >
        Add Question
      </button>

      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleSaveForm}
      >
        Save Form
      </button>
    </div>
  );
};

export default FormEditor;
