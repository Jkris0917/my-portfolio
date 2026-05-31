from django.urls import path
from .views import ContactMessageView, ContactMessageListView, ContactMessageDetailView

urlpatterns = [
    path('contact/', ContactMessageView.as_view()),
    path('messages/', ContactMessageListView.as_view()),
    path('messages/<int:pk>/', ContactMessageDetailView.as_view()),
]