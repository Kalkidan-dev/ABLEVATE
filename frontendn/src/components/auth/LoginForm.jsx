import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useVoiceControl from '../../hooks/useVoiceControl';
import useVoiceCommands from '../../hooks/useVoiceCommands';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    console.log('Submitted email:', formData.email);
    console.log('Submitted password:', formData.password);

    if (!formData.email || !formData.password) {
      setFeedback('Email and password are required');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post('http://localhost:8000/api/token/', {
        email: formData.email,
        password: formData.password,
      });

      const { access, refresh, role } = res.data;
      console.log('ROLE FROM BACKEND:', role);

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('role', role);

      login({ token: access, role });

      setFeedback('Login successful!');

      if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'instructor') {
        navigate('/instructor-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-panel');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setFeedback('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceCommand = useVoiceCommands({
    formData,
    setFormData: (newData) =>
      setFormData((prev) => ({
        ...prev,
        ...newData,
      })),
    setShowPassword,
    handleSubmit: () => {
      // Delay to allow state to update before submission
      setTimeout(() => {
        handleSubmit();
      }, 100);
    },
    setFeedback,
    navigate,
  });

  const toggleListening = useVoiceControl(handleVoiceCommand, setListening);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full border px-3 py-2 rounded"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.remember}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, remember: e.target.checked }))
            }
          />
          <label>Remember Me</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {feedback && (
        <div className="mt-4 text-sm text-red-600 font-medium">{feedback}</div>
      )}

      <button
        onClick={toggleListening}
        className={`mt-4 px-4 py-2 rounded ${
          listening ? 'bg-red-500' : 'bg-green-500'
        } text-white`}
      >
        {listening ? 'Stop Voice Control' : 'Start Voice Control'}
      </button>
    </div>
  );
};

export default LoginForm;
