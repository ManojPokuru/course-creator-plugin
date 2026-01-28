from django.apps import AppConfig
from edx_django_utils.plugins import PluginSettings, PluginURLs
from openedx.core.djangoapps.plugins.constants import ProjectType, SettingsType

class AiCourseCreatorConfig(AppConfig):
    name = "ai_course_creator"
    label = "ai_course_creator"
    verbose_name = "AI Course Creator"

    plugin_app = {
        PluginURLs.CONFIG: {
            ProjectType.LMS: {
                PluginURLs.NAMESPACE: "ai_course_creator",
                PluginURLs.REGEX: r"^ai-course-creator/",
                PluginURLs.RELATIVE_PATH: "urls",
            },
            ProjectType.CMS: {
                PluginURLs.NAMESPACE: "ai_course_creator",
                PluginURLs.REGEX: r"^ai-course-creator/",
                PluginURLs.RELATIVE_PATH: "urls",
            },
        },
        PluginSettings.CONFIG: {
            ProjectType.LMS: {
                SettingsType.COMMON: {PluginSettings.RELATIVE_PATH: "settings.common"},
            },
            ProjectType.CMS: {
                SettingsType.COMMON: {PluginSettings.RELATIVE_PATH: "settings.common"},
            },
        },
    }

    def ready(self):
        pass