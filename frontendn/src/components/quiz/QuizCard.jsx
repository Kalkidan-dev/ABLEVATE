import React from 'react';

const QuizCard = ({ question, options, onAnswer }) => {
  return (
    <div className="quiz-card">
      <p>{question}</p>
      {options.map((opt, i) => (
        <button key={i} onClick={() => onAnswer(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
};

export default QuizCard;