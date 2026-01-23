from tutor import hooks

# --------------------------------
# Config defaults
# --------------------------------
@hooks.Filters.CONFIG_DEFAULTS.add()
def _add_ai_course_creator_defaults(items):
    items.append(("AI_COURSE_CREATOR_GEMINI_API_KEY", ""))
    items.append(("AI_COURSE_CREATOR_TAVILY_API_KEY", ""))
    return items


# --------------------------------
# COPY Django app into Open edX image  🔴 REQUIRED
# --------------------------------
hooks.Filters.ENV_PATCHES.add_item(
    (
        "openedx-dockerfile-post-python-requirements",
        """ RUN pip install tutor-openedx-ai-course-creator
"""
    )
)

# --------------------------------
# CMS Django settings
# --------------------------------
@hooks.Filters.ENV_PATCHES.add()
def _patch_cms_settings(patches):
    patches.append((
        "openedx-cms-settings",
        """
INSTALLED_APPS += ["ai_course_creator"]
"""
    ))
    return patches


# --------------------------------
# CMS URLs (Tutor 20 style)
# --------------------------------
@hooks.Filters.ENV_PATCHES.add()
def _patch_cms_urls(patches):
    patches.append((
        "openedx-cms-urls",
        """
from django.urls import include, path

urlpatterns += [
    path("", include("ai_course_creator.urls")),
]
"""
    ))
    return patches
