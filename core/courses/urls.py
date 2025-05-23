from django.urls import path
from .views import (
    CourseListView,
    CourseDetailView,
    CourseCreateView,
    CourseUpdateView,
    LessonListView,
    LessonCreateView,
    LessonUpdateView,
    CourseEnrollmentView
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

    # Enrollment Endpoint
    path('enroll/', CourseEnrollmentView.as_view(), name='course-enroll'),
]
