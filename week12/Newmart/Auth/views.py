from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token

from .serialisers import UserSerializer

# Create your views here.

class AuthView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = (AllowAny,)  # No authentication required for this view
    # def get(self, request):
    #     return JsonResponse({"message": "Welcome to the Auth API"})

    def post(self, request):
        # Register a new user
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email', '')  # Optional email field

        if not username or not password or not first_name or not last_name:
            return JsonResponse({"error": "Username and password are required"}, status=400)
        else:
            #check if user already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "User already exists"}, status=400)
            else:
                user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name, is_staff=False, is_superuser=False)
                token, created = Token.objects.get_or_create(user=user) #generate token for the user
                #store the token in the database
                user.token = token
                serialised_user= UserSerializer(user)
                user.save()
                user_data = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "token": token.key
                }
                return JsonResponse({"user": user_data}, status=201)


    def put(self, request):
        # Login
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)
        else:
            user = User.objects.filter(username=username).first()
            if user and user.check_password(password):
                
                #delete token if it exists
                token, created = Token.objects.get_or_create(user=user)
                token.delete()  # Delete the existing token if it exists
                
                #create a new token for the user
                token,created = Token.objects.get_or_create(user=user)

                user_data = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "token": token.key
                }
            
                return JsonResponse({"user": user_data}, status=201)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)