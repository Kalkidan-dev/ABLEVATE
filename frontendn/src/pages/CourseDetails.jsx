// import React from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { getCourseDetails } from "../api/courseApi";
// // import CourseDetailsCard from "../components/course/CourseDetailsCard";
// // import AccessibleVideoPlayer from "../components/course/AccessibleVideoPlayer";
// // import CourseContent from "../components/course/CourseContent";
// // import CourseReviews from "../components/course/CourseReviews";
// // import CourseEnrollment from "../components/course/CourseEnrollment";


// const CourseDetails = () => {
//   const { courseId } = useParams();

//   const { data: isLoading, error } = useQuery({
//     queryKey: ["courseDetails", courseId],
//     queryFn: () => getCourseDetails(courseId),
//   });

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading course details</div>;

//   return (
//     <div className="p-6">
//       {/* <CourseDetailsCard course={course} />
//       <AccessibleVideoPlayer
//         videoSrc={course.videoUrl}
//         captionsSrc={course.captionsUrl}
//         signLanguageOverlay={course.signLanguageOverlay}
//       /> */}
//       {/* <CourseContent content={course.content} />
//       <CourseReviews reviews={course.reviews} />
//       <CourseEnrollment courseId={course.id} /> */}
//     </div>
//   );
// };

// export default CourseDetails;