// components/CourseCard.jsx
function CourseCard({ course }) {
    return (
      <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
        <img
          src={course.image_url || '/default-course.jpg'}
          alt={course.title}
          className="w-full h-48 object-cover rounded mb-2"
        />
        <h2 className="text-lg font-semibold">{course.title}</h2>
        <p className="text-gray-600">{course.description}</p>
      </div>
    );
  }
  
  export default CourseCard;
  