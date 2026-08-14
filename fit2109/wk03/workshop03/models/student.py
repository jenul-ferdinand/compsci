"""Domain model representing a student and their assessment results."""
from __future__ import annotations

from dataclasses import dataclass, field
from statistics import mean


@dataclass
class AssessmentResult:
    name: str
    score: float
    weight: float

    def weighted_score(self) -> float:
        return self.score * self.weight


@dataclass
class Student:
    student_id: str
    first_name: str
    last_name: str
    email: str
    attendance: float
    assessments: list[AssessmentResult] = field(default_factory=list)

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def short_name(self) -> str:
        return f"{self.first_name} {self.last_name[:1]}.".strip()

    def add_assessment(self, name: str, score: float, weight: float) -> None:
        self.assessments.append(AssessmentResult(name, score, weight))

    def assessment_named(self, name: str) -> AssessmentResult | None:
        target = name.casefold()
        for assessment in self.assessments:
            if assessment.name.casefold() == target:
                return assessment
        return None

    def raw_average(self) -> float:
        if not self.assessments:
            return 0.0
        return mean(item.score for item in self.assessments)

    def weighted_total(self) -> float:
        if not self.assessments:
            return 0.0
        total_weight = sum(item.weight for item in self.assessments)
        if total_weight <= 0:
            return 0.0
        return sum(item.weighted_score() for item in self.assessments) / total_weight

    def lowest_assessment(self) -> AssessmentResult | None:
        if not self.assessments:
            return None
        return min(self.assessments, key=lambda item: item.score)

    def highest_assessment(self) -> AssessmentResult | None:
        if not self.assessments:
            return None
        return max(self.assessments, key=lambda item: item.score)

    def is_passing(self, pass_mark: float = 50.0) -> bool:
        return self.weighted_total() >= pass_mark

    def has_low_attendance(self, threshold: float = 75.0) -> bool:
        return self.attendance < threshold

    def risk_reasons(self, pass_mark: float = 50.0, attendance_threshold: float = 75.0) -> list[str]:
        reasons: list[str] = []
        if self.weighted_total() < pass_mark:
            reasons.append("overall mark below pass threshold")
        if self.attendance < attendance_threshold:
            reasons.append("attendance below recommended threshold")
        lowest = self.lowest_assessment()
        if lowest is not None and lowest.score < 40.0:
            reasons.append(f"low result in {lowest.name}")
        if not self.assessments:
            reasons.append("no assessment results recorded")
        return reasons

    def to_summary_dict(self) -> dict[str, object]:
        return {
            "student_id": self.student_id,
            "name": self.full_name,
            "email": self.email,
            "attendance": self.attendance,
            "assessment_count": len(self.assessments),
            "raw_average": round(self.raw_average(), 2),
            "weighted_total": round(self.weighted_total(), 2),
        }

    def __str__(self) -> str:
        return f"{self.student_id} - {self.full_name} ({self.weighted_total():.1f})"
