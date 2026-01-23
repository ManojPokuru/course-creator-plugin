from django.urls import path
from .views import generate_course, studio_page

urlpatterns = [
   
    path(
        "api/generate/",
        generate_course,
        name="ai_course_creator_generate",
    ),
    path("studio/", studio_page, name="ai_course_creator_studio"),
]
