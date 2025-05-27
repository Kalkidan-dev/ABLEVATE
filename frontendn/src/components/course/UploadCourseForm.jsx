import React, { useState } from 'react';

const UploadCourseForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (video) formData.append('video', video);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course Title" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadCourseForm;