from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('register/',      views.RegisterView.as_view(),       name='register'),
    path('login/',         TokenObtainPairView.as_view(),       name='login'),
    path('token/refresh/', TokenRefreshView.as_view(),          name='token_refresh'),
    path('profile/',       views.ProfileView.as_view(),         name='profile'),
    path('dashboard/',     views.DashboardView.as_view(),       name='dashboard'),

    # Public
    path('services/',      views.ServiceListView.as_view(),     name='services'),
    path('testimonials/',  views.TestimonialListView.as_view(), name='testimonials'),
    path('contact/',       views.ContactCreateView.as_view(),   name='contact'),

    # Admin — Stats & Users
    path('admin/stats/',   views.AdminStatsView.as_view(),      name='admin-stats'),
    path('admin/users/',   views.AdminUsersView.as_view(),      name='admin-users'),

    # Admin — Messages
    path('admin/messages/',           views.AdminMessagesView.as_view(),      name='admin-messages'),
    path('admin/messages/<int:pk>/',  views.AdminMessagesView.as_view(),      name='admin-message-update'),

    # Admin — Services CRUD
    path('admin/services/',           views.AdminServicesView.as_view(),      name='admin-services'),
    path('admin/services/<int:pk>/',  views.AdminServiceDetailView.as_view(), name='admin-service-detail'),

    # Admin — Testimonials CRUD
    path('admin/testimonials/',          views.AdminTestimonialsView.as_view(),      name='admin-testimonials'),
    path('admin/testimonials/<int:pk>/', views.AdminTestimonialDetailView.as_view(), name='admin-testimonial-detail'),
]