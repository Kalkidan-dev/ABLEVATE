from rest_framework import generics, permissions
from .models import Course, Lesson, Enrollment
from core.accounts.permissions import IsInstructor, IsStudent
from .serializers import CourseSerializer, LessonSerializer, EnrollmentSerializer
from .permissions import IsInstructorOrAdmin
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied
from django.utils.text import slugify


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class CourseCreateView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrAdmin]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)


class CourseUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrAdmin]


class LessonCreateView(generics.CreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        course = serializer.validated_data.get('course')
        user = self.request.user

        # Check if the user is an instructor
        if user.role != 'instructor':
            raise PermissionDenied("Only instructors can create lessons.")

        # Ensure the course belongs to the instructor
        if course.instructor != user:
            raise PermissionDenied("You can only add lessons to your own courses.")

        serializer.save()

class LessonUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]
    parser_classes = [MultiPartParser, FormParser]

    def perform_update(self, serializer):
        course = serializer.validated_data.get('course')
        if course.instructor != self.request.user:
            raise PermissionDenied("You can only edit lessons in your own courses.")
        serializer.save()

class CourseEnrollmentView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

class LessonListView(generics.ListAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Lesson.objects.filter(course_id=course_id)
    
    def perform_create(self, serializer):
        course = serializer.validated_data.get('course')
        if self.request.user.role != 'instructor':
            raise PermissionDenied("Only instructors can create lessons.")
        if course.instructor != self.request.user:
            raise PermissionDenied("You can only add lessons to your own courses.")
        serializer.save()
