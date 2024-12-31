import React, { useState } from "react";

const CategorizeBuilder = ({ data, onChange }) => {
  const [categories, setCategories] = useState(data.categories || [""]);
  const [fields, setFields] = useState(data.fields || [{ id: Date.now(), items: "", belongsTo: "" }]); 
  const [headerImage, setHeaderImage] = useState(null);


  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
    onChange({ ...data, categories: updatedCategories }); 
  };

 
  const handleAddCategory = () => {
    setCategories([...categories, ""]);
    onChange({ ...data, categories: [...categories, ""] }); 
  };

 
  const handleAddField = () => {
    const newField = { id: Date.now(), items: "", belongsTo: "" };
    setFields([...fields, newField]);
    onChange({ ...data, fields: [...fields, newField] }); 
  };

  
  const handleUpdateField = (id, key, value) => {
    const updatedFields = fields.map((field) => 
      field.id === id ? { ...field, [key]: value } : field
    );
    setFields(updatedFields);
    onChange({ ...data, fields: updatedFields }); // Update parent component
  };

  
  const handleHeaderImageUpload = (file) => {
    setHeaderImage(file);
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Categorize Builder</h2>

      
      <div className="mb-4">
        <label className="block font-bold mb-2">Upload Header Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleHeaderImageUpload(e.target.files[0])}
          className="border p-2 rounded w-full"
        />
      </div>

      
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Categories</h3>
        {categories.map((category, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => handleCategoryChange(index, e.target.value)}
              className="border p-2 rounded flex-1"
            />
          </div>
        ))}
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      
      <div>
        <h3 className="text-lg font-bold mb-2">Items</h3>
        {fields.map((field) => (
          <div key={field.id} className="flex gap-2 mb-4 border p-4 rounded bg-white">
            
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                placeholder="Enter items"
                value={field.items}
                onChange={(e) => handleUpdateField(field.id, "items", e.target.value)}
                className="border p-2 rounded flex-1"
              />
              <select
                value={field.belongsTo}
                onChange={(e) => handleUpdateField(field.id, "belongsTo", e.target.value)}
                className="border p-2 rounded flex-1"
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

       
        <button
          onClick={handleAddField}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Field
        </button>
      </div>
    </div>
  );
};

export default CategorizeBuilder;
