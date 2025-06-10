// pages/LessonQuiz.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import QuizForm from '../../components/quiz/QuizForm';

const LessonQuiz = () => {
  const { lessonId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axiosInstance.get(`/courses/lessons/${lessonId}/quizzes/`);

        const transformed = res.data.map(q => ({
          id: q.id,
          question: q.question,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
        }));

        setQuestions(transformed);
        if (transformed.length === 0) {
          setMessage("No quiz available for this lesson.");
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        setMessage("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [lessonId]);

  const handleSubmit = (answers) => {
    console.log("Submitted answers:", answers);
    setMessage("Quiz submitted ✅");
    // You can send to backend via POST here
  };

  if (loading) return <p>Loading quiz...</p>;
  if (message) return <p>{message}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Quiz for Lesson {lessonId}</h1>
      <QuizForm questions={questions} onSubmit={handleSubmit} />
    </div>
  );
};

export default LessonQuiz;
