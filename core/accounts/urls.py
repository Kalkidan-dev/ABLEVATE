from django.urls import path
from .views import RegisterView, LoginView, dashboard_stats, notifications, student_profile
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard-stats/', dashboard_stats, name='dashboard-stats'),
    path('notifications/', notifications, name='notifications'),
    path('student-profile/', student_profile, name='student-profile'),  # Uncomment if needed
]

