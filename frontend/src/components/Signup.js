import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ username: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    localStorage.setItem('role', form.role);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} aria-label="Signup form">
        <label className="block mb-2" htmlFor="username">Username</label>
        <input
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          type="text"
          name="username"
          id="username"
          value={form.username}
          onChange={handleChange}
          required
          aria-required="true"
        />

        <label className="block mb-2" htmlFor="password">Password</label>
        <input
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          type="password"
          name="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          required
          aria-required="true"
        />

        <label className="block mb-2" htmlFor="role">Select Role</label>
        <select
          name="role"
          id="role"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={form.role}
          onChange={handleChange}
          aria-label="Select user role"
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <button aria-label="Sign up">Sign Up</button>
        <p className="mt-4 text-sm text-gray-600">Already have an account? <a href="/" className="text-blue-500">Login</a></p>
        <p className="mt-4 text-sm text-gray-600">By signing up, you agree to our <a href="/terms" className="text-blue-500">Terms of Service</a>.</p>
      </form>
    </div>
  );
}

export default Signup;
