from rest_framework import serializers
from .models import Course, Lesson, Enrollment, Quiz, LessonProgress, QuizSubmission
from django.utils.text import slugify
from django.utils import timezone


class QuizSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    lesson = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Quiz
        fields = '__all__'
        read_only_fields = ['created_at', 'lesson']

    def create(self, validated_data):
        return Quiz.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class QuizSubmissionSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    quiz_id = serializers.PrimaryKeyRelatedField(source='quiz', queryset=Quiz.objects.all(), write_only=True)

    class Meta:
        model = QuizSubmission
        fields = ['id', 'quiz', 'quiz_id', 'student', 'selected_option', 'submitted_at']
        read_only_fields = ['student', 'submitted_at']


class LessonSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True)
    downloadable_resource = serializers.FileField(required=False, allow_null=True)
    video_file = serializers.FileField(required=False, allow_null=True)
    video_url = serializers.URLField(required=False, allow_blank=True)
    captions = serializers.CharField(required=False, allow_blank=True)
    has_quiz = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'content', 'video_url', 'video_file', 'captions',
            'alt_text', 'screen_reader_hint', 'order', 'course', 'has_quiz',
            'created_at', 'audio_file', 'pdf_file', 'transcript',
            'downloadable_resource', 'quizzes'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        if not attrs.get('video_url') and not attrs.get('video_file'):
            raise serializers.ValidationError("Either video_url or video_file must be provided.")
        if attrs.get('video_url') and attrs.get('video_file'):
            raise serializers.ValidationError("Please provide either video_url or video_file, not both.")
        return attrs

    def create(self, validated_data):
        quizzes_data = validated_data.pop('quizzes', [])
        lesson = Lesson.objects.create(**validated_data)
        for quiz_data in quizzes_data:
            Quiz.objects.create(lesson=lesson, **quiz_data)
        return lesson
    
    def get_has_quiz(self, obj):
        return obj.quizzes.exists()

    def update(self, instance, validated_data):
        quizzes_data = validated_data.pop('quizzes', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if quizzes_data is not None:
            instance.quizzes.all().delete()
            for quiz_data in quizzes_data:
                Quiz.objects.create(lesson=instance, **quiz_data)

        return instance


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.email', read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    enrolled = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'instructor', 'instructor_name',
            'level', 'thumbnail', 'is_published', 'created_at', 'updated_at',
            'lessons', 'enrolled', 'progress',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'instructor']

    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data.get('title', ''))
        return super().create(validated_data)

    def get_enrolled(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Enrollment.objects.filter(course=obj, student=user).exists()
        return False

    def get_progress(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            lessons = obj.lessons.all()
            total = lessons.count()
            if not total:
                return None
            completed = LessonProgress.objects.filter(
                student=user, lesson__in=lessons, completed=True
            ).count()
            return {
                "completed_lessons": completed,
                "total_lessons": total,
                "percentage": round((completed / total) * 100, 2)
            }
        return None


class EnrollmentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='course.id')
    # title = serializers.CharField(source='course.title')

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'status']
        read_only_fields = ['id', 'student', 'enrolled_at']


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id','lesson', 'completed', 'completed_at', 'viewed_at']
        read_only_fields = ['id','completed_at', 'viewed_at']

    def update(self, instance, validated_data):
        if validated_data.get('completed') and not instance.completed_at:
            instance.completed_at = timezone.now()
        if not instance.viewed_at:
            instance.viewed_at = timezone.now()
        return super().update(instance, validated_data)
