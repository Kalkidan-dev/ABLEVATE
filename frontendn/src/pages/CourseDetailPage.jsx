// src/pages/CourseDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { FileText, Volume2, Video, Download } from 'lucide-react';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  
  const voiceCommands = {};

  if (course?.lessons) {
    course.lessons.forEach((lesson) => {
      // command to navigate to lesson by title, e.g., "open lesson one"
      voiceCommands[`open ${lesson.title.toLowerCase()}`] = () => navigate(`/lessons/${lesson.id}`);
    });
  }


  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/courses/${courseId}/`);
        setCourse(res.data);
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (!course)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading course...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-6">{course.title}</h1>
      <p className="text-gray-700 text-lg leading-relaxed mb-10">{course.description}</p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b border-blue-200 pb-2">
        Lessons
      </h2>

      <div className="grid gap-6">
        {course.lessons?.length > 0 ? (
          course.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md cursor-pointer transition"
              onClick={() => navigate(`/lessons/${lesson.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/lessons/${lesson.id}`);
              }}
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{lesson.title}</h3>
              <p className="text-gray-600 mb-4">
                {lesson.description ? lesson.description.slice(0, 120) + (lesson.description.length > 120 ? '...' : '') : 'No description available.'}
              </p>

              <div className="flex flex-wrap gap-4">
                {lesson.pdf_file && (
                  <a
                    href={lesson.pdf_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    <FileText size={18} />
                    View PDF
                  </a>
                )}

                {lesson.audio_file && (
                  <a
                    href={lesson.audio_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    <Volume2 size={18} />
                    Listen Audio
                  </a>
                )}

                {lesson.video_file && (
                  <a
                    href={lesson.video_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    <Video size={18} />
                    Watch Video
                  </a>
                )}

                {lesson.downloadable_file && (
                  <a
                    href={lesson.downloadable_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    <Download size={18} />
                    Download File
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-6">No lessons available yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
