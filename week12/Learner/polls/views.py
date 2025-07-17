from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Book

# Create your views here.

def index(request):
    return HttpResponse("Hello world")

def about(request):
    return HttpResponse("This is the about page")


def test(request):
    template=loader.get_template("polls/test.html")
    return HttpResponse(template.render(request=request))

def dashboard(request):

    books= Book.objects.all()  # Fetch all books from the database
    template=loader.get_template("polls/dashboard.html")
    context={
        'name': 'John',
        'age': 30,
        'skills': ['Python', 'Django', 'JavaScript'],
        'is_active': True,
        'books': books
    }
    return HttpResponse(template.render(context=context, request=request))