from rest_framework import serializers
from .models import GalleryImage

class GalleryImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = GalleryImage
        fields = ['id', 'title','category','order','created_at']
        
    def get_image(self, obj):
        if obj.image:
            url = obj.image.url
            if url.startswith('http'):
                return url
            request = url.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None