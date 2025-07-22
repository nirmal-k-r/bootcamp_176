
from django.contrib import admin
from django.urls import path,include
from .views import ProductView

urlpatterns = [
    path('product', ProductView.as_view(), name='product')
]
