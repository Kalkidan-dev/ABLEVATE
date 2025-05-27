import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useVoiceControl from '../hooks/useVoiceControl';
import Fuse from 'fuse.js';
import { voiceCommands } from '../voiceCommands';
import { useAuth } from '../hooks/useAuth';

const VoiceControl = () => {
  const [message, setMessage] = useState('Say a command or say "help"');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Override logout command action for auth context
  const enhancedCommands = voiceCommands.map(cmd => {
    if (cmd.phrase === 'log out') {
      return {
        ...cmd,
        action: (nav, spk) => {
          logout();
          nav('/login');
          spk('Logged out successfully');
        },
      };
    }
    return cmd;
  });

  const fuse = new Fuse(enhancedCommands, {
    keys: ['phrase'],
    threshold: 0.4,
  });

  const handleTranscript = (transcript) => {
    const lowerTranscript = transcript.toLowerCase();
    const result = fuse.search(lowerTranscript);

    if (result.length > 0) {
      result[0].item.action(navigate, speak);
      setMessage(`Executed: ${result[0].item.phrase}`);
    } else {
      setMessage(`Command not recognized: "${transcript}". Say "help" for options.`);
      speak(`Sorry, I did not recognize the command: ${transcript}`);
    }
  };

  useVoiceControl(handleTranscript);

  return (
    <div className="p-4 border rounded fixed bottom-4 right-4 bg-white shadow-lg max-w-xs z-50">
      <h3 className="font-semibold mb-2">Voice Control</h3>
      <p>{message}</p>
    </div>
  );
};

export default VoiceControl;
