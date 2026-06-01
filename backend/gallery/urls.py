from django.urls import path,include
from .views import GalleryViewSet
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'gallery', GalleryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
