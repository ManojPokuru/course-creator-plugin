from tutor import hooks
from pathlib import Path


hooks.Filters.CONFIG_DEFAULTS.add_items([
    ("AI_COURSE_CREATOR_GEMINI_API_KEY", ""),
    ("AI_COURSE_CREATOR_TAVILY_API_KEY", ""),
])

hooks.Filters.IMAGES_BUILD_MOUNTS.add_item(
    ("openedx", "ai-course-creator", "/mnt/ai-course-creator")
)


hooks.Filters.ENV_PATCHES.add_item(
    (
        "openedx-dockerfile-post-python-requirements",
        """
# Install AI Course Creator Django app
RUN pip install --no-deps -e /mnt/ai-course-creator
"""
    )
)


hooks.Filters.ENV_PATCHES.add_item(
    (
        "openedx-cms-common-settings",
        """
# AI Course Creator Configuration
AI_COURSE_CREATOR_GEMINI_API_KEY = "{{ AI_COURSE_CREATOR_GEMINI_API_KEY }}"
AI_COURSE_CREATOR_TAVILY_API_KEY = "{{ AI_COURSE_CREATOR_TAVILY_API_KEY }}"
"""
    )
)


hooks.Filters.ENV_PATCHES.add_item(
    (
        "openedx-lms-common-settings",
        """
# AI Course Creator Configuration
AI_COURSE_CREATOR_GEMINI_API_KEY = "{{ AI_COURSE_CREATOR_GEMINI_API_KEY }}"
AI_COURSE_CREATOR_TAVILY_API_KEY = "{{ AI_COURSE_CREATOR_TAVILY_API_KEY }}"
"""
    )
)