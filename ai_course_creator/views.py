from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from pypdf import PdfReader

from .core.course_generator import CourseGenerator
from django.shortcuts import render
from django.contrib.auth.decorators import login_required



@csrf_exempt
@require_POST
def generate_course(request):
    course_topic = request.POST.get("course_topic")
    course_level = request.POST.get("course_level")

    if not course_topic or not course_level:
        return JsonResponse(
            {"result": "error", "message": "course_topic and course_level are required"},
            status=400
        )

    
    source_material = None
    uploaded_pdf = request.FILES.get("source_pdf")

    if uploaded_pdf:
        try:
            reader = PdfReader(uploaded_pdf)
            extracted_text = []

            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text.append(text)

            source_material = "\n".join(extracted_text)

        except Exception as e:
            return JsonResponse(
                {"result": "error", "message": f"Failed to read PDF: {str(e)}"},
                status=400
            )

    course_generator = CourseGenerator()

    course = course_generator.generate_course_structure(
        title=course_topic,
        audience=course_level,
        duration="medium",
        components=["text", "video"],
        source_material=source_material  
    )

    return JsonResponse(
        {
            "result": "success",
            "json": course.to_dict()
        }
    )

@login_required
def studio_page(request):
    return render(request, "ai_course_creator/studio.html")
