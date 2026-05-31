from django.contrib import admin
from .models import About,Skill,Experience

# Register your models here.
@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ('full_name','location','status','updated_at')
    readonly_fields = ('updated_at',)
    
@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name','category','order')
    list_editable = ('category','order')
    list_filter = ('category',)
    
@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role','company','period','location','description','order')
    list_editable = ('order',)