from .course_generator import CourseGenerator
from .content_generator import ContentGenerator





def generate_course_data(course_topic, course_level, num_modules):
    # Map level and duration (same logic you already had)
    audience = course_level.lower()
    if num_modules <= 3:
        duration = "short"
    elif num_modules <= 7:
        duration = "medium"
    else:
        duration = "long"

    course_generator = CourseGenerator()
    content_generator = ContentGenerator()
    

    course_structure = course_generator.generate_course_structure(
        title=course_topic,
        audience=audience,
        duration=duration,
        components=["text"],
    )

    course_with_content = content_generator.generate_course_content(
        course_structure=course_structure,
        components=["text"],
        use_web_search=False,
    )

    course_dict = course_with_content.to_dict()

    modules = []
    for section in course_dict.get("sections", []):
        for subsection in section.get("subsections", []):
            for unit in subsection.get("units", []):
                title = unit.get("title", "")
                content = unit.get("content", "")
                


               
                
                modules.append({
                "title": unit.get("title", ""),
                "content": unit.get("content", ""),
    
            })

    return {
        "title": course_dict.get("title", course_topic),
        "level": course_level,
        "modules": modules[:num_modules],
    }
