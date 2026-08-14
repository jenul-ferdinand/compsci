"""Report models shared by builders, formatters, and exporters."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime

from models.student import Student


@dataclass(frozen=True)
class ClassStatistics:
    count: int
    average: float
    median: float
    minimum: float
    maximum: float
    pass_rate: float
    attendance_average: float
    standard_deviation: float


@dataclass(frozen=True)
class GradeDistribution:
    counts: dict[str, int]

    @property
    def total(self) -> int:
        return sum(self.counts.values())

    def percentage(self, grade: str) -> float:
        if self.total == 0:
            return 0.0
        return self.counts.get(grade, 0) / self.total * 100.0


@dataclass(frozen=True)
class RiskEntry:
    student: Student
    reasons: tuple[str, ...]
    severity: str


@dataclass
class ClassReport:
    title: str
    generated_at: datetime
    students: list[Student]
    statistics: ClassStatistics
    grade_distribution: GradeDistribution
    risk_entries: list[RiskEntry] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    source_name: str = ""

    def passing_students(self, pass_mark: float = 50.0) -> list[Student]:
        return [student for student in self.students if student.is_passing(pass_mark)]

    def failing_students(self, pass_mark: float = 50.0) -> list[Student]:
        return [student for student in self.students if not student.is_passing(pass_mark)]

    def students_by_mark(self, descending: bool = True) -> list[Student]:
        return sorted(self.students, key=lambda item: item.weighted_total(), reverse=descending)

    def high_risk_students(self) -> list[Student]:
        return [entry.student for entry in self.risk_entries if entry.severity == "high"]

    def summary(self) -> str:
        return (
            f"{self.title}: {self.statistics.count} students, "
            f"average {self.statistics.average:.1f}, "
            f"pass rate {self.statistics.pass_rate:.1f}%"
        )
