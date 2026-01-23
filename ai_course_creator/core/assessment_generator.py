import os
import json
import uuid
from typing import Dict, List, Any
import google.generativeai as genai
import logging

from ..models.course import Course, Assessment

logger = logging.getLogger(__name__)

class AssessmentGenerator:
    def __init__(self):
        genai.configure(api_key=os.getenv('AI_COURSE_CREATOR_GEMINI_API_KEY'))
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def generate_assessments(self, course_structure: Course, assessment_types: List[str]) -> Course:
        """Generate assessments for the course"""
        
        try:
            # Generate section-level assessments
            for section in course_structure.sections:
                assessment = self._generate_section_assessment(
                    section_id=section.id,
                    section_title=section.title,
                    course_title=course_structure.title,
                    assessment_types=assessment_types
                )
                if assessment:
                    course_structure.add_assessment(assessment)
            
            # Generate final course assessment
            final_assessment = self._generate_final_assessment(
                course_structure=course_structure,
                assessment_types=assessment_types
            )
            if final_assessment:
                course_structure.add_assessment(final_assessment)
            
            return course_structure
            
        except Exception as e:
            logger.error(f"Error generating assessments: {str(e)}")
            return course_structure
    
    def _generate_section_assessment(self, section_id: str, section_title: str, course_title: str, assessment_types: List[str]) -> Assessment:
        """Generate assessment for a specific section"""
        
        try:
            prompt = f"""
            Create an assessment for this course section:
            
            Course: {course_title}
            Section: {section_title}
            Assessment Types: {', '.join(assessment_types)}
            
            Generate a mix of questions using the specified assessment types:
            - multiple-choice: 4 options, 1 correct answer
            - checkbox: 4-6 options, 2-3 correct answers
            - text-input: Short answer questions (1-3 sentences)
            - dropdown: 4-5 options in dropdown format
            - numerical: Math/calculation problems with numeric answers
            
            Create 5-8 questions total, mixing the requested types.
            Ensure each question tests comprehension, application, or analysis.
            
            IMPORTANT: Format ALL question text, options, and explanations in HTML format.
            Use <p>, <strong>, <em>, <code>, <ul>, <li> tags as needed.
            
            Return JSON format with HTML content:
            {{
                "questions": [
                    {{
                        "id": "q1",
                        "type": "multiple-choice",
                        "question": "<p>What is the primary purpose of <strong>key concept</strong>?</p>",
                        "options": ["<p>Option A with <em>emphasis</em></p>", "<p>Option B</p>", "<p>Option C</p>", "<p>Option D</p>"],
                        "correct_answer": "<p>Option A with <em>emphasis</em></p>",
                        "explanation": "<p>This is correct because <strong>explanation</strong> with proper HTML formatting.</p>",
                        "difficulty": "medium"
                    }},
                    {{
                        "id": "q2", 
                        "type": "checkbox",
                        "question": "<p>Which of the following are <strong>key characteristics</strong>?</p>",
                        "options": ["<p>Option 1</p>", "<p>Option 2</p>", "<p>Option 3</p>", "<p>Option 4</p>"],
                        "correct_answers": ["<p>Option 1</p>", "<p>Option 3</p>"],
                        "explanation": "<p><strong>Explanation</strong> with HTML formatting.</p>"
                    }},
                    {{
                        "id": "q3",
                        "type": "text-input",
                        "question": "<p>Explain the concept of <em>key term</em> in your own words.</p>",
                        "correct_answer": "<p>Expected answer with proper formatting</p>",
                        "explanation": "<p>This answer demonstrates understanding of <strong>key concepts</strong>.</p>"
                    }},
                    {{
                        "id": "q4",
                        "type": "dropdown",
                        "question": "<p>Select the correct <strong>method</strong> for this scenario:</p>",
                        "options": ["<p>Select...</p>", "<p>Option A</p>", "<p>Option B</p>", "<p>Option C</p>"],
                        "correct_answer": "<p>Option B</p>",
                        "explanation": "<p><strong>Explanation</strong> with HTML formatting.</p>"
                    }},
                    {{
                        "id": "q5",
                        "type": "numerical",
                        "question": "<p>Calculate: What is <strong>2 + 2</strong>?</p>",
                        "correct_answer": "4",
                        "tolerance": "0",
                        "explanation": "<p>Basic arithmetic: <em>2 + 2 = 4</em></p>"
                    }}
                ]
            }}
            """
            
            full_prompt = "You are an expert at creating educational assessments. Create challenging but fair questions that test understanding. IMPORTANT: All text content must be formatted in HTML using proper tags like <p>, <strong>, <em>, <code>, etc.\n\n" + prompt
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=2000
                )
            )
            
            # Get and validate response content
            content = response.text.strip()
            if not content:
                logger.warning(f"Empty response from Gemini for section assessment: {section_title}")
                raise Exception(f"Section assessment generation failed: {str(e)}")
            
            try:
                cleaned_content = self._extract_json_from_response(content)
                questions_data = json.loads(cleaned_content)
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error for section assessment: {str(e)}")
                logger.error(f"Response content: {content[:500]}")
                raise Exception(f"Section assessment generation failed: {str(e)}")
            
            assessment = Assessment(
                id=str(uuid.uuid4()),
                title=f"{section_title} - Assessment",
                assessment_type="mixed",
                questions=questions_data.get('questions', []),
                section_id=section_id,
                time_limit=20,
                passing_score=70
            )
            
            return assessment
            
        except Exception as e:
            logger.error(f"Error generating section assessment: {str(e)}")
            raise Exception(f"Section assessment generation failed: {str(e)}")
    
    def _generate_final_assessment(self, course_structure: Course, assessment_types: List[str]) -> Assessment:
        """Generate comprehensive final assessment for the entire course"""
        
        try:
            # Collect all section titles for context
            section_titles = [section.title for section in course_structure.sections]
            
            prompt = f"""
            Create a comprehensive final assessment for this course:
            
            Course: {course_structure.title}
            Sections Covered: {', '.join(section_titles)}
            Assessment Types: {', '.join(assessment_types)}
            
            Create a final exam with 10-15 questions that:
            1. Cover all major topics from the course
            2. Test both knowledge and application
            3. Use a mix of the specified assessment types
            4. Include some challenging synthesis questions
            
            Return JSON format with questions array.
            """
            
            full_prompt = "You are an expert at creating comprehensive final exams. Create questions that test both knowledge and practical application.\n\n" + prompt
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=3000
                )
            )
            
            # Get and validate response content
            content = response.text.strip()
            if not content:
                logger.warning(f"Empty response from Gemini for final assessment: {course_structure.title}")
                raise Exception(f"Final assessment generation failed: {str(e)}")
            
            try:
                cleaned_content = self._extract_json_from_response(content)
                questions_data = json.loads(cleaned_content)
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error for final assessment: {str(e)}")
                logger.error(f"Response content: {content[:500]}")
                raise Exception(f"Final assessment generation failed: {str(e)}")
            
            assessment = Assessment(
                id=str(uuid.uuid4()),
                title=f"{course_structure.title} - Final Assessment",
                assessment_type="final_exam",
                questions=questions_data.get('questions', []),
                time_limit=60,
                passing_score=75
            )
            
            return assessment
            
        except Exception as e:
            logger.error(f"Error generating final assessment: {str(e)}")
            raise Exception(f"Final assessment generation failed: {str(e)}")
    
    def generate_question(self, question_type: str, topic: str, difficulty: str = "medium") -> Dict[str, Any]:
        """Generate a single question of specified type"""
        
        try:
            prompt = f"""
            Create a {difficulty} difficulty {question_type} question about {topic}.
            
            Question Type Guidelines:
            - multiple_choice: 4 options, only 1 correct
            - checkbox: 2-4 correct answers from 5-6 options  
            - text_input: Short answer (1-3 sentences)
            - dropdown: Select best option from 4-5 choices
            - numerical: Math problem with numeric answer
            
            Return JSON format appropriate for the question type.
            """
            
            full_prompt = "You are an expert question writer. Create clear, educational questions.\n\n" + prompt
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=5000
                )
            )
            
            # Get and validate response content
            content = response.text.strip()
            if not content:
                logger.warning(f"Empty response from Gemini for question generation: {topic}")
                raise Exception(f"Question generation failed: {str(e)}")
            
            try:
                cleaned_content = self._extract_json_from_response(content)
                return json.loads(cleaned_content)
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error for question generation: {str(e)}")
                logger.error(f"Response content: {content[:500]}")
                raise Exception(f"Question generation failed: {str(e)}")
            
        except Exception as e:
            logger.error(f"Error generating question: {str(e)}")
            raise Exception(f"Question generation failed: {str(e)}")
    
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
