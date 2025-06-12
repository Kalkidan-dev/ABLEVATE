from rest_framework import generics, permissions
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.courses.models import Enrollment
from core.courses.serializers import EnrollmentSerializer

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [IsAdminUser]  # Only admins can register users


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]  # Allow any user to log in



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user

    total = user.enrollments.count()
    completed = user.enrollments.filter(status='completed').count()
    in_progress = user.enrollments.filter(status='in_progress').count()

    # Fetch enrolled course details
    enrolled_courses = Enrollment.objects.filter(student=user).select_related('course')
    enrolled_data = [
        {
            "id": e.course.id,
            "title": e.course.title,
            "status": e.status
        }
        for e in enrolled_courses
    ]
    # serializer = EnrollmentSerializer(enrolled_courses, many=True)
    return Response({
        "username": user.username,
        "total": total,
        "completed": completed,
        "inProgress": in_progress,
        "enrolledCourses": enrolled_data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications(request):
    data = [
        {"id": 1, "text": "New lesson available in React Basics"},
        {"id": 2, "text": "Your course 'Web Accessibility' is 80% complete"},
    ]
    return Response(data)   

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_profile(request):
    user = request.User
    return Response({
        "full_name": user.username,
        "email": user.email,
    })