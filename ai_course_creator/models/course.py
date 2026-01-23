from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any
from datetime import datetime
import uuid

@dataclass
class Unit:
    """Individual learning unit within a subsection"""
    id: str
    title: str
    content: str = ""
    content_type: str = "text_video"  # text_video (combined), text, video, image, exercise
    video_url: Optional[str] = None
    video_duration: int = 0  # minutes
    image_urls: List[str] = field(default_factory=list)
    reading_time: int = 5  # minutes
    exercises: List[Dict] = field(default_factory=list)
    resources: List[Dict] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'content_type': self.content_type,
            'video_url': self.video_url,
            'video_duration': self.video_duration,
            'image_urls': self.image_urls,
            'reading_time': self.reading_time,
            'total_time': self.reading_time + self.video_duration,
            'exercises': self.exercises,
            'resources': self.resources
        }

@dataclass
class SubSection:
    """Subsection containing multiple units"""
    id: str
    title: str
    description: str = ""
    units: List[Unit] = field(default_factory=list)
    estimated_time: int = 30  # minutes
    learning_objectives: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'units': [unit.to_dict() for unit in self.units],
            'estimated_time': self.estimated_time,
            'learning_objectives': self.learning_objectives
        }
    
    def add_unit(self, unit: Unit):
        self.units.append(unit)
        self.estimated_time = sum(unit.reading_time + unit.video_duration for unit in self.units)

@dataclass
class Section:
    """Main section containing subsections"""
    id: str
    title: str
    description: str = ""
    subsections: List[SubSection] = field(default_factory=list)
    estimated_time: int = 120  # minutes
    prerequisites: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'subsections': [subsection.to_dict() for subsection in self.subsections],
            'estimated_time': self.estimated_time,
            'prerequisites': self.prerequisites
        }
    
    def add_subsection(self, subsection: SubSection):
        self.subsections.append(subsection)
        self.estimated_time = sum(subsection.estimated_time for subsection in self.subsections)

@dataclass
class Assessment:
    """Assessment/quiz for the course"""
    id: str
    title: str
    assessment_type: str  # multiple_choice, checkbox, text_input, dropdown, numerical
    questions: List[Dict] = field(default_factory=list)
    section_id: Optional[str] = None
    subsection_id: Optional[str] = None
    time_limit: int = 30  # minutes
    passing_score: int = 70  # percentage
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'title': self.title,
            'assessment_type': self.assessment_type,
            'questions': self.questions,
            'section_id': self.section_id,
            'subsection_id': self.subsection_id,
            'time_limit': self.time_limit,
            'passing_score': self.passing_score
        }

@dataclass
class Course:
    """Complete course structure"""
    id: str
    title: str
    description: str = ""
    audience: str = "beginner"
    duration: str = "medium"
    sections: List[Section] = field(default_factory=list)
    assessments: List[Assessment] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'audience': self.audience,
            'duration': self.duration,
            'sections': [section.to_dict() for section in self.sections],
            'assessments': [assessment.to_dict() for assessment in self.assessments],
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat(),
            'total_sections': len(self.sections),
            'total_assessments': len(self.assessments),
            'estimated_total_time': sum(section.estimated_time for section in self.sections)
        }
    
    def add_section(self, section: Section):
        self.sections.append(section)
    
    def add_assessment(self, assessment: Assessment):
        self.assessments.append(assessment)
    
    def get_section_by_id(self, section_id: str) -> Optional[Section]:
        for section in self.sections:
            if section.id == section_id:
                return section
        return None
    
    def get_subsection_by_id(self, section_id: str, subsection_id: str) -> Optional[SubSection]:
        section = self.get_section_by_id(section_id)
        if section:
            for subsection in section.subsections:
                if subsection.id == subsection_id:
                    return subsection
        return None
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Course':
        """Create Course object from dictionary data"""
        
        course = cls(
            id=data.get('id', str(uuid.uuid4())),
            title=data.get('title', ''),
            description=data.get('description', ''),
            audience=data.get('audience', 'beginner'),
            duration=data.get('duration', 'medium'),
            metadata=data.get('metadata', {}),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else datetime.now()
        )
        
        # Add sections
        for section_data in data.get('sections', []):
            section = Section(
                id=section_data.get('id', str(uuid.uuid4())),
                title=section_data.get('title', ''),
                description=section_data.get('description', ''),
                estimated_time=section_data.get('estimated_time', 120),
                prerequisites=section_data.get('prerequisites', [])
            )
            
            # Add subsections
            for subsection_data in section_data.get('subsections', []):
                subsection = SubSection(
                    id=subsection_data.get('id', str(uuid.uuid4())),
                    title=subsection_data.get('title', ''),
                    description=subsection_data.get('description', ''),
                    estimated_time=subsection_data.get('estimated_time', 30),
                    learning_objectives=subsection_data.get('learning_objectives', [])
                )
                
                # Add units
                for unit_data in subsection_data.get('units', []):
                    unit = Unit(
                        id=unit_data.get('id', str(uuid.uuid4())),
                        title=unit_data.get('title', ''),
                        content=unit_data.get('content', ''),
                        content_type=unit_data.get('content_type', 'text_video'),
                        video_url=unit_data.get('video_url'),
                        video_duration=unit_data.get('video_duration', 0),
                        image_urls=unit_data.get('image_urls', []),
                        reading_time=unit_data.get('reading_time', 5),
                        exercises=unit_data.get('exercises', []),
                        resources=unit_data.get('resources', [])
                    )
                    subsection.add_unit(unit)
                
                section.add_subsection(subsection)
            
            course.add_section(section)
        
        # Add assessments
        for assessment_data in data.get('assessments', []):
            assessment = Assessment(
                id=assessment_data.get('id', str(uuid.uuid4())),
                title=assessment_data.get('title', ''),
                assessment_type=assessment_data.get('assessment_type', 'mixed'),
                questions=assessment_data.get('questions', []),
                section_id=assessment_data.get('section_id'),
                subsection_id=assessment_data.get('subsection_id'),
                time_limit=assessment_data.get('time_limit', 30),
                passing_score=assessment_data.get('passing_score', 70)
            )
            course.add_assessment(assessment)
        
        return course