from rest_framework import viewsets
from .serializers import ProjectSerializer
from .models import Project

# Create your views here.
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer