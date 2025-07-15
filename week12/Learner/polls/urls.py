from django.urls import include,path
from . import views


urlpatterns = [
    path('', views.index, name='index page'),
    path('about/', views.about, name='about page'),
    path('test/', views.test, name='test page'),
    path('dashboard/',views.dashboard, name='dashboard page')
]