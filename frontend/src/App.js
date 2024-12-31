import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormEditor from "./components/FormEditor";
import FormPreview from "./components/FormPreview"
import './index.css';
import FormSubmitted from "./components/FormSubmitted";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-red-100 p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Form Builder</h1>
        <Routes>

          <Route path="/" element={<FormEditor />} />


          <Route path="/form/:formId" element={<FormPreview />} />
          <Route path="/form/submitted" element={<FormSubmitted />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
