import json
from rest_framework import serializers
from .models import Project


class TechStackField(serializers.Field):
    def to_representation(self, value):
        return value

    def to_internal_value(self, data):
        if isinstance(data, list):
            return data
        if isinstance(data, str):
            try:
                parsed = json.loads(data)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                return [t.strip() for t in data.split(',') if t.strip()]
        raise serializers.ValidationError("Invalid tech stack format.")


class ProjectSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    tech_stack = TechStackField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'image', 'image_url',
            'tech_stack', 'live_url', 'github_url',
            'is_featured', 'order', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'image': {'write_only': True, 'required': False},
        }

    def get_image_url(self, obj):
        if obj.image:
            # Cloudinary URLs are already absolute
            url = obj.image.url
            if url.startswith('http'):
                return url
            # Fallback for local dev
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None