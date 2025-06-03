import React, { useState } from 'react';

const CourseDetails = ({ course }) => {
  const [lessons, setLessons] = useState(course.lessons || []);
  const [newLesson, setNewLesson] = useState('');

  const addLesson = () => {
    if (!newLesson.trim()) return;
    setLessons(prev => [...prev, newLesson.trim()]);
    setNewLesson('');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Lessons for "{course.title}"</h3>
      <ul className="mb-4 list-disc list-inside">
        {lessons.map((lesson, i) => (
          <li key={i}>{lesson}</li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New lesson title"
          value={newLesson}
          onChange={e => setNewLesson(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 flex-grow"
        />
        <button
          onClick={addLesson}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Add Lesson
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
