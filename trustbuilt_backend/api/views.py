from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from urllib.parse import quote
from .models import Service, Testimonial, Contact, Consultation
from .serializers import (
    UserRegistrationSerializer, UserProfileSerializer,
    ServiceSerializer, TestimonialSerializer, ContactSerializer,
    ConsultationSerializer,
)

User = get_user_model()


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user    = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Account created successfully.',
                'user':    UserProfileSerializer(user).data,
                'tokens':  {'refresh': str(refresh), 'access': str(refresh.access_token)},
            }, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class   = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'user':  UserProfileSerializer(user).data,
            'stats': {
                'member_since': user.date_joined.strftime('%B %Y'),
                'is_staff':     user.is_staff,
            },
        })


# ── Public ────────────────────────────────────────────────────────────────────

class ServiceListView(generics.ListAPIView):
    queryset           = Service.objects.filter(is_active=True)
    serializer_class   = ServiceSerializer
    permission_classes = [permissions.AllowAny]


class TestimonialListView(generics.ListAPIView):
    queryset           = Testimonial.objects.filter(is_active=True)
    serializer_class   = TestimonialSerializer
    permission_classes = [permissions.AllowAny]


class ContactCreateView(generics.CreateAPIView):
    serializer_class   = ContactSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()
            try:
                send_mail(
                    subject=f'[Trust Built] New {contact.get_inquiry_type_display()} from {contact.name}',
                    message=f'''New inquiry received on Trust Built website.

Type:    {contact.get_inquiry_type_display()}
Name:    {contact.name}
Email:   {contact.email}
Phone:   {contact.phone or "Not provided"}
Service: {contact.service_interest or "Not specified"}

Message:
{contact.message}

View in Admin Panel: https://trustbuilt.vercel.app/admin-panel
                    ''',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.ADMIN_NOTIFY_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass
            return Response(
                {'message': 'Your message has been received. We will reach out within 24 hours.'},
                status=status.HTTP_201_CREATED
            )
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# ── NEW: Consultation Request ─────────────────────────────────────────────────

class ConsultationCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ConsultationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        consultation = serializer.save()

        # ── 1. Send admin email ───────────────────────────────────────────────
        admin_email = getattr(settings, 'ADMIN_NOTIFY_EMAIL', settings.DEFAULT_FROM_EMAIL)
        email_body = f"""
New FREE CONSULTATION request received on Trust Built website.

━━━━━━━━━━━━━━━━━━━━━━━━━
  Name    : {consultation.name}
  Email   : {consultation.email}
  Phone   : {consultation.phone}
━━━━━━━━━━━━━━━━━━━━━━━━━

Message:
{consultation.message}

━━━━━━━━━━━━━━━━━━━━━━━━━
Received at: {consultation.created_at.strftime('%d %b %Y, %I:%M %p IST')}
View in Admin Panel: https://trustbuilt.vercel.app/admin-panel
        """.strip()

        try:
            send_mail(
                subject=f'[Trust Built] 🚀 New Consultation Request from {consultation.name}',
                message=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[admin_email],
                fail_silently=False,
            )
        except Exception as e:
            # Log but don't fail the request — data is already saved
            print(f"[ConsultationView] Email send failed: {e}")

        # ── 2. Build WhatsApp link ────────────────────────────────────────────
        admin_whatsapp_number = getattr(settings, 'ADMIN_WHATSAPP_NUMBER', '917067570038')
        wa_text = (
            f"Hi Trust Built Team! 👋\n\n"
            f"New Consultation Request:\n"
            f"━━━━━━━━━━━━━━━\n"
            f"Name   : {consultation.name}\n"
            f"Email  : {consultation.email}\n"
            f"Phone  : {consultation.phone}\n"
            f"━━━━━━━━━━━━━━━\n"
            f"Message: {consultation.message}\n\n"
            f"Please follow up ASAP! 🙏"
        )
        whatsapp_url = f"https://wa.me/{admin_whatsapp_number}?text={quote(wa_text)}"

        return Response({
            'status':       'success',
            'message':      'Consultation request received! We will contact you within 24 hours.',
            'whatsapp_url': whatsapp_url,
        }, status=status.HTTP_201_CREATED)


# ── Admin Permission ──────────────────────────────────────────────────────────

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


# ── Admin Stats ───────────────────────────────────────────────────────────────

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            'total_users':           User.objects.filter(is_staff=False).count(),
            'total_messages':        Contact.objects.count(),
            'new_messages':          Contact.objects.filter(status='new').count(),
            'consultations':         Contact.objects.filter(inquiry_type='consultation').count(),
            'franchise_inquiries':   Contact.objects.filter(inquiry_type='franchise').count(),
            'general_messages':      Contact.objects.filter(inquiry_type='general').count(),
            'resolved':              Contact.objects.filter(status='resolved').count(),
            # Consultation widget stats
            'consultation_requests': Consultation.objects.count(),
            'new_consultations':     Consultation.objects.filter(status='new').count(),
        })


