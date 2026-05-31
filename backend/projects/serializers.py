from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id','title','description','image','tech_stack','live_url','github_url','is_featured','order','created_at','updated_at']
        read_only_fields = ['id','created_at','updated_at']