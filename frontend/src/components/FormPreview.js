import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


const DraggableItem = ({ text, id }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "item",
    item: { text, id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-2 border rounded mb-2 cursor-pointer ${
        isDragging ? "bg-gray-300" : "bg-white"
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {text}
    </div>
  );
};

const DroppableCategory = ({ category, items, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "item",
    drop: (item) => onDrop(category, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div className="flex flex-col items-center mb-4">
      <h3 className="font-bold mb-2">{category}</h3>
      <div
        ref={drop}
        className={`w-64 h-32 border-2 rounded p-2 ${
          isOver ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="p-2 border-b ">
              {item.text}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Drop items here</p>
        )}
      </div>
    </div>
  );
};

const DraggableBlank = ({ text, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "blank",
    item: { text, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-2 border rounded mb-2 ${
        isDragging ? "bg-gray-100" : "bg-white"
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {text}
    </div>
  );
};

const DroppableInput = ({ index, value, onDrop, placeholder }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "blank",
    drop: (item) => onDrop(index, item.text),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`border p-2 w-50 rounded ${
        isOver ? "bg-green-100" : "bg-white"
      }`}
    >
      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        readOnly
        className="w-40"
      />
    </div>
  );
};

const FormPreview = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [categories, setCategories] = useState({}); 
  const navigate = useNavigate();
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/forms/form/${formId}`
        );
        setForm(response.data);

       
        if (response.data.questions) {
          const categorizeQuestion = response.data.questions.find(
            (q) => q.type === "categorize"
          );
          if (categorizeQuestion) {
            const initialCategories = categorizeQuestion.data.categories.reduce(
              (acc, category) => {
                acc[category] = [];
                return acc;
              },
              {}
            );
            setCategories(initialCategories);
          }
        }
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    };

    fetchForm();
  }, [formId]);

  const handleDrop = (category, item) => {
    setCategories((prev) => {
      const updated = { ...prev };
      updated[category] = [...updated[category], item];
      return updated;
    });
  };

  const handleInputChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/forms/${formId}/responses`, {
        responses: { ...responses, ...categories },
      });
      alert("Responses submitted successfully!");
      navigate('/form/submitted')
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  if (!form) return <div>Loading form...</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{form.title}</h2>
      <DndProvider backend={HTML5Backend}>
        <form onSubmit={handleSubmit}>
          {form.questions.map((question, index) => {
            if (question.type === "categorize") {
              const { data } = question;

              return (
                <div key={index} className="mb-8">
                  <h3 className="font-bold mb-4">{data.title || "Categorize Items"}</h3>
                  <div className="flex">
                  
                    {data.categories.map((category, catIndex) => (
                      <DroppableCategory
                        key={catIndex}
                        category={category}
                        items={categories[category] || []}
                        onDrop={handleDrop}
                      />
                    ))}
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold mb-2">Available Items</h4>
                    {data.fields.map((field, fieldIndex) => (
                      <DraggableItem
                        key={fieldIndex}
                        text={field.items}
                        id={field.id}
                      />
                    ))}
                  </div>
                </div>
              );
            } else if (question.type === "cloze") {
              const questionText = question.data.questions[0].text || "Untitled";
              const blanks = question.data.questions[0].blanks || [];
              const questionParts = questionText.split("_");

              return (
                <div key={index} className="mb-4">
                  <label className="block mb-2 font-bold">Cloze Question:</label>
                  <div className="mb-1">
                    {questionParts.map((part, i) => (
                      <span key={i}>
                        {part}
                        {i < blanks.length && (
                          <DroppableInput
                            index={i}
                            value={responses[`blank-${i}`]}
                            onDrop={(index, text) =>
                              setResponses((prev) => ({
                                ...prev,
                                [`blank-${index}`]: text,
                              }))
                            }
                            placeholder={`Blank ${i + 1}`}
                          />
                        )}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2 font-bold">
                      Available Blanks:
                    </label>
                    {blanks.map((blank, blankIndex) => (
                      <DraggableBlank key={blankIndex} text={blank} />
                    ))}
                  </div>
                </div>
              );
            } else if (question.type === "passage") {
              const { data } = question;
              return (
                <div key={index} className="mb-8">
                 <h3 className="font-bold mb-4">Comprehension Question :</h3>
                  <h3 className="font-bold mb-4">{data.passage}</h3>
                  {data.mcqs.map((mcq, qIndex) => (
                    <div key={qIndex} className="mb-4">
                      <label className="block mb-2 font-bold">
                        {mcq.question}
                      </label>
                      {mcq.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="mb-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`mcq-${qIndex}`}
                              value={optionIndex}
                              checked={responses[`mcq-${qIndex}`] === `${optionIndex}`}
                              onChange={() =>
                                setResponses((prev) => ({
                                  ...prev,
                                  [`mcq-${qIndex}`]: `${optionIndex}`,
                                }))
                              }
                              className="mr-2"
                            />
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      </DndProvider>
    </div>
  );
};

export default FormPreview;

