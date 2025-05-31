import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useVoiceControl from '../../hooks/useVoiceControl';
import useVoiceCommands from '../../hooks/useVoiceCommands';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [listening, setListening] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!formData.email || !formData.password) {
      setFeedback('Email and password are required');
      return;
    }

    console.log('Logging in with', formData);
    setFeedback('Login successful!');
  };

  const handleVoiceCommand = useVoiceCommands({
    formData,
    setFormData,
    setShowPassword,
    handleSubmit,
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
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full border px-3 py-2 rounded"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.remember}
            onChange={(e) =>
              setFormData({ ...formData, remember: e.target.checked })
            }
          />
          <label>Remember Me</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">{feedback}</div>

      <button
        onClick={toggleListening}
        className={`mt-4 px-4 py-2 rounded ${
          listening ? 'bg-red-500' : 'bg-green-500'
        } text-white`}
      >
        {listening ? 'Stop Listening' : 'Start Voice Control'}
      </button>
    </div>
  );
};

export default LoginForm;
