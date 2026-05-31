from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            message_obj = serializer.save()

            try:
                send_mail(
                    subject=f"[Portfolio] New message from {message_obj.name}",
                    message=(
                        f"Name: {message_obj.name}\n"
                        f"Email: {message_obj.email}\n\n"
                        f"Message:\n{message_obj.message}"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.CONTACT_NOTIFICATION_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass

            return Response(
                {"detail": "Message received. I'll get back to you soon!"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactMessageListView(generics.ListAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]


class ContactMessageDetailView(generics.RetrieveUpdateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]