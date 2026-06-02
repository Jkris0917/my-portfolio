from django.urls import path
from .views import AboutView,SkillListView,ExperienceListView,AboutDetailView,SkillDetailView,ExperienceDetailView,SkillListView

urlpatterns = [
    path('about/', AboutView.as_view()),
    path('about/<int:pk>/', AboutDetailView.as_view()),
    path('about/skills/', SkillListView.as_view()),
    path('about/skills/<int:pk>/', SkillDetailView.as_view()),
    path('about/experience/', ExperienceListView.as_view()),
    path('about/experience/<int:pk>/', ExperienceDetailView.as_view()),
]
