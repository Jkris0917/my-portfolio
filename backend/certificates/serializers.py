from rest_framework import serializers
from .models import Certificate

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ['id','title','date_issued','credential_url','image','order']
    
    def get_image(self,obj):
        if obj.image:
            url = obj.image.url
            if url.startswith('http'):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None