from django.urls import path
from .views import (
    CourseListView,
    CourseDetailView,
    CourseCreateView,
    CourseUpdateView,
    LessonListView,
    LessonCreateView,
    LessonUpdateView,
    CourseEnrollmentView,
    QuizSubmissionCreateView,
    MyQuizPerformanceView,
)

urlpatterns = [
    # Course Endpoints
    path('', CourseListView.as_view(), name='course-list'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('create/', CourseCreateView.as_view(), name='course-create'),
    path('<int:pk>/edit/', CourseUpdateView.as_view(), name='course-update'),

    # Lesson Endpoints
    path('<int:course_id>/lessons/', LessonListView.as_view(), name='lesson-list'),
    
    path('lessons/create/', LessonCreateView.as_view(), name='lesson-create'),
    path('lessons/<int:pk>/update/', LessonUpdateView.as_view(), name='lesson-update'),
    path('quiz-performance/', MyQuizPerformanceView.as_view(), name='quiz-performance-list'),  # GET user's quiz submissions
    
    # Quiz submissions tied to lessons
    path('lessons/<int:lesson_id>/quiz-submissions/', QuizSubmissionCreateView.as_view(), name='quiz-submission-create'),  # POST submit quiz

    # Enrollment Endpoint
    path('enroll/', CourseEnrollmentView.as_view(), name='course-enroll'),
    
]
