import { useEffect, useState } from 'react';
import EnrollmentButton from './EnrollmentButton';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/courses/')  // Update URL for development
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
        setLoading(false);
      });
  }, []);

  const handleEnroll = (courseId) => {
    // Handle enrollment logic, make sure backend API is prepared for it
    console.log(`Enrolled in course ${courseId}`);
  };

  if (loading) return <p className="text-center mt-10">Loading courses...</p>;

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Courses</h1>

      <input
        type="text"
        placeholder="Search courses..."
        className="mb-6 p-2 border border-gray-300 rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search courses"
      />

      <div className="grid gap-4">
        {filteredCourses.map((course) => (
          <article
            key={course.id}
            className="border rounded-lg shadow-md p-4 bg-white"
            aria-labelledby={`course-title-${course.id}`}
          >
            <img
              src={course.image || `https://via.placeholder.com/400x200?text=${encodeURIComponent(course.title)}`}
              alt={`Preview for ${course.title}`}
              className="w-full h-48 object-cover rounded mb-4"
            />

            <h2 id={`course-title-${course.id}`} className="text-xl font-semibold text-gray-800">
              {course.title}
            </h2>
            <p className="text-gray-600 mb-2">{course.description}</p>
            <EnrollmentButton courseId={course.id} onEnroll={handleEnroll} />
          </article>
        ))}
      </div>
    </main>
  );
}

export default CourseList;
