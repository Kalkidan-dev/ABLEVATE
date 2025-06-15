// src/pages/LessonPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import LessonDetail from '../components/course/LessonDetail';

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${lessonId}/`);
        setLesson(res.data);
      } catch (err) {
        console.error('Failed to load lesson:', err);
        navigate('/dashboard/student');
      }
    };

    fetchLesson();
  }, [lessonId, navigate]);

  if (!lesson) return <p className="text-center mt-10">Loading lesson...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <LessonDetail lesson={lesson} />
    </div>
  );
};

export default LessonPage;
