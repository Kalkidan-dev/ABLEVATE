import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to ABLEVATE</h1>
      <p className="text-lg mb-6">An inclusive learning platform for visually and hearing-impaired students.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </Link>
        <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
