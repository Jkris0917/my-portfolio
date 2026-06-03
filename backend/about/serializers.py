from rest_framework import serializers
from .models import About, Skill, Experience


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'order']


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'role', 'company', 'period', 'location', 'description', 'order']


class AboutSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    cv_url = serializers.SerializerMethodField()

    class Meta:
        model = About
        fields = [
            'id', 'full_name', 'tagline', 'bio',
            'photo', 'photo_url', 'cv', 'cv_url',
            'location', 'target', 'education',
            'japanese_level', 'status', 'email',
            'github_url', 'linkedin_url',
            'is_active', 'updated_at',
        ]
        extra_kwargs = {
            'photo': {'write_only': True, 'required': False},
            'cv': {'write_only': True, 'required': False},
        }
        read_only_fields = ['id', 'updated_at']

    def get_photo_url(self, obj):
        if obj.photo:
            url = obj.photo.url
            if url.startswith('http'):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None

    def get_cv_url(self, obj):
        if obj.cv:
            url = obj.cv.url
            if url.startswith('http'):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None