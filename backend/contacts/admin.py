from django.contrib import admin
from .models import ContactMessage

# Register your models here.
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name','email','created_at','is_read')
    list_editable = ('is_read',)
    search_fields = ('name','email')
    readonly_fields = ('name','email','message','created_at')