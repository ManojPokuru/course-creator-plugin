from tutor import hooks

hooks.Filters.ENV_PATCHES.add_item(
    (
        "local-docker-compose-dev-services",
        """
lms:
  volumes:
    - C:\\Users\\Unify\\Desktop\\studio-course-creator-plugin:/mnt/ai_course_creator
cms:
  volumes:
    - C:\\Users\\Unify\\Desktop\\studio-course-creator-plugin:/mnt/ai_course_creator
"""
    )
)

hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("AI_COURSE_CREATOR_GEMINI_API_KEY", "")
)

hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("AI_COURSE_CREATOR_TAVILY_API_KEY", "")
)