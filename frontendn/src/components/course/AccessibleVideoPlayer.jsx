// Directory: src/components/course/AccessibleVideoPlayer.jsx
import React from 'react';

const AccessibleVideoPlayer = ({ videoSrc, captionsSrc, signLanguageOverlay }) => {
  return (
    <div className="accessible-video-player">
      <video controls>
        <source src={videoSrc} type="video/mp4" />
        {captionsSrc && <track label="Captions" kind="subtitles" srcLang="en" src={captionsSrc} default />}
      </video>
      {signLanguageOverlay && <div className="sign-language-overlay">{signLanguageOverlay}</div>}
    </div>
  );
};

export default AccessibleVideoPlayer;

