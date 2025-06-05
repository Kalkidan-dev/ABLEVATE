import { useCallback } from 'react';

const speak = (message) => {
  const utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.cancel(); // Cancel any ongoing speech first
  speechSynthesis.speak(utterance);
};

export default function useVoiceCommands({
  setFormData,
  setShowPassword,
  handleSubmit,
  setFeedback,
  navigate,
}) {
  return useCallback(
    (text) => {
      if (!text) return;

      let displayText = text;
      if (text.includes('password is')) {
        displayText = text.replace(/password is.*/i, 'password is [hidden]');
      }

      setFeedback(`Heard: "${displayText}"`);
      speak(displayText);

      // Email and password capture
      if (text.includes('email is')) {
        const match = text.match(/email is (.*)/i);
        if (match?.[1]) {
          setFormData((prev) => ({ ...prev, email: match[1].trim() }));
        }
      }

      if (text.includes('password is')) {
        const match = text.match(/password is (.*)/i);
        if (match?.[1]) {
          setFormData((prev) => ({ ...prev, password: match[1].trim() }));
        }
      }

      // Remember me
      if (text.includes('remember me')) {
        setFormData((prev) => ({ ...prev, remember: true }));
      }

      if (text.includes("don't remember me") || text.includes('do not remember me')) {
        setFormData((prev) => ({ ...prev, remember: false }));
      }

      // Login
      if (text.includes('login')) {
        setTimeout(() => {
          handleSubmit();
        }, 150);
      }

      // Show/Hide Password
      if (text.includes('show password')) {
        setShowPassword(true);
      }

      if (text.includes('hide password')) {
        setShowPassword(false);
      }

      // Reset form
      if (text.includes('reset fields')) {
        setFormData({ email: '', password: '', remember: false });
        setFeedback('Fields have been reset.');
        speak('Fields have been cleared');
      }

      // Language switch
      if (text.includes('language is amharic')) {
        document.documentElement.lang = 'am';
        document.body.dir = 'ltr';
        setFeedback('Language set to Amharic');
        speak('Language set to Amharic');
      }

      if (text.includes('language is english')) {
        document.documentElement.lang = 'en';
        document.body.dir = 'ltr';
        setFeedback('Language set to English');
        speak('Language set to English');
      }

      // Navigation
      if (text.includes('go to home')) {
        navigate?.('/');
        speak('Navigating to home page');
      }

      if (text.includes('go to courses') || text.includes('show my courses')) {
        const el = document.getElementById('course-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          el.focus();
          setFeedback('Navigating to courses section');
          speak('Here are your courses');
        }
      }

      // Read courses
      if (text.includes('read courses') || text.includes('speak courses')) {
        const rows = document.querySelectorAll('.course-row');
        if (rows.length === 0) {
          speak('You have no courses at the moment');
          setFeedback('No courses found');
          return;
        }

        let courseInfo = '';
        rows.forEach(row => {
          const title = row.querySelector('.course-title')?.textContent;
          const description = row.querySelector('.course-description')?.textContent;
          courseInfo += `${title}. ${description ? description : ''} `;
        });

        if (courseInfo.trim()) {
          speak(`You are enrolled in the following courses: ${courseInfo}`);
          setFeedback('Reading your courses');
        }
      }

    },
    [setFormData, setShowPassword, handleSubmit, setFeedback, navigate]
  );
}