# ── Admin Users ───────────────────────────────────────────────────────────────

class AdminUsersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.filter(is_staff=False).order_by('-date_joined')
        data  = []
        for u in users:
            messages = Contact.objects.filter(email=u.email).order_by('-created_at')
            data.append({
                'id':            u.id,
                'username':      u.username,
                'email':         u.email,
                'first_name':    u.first_name,
                'last_name':     u.last_name,
                'date_joined':   u.date_joined.strftime('%d %b %Y'),
                'is_active':     u.is_active,
                'message_count': messages.count(),
                'messages': [{
                    'id':               m.id,
                    'name':             m.name,
                    'email':            m.email,
                    'phone':            m.phone,
                    'service_interest': m.service_interest,
                    'message':          m.message,
                    'inquiry_type':     m.inquiry_type,
                    'status':           m.status,
                    'created_at':       m.created_at.strftime('%d %b %Y, %I:%M %p'),
                } for m in messages],
            })
        return Response(data)


# ── Admin Messages ────────────────────────────────────────────────────────────

class AdminMessagesView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        itype = request.query_params.get('type', None)
        qs    = Contact.objects.all().order_by('-created_at')
        if itype:
            qs = qs.filter(inquiry_type=itype)
        return Response([{
            'id':               m.id,
            'name':             m.name,
            'email':            m.email,
            'phone':            m.phone,
            'service_interest': m.service_interest,
            'message':          m.message,
            'inquiry_type':     m.inquiry_type,
            'status':           m.status,
            'created_at':       m.created_at.strftime('%d %b %Y, %I:%M %p'),
        } for m in qs])

    def patch(self, request, pk):
        try:
            contact        = Contact.objects.get(pk=pk)
            contact.status = request.data.get('status', contact.status)
            contact.save()
            return Response({'message': 'Status updated.'})
        except Contact.DoesNotExist:
            return Response({'error': 'Not found.'}, status=404)


# ── Admin CRUD: Services ──────────────────────────────────────────────────────

class AdminServicesView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(ServiceSerializer(Service.objects.all(), many=True).data)

    def post(self, request):
        s = ServiceSerializer(data=request.data)
        if s.is_valid():
            s.save()
            return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminServiceDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return None

    def put(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'error': 'Not found'}, status=404)
        s = ServiceSerializer(obj, data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(s.data)
        return Response(s.errors, status=400)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'error': 'Not found'}, status=404)
        obj.delete()
        return Response({'message': 'Deleted.'}, status=204)


# ── Admin CRUD: Testimonials ──────────────────────────────────────────────────

class AdminTestimonialsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(TestimonialSerializer(Testimonial.objects.all(), many=True).data)

    def post(self, request):
        s = TestimonialSerializer(data=request.data)
        if s.is_valid():
            s.save()
            return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=400)


class AdminTestimonialDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return Testimonial.objects.get(pk=pk)
        except Testimonial.DoesNotExist:
            return None

    def put(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'error': 'Not found'}, status=404)
        s = TestimonialSerializer(obj, data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(s.data)
        return Response(s.errors, status=400)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'error': 'Not found'}, status=404)
        obj.delete()
        return Response({'message': 'Deleted.'}, status=204)


# ── Admin: Consultations ──────────────────────────────────────────────────────

class AdminConsultationsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Consultation.objects.all().order_by('-created_at')
        return Response([{
            'id':         c.id,
            'name':       c.name,
            'email':      c.email,
            'phone':      c.phone,
            'message':    c.message,
            'status':     c.status,
            'created_at': c.created_at.strftime('%d %b %Y, %I:%M %p'),
        } for c in qs])

    def patch(self, request, pk):
        try:
            c        = Consultation.objects.get(pk=pk)
            c.status = request.data.get('status', c.status)
            c.save()
            return Response({'message': 'Status updated.'})
        except Consultation.DoesNotExist:
            return Response({'error': 'Not found.'}, status=404)