from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    genre= models.CharField(max_length=50)
    shelf_location = models.CharField(max_length=50)

    def __str__(self):
        return self.title
    
    def clean(self):
        # Custom validation logic can be added here
        if not self.title or not self.author:
            raise ValueError("Title and Author fields cannot be empty.")
        if len(self.title) < 3:
            raise ValueError("Title must be at least 3 characters long.")
        if len(self.author) < 3:
            raise ValueError("Author must be at least 3 characters long.")
        
    
def post_save_book(sender, instance, created, **kwargs):
    if created:
        print(f"Book '{instance.title}' by {instance.author} has been added to the database.")
    else:
        print(f"Book '{instance.title}' by {instance.author} has been updated.")

post_save.connect(receiver=post_save_book, sender=Book)