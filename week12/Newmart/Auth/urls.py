
from django.contrib import admin
from django.urls import path,include
from .views import AuthView

urlpatterns = [
    path('', AuthView.as_view(), name='auth')
]


