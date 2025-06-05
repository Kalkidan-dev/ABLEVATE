import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LessonDetail = ({ lesson }) => {
  const [quizResults, setQuizResults] = useState({});
  const [score, setScore] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Utility to check for YouTube URLs
  const isYouTubeUrl = (url) =>
    url.includes('youtube.com') || url.includes('youtu.be');

  // ESLint-friendly extractor for YouTube embed URL
  const convertYouTubeUrlToEmbed = (url) => {
    try {
      const regExp = /(?:youtube\.com\/(?:[^/]+\/.+|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})/;
      const match = url.match(regExp);
      return match ? `https://www.youtube.com/embed/${match[1]}` : '';
    } catch {
      return '';
    }
  };

  const getLessonKey = (lessonId) => `quiz_answers_lesson_${lessonId}`;

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem(getLessonKey(lesson.id))) || {};
    setQuizResults(savedAnswers);
  }, [lesson.id]);

  const handleOptionChange = (quizId, selectedOption) => {
    const updated = { ...quizResults, [quizId]: selectedOption };
    setQuizResults(updated);
    localStorage.setItem(getLessonKey(lesson.id), JSON.stringify(updated));
  };

  const isFormComplete = lesson.quizzes.every(q => quizResults[q.id]);

  const submitQuizToServer = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/submit-quiz/',
        {
          lesson_id: lesson.id,
          answers: quizResults,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setScore({
        correct: res.data.correct,
        total: res.data.total,
        percentage: res.data.percentage,
      });
      setIsSubmitted(true);
    } catch (error) {
      alert('Failed to submit quiz. Please try again.');
    }
  };

  const handleSubmit = () => {
    submitQuizToServer();
  };

  return (
    <div className="lesson-detail p-6">
      <h2 className="text-2xl font-bold mb-4" id="lesson-title">{lesson.title}</h2>

      {/* ✅ Multiple Video Support */}
      {lesson.videos && lesson.videos.length > 0 && (
        <div className="mb-6 space-y-4">
          {lesson.videos.map((videoUrl, index) => (
            <div key={index}>
              {isYouTubeUrl(videoUrl) ? (
                <iframe
                  className="w-full aspect-video rounded"
                  src={convertYouTubeUrlToEmbed(videoUrl)}
                  title={`Lesson Video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  controls
                  className="w-full rounded"
                  aria-label={`Lesson Video ${index + 1}`}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      {lesson.audio && (
        <audio controls className="mb-4">
          <source src={lesson.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {lesson.pdf && (
        <a href={lesson.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mb-4 block">
          View PDF Resource
        </a>
      )}

      <div className="lesson-content mb-6" dangerouslySetInnerHTML={{ __html: lesson.content }} />

      <h3 className="text-xl font-semibold mb-2">Quiz</h3>
      <form aria-labelledby="lesson-title">
        {lesson.quizzes.map((quiz, idx) => (
          <fieldset key={quiz.id} className="mb-6 p-4 border rounded" aria-describedby={`feedback-${quiz.id}`}>
            <legend className="font-medium mb-2">{idx + 1}. {quiz.question}</legend>
            {['A', 'B', 'C', 'D'].map(opt => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name={`quiz-${quiz.id}`}
                  value={opt}
                  checked={quizResults[quiz.id] === opt}
                  onChange={() => handleOptionChange(quiz.id, opt)}
                  disabled={isSubmitted}
                  className="mr-2"
                />
                {quiz[`option_${opt.toLowerCase()}`]}
              </label>
            ))}

            {score && (
              <p id={`feedback-${quiz.id}`} className={`mt-2 ${quizResults[quiz.id] === quiz.correct_option ? 'text-green-600' : 'text-red-600'}`}>
                {quizResults[quiz.id] === quiz.correct_option ? 'Correct ✅' : 'Incorrect ❌'}
                {quiz.explanation && (
                  <span className="block text-gray-600">Explanation: {quiz.explanation}</span>
                )}
              </p>
            )}
          </fieldset>
        ))}

        <button
          type="button"
          className={`px-6 py-2 rounded text-white ${isFormComplete && !isSubmitted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={handleSubmit}
          disabled={!isFormComplete || isSubmitted}
          aria-disabled={!isFormComplete || isSubmitted}
        >
          Submit Quiz
        </button>
      </form>

      {score && (
        <div className="mt-6 text-lg font-semibold text-blue-700" role="status">
          ✅ Score: {score.correct} / {score.total} ({score.percentage}%)
        </div>
      )}
    </div>
  );
};

export default LessonDetail;
