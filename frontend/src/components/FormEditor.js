import React, { useState } from "react";
import Question from "./Question";
import Preview from "./Preview";
import axios from "axios";

const FormEditor = () => {
  const [title, setTitle] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isPreview, setIsPreview] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([...questions, { type: "text", label: "", options: [] }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSaveForm = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("headerImage", headerImage);

      formData.append("questions", JSON.stringify(questions));
      await axios.post("http://localhost:5000/api/forms/save", formData);
      alert("Form saved successfully!");
      console.log({
        title,
        headerImage,
        questions,
      });

    } catch (error) {
      console.log("Error saving form:", error);
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

      {questions.map((question, index) => (
        <Question
          key={index}
          index={index}
          question={question}
          onRemove={handleRemoveQuestion}
          onUpdate={(updatedQuestion) => {
            const updatedQuestions = [...questions];
            updatedQuestions[index] = updatedQuestion;
            setQuestions(updatedQuestions);
          }}
        />
      ))}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddQuestion}
      >
        Add Question
      </button>

      <div className="flex justify-between mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setIsPreview(!isPreview)}
        >
          {isPreview ? "Edit" : "Preview"}
        </button>

        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handleSaveForm}
        >
          Save Form
        </button>
      </div>

      {isPreview && <Preview title={title} headerImage={headerImage} questions={questions} />}
    </div>
  );
};

export default FormEditor;
