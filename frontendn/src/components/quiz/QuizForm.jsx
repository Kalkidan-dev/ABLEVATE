// components/quiz/QuizForm.jsx
import React, { useState } from 'react';
import QuizCard from './QuizCard';

const QuizForm = ({ questions, onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (selectedOption) => {
    const questionId = questions[currentIndex].id;

    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      onSubmit(answers);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-form">
      {currentQuestion ? (
        <QuizCard
          question={currentQuestion.question}
          options={currentQuestion.options}
          onAnswer={handleAnswer}
        />
      ) : (
        <p>Submitting...</p>
      )}
    </div>
  );
};

export default QuizForm;
