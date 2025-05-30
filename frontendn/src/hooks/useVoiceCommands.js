import { useCallback } from 'react';

const speak = (message) => {
  const utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(utterance);
};

export default function useVoiceCommands({ setFormData, setShowPassword, handleSubmit, setFeedback, navigate }) {
  return useCallback((text) => {
    let displayText = text;
    if (text.includes('password is')) {
      displayText = text.replace(/password is.*/i, 'password is [hidden]');
    }

    setFeedback(`Heard: "${displayText}"`);
    speak(displayText);

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

    if (text.includes('remember me')) {
      setFormData((prev) => ({ ...prev, remember: true }));
    }

    if (text.includes("don't remember me") || text.includes('do not remember me')) {
      setFormData((prev) => ({ ...prev, remember: false }));
    }

    if (text.includes('login')) {
      handleSubmit();
    }

    if (text.includes('show password')) {
      setShowPassword(true);
    }

    if (text.includes('hide password')) {
      setShowPassword(false);
    }

    if (text.includes('reset fields')) {
      setFormData({ email: '', password: '', remember: false });
      setFeedback('Fields have been reset.');
      speak('Fields have been cleared');
    }

    if (text.includes('language is arabic')) {
      document.documentElement.lang = 'ar';
      document.body.dir = 'rtl';
      setFeedback('Language set to Arabic');
      speak('Language set to Arabic');
    }

    if (text.includes('language is english')) {
      document.documentElement.lang = 'en';
      document.body.dir = 'ltr';
      setFeedback('Language set to English');
      speak('Language set to English');
    }

    if (text.includes('go to home')) {
      navigate?.('/');
      speak('Navigating to home page');
    }

    if (text.includes('go to signup')) {
      navigate?.('/signup');
      speak('Navigating to signup page');
    }
  }, [setFormData, setShowPassword, handleSubmit, setFeedback, navigate]);
}
