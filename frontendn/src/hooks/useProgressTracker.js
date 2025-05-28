import { useState, useEffect } from 'react';

/**
 * Hook to track course/video progress via localStorage.
 * @param {string} courseId - Unique identifier for the course or lesson.
 */
const useProgressTracker = (courseId) => {
  const [progress, setProgress] = useState({ viewed: false, completed: false });

  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem(`progress-${courseId}`));
    if (savedProgress) setProgress(savedProgress);
  }, [courseId]);

  const markViewed = () => {
    const updated = { ...progress, viewed: true };
    setProgress(updated);
    localStorage.setItem(`progress-${courseId}`, JSON.stringify(updated));
  };

  const markCompleted = () => {
    const updated = { ...progress, completed: true };
    setProgress(updated);
    localStorage.setItem(`progress-${courseId}`, JSON.stringify(updated));
  };

  return { progress, markViewed, markCompleted };
};

export default useProgressTracker;
