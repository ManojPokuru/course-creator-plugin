from django.apps import AppConfig


class AiCourseCreatorConfig(AppConfig):
    name = "ai_course_creator"
    verbose_name = "AI Course Creator"
    default_auto_field = "django.db.models.BigAutoField"

    plugin_app = {
        "settings_config": {
            "cms": {
                "common": {
                    "INSTALLED_APPS": [
                        "ai_course_creator",
                    ],
                },
            },
        },
        "urls_config": {
            "cms": {
                "namespace": "ai_course_creator",
                "regex": r"^ai-course-creator/",
                "relative_path": "urls",
            },
        },
    }

    def ready(self):
        pass
