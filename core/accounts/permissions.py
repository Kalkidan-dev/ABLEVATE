from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'instructor'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
