from django.contrib import admin
from .models import GalleryImage

# Register your models here.
@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title','category','order','created_at')
    list_editable = ('category','order')
    search_fields = ('title',)
    