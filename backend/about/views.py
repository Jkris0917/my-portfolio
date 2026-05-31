from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import About,Skill,Experience
from .serializers import AboutSerializer,SkillSerializer,ExperienceSerializer

# Create your views here.
class AboutView(APIView):
    def get(self,request):
        about = About.objects.filter(is_active=True).first()
        if not about:
            return Response(
                {"error": "About content not found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = AboutSerializer(about, context={'request':request})
        return Response(serializer.data)
    
class SkillListView(APIView):
    def get(self, request):
        skills = Skill.objects.all()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)
    
class ExperienceListView(APIView):
    def get(self,request):
        experience = Experience.objects.all()
        serializer = ExperienceSerializer(experience,many=True)
        return Response(serializer.data)