// LessonDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LessonDetail = ({ courseId, lessonId }) => {
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/courses/${courseId}/lessons/${lessonId}/`)
      .then(response => {
        setLesson(response.data);
      })
      .catch(error => {
        console.error('Error fetching lesson:', error);
      });
  }, [courseId, lessonId]);

  if (!lesson) return <p>Loading lesson...</p>;

  return (
    <div className="lesson-detail">
      <h2>{lesson.title}</h2>
      <p>{lesson.content}</p>
      {lesson.video_url && (
        <video controls>
          <source src={lesson.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default LessonDetail;
