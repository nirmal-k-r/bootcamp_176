from django.shortcuts import render
from rest_framework.views import APIView
from .models import Product
from rest_framework.response import Response
from .serialisers import ProductSerializer
from rest_framework.permissions import AllowAny
from .permissions import isAuthenticatedAndPostRequiresStaff  # Custom permission class for authentication

# Create your views here.
class ProductView(APIView):
    permission_classes = (isAuthenticatedAndPostRequiresStaff,)  # No authentication required for this view
    def get(self, request):
        # Logic to retrieve products from the database
        #get params
        content= request.GET.get('content', 'all')    #all or one

        if content == 'all':
            products = Product.objects.all()
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        
        elif content == 'one':
            product_id = request.GET.get('id')
            try:
                product = Product.objects.get(id=product_id)
                serializer = ProductSerializer(product)
                return Response(serializer.data)
            except Product.DoesNotExist:
                return Response({'error': 'Product not found'}, status=404)

        else:   
            return Response({'error': 'Invalid request'}, status=400)

    def post(self, request): 
        # Logic to create a new product
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)
        
    def patch(self, request):
        # Logic to update an existing product
        product_id = request.GET.get('id')
        try:
            product = Product.objects.get(id=product_id)
            serializer = ProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)
            
    
    def delete(self, request):
        # Logic to delete a product
        product_id = request.GET.get('id')

        try:
            product = Product.objects.get(id=product_id)
            product.delete()
            return Response({'message': 'Product deleted successfully'}, status=204)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)