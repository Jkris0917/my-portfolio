from django.contrib import admin
from .models import Project

# Register your models here.
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_featured','order', 'created_at')
    list_editable = ('is_featured', 'order')
    search_fields = ('title','description')
    list_filter = ('is_featured',)