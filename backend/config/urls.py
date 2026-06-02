from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .auth_views import ChangePasswordView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('projects.urls')),
    path('api/', include('contacts.urls')),
    path('api/', include('about.urls')),
    path('api/', include('certificates.urls')),
    path('api/', include('gallery.urls')),
    path('api/auth/login/', TokenObtainPairView.as_view()),
    path('api/auth/refresh/', TokenRefreshView.as_view()),
    path('api/auth/change-password/', ChangePasswordView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)