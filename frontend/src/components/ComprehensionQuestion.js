import React, { useState, useEffect } from "react";

const ComprehensionQuestion = ({ data, onChange }) => {
  const [passage, setPassage] = useState(data.passage || "");
  const [mcqs, setMcqs] = useState(data.mcqs || [
    { question: "", options: ["", "", "", ""], correctAnswer: "0" },
  ]);


  useEffect(() => {
    setPassage(data.passage || "");
    setMcqs(data.mcqs || [{ question: "", options: ["", "", "", ""], correctAnswer: "0" }]);
  }, [data]);

  
  const handlePassageChange = (e) => {
    const updatedPassage = e.target.value;
    setPassage(updatedPassage);
    onChange({ passage: updatedPassage, mcqs }); // Send updated passage to parent
  };

 
  const handleMcqChange = (index, key, value) => {
    const updatedMcqs = [...mcqs];
    updatedMcqs[index][key] = value;
    setMcqs(updatedMcqs);
    onChange({ passage, mcqs: updatedMcqs }); 
  };

  
  const handleAddMcq = () => {
    setMcqs([
      ...mcqs,
      { question: "", options: ["", "", "", ""], correctAnswer: "0" },
    ]);
    onChange({ passage, mcqs: [...mcqs, { question: "", options: ["", "", "", ""], correctAnswer: "0" }] });
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Comprehension Question Builder</h2>

      {/* Passage input */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Passage:</label>
        <textarea
          value={passage}
          onChange={handlePassageChange}
          className="border p-2 rounded w-full"
          placeholder="Enter the passage here..."
        />
      </div>

      
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">MCQs</h3>
        {mcqs.map((mcq, index) => (
          <div key={index} className="mb-4">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Enter question"
                value={mcq.question}
                onChange={(e) => handleMcqChange(index, "question", e.target.value)}
                className="border p-2 rounded flex-1"
              />
            </div>
            <div className="flex gap-2 mb-2">
              {mcq.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleMcqChange(index, "options", [
                      ...mcq.options.slice(0, optionIndex),
                      e.target.value,
                      ...mcq.options.slice(optionIndex + 1),
                    ])
                  }
                  className="border p-2 rounded flex-1"
                />
              ))}
            </div>
            
          </div>
        ))}
        <button
          onClick={handleAddMcq}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add MCQ
        </button>
      </div>
    </div>
  );
};

export default ComprehensionQuestion;

