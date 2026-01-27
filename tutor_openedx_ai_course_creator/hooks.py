from tutor import hooks

hooks.Filters.ENV_PATCHES.add_item(
    (
        "openedx-dockerfile-post-python-requirements",
        """
RUN pip install --upgrade pip setuptools wheel
RUN pip install git+https://github.com/ManojPokuru/course-creator-plugin.git@main
"""
    )
)

#hooks.Filters.ENV_PATCHES.add_item(
 #   (
  #      "openedx-lms-common-settings",
  #      """
#INSTALLED_APPS.append("ai_course_creator")
#"""
#    )
#)

#hooks.Filters.ENV_PATCHES.add_item(
 #   (
  #      "openedx-cms-common-settings",
   #     """
#INSTALLED_APPS.append("ai_course_creator")
#"""
#    )
#)

hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("AI_COURSE_CREATOR_GEMINI_API_KEY", "")
)

hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("AI_COURSE_CREATOR_TAVILY_API_KEY", "")
)