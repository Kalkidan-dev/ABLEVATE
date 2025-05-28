import axios from 'axios';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login/', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};


export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post('/api/auth/register/', { name, email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Registration failed', error);
    throw error;
  }
};


export const activateAccount = async (uid, token) => {
  try {
    const response = await axios.post(`/api/auth/activate/${uid}/${token}/`);
    return response.data;
  } catch (error) {
    console.error('Activation failed', error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await axios.post('/api/auth/reset-password/', { email });
    return response.data;
  } catch (error) {
    console.error('Reset password failed', error);
    throw error;
  }
};

export const changePassword = async (uid, token, newPassword) => {
  try {
    const response = await axios.post(`/api/auth/change-password/${uid}/${token}/`, { new_password: newPassword });
    return response.data;
  } catch (error) {
    console.error('Change password failed', error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

