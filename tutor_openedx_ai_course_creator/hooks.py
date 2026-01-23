from tutor import hooks

@hooks.Filters.CONFIG_DEFAULTS.add()
def _add_ai_course_creator_defaults(items):
    items.append(("AI_COURSE_CREATOR_GEMINI_API_KEY", ""))
    items.append(("AI_COURSE_CREATOR_TAVILY_API_KEY", ""))
    return items


@hooks.Filters.ENV_PATCHES.add()
def install_ai_course_creator(patches):
    patches.append((
        "openedx-dockerfile-post-python-requirements",
        """
RUN /openedx/venv/bin/pip install git+https://github.com/ManojPokuru/course-creator-plugin.git
"""
    ))
    return patches
