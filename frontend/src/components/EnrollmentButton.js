// EnrollmentButton.js
function EnrollmentButton({ courseId, onEnroll }) {
    return (
      <button
        onClick={() => onEnroll(courseId)}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        aria-label="Enroll in course"
      >
        Enroll
      </button>
    );
  }
  
  export default EnrollmentButton;
  