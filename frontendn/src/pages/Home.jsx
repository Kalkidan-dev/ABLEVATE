import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../styles/Home.css';

const recognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)
    ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    : null;

const Home = () => {
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFeedback(`You said: "${transcript}"`);
      if (transcript.toLowerCase().includes('login')) {
        window.location.href = '/login';
      } else if (transcript.toLowerCase().includes('register')) {
        window.location.href = '/register';
      }
    };

    recognition.onerror = (event) => {
      setFeedback(`Error: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      setFeedback('Speech recognition not supported in your browser.');
      return;
    }

    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
      setFeedback('Listening...');
    }

    setListening(!listening);
  };

  return (
    <>
      
      <div className="home-container">
        <h1>Welcome to ABLEVATE</h1>
        <p>
          An inclusive learning platform for visually and hearing-impaired students. Empower your education with assistive technology and accessible content.
        </p>

        <div className="home-btn-group">
          <Link to="/login" className="home-btn home-btn-login">Login</Link>
          <Link to="/register" className="home-btn home-btn-register">Register</Link>
        </div>

        <div className="voice-control">
          <button
            onClick={toggleListening}
            aria-pressed={listening}
            className={`mic-button ${listening ? 'mic-active' : ''}`}
            title={listening ? 'Stop microphone' : 'Start microphone'}
          >
            🎤
          </button>
          <p className="mic-feedback">
            {feedback || 'Click mic to say "Login" or "Register"'}
          </p>
        </div>

        <section className="features">
          <div className="feature-card">
            <h3>Braille-Compatible Content</h3>
            <p>All text content is formatted to support Braille devices and displays.</p>
          </div>
          <div className="feature-card">
            <h3>Voice & Caption Support</h3>
            <p>Courses include voice control, captions, and optional sign language videos.</p>
          </div>
          <div className="feature-card">
            <h3>Role-Based Access</h3>
            <p>Students, instructors, and admins enjoy tailored experiences.</p>
          </div>
        </section>
      </div>

      <footer className="footer">
        <p>© 2025 ABLEVATE. All rights reserved.</p>
        <p>
          <Link to="/about">About</Link> | <Link to="/contact">Contact</Link> | <Link to="/privacy">Privacy Policy</Link>
        </p>
      </footer>
    </>
  );
};

export default Home;
