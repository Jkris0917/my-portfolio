from django.contrib import admin
from .models import Certificate

# Register your models here.
@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('title', 'issuer', 'date_issued', 'order')
    list_editable = ('order',)
    search_fields = ('title','issuer')