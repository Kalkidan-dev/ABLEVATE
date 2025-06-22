import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useVoiceControl from '../../hooks/useVoiceControl';
import useVoiceCommands from '../../hooks/useVoiceCommands';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/Logo.png';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('role', role);
      localStorage.setItem('email', formData.email);

      login({ token: access, role });
      setFeedback('Login successful!');
      navigate(role === 'student' ? '/student-dashboard' :
               role === 'instructor' ? '/instructor-dashboard' :
               role === 'admin' ? '/admin-panel' : '/');
    } catch (err) {
      console.error('Login error:', err);
      setFeedback('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceCommand = useVoiceCommands({
    formData,
    setFormData: (newData) => setFormData((prev) => ({ ...prev, ...newData })),
    setShowPassword,
    handleSubmit, 
    // handleSubmit: () => setTimeout(() => handleSubmit(), 100),
    setFeedback,
    navigate,
  });

  const toggleListening = useVoiceControl(handleVoiceCommand, setListening);

  return (
    <div className="w-[380px] h-[460px] bg-white rounded-xl shadow-xl mx-auto mt-20 p-5 flex flex-col justify-between">
      {/* Logo + Title */}
      <div className="flex flex-col items-center">
        <img src={Logo} alt="ABLEVATE Logo" className="h-12 mb-2" />
        <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mt-4 px-1 text-sm">
        <div>
          <label className="block text-gray-600 font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        <div className="flex justify-between items-center text-gray-600 text-xs">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={formData.remember}
              onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
            />
            Remember Me
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-blue-600 hover:underline"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {feedback && <p className="text-center text-red-600 text-sm">{feedback}</p>}
      </form>

      {/* Voice Control Button */}
      <button
        onClick={toggleListening}
        className={`w-full mt-2 py-2 rounded text-white font-medium ${
          listening ? 'bg-red-600' : 'bg-green-600'
        } hover:opacity-90 transition`}
      >
        {listening ? 'Stop Voice Control' : 'Start Voice Control'}
      </button>
    </div>
  );
};

export default LoginForm;
