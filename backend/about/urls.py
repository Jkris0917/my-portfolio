from django.urls import path
from .views import AboutView,SkillListView,ExperienceListView

urlpatterns = [
    path('about/', AboutView.as_view()),
    path('about/skills/', SkillListView.as_view()),
    path('about/experience/',ExperienceListView.as_view()),
]
