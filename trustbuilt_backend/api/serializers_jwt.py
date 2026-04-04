from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        # attrs key is 'email' not 'username'
        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password'),
        }

        user = None
        try:
            user = User.objects.get(email=credentials['email'])
        except User.DoesNotExist:
            raise Exception('No account found with this email.')

        if not user.check_password(credentials['password']):
            raise Exception('Invalid password.')

        if not user.is_active:
            raise Exception('This account is inactive.')

        refresh = self.get_token(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        return token


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer