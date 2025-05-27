import React, { useReducer } from 'react';
import useVoiceControl from '../hooks/useVoiceControl';  // Adjust path as needed

// Reducer function
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FORM_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };
    case 'SUBMIT_LOGIN_FORM':
      return {
        ...state,
        submitting: true,
      };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        submitting: false,
        formData: { email: '', password: '' },
      };
    case 'SUBMIT_FAILURE':
      return {
        ...state,
        submitting: false,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  formData: { email: '', password: '' },
  submitting: false,
};

const LoginForm = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Handler for voice commands
  const handleVoiceCommand = (command) => {
    const lowerCmd = command.toLowerCase();

    if (lowerCmd.startsWith('set email to ')) {
      const email = lowerCmd.replace('set email to ', '').trim();
      dispatch({ type: 'SET_FORM_FIELD', field: 'email', value: email });
    } else if (lowerCmd.startsWith('set password to ')) {
      const password = lowerCmd.replace('set password to ', '').trim();
      dispatch({ type: 'SET_FORM_FIELD', field: 'password', value: password });
    } else if (lowerCmd === 'submit login form') {
      dispatch({ type: 'SUBMIT_LOGIN_FORM' });
      handleSubmit(); // call submit function (defined below)
    } else {
      console.log('Voice command not recognized:', command);
    }
  };

  // Connect voice commands to useVoiceControl hook
  useVoiceControl(handleVoiceCommand);

  // Manual input change handler
  const handleInputChange = (e) => {
    dispatch({
      type: 'SET_FORM_FIELD',
      field: e.target.name,
      value: e.target.value,
    });
  };

  // Simulated async submit handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    dispatch({ type: 'SUBMIT_LOGIN_FORM' });

    // Simulate API call delay
    try {
      // Replace this with your actual login API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Form submitted:', state.formData);
      dispatch({ type: 'SUBMIT_SUCCESS' });

      // Optionally: display success message or redirect user
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'SUBMIT_FAILURE' });
      // Optionally: display error message to user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      <input
        name="email"
        type="email"
        value={state.formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        required
        className="mb-2 p-2 border rounded w-full"
      />
      <input
        name="password"
        type="password"
        value={state.formData.password}
        onChange={handleInputChange}
        placeholder="Password"
        required
        className="mb-4 p-2 border rounded w-full"
      />
      <button
        type="submit"
        disabled={state.submitting}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        {state.submitting ? 'Logging in...' : 'Login'}
      </button>
      <p className="mt-2 text-sm text-gray-600">
        Use voice commands like "Set email to example@domain.com", "Set password to 123456", or "Submit login form".
      </p>
    </form>
  );
};

export default LoginForm;
