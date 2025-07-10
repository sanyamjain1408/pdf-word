import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("pdf-to-word");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleConvert = async () => {
    if (!file) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    // ✅ Use full Railway backend URL
    const endpoint =
      type === "pdf-to-word"
        ? "https://pdf-word-production.up.railway.app/convert/pdf-to-word"
        : "https://pdf-word-production.up.railway.app/convert/word-to-pdf";

    try {
      const res = await axios.post(endpoint, formData, {
        responseType: "blob", // needed to get downloadable file
      });

      // ✅ Create blob URL to download file
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Conversion failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-100 font-sans">
      {/* Header */}
      <header className="bg-blue-900 text-white text-center py-6 shadow-md text-3xl font-semibold">
        📄 PDF ⇄ Word File Converter
      </header>

      {/* Main Content */}
      <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
        {/* Toggle Conversion Type */}
        <div className="flex justify-between mb-6">
          <div
            onClick={() => {
              setType("pdf-to-word");
              setDownloadUrl(""); // reset
            }}
            className={`w-1/2 mr-2 p-6 text-center text-lg font-medium rounded-lg cursor-pointer
              ${
                type === "pdf-to-word"
                  ? "bg-gradient-to-tr from-blue-400 to-indigo-500 text-white border-2 border-blue-600"
                  : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
              }`}
          >
            PDF ➡ Word
          </div>

          <div
            onClick={() => {
              setType("word-to-pdf");
              setDownloadUrl(""); // reset
            }}
            className={`w-1/2 ml-2 p-6 text-center text-lg font-medium rounded-lg cursor-pointer
              ${
                type === "word-to-pdf"
                  ? "bg-gradient-to-tr from-pink-400 to-purple-500 text-white border-2 border-pink-600"
                  : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
              }`}
          >
            Word ➡ PDF
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="font-semibold">📎 Upload File:</label>
          <input
            type="file"
            accept={
              type === "pdf-to-word"
                ? "application/pdf"
                : ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }
            onChange={(e) => {
              setFile(e.target.files[0]);
              setDownloadUrl(""); // reset on new file select
            }}
            className="block mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          🔄 Convert File
        </button>

        {/* Download Link */}
        {downloadUrl && (
          <div className="mt-6 text-center">
            <a
              href={downloadUrl}
              download={type === "pdf-to-word" ? "converted.docx" : "converted.pdf"}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
            >
              🔽 Download Converted File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
