from django.db import models

# Create your models here.
class About(models.Model):
    full_name = models.CharField(max_length=100)
    tagline = models.CharField(max_length=100)
    bio = models.TextField()
    photo = models.ImageField(upload_to='about/',null=True, blank=True)
    cv = models.FileField(upload_to='cv/', blank=True, null=True)
    location = models.CharField(max_length=100)
    target = models.CharField(max_length=100)
    education = models.CharField(max_length=200)
    japanese_level = models.CharField(max_length=200)
    status = models.CharField(max_length=100)
    email = models.EmailField()
    github_url = models.URLField()
    linkedin_url = models.URLField()
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True,)
    
    class Meta:
        verbose_name = 'About'
        verbose_name_plural = 'About'
        
    def __str__(self):
        return self.full_name
    
class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('languages','Languages & Frameworks'),
        ('databases','Databases'),
        ('auth','Auth & Security'),
        ('queues','Task Queues'),
        ('testing', 'Testing'),
        ('devops','DevOps & Tools'),
        ('ai','AI / ML'),
    ]
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['category', 'order']
    
    def __str__(self):
        return f"{self.name} ({self.category})"
    
class Experience(models.Model):
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    period = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return f"{self.role} at {self.company}"
    