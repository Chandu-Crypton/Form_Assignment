import React from "react";

const Preview = ({ title, headerImage, questions }) => {
  return (
    <div className="bg-gray-100 p-4 rounded mt-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>


      {headerImage && (
        <img
          src={URL.createObjectURL(headerImage)}
          alt="Header"
          className="mb-4 max-w-full h-auto"
        />
      )}


      {questions.map((question, index) => (
        <div key={index} className="mb-4">

          <label className="block font-bold mb-2">{question.label}</label>


          {question.image && (
            <img
              src={URL.createObjectURL(question.image)}
              alt={`Question ${index + 1}`}
              className="mb-4 max-w-full h-auto"
            />
          )}


          {question.type === "text" && (
            <input
              type="text"
              placeholder="Your answer"
              className="border p-2 rounded w-full"
            />
          )}

          {question.type === "checkbox" && (
            <div>
              {question.options &&
                question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center mb-2">
                    <input type="checkbox" id={`checkbox-${index}-${optIndex}`} className="mr-2" />
                    <label htmlFor={`checkbox-${index}-${optIndex}`}>{option}</label>
                  </div>
                ))}
            </div>
          )}

          {question.type === "grid" && (
            <div>
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2"></th>
                    {question.columns &&
                      question.columns.map((col, colIndex) => (
                        <th key={colIndex} className="border border-gray-300 p-2">
                          {col}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {question.rows &&
                    question.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border border-gray-300 p-2">{row}</td>
                        {question.columns &&
                          question.columns.map((_, colIndex) => (
                            <td key={colIndex} className="border border-gray-300 p-2 text-center">
                              <input type="radio" name={`grid-${index}-${rowIndex}`} />
                            </td>
                          ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Preview;
