import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/courses/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch courses');

        const data = await response.json();
        console.log("Fetched courses:", data); // For debugging
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="overflow-x-auto">
      <div id="course-section" className="overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>

        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300 text-left">Course Title</th>
                <th className="p-2 border border-gray-300 text-left hidden sm:table-cell">Description</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.id} className="course-row">
                    <td className="p-2 border border-gray-300 course-title">
                      {course.slug || course.id ? (
                        <Link
                          to={`/courses/${course.id}`}
                          className="text-blue-600 hover:underline hover:text-blue-800"
                        >
                          {course.title}
                        </Link>
                      ) : (
                        <span className="text-gray-500">{course.title}</span>
                      )}
                    </td>
                    <td className="p-2 border border-gray-300 course-description hidden sm:table-cell">
                      {course.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-4 text-center">
                    No courses available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CourseList;
