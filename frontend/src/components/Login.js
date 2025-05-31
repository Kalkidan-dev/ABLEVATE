import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/token/', { email, password });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('role', res.data.role);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">Login</h1>
      <form onSubmit={handleLogin} aria-label="Login Form">
        <input
          type="email"
          className="w-full p-2 border"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
          required
        />
        <input
          type="password"
          className="w-full p-2 border mt-2"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
          required
        />
        <button className="mt-4 bg-blue-500 text-white p-2 w-full rounded">Login</button>
      </form>
    </div>
  );
}

export default Login;
