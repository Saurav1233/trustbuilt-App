from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Service, Testimonial, Contact, Consultation


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['email', 'username', 'first_name', 'last_name', 'is_staff', 'date_joined']
    list_filter   = ['is_staff', 'is_superuser', 'is_active']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering      = ['-date_joined']
    fieldsets     = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('bio',)}),
    )


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display  = ['title', 'icon', 'order', 'is_active', 'created_at']
    list_filter   = ['is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'description']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display  = ['name', 'role', 'rating', 'is_active', 'created_at']
    list_filter   = ['rating', 'is_active']
    list_editable = ['is_active']
    search_fields = ['name', 'role', 'review']


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display   = ['name', 'email', 'phone', 'service_interest', 'status', 'created_at']
    list_filter    = ['status', 'created_at']
    list_editable  = ['status']
    search_fields  = ['name', 'email', 'message']
    readonly_fields = ['created_at', 'updated_at']


# ── NEW ───────────────────────────────────────────────────────────────────────

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display    = ['name', 'email', 'phone', 'status', 'created_at']
    list_filter     = ['status', 'created_at']
    list_editable   = ['status']
    search_fields   = ['name', 'email', 'phone', 'message']
    readonly_fields = ['created_at', 'updated_at']
    ordering        = ['-created_at']