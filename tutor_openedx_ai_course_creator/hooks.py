from tutor import hooks
import os

plugin_root = os.path.dirname(__file__)

hooks.Filters.MOUNTS.add_item(
    ("ai_course_creator", plugin_root)
)

hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("AI_COURSE_CREATOR_GEMINI_API_KEY", "")
)

hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("AI_COURSE_CREATOR_TAVILY_API_KEY", "")
)