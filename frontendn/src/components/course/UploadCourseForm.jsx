import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadCourseForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateForm = () => {
    if (!title.trim() || !description.trim() || !video) {
      toast.error('Please fill in all fields and upload a video file.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', video);

    try {
      // Simulate upload with a timeout and progress bar
      const fakeUpload = () => {
        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      };

      await fakeUpload(); // Replace with actual upload call if using axios/fetch
      onSubmit(formData);
      toast.success('Course uploaded successfully!');
      setTitle('');
      setDescription('');
      setVideo(null);
      setUploadProgress(0);
    } catch (err) {
      toast.error('Upload failed. Please try again.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideo(file);
    } else {
      toast.error('Only video files are allowed.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-lg w-full"
    >
      <ToastContainer />
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Course Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter course title"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter course description"
          className="w-full border border-gray-300 rounded-md p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-dashed border-2 p-4 rounded-md text-center cursor-pointer ${
          dragOver ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-300'
        }`}
      >
        <p className="text-gray-700">
          {video ? `Selected File: ${video.name}` : 'Drag & drop a video file here, or click to select.'}
        </p>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          className="hidden"
          id="fileInput"
        />
      </div>
      <label
        htmlFor="fileInput"
        className="block text-blue-600 underline text-sm text-center cursor-pointer"
      >
        Or browse manually
      </label>

      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 h-4 rounded-md overflow-hidden">
          <div
            className="bg-blue-500 h-4 transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Upload Course
      </button>
    </form>
  );
};
await fetch('http://localhost:8000/api/courses/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}` if using JWT
  },
  body: JSON.stringify({
    // title,
    // description,
    // video: video, // This should be a file object, handle accordingly in backend
    
  }),
});

export default UploadCourseForm;
