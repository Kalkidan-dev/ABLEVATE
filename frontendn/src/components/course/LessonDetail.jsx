import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LessonDetail = ({ lesson }) => {
  const [quizResults, setQuizResults] = useState({});
  const [score, setScore] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isYouTubeUrl = (url) =>
    url.includes('youtube.com') || url.includes('youtu.be');

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

  useEffect(() => {
    if (Object.keys(quizResults).length > 0) {
      setIsSaving(true);
      localStorage.setItem(getLessonKey(lesson.id), JSON.stringify(quizResults));
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [quizResults, lesson.id]);

  useEffect(() => {
    if (score) {
      document.querySelector('[role="status"]')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [score]);

  const handleOptionChange = (quizId, selectedOption) => {
    const updated = { ...quizResults, [quizId]: selectedOption };
    setQuizResults(updated);
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
      if (error.response?.status === 401) {
        alert('You must be logged in to submit the quiz.');
      } else {
        alert('Failed to submit quiz. Please try again.');
      }
    }
  };

  const handleSubmit = () => {
    submitQuizToServer();
  };

  const renderVideo = (url, index) => (
    <div key={index} className="relative w-full pb-[56.25%] h-0">
      {isYouTubeUrl(url) ? (
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded"
          src={convertYouTubeUrlToEmbed(url)}
          title={`Lesson Video ${index + 1}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          controls
          className="absolute top-0 left-0 w-full h-full rounded"
          aria-label={`Lesson Video ${index + 1}`}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );

  const allVideos = Array.isArray(lesson.videos)
    ? lesson.videos
    : lesson.video_file
    ? [lesson.video_file]
    : [];

  return (
    <div className="lesson-detail p-6">
      <h2 className="text-2xl font-bold mb-4" id="lesson-title">{lesson.title}</h2>

      {allVideos.length > 0 && (
        <div className="mb-6 space-y-4">
          {allVideos.map((url, index) => renderVideo(url, index))}
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

      <section aria-labelledby="quiz-section">
        <h3 id="quiz-section" className="text-xl font-semibold mb-2">Quiz</h3>
        {isSaving && <p className="text-sm text-gray-500">Saving your answers...</p>}

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
                  {quizResults[quiz.id] !== quiz.correct_option && (
                    <div className="text-green-600">
                      Correct answer: {quiz[`option_${quiz.correct_option.toLowerCase()}`]}
                    </div>
                  )}
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
      </section>

      {score && (
        <div className="mt-6 text-lg font-semibold text-blue-700" role="status">
          ✅ Score: {score.correct} / {score.total} ({score.percentage}%)
        </div>
      )}
    </div>
  );
};

export default LessonDetail;
