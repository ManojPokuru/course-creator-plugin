from django.apps import AppConfig

class AiCourseCreatorConfig(AppConfig):
    name = "ai_course_creator"
    verbose_name = "AI Course Creator"

    plugin_app = {
        "settings_config": {
            "lms.djangoapp": {
                "common": {
                    "INSTALLED_APPS": [
                        "ai_course_creator",
                    ],
                },
            },
            "cms.djangoapp": {
                "common": {
                    "INSTALLED_APPS": [
                        "ai_course_creator",
                    ],
                },
            },
        },
        "urls_config": {
            "lms.djangoapp": {
                "namespace": "ai_course_creator",
                "regex": r"^ai-course-creator/",
                "relative_path": "urls",
            },
            "cms.djangoapp": {
                "namespace": "ai_course_creator",
                "regex": r"^ai-course-creator/",
                "relative_path": "urls",
            },
        },
    }
