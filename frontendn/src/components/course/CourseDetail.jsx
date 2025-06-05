import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Pagination from './Pagination';
import LessonDetail from './LessonDetail';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageSize, setPageSize] = useState(5); // default lessons per page
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/courses/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setCourse(res.data);
        if (res.data.lessons?.length > 0) {
          setSelectedLessonId(res.data.lessons[0].id);
          setCurrentPage(1);
        }
      })
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading course...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!course) return <p className="text-center mt-10">Course not found.</p>;

  const totalLessons = course.lessons?.length || 0;
  const totalPages = Math.ceil(totalLessons / pageSize);

  // Adjust currentPage if it goes beyond totalPages after pageSize change
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const startIndex = (currentPage - 1) * pageSize;
  const pagedLessons = course.lessons?.slice(startIndex, startIndex + pageSize) || [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="mb-6">{course.description}</p>

      <h2 className="text-2xl font-semibold mb-3">Lessons</h2>
      <ul className="space-y-2">
        {pagedLessons.map((lesson) => (
          <li key={lesson.id}>
            <button
              onClick={() => setSelectedLessonId(lesson.id)}
              className={`text-left w-full p-3 rounded border ${
                lesson.id === selectedLessonId ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-current={lesson.id === selectedLessonId ? 'true' : undefined}
            >
              {lesson.title}
            </button>
          </li>
        ))}
      </ul>

      <Pagination
        total={totalLessons}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          setSelectedLessonId(course.lessons[(page - 1) * pageSize]?.id || null);
        }}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1); // reset to first page on page size change
          setSelectedLessonId(course.lessons[0]?.id || null);
        }}
      />

      {selectedLessonId && (
        <LessonDetail lesson={course.lessons.find((l) => l.id === selectedLessonId)} />
      )}
    </div>
  );
}

export default CourseDetail;
