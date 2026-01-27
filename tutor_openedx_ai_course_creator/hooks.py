from tutor import hooks

hooks.Filters.ENV_PATCHES.add_item(
    (
        "openedx-dockerfile-post-python-requirements",
        """
RUN pip install git+https://github.com/ManojPokuru/course-creator-plugin.git@main
"""
    )
)

hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("AI_COURSE_CREATOR_GEMINI_API_KEY", "")
)

hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("AI_COURSE_CREATOR_TAVILY_API_KEY", "")
)