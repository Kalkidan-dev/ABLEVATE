from django.db import models
from core.accounts.models import CustomUser
from django.utils.text import slugify


class Course(models.Model):
    LEVEL_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    image = models.ImageField(upload_to='course_images/', blank=True, null=True)
    instructor = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'instructor'},
        related_name='courses'
    )
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
    

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

     


class Enrollment(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')  

    def __str__(self):
        return f"{self.student.email} enrolled in {self.course.title}"
    


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    content = models.TextField()
    video_url = models.URLField(blank=True, null=True)
    
    video_file = models.FileField(
        upload_to='videos/',
        blank=True,
        null=True,
        help_text="Upload a video file if not using a URL.")
    
    downloadable_resource = models.FileField(upload_to='lesson_resources/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_free = models.BooleanField(default=False, help_text="Is this lesson free for all users?")
    captions = models.TextField(blank=True, help_text="Include text captions for hearing-impaired users.")
    alt_text = models.TextField(blank=True, help_text="Alternative text for any images used.")
    screen_reader_hint = models.TextField(blank=True, help_text="Special notes or structure for screen readers.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order = models.PositiveIntegerField(default=0, help_text="Order of the lesson in the course.")
    

    def __str__(self):
        return f"{self.title} ({self.course.title})"
class LessonProgress(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('student', 'lesson')
    def __str__(self):
        return f"{self.student.email} - {self.lesson.title} - {'Completed' if self.completed else 'Not Completed'}"

class Quiz(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="quizzes")
    question = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    explanation = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    correct_option = models.CharField(max_length=1, choices=[('A','A'),('B','B'),('C','C'),('D','D')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question
