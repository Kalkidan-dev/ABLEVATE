from rest_framework import permissions


class IsInstructorOrAdmin(permissions.BasePermission):
    """
    Only instructors and admins can create or update courses.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['instructor', 'admin']

    def has_object_permission(self, request, view, obj):
        # Instructors can edit only their own courses; admins can edit all
        return request.user.role == 'admin' or obj.instructor == request.user

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'
