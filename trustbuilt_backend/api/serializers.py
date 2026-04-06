from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Service, Testimonial, Contact, Consultation

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'password', 'password2', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(
            username   = validated_data.get('username', validated_data['email']),
            email      = validated_data['email'],
            password   = validated_data['password'],
            first_name = validated_data.get('first_name', ''),
            last_name  = validated_data.get('last_name', ''),
        )


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model            = User
        fields           = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'date_joined', 'is_staff']
        read_only_fields = ['id', 'email', 'date_joined', 'is_staff']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Service
        fields = ['id', 'title', 'description', 'icon', 'order', 'is_active']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Testimonial
        fields = ['id', 'name', 'role', 'review', 'rating', 'is_active']


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Contact
        fields = ['id', 'name', 'email', 'phone', 'service_interest', 'message', 'inquiry_type']


# ── NEW: Consultation ─────────────────────────────────────────────────────────

class ConsultationSerializer(serializers.ModelSerializer):
    name    = serializers.CharField(max_length=200, error_messages={'blank': 'Name is required.'})
    email   = serializers.EmailField(error_messages={'blank': 'Email is required.', 'invalid': 'Enter a valid email.'})
    phone   = serializers.CharField(max_length=20, error_messages={'blank': 'Phone number is required.'})
    message = serializers.CharField(min_length=10, error_messages={
        'blank':     'Message is required.',
        'min_length': 'Message must be at least 10 characters.',
    })

    class Meta:
        model  = Consultation
        fields = ['id', 'name', 'email', 'phone', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']