import React, { useState } from 'react';

const BrailleToggle = ({ onToggle }) => {
  const [enabled, setEnabled] = useState(false);

  const toggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle(newState);
  };

  return (
    <button onClick={toggle} aria-pressed={enabled} aria-label="Toggle Braille Mode">
      {enabled ? 'Braille Mode On' : 'Braille Mode Off'}
    </button>
  );
};

export default BrailleToggle;