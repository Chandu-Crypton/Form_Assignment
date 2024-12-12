import React from "react";
import FormEditor from "./components/FormEditor";
import './index.css'
function App() {
  return (
    <div className="min-h-screen bg-red-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Form Builder</h1>
      <FormEditor />
    </div>
  );
}

export default App;
