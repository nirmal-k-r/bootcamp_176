from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image= models.TextField(blank=True, null=True)  # Optional image field
    discounted= models.BooleanField(default=False)  # Field to indicate if the product is discounted

    def __str__(self):
        return self.name

