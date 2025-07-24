from rest_framework import permissions
from django.contrib.auth.models import User

# class IsAuthenticated(permissions.BasePermission):
#     def has_permission(self, request, view):
#         #get the berarer token from the request headers
#         token=request.headers.get('Authorization', None)
#         token=token.split('Bearer ')[1].strip()
#         if token!= None:
#             try:
#                 user = User.objects.get(auth_token=token) #lookup user by token
#                 # If the user exists and has a token, they are authenticated
#                 request.user = user  # Set the user on the request object
#                 return True
#             except User.DoesNotExist:
#                 return False
            
# class isStaff(permissions.BasePermission):
#     def has_permission(self, request, view):
#         # Check if the user is authenticated and is an admin
#         # return request.user and request.user.is_authenticated 
#         token=request.headers.get('Authorization', None)
#         token=token.split('Bearer ')[1].strip()
#         if token!= None:
#             try:
#                 user = User.objects.get(auth_token=token) #lookup user by token
#                 if user.is_staff: #check if user is staff
#                     request.user = user  # Set the user on the request object
#                     return True
#                 else:
#                     return False
#             except User.DoesNotExist:
#                 return False
#         return False
    
class isAuthenticatedAndPostRequiresStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        #get the berarer token from the request headers
        token=request.headers.get('Authorization', None)
        token=token.split('Bearer ')[1].strip()
        if token!= None:
            try:
                user = User.objects.get(auth_token=token) #lookup user by token
                # If the user exists and has a token, they are authenticated
                request.user = user  # Set the user on the request object

                if request.method == 'POST': #for POST requests, check if user is staff
                    # if user.is_staff:
                    #     return True
                    
                    # else:
                    #     return False
                    return user.is_staff  # Check if the user is staff for POST requests
                else:
                    return True
            except User.DoesNotExist:
                return False
        else:
            return False
       
