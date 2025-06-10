// src/pages/lessons/LessonDetailWrapper.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LessonDetail from '../components/course/LessonDetail';
import axios from 'axios';

const LessonDetailWrapper = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}/lessons/${lessonId}/`);
        setLesson(response.data);
      } catch (err) {
        setError('Lesson not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [courseId, lessonId]);

  if (loading) return <p role="status">Loading lesson...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <main>
      <h1 className="sr-only">Lesson Detail Page</h1>
      <LessonDetail lesson={lesson} />
    </main>
  );
};

export default LessonDetailWrapper;
