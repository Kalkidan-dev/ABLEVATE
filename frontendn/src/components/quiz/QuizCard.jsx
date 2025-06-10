// components/quiz/QuizCard.jsx
import React from 'react';

const QuizCard = ({ question, options, onAnswer }) => {
  return (
    <div className="quiz-card border p-4 mb-4">
      <p className="font-semibold">{question}</p>
      {options.map((opt, i) => (
        <button
          key={i}
          className="block w-full bg-blue-100 hover:bg-blue-200 text-left p-2 mt-2 rounded"
          onClick={() => onAnswer(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

export default QuizCard;
