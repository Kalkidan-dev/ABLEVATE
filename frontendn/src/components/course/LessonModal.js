import React from 'react';

const LessonModal = ({ lesson, onClose, onNavigate }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">✕</button>
        <h2 className="text-2xl font-semibold text-blue-700">{lesson.title}</h2>
        <video controls src={lesson.video_file} className="w-full mt-4 rounded" />
        <button
          onClick={onNavigate}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Full Lesson Page
        </button>
      </div>
    </div>
  );
};

export default LessonModal;
