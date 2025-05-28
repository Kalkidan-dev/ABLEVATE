export const voiceCommands = [
    {
    phrase: 'toggle sidebar',
    description: 'Open or close the sidebar',
    action: (navigate, speak, dispatch) => {
      dispatch({ type: 'TOGGLE_SIDEBAR' });
      speak('Toggling sidebar');
    },
  },
  {
    phrase: 'open help modal',
    description: 'Open the help modal',
    action: (_, speak, dispatch) => {
      dispatch({ type: 'OPEN_MODAL' });
      speak('Opening help modal');
    },
  },
  {
    phrase: 'close help modal',
    description: 'Close the help modal',
    action: (_, speak, dispatch) => {
      dispatch({ type: 'CLOSE_MODAL' });
      speak('Closing help modal');
    },
  },

  {
  phrase: 'login',
  description: 'Navigate to the login page',
  action: (navigate, speak) => {
    navigate('/login');
    speak('Navigating to login page');
  },
},
{
  phrase: 'register',
  description: 'Navigate to the registration page',
  action: (navigate, speak) => {
    navigate('/register');
    speak('Navigating to registration page');
  },
},

  {
  phrase: 'switch language to spanish',
  description: 'Change voice control language to Spanish',
  action: (navigate, speak, dispatch, transcript, setLanguage) => {
    setLanguage('es-ES');
    speak('Idioma cambiado a español');
  },
},

{
  phrase: 'fill email with',
  description: 'Fill the email input field',
  action: (_, speak, dispatch, transcript) => {
    // Extract the text after "fill email with"
    const match = transcript.match(/fill email with (.+)/i);
    if (match && match[1]) {
      dispatch({ type: 'SET_FORM_FIELD', field: 'email', value: match[1] });
      speak(`Email field filled with ${match[1]}`);
    } else {
      speak('Please say the email after the phrase');
    }
  },
},
{
  phrase: 'submit login form',
  description: 'Submit the login form',
  action: (_, speak, dispatch) => {
    dispatch({ type: 'SUBMIT_LOGIN_FORM' });
    speak('Submitting login form');
  },
},

  {
    phrase: 'go to home',
    description: 'Navigate to home page',
    action: (navigate, speak) => {
      navigate('/');
      speak('Navigating to home');
    },
  },
  {
    phrase: 'open my courses',
    description: 'Open student dashboard',
    action: (navigate, speak) => {
      navigate('/student-dashboard');
      speak('Opening your courses');
    },
  },
  {
    phrase: 'upload a course',
    description: 'Go to upload course page',
    action: (navigate, speak) => {
      navigate('/upload-course');
      speak('Opening course upload page');
    },
  },
  {
    phrase: 'show admin panel',
    description: 'Open the admin panel',
    action: (navigate, speak) => {
      navigate('/admin-panel');
      speak('Opening admin panel');
    },
  },
  {
    phrase: 'log out',
    description: 'Log out from the app',
    action: (navigate, speak) => {
      navigate('/login');
      speak('Logging out');
    },
  },
  {
    phrase: 'help',
    description: 'List available commands',
    action: (_, speak) => {
      speak('Try saying commands like go to home, open my courses, upload a course, or log out');
    },
  },
];
export const getCommandByPhrase = (phrase) => {
  return voiceCommands.find(command => command.phrase === phrase);
};
export const getCommandDescriptions = () => {
  return voiceCommands.map(command => ({
    phrase: command.phrase,
    description: command.description,
  }));
};
