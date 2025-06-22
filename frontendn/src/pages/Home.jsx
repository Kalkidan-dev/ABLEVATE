import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import BrailleImg from '../assets/BrailleImg.jpg';
import VoiceImg from '../assets/VoiceImg.jpg';
import RoleImg from '../assets/RoleImg.jpg';

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
      setFeedback('🎧 Listening...');
    }

    setListening(!listening);
  };

  return (
    <>
      <div className="home-container">

        <div className="mic-top-right">
          <button
            onClick={toggleListening}
            aria-pressed={listening}
            className={`mic-button small ${listening ? 'mic-active' : ''}`}
            title={listening ? 'Stop microphone' : 'Start microphone'}
          >
            🎤
          </button>
        </div>

        <header className="home-hero">
          <h1><span className="brand">Welcome to ABLEVATE</span></h1>
          <p className="subtext">
            Want to Learn Without limits? Say hello to ABLEVATE!
            
          </p>
        </header>

        <div className="home-search-group">
          <input
            type="text"
            className="home-search-input"
            placeholder="Search courses, topics, or instructors..."
            aria-label="Search"
          />
          <button className="home-search-btn">🔍 Search</button>
        </div>

        <div className="mic-feedback">
          {feedback || 'Say "Login" or "Register" for voice navigation'}
        </div>

        <section className="features">
         
          <div className="features-grid">

            <div className="feature-card">
              <img src={BrailleImg} alt="Braille Compatible" className="feature-img-large" />
              <div className="feature-text">
                <h4>Braille-Compatible</h4>
                <p>BRF-ready learning materials, perfectly tailored for Braille displays.</p>
              </div>
            </div>

            <div className="feature-card">
              <img src={VoiceImg} alt="Voice and Captions" className="feature-img-large" />
              <div className="feature-text">
                <h4>Voice & Captions</h4>
                <p>All lessons include audio, captions, and optional sign language.</p>
              </div>
            </div>

            <div className="feature-card">
              <img src={RoleImg} alt="Role-Based Access" className="feature-img-large" />
              <div className="feature-text">
                <h4>Role-Based Access</h4>
                <p>Personalized experience for students, instructors, and admins.</p>
              </div>
            </div>

          </div>
        </section>
      </div>

      <footer className="footer">
        <p>© 2025 <span className="brand">ABLEVATE</span>. All rights reserved.</p>
        <p className="footer-links">
          <Link to="/about">About</Link> | <Link to="/contact">Contact</Link> | <Link to="/privacy">Privacy</Link>
        </p>
      </footer>
    </>
  );
};

export default Home;
