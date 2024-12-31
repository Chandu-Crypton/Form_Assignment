import React, { useState } from "react";

const ClozeQuestionBuilder = ({ data, onChange }) => {
  const [questions, setQuestions] = useState(data.questions || []);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `q-${questions.length + 1}`,
      text: "",
      blanks: [""],
    };
    setQuestions((prev) => [...prev, newQuestion]);
    onChange({ ...data, questions: [...questions, newQuestion] }); 
  };

  const handleQuestionTextChange = (id, value) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, text: value } : q
    );
    setQuestions(updatedQuestions);
    onChange({ ...data, questions: updatedQuestions }); 
  };

  const handleAddBlank = (id) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, blanks: [...q.blanks, ""] } : q
    );
    setQuestions(updatedQuestions);
    onChange({ ...data, questions: updatedQuestions }); 
  };

  const handleBlankChange = (questionId, blankIndex, value) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            blanks: q.blanks.map((b, i) => (i === blankIndex ? value : b)),
          }
        : q
    );
    setQuestions(updatedQuestions);
    onChange({ ...data, questions: updatedQuestions }); 
  };

  const handleRemoveQuestion = (id) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    onChange({ ...data, questions: updatedQuestions }); 
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cloze Question Builder</h2>
      <button
        onClick={handleAddQuestion}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add New Question
      </button>

      {questions.map((question, questionIndex) => (
        <div key={question.id} className="mb-6 p-4 border rounded shadow">
          <div className="flex justify-between items-center">
            <strong>Question {questionIndex + 1}</strong>
            <button
              onClick={() => handleRemoveQuestion(question.id)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
          <textarea
            className="w-full p-2 border mb-2"
            rows="3"
            placeholder="Enter your question "
            value={question.text}
            onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
          />
          <div>
            <strong>Blanks:</strong>
            <button
              onClick={() => handleAddBlank(question.id)}
              className="ml-4 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Add Blank
            </button>
            <div className="mt-2">
              {question.blanks.map((blank, blankIndex) => (
                <div key={blankIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={blank}
                    onChange={(e) =>
                      handleBlankChange(question.id, blankIndex, e.target.value)
                    }
                    placeholder={`Blank ${blankIndex + 1}`}
                    className="border p-2 flex-grow mr-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClozeQuestionBuilder;
