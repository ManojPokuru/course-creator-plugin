import os
from typing import Dict, List, Any
import google.generativeai as genai
import logging

from ..models.course import Course, Section, SubSection, Unit

logger = logging.getLogger(__name__)

class ContentGenerator:
    def __init__(self):
        genai.configure(api_key=os.getenv('AI_COURSE_CREATOR_GEMINI_API_KEY'))
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def generate_course_content(self, course_structure: Course, components: List[str], use_web_search: bool = True) -> Course:
        """Generate detailed content for each unit in the course"""
        
        try:
            for section in course_structure.sections:
                for subsection in section.subsections:
                    for unit in subsection.units:
                        self._generate_unit_content(unit, course_structure.title, section.title, subsection.title, components)
            
            return course_structure
            
        except Exception as e:
            logger.error(f"Error generating course content: {str(e)}")
            return course_structure
    
    def _generate_unit_content(self, unit: Unit, course_title: str, section_title: str, subsection_title: str, components: List[str]):
        """Generate content for a specific unit with text+video structure"""
        
        try:
            # Set unit to text_video type by default for rich content
           
            
            prompt = f"""
Create a complete, high-quality learning unit for a professional learning platform.

Course: {course_title}
Section: {section_title}
Subsection: {subsection_title}
Unit: {unit.title}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORE RULES (NON-NEGOTIABLE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. EVERY unit MUST include text-based explanations.
   Text is NEVER optional.




━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT DEPTH REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


- Lines must be meaningful instructional content (not filler)
- Minimum 60–80 lines of meaningful instructional text
- Content must be detailed, structured, and professional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY HTML STRUCTURE (ORDER MATTERS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<h3>Overview</h3>
- 4–6 long <p> paragraphs
- Explain the topic from fundamentals
- Use <strong>key terms</strong> and <em>important ideas</em>


<h3>Conceptual Flow</h3>
- Step-by-step explanation
- Include at least one flowchart:
<pre><code>
Input → Processing → Decision → Output
</code></pre>

<h3>Key Concepts Explained</h3>
- Multiple long paragraphs
- Deep explanation of each idea
- Increase depth if video is missing

<h3>Practical Examples</h3>
- Real-world use cases
- Expand section if video is missing

🔥 CODING RULE (IMPORTANT)
- If the unit involves programming, algorithms, logic, or data:
  - Include at least ONE working example
<pre><code class="language-python">
# example code here
</code></pre>
- If coding is NOT relevant, do NOT force it

<h3>Visual Aids</h3>
- Include at least TWO diagrams or image placeholders:
<figure>
  <img src="" alt="Diagram explaining key concept" />
  <figcaption>Explanation of the diagram</figcaption>
</figure>

<h3>Common Mistakes & Notes</h3>
- Use <div class="highlight"> for warnings
- Add extra explanations if no video exists

<h3>Summary & Takeaways</h3>
- 5–7 strong bullet points
- Reinforce learning clearly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Output ONLY valid HTML
- NO markdown
- NO <html>, <head>, <body>
- NO external links
- Content must stand alone even WITHOUT video

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY the final HTML.
"""

            
            full_prompt = "You are an expert educator creating HTML-formatted educational content that pairs with video lessons. All content must be in proper HTML format for display in a learning management system.\n\n" + prompt
            
            # Log content generation
            logger.info(f"Generating HTML content for unit: {unit.title}")
            logger.info(f"Course context: {course_title} > {section_title} > {subsection_title}")
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=8000
                )
            )
            
            content = response.text
            logger.info(f"Generated HTML content length: {len(content)} characters")
            logger.info(f"Content preview: {content[:200]}...")
            unit.content = content
            
            # Estimate realistic reading time based on content length
            word_count = len(content.split())
            unit.reading_time = max(3, min(15, word_count // 200))  # 200 words per minute reading speed
            
            # Add metadata
            unit.resources.append({
                "type": "generated_content",
                "content_structure": "text_video_card",
                "generated_at": "now"
            })
            
        except Exception as e:
            logger.error(f"Error generating unit content for {unit.title}: {str(e)}")
            unit.content = f"<p><strong>{unit.title}</strong> - covering key concepts and practical applications.</p>"
            unit.reading_time = 5
    
    def generate_learning_objectives(self, unit_title: str, section_context: str) -> List[str]:
        """Generate specific learning objectives for a unit"""
        
        try:
            prompt = f"""
            Create 3-4 specific, measurable learning objectives for this educational unit:
            
            Unit: {unit_title}
            Context: {section_context}
            
            IMPORTANT: Format the response as HTML using <ul> and <li> tags.
            
            Format each objective as: "By the end of this unit, students will be able to..."
            Make them specific, actionable, and measurable.
            
            Return the objectives in this HTML format:
            <ul>
            <li>By the end of this unit, students will be able to...</li>
            <li>By the end of this unit, students will be able to...</li>
            </ul>
            
            Return ONLY the HTML <ul> structure without any other text.
            """
            
            full_prompt = "You are an educational expert. Create clear, specific learning objectives using action verbs in HTML format.\n\n" + prompt
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.6,
                    max_output_tokens=3000
                )
            )
            
            content = response.text
            # Parse objectives from response
            objectives = [obj.strip() for obj in content.split('\n') if obj.strip() and ('able to' in obj.lower() or 'will' in obj.lower())]
            
            return objectives[:4]  # Return max 4 objectives
            
        except Exception as e:
            logger.error(f"Error generating learning objectives: {str(e)}")
            return [f"Understand key concepts related to {unit_title}"]
    
    def generate_practical_exercises(self, unit_title: str, content: str) -> List[Dict[str, Any]]:
        """Generate practical exercises for a unit"""
        
        try:
            prompt = f"""
            Based on this unit content, create 2-3 practical exercises:
            
            Unit: {unit_title}
            Content Preview: {content[:200]}...
            
            For each exercise, provide:
            1. Exercise title
            2. Description/instructions
            3. Difficulty level (beginner/intermediate/advanced)
            4. Estimated time to complete
            5. Expected outcome/solution approach
            
            Make exercises practical and hands-on.
            """
            
            full_prompt = "You are an expert at creating practical, engaging educational exercises.\n\n" + prompt
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=8000
                )
            )
            
            # Parse response into exercise format
            exercises = []
            content = response.text
            
            # Simple parsing - in production, you'd want more robust parsing
            exercise_blocks = content.split('\n\n')
            for i, block in enumerate(exercise_blocks[:3]):
                if block.strip():
                    exercises.append({
                        "id": f"exercise_{i+1}",
                        "title": f"Exercise {i+1}",
                        "description": block.strip(),
                        "difficulty": "beginner",
                        "estimated_time": 15,
                        "type": "practical"
                    })
            
            return exercises
            
        except Exception as e:
            logger.error(f"Error generating exercises: {str(e)}")
            return []