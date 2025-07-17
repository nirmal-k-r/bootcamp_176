from django.urls import include,path
from rest_framework.routers import DefaultRouter
from . import views


#connect product 
urlpatterns = [
    path('get-products', views.get_products, name='get products'),
    path('create-product', views.create_product, name='create product'),
    path('get-product/<product_id>', views.get_product_by_id, name='get product by id'),
    path('delete-product/<product_id>', views.delete_product_by_id, name='delete product by id'),
]