from django.apps import AppConfig


class AiCourseCreatorConfig(AppConfig):
    """
    Configuration for the ai_course_creator Django application.
    """

    name = 'ai_course_creator'

    plugin_app = {
        'url_config': {
            'lms.djangoapp': {
                'namespace': 'ai_course_creator',
                'relative_path': 'urls',
            },
            'cms.djangoapp': {
                'namespace': 'ai_course_creator',
                'relative_path': 'urls',
            }
        },
        'settings_config': {
            'lms.djangoapp': {
                'common': {'relative_path': 'settings'},
            },
            'cms.djangoapp': {
                'common': {'relative_path': 'settings'},
            }
        },
    }

    def ready(self):
        pass