import json
import re

def safe_parse_llm_json(text: str):
    try:
        # Extract first JSON object only
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            return {}

        return json.loads(match.group())
    except Exception:
        return {}
