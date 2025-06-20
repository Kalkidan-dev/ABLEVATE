// src/components/LessonPdfReader.jsx
import React from 'react';
import { extractTextFromPdf, speakText } from '../../utils/pdfReader';

const LessonPdfReader = ({ pdfUrl }) => {
  const handleReadPdf = async () => {
    try {
      const text = await extractTextFromPdf(pdfUrl);
      speakText(text);
    } catch (err) {
      console.error('Error reading PDF:', err);
      alert('Failed to read PDF');
    }
  };

  return (
    <button
      onClick={handleReadPdf}
      className="mt-2 mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      🔊 Read PDF Aloud
    </button>
  );
};

export default LessonPdfReader;
