from django.db import models

# Create your models here.
class Certificate(models.Model):
    title = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    date_issued = models.DateField()
    credential_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='certificates/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order','-date_issued']
        
    def __str__(self):
        return f"{self.title} - {self.issuer}"