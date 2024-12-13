import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FillForm = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});

    useEffect(() => {

        const fetchForm = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/forms/form/${formId}`);
                setForm(response.data);
            } catch (error) {
                console.log("Error fetching form:", error);
            }
        };

        fetchForm();
    }, [formId]);

    const handleInputChange = (questionId, value) => {
        setResponses({ ...responses, [questionId]: value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`http://localhost:5000/api/forms/form/${formId}/response`, {
                responses: Object.entries(responses).map(([questionId, answer]) => ({
                    questionId,
                    answer,
                })),
            });
            alert("Form submitted successfully!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit the form.");
        }
    };

    if (!form) return <div>Loading...</div>;

    return (
        <div className="p-4 bg-gray-100 rounded">
            <h2 className="text-2xl font-bold mb-4">{form.title}</h2>
            {form.headerImage && (
                <img
                    src={`data:image/png;base64,${form.headerImage}`}
                    alt="Header"
                    className="mb-4"
                />
            )}
            {form.questions.map((question) => (
                <div key={question._id} className="mb-4">
                    <label className="block font-bold">{question.label}</label>
                    {question.type === "text" && (
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                        />
                    )}
                    {question.type === "checkbox" && (
                        <div>
                            {question.options.map((option) => (
                                <div key={option}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={option}
                                            onChange={(e) => {
                                                const currentAnswers =
                                                    responses[question._id] || [];
                                                const updatedAnswers = e.target.checked
                                                    ? [...currentAnswers, option]
                                                    : currentAnswers.filter((o) => o !== option);
                                                handleInputChange(question._id, updatedAnswers);
                                            }}
                                        />
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                    {question.type === "grid" && (
                        <table className="table-auto border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th></th>
                                    {question.columns.map((column) => (
                                        <th key={column} className="border px-4 py-2">
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {question.rows.map((row) => (
                                    <tr key={row}>
                                        <td className="border px-4 py-2">{row}</td>
                                        {question.columns.map((column) => (
                                            <td key={column} className="border px-4 py-2 text-center">
                                                <input
                                                    type="radio"
                                                    name={`${question._id}-${row}`}
                                                    value={column}
                                                    onChange={(e) =>
                                                        handleInputChange(question._id, {
                                                            ...responses[question._id],
                                                            [row]: e.target.value,
                                                        })
                                                    }
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ))}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
};

export default FillForm;
