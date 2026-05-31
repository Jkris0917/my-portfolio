from django.db import models

# Create your models here.
class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='projects/images', blank=True, null=True)
    tech_stack = models.JSONField(default=list)
    live_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order','-created_at']
        
    def __str__(self):
        return self.title