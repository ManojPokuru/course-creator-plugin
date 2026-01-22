import os
import json
import uuid
from typing import Dict, List, Any
import google.generativeai as genai
import httpx
import requests
from ..utils.json_parser import safe_parse_llm_json
import logging

from ..models.course import Course, Section, SubSection, Unit, Assessment

from .assessment_generator import AssessmentGenerator


logger = logging.getLogger(__name__)

class CourseGenerator:
    def __init__(self):
        genai.configure(api_key=os.getenv('AI_COURSE_CREATOR_GEMINI_API_KEY'))
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.assessment_generator = AssessmentGenerator()
    
    def generate_course_structure(self, title: str, audience: str, duration: str, components: List[str], assessment_types: List[str], include_videos: bool = True, source_material: str |None = None) -> Course:
        """Generate the hierarchical course structure using Gemini"""
        
        try:
            prompt = self._create_structure_prompt(title, audience, duration, components, source_material)
            
            full_prompt = "You are an expert curriculum designer. Create comprehensive course structures with sections, subsections, and units following educational best practices.\n\n" + prompt
            
            # Log the API call details
            logger.info("=" * 60)
            logger.info("GEMINI API CALL - COURSE STRUCTURE GENERATION")
            logger.info("=" * 60)
            logger.info(f"Course Title: {title}")
            logger.info(f"Target Audience: {audience}")
            logger.info(f"Duration: {duration}")
            logger.info(f"Components: {components}")
            logger.info(f"Prompt Length: {len(full_prompt)} characters")
            logger.info("Prompt Preview:")
            logger.info(full_prompt[:500] + "..." if len(full_prompt) > 500 else full_prompt)
            logger.info("-" * 40)
            
            # Make the API call
            logger.info("Making Gemini API call...")
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.0,
                    max_output_tokens=9000,
                    response_mime_type="application/json",
                
                )
            )
            
            # Log the response details
            logger.info("Gemini API call completed successfully!")
            logger.info(f"Response usage metadata: {getattr(response, 'usage_metadata', 'Not available')}")
            
            # Get and validate response content
            content = response.text.strip()
            logger.info(f"Response Length: {len(content)} characters")
            logger.info("Response Preview:")
            logger.info(content[:800] + "..." if len(content) > 800 else content)
            logger.info("=" * 60)
            if not content:
                logger.error("Empty response from Gemini for course structure")
                raise Exception("Gemini API returned empty response")
            
            structure_data = safe_parse_llm_json(content)

            if not isinstance(structure_data, dict):
                raise Exception("Parsed structure data is not a JSON object")

            if 'sections' not in structure_data:
                logger.error(f"AI response keys: {structure_data.keys()}")
                raise Exception("Invalid course sctrutre: missing 'sections'")

            course = self._build_course_from_structure(
                structure_data,
                title,
                audience,
                duration,
                include_videos
            )

          
            

            course = self.assessment_generator.generate_assessments(
                course_structure = course,
                assessment_types = assessment_types
            )

            return course
        except Exception as e:
            logger.error(f"Error generating course structure: {str(e)}")
            raise Exception(f"Course structure generation failed: {str(e)}")
    
    def _create_structure_prompt(self, title: str, audience: str, duration: str, components: List[str], source_material: str | None = None) -> str:
        
        duration_mapping = {
            "short": "1-2 hours",
            "medium": "3-5 hours", 
            "long": "6+ hours"
        }
        
        actual_duration = duration_mapping.get(duration, duration)
        
        # Calculate dynamic structure based on duration and audience
        if "1-2 hours" in actual_duration or duration == "short":
            subsections_per_section = 2
            units_per_subsection = 2
            unit_time_range = "8-12"
        elif "3-5 hours" in actual_duration or duration == "medium":
            subsections_per_section = 2
            units_per_subsection = 3
            unit_time_range = "10-15"
        else:  # long duration
            subsections_per_section = 3
            units_per_subsection = 3
            unit_time_range = "12-18"
        
        # Adjust complexity based on audience
        complexity_level = self._get_complexity_level(audience)
        content_focus = self._get_content_focus(components)
        assessment_guidance = self._get_assessment_guidance(audience, duration)
        
        reference_block = ""

        if source_material:
            reference_block = f"""
IMPORTANT:
The user has provided reference material (PDF).
You MUST prioritize this content when designing the course.
Do NOT introduce topics that are not supported by this material.
You may reorganize, expand, and clarify concepts, but stay faithful to the source.

REFERENCE MATERIAL (summarized):

{source_material[:8000]}

"""


        return f"""
        Return ONLY valid JSON with a top-level key named "sections". Do not rename it.
        {reference_block}
        Create a comprehensive course structure for: "{title}"
        
        REQUIREMENTS:
        - Target Audience: {audience} ({complexity_level})
        - Total Duration: {actual_duration}
        - Content Focus: {content_focus}
        - Assessment Strategy: {assessment_guidance}
        
        MANDATORY STRUCTURE - EXACTLY 5 SECTIONS:
        1. Introduction & Fundamentals
        2. Core Concepts & Theory
        3. Practical Application & Skills
        4. Advanced Topics & Integration
        5. Mastery & Real-World Implementation
        
        Each section must have:
        - Exactly {subsections_per_section} subsections
        - Each subsection must have exactly {units_per_subsection} units
        - Each unit time: {unit_time_range} minutes total
        - Content type: text_video (combination of text and video)
        
        Content Adaptation Guidelines:
        {self._get_audience_guidelines(audience)}
        
        Example for "{title}":
        Section 1: "Introduction to {title} and Fundamentals"
        - Subsection: "Getting Started and Overview"
          - Unit: "What is {title}? Applications and Importance" ({unit_time_range.split('-')[0]} min)
          - Unit: "Setting Up Environment and Tools" ({unit_time_range.split('-')[1]} min)
          {'- Unit: "Basic Terminology and Concepts" (' + unit_time_range.split('-')[1] + ' min)' if units_per_subsection == 3 else ''}
        
        IMPORTANT: Format all descriptions in HTML using <p>, <strong>, <em> tags.

        
        CONTENT DEPTH REQUIREMENTS (MANDATORY):

- SECTION descriptions must be LONG and DETAILED (4–6 paragraphs).
  They should explain:
  • Overall theory
  • Why the topic matters
  • Real-world relevance
  • What learners will gain

- SUBSECTION descriptions must be MEDIUM–LONG (3–4 paragraphs).
  They should:
  • Break down concepts
  • Explain relationships
  • Provide conceptual examples

- UNIT content must be VERY DETAILED (step-by-step explanations).
  Units are where practical depth, workflows, and examples live.

- Text is PRIMARY at ALL levels.
- Videos are OPTIONAL and ONLY for UNITS.
- NEVER reduce text because a video exists.

        
        Return ONLY a valid JSON object exactly matching this schema:
        {{
            "sections": [
                {{
                    "title": "Section Title",
                    "description": "<p>Brief description explaining what this section covers with <strong>key concepts</strong>.</p>",
                    "subsections": [
                        {{
                            "title": "Subsection Title", 
                            "description": "<p>Brief description of subtopic with <em>emphasis</em> on important points.</p>",
                            "units": [
                                {{
                                    "title": "Unit Title",
                                    "content_type": "text_video",
                                    "video_required": true
                                }}
                            ]
                        }}
                    ]
                }}
            ]
        }}
        """
    
    def _get_complexity_level(self, audience: str) -> str:
        """Return complexity level based on audience"""
        if audience.lower() in ['beginner', 'beginners', 'novice']:
            return "Basic level with step-by-step explanations"
        elif audience.lower() in ['intermediate', 'some experience']:
            return "Intermediate level with practical examples"
        elif audience.lower() in ['advanced', 'expert', 'professional']:
            return "Advanced level with in-depth analysis"
        else:
            return "Adaptive level based on audience needs"
    
    def _get_content_focus(self, components: List[str]) -> str:
        """Return content focus based on selected components"""
        focus_areas = []
        if 'text' in components:
            focus_areas.append("detailed written explanations")
        if 'video' in components:
            focus_areas.append("visual demonstrations and tutorials")
        if 'images' in components:
            focus_areas.append("visual aids and diagrams")
        if 'audio' in components:
            focus_areas.append("audio explanations and discussions")
        
        return ", ".join(focus_areas) if focus_areas else "multimedia learning experience"
    
    def _get_assessment_guidance(self, audience: str, duration: str) -> str:
        """Return assessment strategy based on audience and duration"""
        if audience.lower() in ['beginner', 'beginners']:
            return "Basic quizzes and practical exercises with immediate feedback"
        elif audience.lower() in ['intermediate']:
            return "Mixed assessments including projects and scenario-based questions"
        elif audience.lower() in ['advanced', 'expert']:
            return "Complex case studies and real-world problem solving"
        else:
            return "Adaptive assessments matching learner progress"
    
    def _get_audience_guidelines(self, audience: str) -> str:
        """Return specific guidelines for different audiences"""
        if audience.lower() in ['beginner', 'beginners']:
            return """
- Use simple, clear language and avoid jargon
- Provide step-by-step instructions
- Include plenty of examples and practice
- Build confidence through progressive difficulty
"""
        elif audience.lower() in ['intermediate']:
            return """
- Balance theory with practical application
- Reference prior knowledge appropriately
- Include challenging but achievable tasks
- Connect concepts to real-world scenarios
"""
        elif audience.lower() in ['advanced', 'expert']:
            return """
- Focus on advanced concepts and edge cases
- Encourage critical thinking and analysis
- Include industry best practices
- Provide opportunities for innovation and exploration
"""
        else:
            return """
- Adapt content complexity to learner needs
- Provide multiple learning paths
- Include both foundational and advanced materials
"""


    def _normalize_youtube_url(self, url: str | None) -> str | None:
        """Normalize any YouTube URL to embed format"""
        if not url:
            return None
    
        url = url.strip()
    
    # Already an embed URL
        if "youtube.com/embed/" in url:
            return url
    
    # Extract from youtube.com/watch?v= URL
        if "watch?v=" in url:
            video_id = url.split("watch?v=")[1].split("&")[0].strip()
            if len(video_id) == 11:
                return f"https://www.youtube.com/embed/{video_id}"
    
    # Extract from youtu.be/ URL
        if "youtu.be/" in url:
            video_id = url.split("youtu.be/")[1].split("?")[0].strip()
            if len(video_id) == 11:
                return f"https://www.youtube.com/embed/{video_id}"
    
        return None

    
    def _build_course_from_structure(self, structure_data: Dict, title: str, audience: str, duration: str, include_videos: bool ) -> Course:
        """Convert JSON structure to Course objects"""
        
        course = Course(
            id=str(uuid.uuid4()),
            title=title,
            audience=audience,
            duration=duration,
            description=f"A comprehensive course on {title} designed for {audience} learners."
        )
        
        for section_data in structure_data.get('sections', []):
            section = Section(
                id=str(uuid.uuid4()),
                title=section_data.get('title', ''),
                description=section_data.get('description', '')
            )
            
            for subsection_data in section_data.get('subsections', []):
                subsection = SubSection(
                    id=str(uuid.uuid4()),
                    title=subsection_data.get('title', ''),
                    description=subsection_data.get('description', '')
                )
                
                

                units = subsection_data.get('units') or []

                for unit_data in units:
                    video_url = None
                    content_type = "text"
                    
                    if include_videos:
                        search_query = f"{unit_data.get('title', '')} tutorial"
                        video_url = self.search_youtube_video(search_query)

                        if video_url:
                            content_type = "text_video"
                    unit = Unit(
                        id=str(uuid.uuid4()),
                        title=unit_data.get('title', ''),
                        content_type="text_video" if include_videos else "text",
                        video_url=video_url
                    )
                    subsection.add_unit(unit)
                
                section.add_subsection(subsection)
            
            course.add_section(section)
        
        return course
    def search_youtube_video(self, search_query: str) -> str | None:
        """Search YouTube using Tavily and return an EMBED URL"""

        if not search_query:
            return None

        tavily_api_key = os.getenv("AI_COURSE_CREATOR_TAVILY_API_KEY")
        if not tavily_api_key:
            logger.error("TAVILY_API_KEY not set")
            return None

        try:
            response = requests.post(
                "https://api.tavily.com/search",
            json={
                "api_key": tavily_api_key,
                "query": f"{search_query} site:youtube.com/watch",
                "search_depth": "basic",
                "max_results": 5
            },
            timeout=15
        )

            data = response.json()
            results = data.get("results", [])

            for result in results:
                url = result.get("url")
                video_id = self._extract_video_id(url)
                if video_id:
                    embed_url = f"https://www.youtube.com/embed/{video_id}"
                    logger.info(f"✓ Found YouTube video via Tavily: {embed_url}")
                    return embed_url

            logger.debug(f"No YouTube video found via Tavily for: {search_query}")
            return None

        except Exception as e:
            logger.error(f"Tavily YouTube search failed: {str(e)}")
            return None

    

    def _extract_video_id(self, video_id_or_url: str) -> str | None:
        if 'playlist?list=' in video_id_or_url or '/shorts/' in video_id_or_url:
            return None

        """Extract just the video ID from any format"""
        if not video_id_or_url:
            return None
    
        video_id_or_url = str(video_id_or_url).strip()
    
    # If already valid ID (11 characters)
        if len(video_id_or_url) == 11 and all(c.isalnum() or c in '-_' for c in video_id_or_url):
            logger.info(f"✓ Valid video ID: {video_id_or_url}")
            return video_id_or_url
    
        try:
        # Extract from youtube.com/embed/ URL
            if '/embed/' in video_id_or_url:
                video_id = video_id_or_url.split('/embed/')[1].split('?')[0].strip()
                if len(video_id) == 11:
                    logger.info(f"✓ Extracted from embed URL: {video_id}")
                    return video_id
        
        # Extract from youtube.com/watch?v= URL
            if 'watch?v=' in video_id_or_url:
                video_id = video_id_or_url.split('watch?v=')[1].split('&')[0].strip()
                if len(video_id) == 11:
                    logger.info(f"✓ Extracted from watch URL: {video_id}")
                    return video_id
        
        # Extract from youtu.be/ URL
            if 'youtu.be/' in video_id_or_url:
                video_id = video_id_or_url.split('youtu.be/')[1].split('?')[0].strip()
                if len(video_id) == 11:
                    logger.info(f"✓ Extracted from youtu.be URL: {video_id}")
                    return video_id
        
        # Extract from youtube.com/v/ URL
            if '/v/' in video_id_or_url:
                video_id = video_id_or_url.split('/v/')[1].split('?')[0].strip()
                if len(video_id) == 11:
                    logger.info(f"✓ Extracted from /v/ URL: {video_id}")
                    return video_id
    
        except (IndexError, AttributeError) as e:
                logger.error(f"Error extracting video ID from {video_id_or_url}: {str(e)}")
    
    # Last resort - validate it's a real ID
        if len(video_id_or_url) == 11 and all(c.isalnum() or c in '-_' for c in video_id_or_url):
            logger.info(f"✓ Accepted as video ID (fallback): {video_id_or_url}")
            return video_id_or_url
    
        logger.error(f"✗ Could not extract valid video ID from: {video_id_or_url}")
        return None

    def _extract_json_from_response(self, content: str) -> str:
        """Extract JSON from Gemini response, handling markdown code blocks"""
        content = content.strip()
        
        # Check if content is wrapped in markdown code blocks
        if content.startswith("```json"):
            # Find the end of the code block
            end_marker = content.find("```", 7)  # Start search after "```json"
            if end_marker != -1:
                return content[7:end_marker].strip()
        elif content.startswith("```"):
            # Handle generic code blocks
            end_marker = content.find("```", 3)
            if end_marker != -1:
                return content[3:end_marker].strip()
        
        # Return content as-is if no code blocks found
        return content
