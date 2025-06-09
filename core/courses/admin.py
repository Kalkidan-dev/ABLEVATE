from django.contrib import admin
from .models import Course, Lesson, Enrollment, Quiz

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    search_fields = ('title',)
    list_filter = ('course',)
    fields = (
        'title', 'content', 'video_url', 'captions',
        'screen_reader_hint', 'order', 'course', 'video_file', 'audio_file', 'pdf_file', 'downloadable_resource','transcript'
    #    , 'braille_file'
    )

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'created_at')
    search_fields = ('title',)
    list_filter = ('instructor',)

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at')
    search_fields = ('student__email', 'course__title')
    list_filter = ('course',)
    readonly_fields = ('enrolled_at',)  
    fields = ('student', 'course')  

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'question', 'created_at')  # ✅ use 'question' instead of 'title'
    search_fields = ('question',)
    list_filter = ('lesson',)
    fields = ('lesson', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option', 'created_at')
    readonly_fields = ('created_at',)
