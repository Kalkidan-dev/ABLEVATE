from django.urls import path, include
from rest_framework.routers import DefaultRouter
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
    LessonViewSet
    
)

# Setup router for LessonViewSet
router = DefaultRouter()
router.register(r'lessons', LessonViewSet, basename='lesson')  # Enables /api/lessons/ and /api/lessons/{id}/quizzes/

urlpatterns = [
    # Course Endpoints
    path('', CourseListView.as_view(), name='course-list'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('create/', CourseCreateView.as_view(), name='course-create'),
    path('<int:pk>/edit/', CourseUpdateView.as_view(), name='course-update'),

    # Lesson Endpoints (non-ViewSet)
    path('<int:course_id>/lessons/', LessonListView.as_view(), name='lesson-list'),
    path('lessons/create/', LessonCreateView.as_view(), name='lesson-create'),
    path('lessons/<int:pk>/update/', LessonUpdateView.as_view(), name='lesson-update'),

    # Quiz and performance
    path('quiz-performance/', MyQuizPerformanceView.as_view(), name='quiz-performance-list'),
    
    path('lessons/<int:lesson_id>/quiz-submissions/', QuizSubmissionCreateView.as_view(), name='quiz-submission-create'),

    # Enrollment Endpoint
    path('enroll/', CourseEnrollmentView.as_view(), name='course-enroll'),

    # Include ViewSet routes
    path('', include(router.urls)),
]
