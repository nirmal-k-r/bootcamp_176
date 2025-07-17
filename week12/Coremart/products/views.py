from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser

from .models import Product
from .serialisers import ProductSerializer
# Create your views here.


@csrf_exempt
def get_products(request):
    products= Product.objects.all()
    serialised= ProductSerializer(products, many=True) #serialise all products
    return JsonResponse(serialised.data, safe=False)  # Return the serialized data as JSON

@csrf_exempt
def create_product(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)  # Parse the incoming JSON data (as incoming is serialized data)
        serializer = ProductSerializer(data=data)  # Create a serializer instance with the data
        if serializer.is_valid():  # Validate the data
            serializer.save()  # Save the new product to the database
            return JsonResponse(serializer.data, status=201)  # Return the created product data with a 201 status code
        return JsonResponse(serializer.errors, status=400)  # Return validation errors with a 400 status code
    return HttpResponse(status=405)  # Method not allowed for other request methods

@csrf_exempt
def get_product_by_id(request,product_id):
    try:
        product = Product.objects.get(id=product_id)  # Fetch the product by ID
        serialised= ProductSerializer(product)  # Serialize the product
        return JsonResponse(serialised.data)  # Return the serialized product data as JSON
    except Product.DoesNotExist:
        return HttpResponse(status=404)
    

@csrf_exempt
def delete_product_by_id(request,product_id):
    if request.method == 'DELETE':
        try:
            product = Product.objects.get(id=product_id)  # Fetch the product by ID
            product.delete()  # Delete the product
            return HttpResponse(status=204)  # Return a 204 No Content status code
        except Product.DoesNotExist:
            return HttpResponse(status=404)
    return HttpResponse(status=405)