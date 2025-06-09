from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add custom claims
        data['role'] = self.user.role
        data['email'] = self.user.email
        print("CustomTokenObtainPairSerializer response:", data)

        return data
    

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'role', 'date_of_birth', 'password', 'password2', 'username', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        return CustomUser.objects.create_user(
            email=validated_data['email'],
            role=validated_data.get('role', 'student'),
            date_of_birth=validated_data.get('date_of_birth'),
            password=validated_data['password']
        )
