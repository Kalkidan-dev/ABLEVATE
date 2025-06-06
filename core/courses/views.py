from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from .models import Course, Lesson, Enrollment, QuizSubmission, LessonProgress
from .serializers import (
    CourseSerializer,
    LessonSerializer,
    EnrollmentSerializer,
    QuizSubmissionSerializer,
    LessonProgressSerializer
)
from .permissions import IsInstructorOrAdmin
from core.accounts.permissions import IsInstructor, IsStudent

# === COURSES ===

class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}


class CourseCreateView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrAdmin]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)


class CourseUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrAdmin]

    def get_serializer_context(self):
        return {'request': self.request}


# === LESSONS ===

class LessonCreateView(generics.CreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        course = serializer.validated_data.get('course')
        if course.instructor != self.request.user:
            raise PermissionDenied("You can only add lessons to your own courses.")
        serializer.save()


class LessonUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]
    parser_classes = [MultiPartParser, FormParser]

    def perform_update(self, serializer):
        course = serializer.validated_data.get('course') or serializer.instance.course
        if course.instructor != self.request.user:
            raise PermissionDenied("You can only edit your own course's lessons.")
        serializer.save()


class LessonListView(generics.ListAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lesson.objects.filter(course_id=self.kwargs['course_id'])

    def get_serializer_context(self):
        return {'request': self.request}


# === ENROLLMENT ===

class CourseEnrollmentView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# === QUIZ PERFORMANCE ===

class MyQuizPerformanceView(generics.ListAPIView):
    serializer_class = QuizSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizSubmission.objects.filter(student=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}


class QuizSubmissionCreateView(generics.CreateAPIView):
    serializer_class = QuizSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def perform_create(self, serializer):
        lesson_id = self.kwargs.get('lesson_id')
        lesson = get_object_or_404(Lesson, id=lesson_id)
        user = self.request.user

        if not Enrollment.objects.filter(student=user, course=lesson.course).exists():
            raise PermissionDenied("You must be enrolled in this course to submit quizzes.")

        quiz = serializer.validated_data.get("quiz")
        if quiz.lesson_id != lesson.id:
            raise PermissionDenied("This quiz does not belong to the specified lesson.")

        serializer.save(student=user, lesson=lesson)


    def get_serializer_context(self):
        return {'request': self.request}

class LessonProgressUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        return LessonProgress.objects.filter(student=self.request.user)

    def get_object(self):
        lesson_id = self.kwargs.get('lesson_id')
        obj, created = LessonProgress.objects.get_or_create(
            student=self.request.user,
            lesson_id=lesson_id
        )
        return obj

    def get_serializer_context(self):
        return {'request': self.request}