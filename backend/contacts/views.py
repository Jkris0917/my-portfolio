from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage
from .serializers import ContactMessageSerializer

# Create your views here.
class ContactMessageView(APIView):
    
    def post(self,request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            message_obj = serializer.save()
            
            try:
                send_mail(
                    subject= f"[Portfolio] new message from  {message_obj.name}",
                    message = (
                        f"Name: {message_obj.name}",
                        f"Email: {message_obj.email}",
                        f"Message:\n{message_obj.message}"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.CONTACT_NOTIFICATION_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass
            
            return Response(
                {"detail": "Message recieved. I'll get back to you soon!"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    