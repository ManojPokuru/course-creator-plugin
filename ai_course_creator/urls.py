from django.urls import path
from .views import generate_course

urlpatterns = [
   
    path(
        "api/generate/",
        generate_course,
        name="ai_course_creator_generate",
    ),
]
