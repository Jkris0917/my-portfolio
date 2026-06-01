from django.db import models

# Create your models here.
class GalleryImage(models.Model):
    CATEGORY_CHOICES = [
        ('personal', 'Personal'),
        ('work','Work'),
        ('event','Event'),
        ('other','Other'),
    ]
    
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='gallery/', blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order','-created_at']
    
    def __str__(self):
        return self.title