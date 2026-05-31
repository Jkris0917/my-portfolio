from rest_framework import serializers
from .models import About,Skill,Experience

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id','name','category','order']
        
class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id','role','company','period','location','description', 'order']

class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = ['id','full_name','tagline','bio','photo', 'cv', 'location', 'target', 'education','japanese_level', 'status','email', 'github_url', 'linkedit_url', 'is_active','updated_at']
    
    def get_photo(self,obj):
        if obj.photo:
            url = obj.photo.url
            if url.startswith('http'):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None
    
    def get_cv(self,obj):
        if obj.cv:
            url = obj.cv.url
            if url.startswith('http'):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None