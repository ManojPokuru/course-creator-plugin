"""
Tutor plugin for AI Course Creator
"""
import os
from tutor import hooks

# Define template folder for this plugin
template_folder = os.path.join(os.path.dirname(__file__), "templates")

# Register template roots
hooks.Filters.ENV_TEMPLATE_ROOTS.add_item(template_folder)

# Register template targets - render templates to the environment
hooks.Filters.ENV_TEMPLATE_TARGETS.add_item(
    ("ai_course_creator/build", "plugins")
)

# Install the Django app into Open edX
hooks.Filters.ENV_PATCHES.add_item(
    (
        "openedx-dockerfile-post-python-requirements",
        """
RUN pip install -e /openedx/plugins/ai_course_creator
""",
    )
)

# Add configuration defaults
hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("AI_COURSE_CREATOR_GEMINI_API_KEY", "")
)
hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("AI_COURSE_CREATOR_TAVILY_API_KEY", "")
)

# Add public settings
hooks.Filters.APP_PUBLIC_SETTINGS.add_item(
    ("AI_COURSE_CREATOR_ENABLED", True)
)