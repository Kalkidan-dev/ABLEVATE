from rest_framework import serializers
from .models import Course, Lesson, Enrollment, Quiz, LessonProgress
from django.utils.text import slugify
from django.utils import timezone


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = [
            'id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option', 'created_at'
        ]


class LessonSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, read_only=True)
    downloadable_resource = serializers.FileField(required=False, allow_null=True)
    video_file = serializers.FileField(required=False, allow_null=True)
    video_url  = serializers.URLField(required=False, allow_blank=True)
    captions = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'content', 'video_url', 'video_file','captions', 'alt_text',
            'screen_reader_hint', 'order', 'course', 'downloadable_resource', 'quizzes'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'course']
    def validate(self, attrs):
        
        if not attrs.get('video_url') and not attrs.get('video_file'):
            raise serializers.ValidationError("Either video_url or video_file must be provided.")
        
        
        if attrs.get('video_url') and attrs.get('video_file'):
            raise serializers.ValidationError("Please provide either video_url or video_file, not both.")
        
        return super().validate(attrs)

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.email', read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'instructor', 'instructor_name',
            'level', 'thumbnail', 'is_published', 'created_at', 'updated_at', 'lessons'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'instructor']


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'enrolled_at']
        read_only_fields = ['student', 'enrolled_at']

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['lesson', 'completed', 'completed_at', 'viewed_at']
        read_only_fields = ['completed_at', 'viewed_at']

    def update(self, instance, validated_data):
        if validated_data.get('completed') and not instance.completed_at:
            instance.completed_at = timezone.now()
        if not instance.viewed_at:
            instance.viewed_at = timezone.now()
        return super().update(instance, validated_data)