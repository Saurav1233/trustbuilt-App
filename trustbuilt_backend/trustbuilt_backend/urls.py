from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({
        "status": "ok",
        "service": "TrustBuilt API",
        "version": "1.0",
        "endpoints": {
            "api": "/api/",
            "admin": "/admin/",
        }
    })


urlpatterns = [
    path('',       health_check,           name='health-check'),
    path('admin/', admin.site.urls),
    path('',       include('api.urls')),  # no /api/ prefix
]