import React from "react";

const Question = ({ index, question, onRemove, onUpdate }) => {
  const handleTypeChange = (e) => {
    onUpdate({ ...question, type: e.target.value, options: [], rows: [], columns: [] });
  };

  const handleLabelChange = (e) => {
    onUpdate({ ...question, label: e.target.value });
  };

  const handleOptionsChange = (e, optIndex) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions[optIndex] = e.target.value;
    onUpdate({ ...question, options: updatedOptions });
  };

  const addOption = () => {
    onUpdate({ ...question, options: [...(question.options || []), ""] });
  };

  const handleGridChange = (e, type, idx) => {
    const updatedGrid = [...(question[type] || [])];
    updatedGrid[idx] = e.target.value;
    onUpdate({ ...question, [type]: updatedGrid });
  };

  const addGridRow = () => {
    onUpdate({ ...question, rows: [...(question.rows || []), ""] });
  };

  const addGridColumn = () => {
    onUpdate({ ...question, columns: [...(question.columns || []), ""] });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpdate({ ...question, image: file });
    }
  };

  return (
    <div className="border p-4 rounded mb-4">
      <div className="flex justify-between items-center mb-2">
        <select
          className="border p-2 rounded"
          value={question.type}
          onChange={handleTypeChange}
        >
          <option value="text">Text</option>
          <option value="grid">Grid</option>
          <option value="checkbox">CheckBox</option>
        </select>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onRemove(index)}
        >
          Remove
        </button>
      </div>


      <input
        type="text"
        placeholder="Enter question label"
        className="border p-2 rounded w-full mb-2"
        value={question.label}
        onChange={handleLabelChange}
      />


      <div className="mb-4">
        <label className="block font-bold mb-2">Upload an Image (Optional):</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 rounded w-full"
        />
        {question.image && (
          <img
            src={URL.createObjectURL(question.image)}
            alt="Uploaded"
            className="mt-2 max-w-full h-auto"
          />
        )}
      </div>


      {question.type === "checkbox" && (
        <div className="mb-2">
          <label className="block font-bold mb-2">Options:</label>
          {question.options &&
            question.options.map((option, optIndex) => (
              <input
                key={optIndex}
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                className="border p-2 rounded w-full mb-1"
                value={option}
                onChange={(e) => handleOptionsChange(e, optIndex)}
              />
            ))}
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded mt-1"
            onClick={addOption}
          >
            Add Option
          </button>
        </div>
      )}


      {question.type === "grid" && (
        <div>
          <label className="block font-bold mb-2">Grid Rows:</label>
          {question.rows &&
            question.rows.map((row, rowIndex) => (
              <input
                key={rowIndex}
                type="text"
                placeholder={`Row ${rowIndex + 1}`}
                className="border p-2 rounded w-full mb-1"
                value={row}
                onChange={(e) => handleGridChange(e, "rows", rowIndex)}
              />
            ))}
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded mt-1"
            onClick={addGridRow}
          >
            Add Row
          </button>

          <label className="block font-bold mb-2 mt-4">Grid Columns:</label>
          {question.columns &&
            question.columns.map((column, colIndex) => (
              <input
                key={colIndex}
                type="text"
                placeholder={`Column ${colIndex + 1}`}
                className="border p-2 rounded w-full mb-1"
                value={column}
                onChange={(e) => handleGridChange(e, "columns", colIndex)}
              />
            ))}
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded mt-1"
            onClick={addGridColumn}
          >
            Add Column
          </button>
        </div>
      )}
    </div>
  );
};

export default Question;
