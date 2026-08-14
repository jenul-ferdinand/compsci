"""Grade calculation and classification services."""
from __future__ import annotations

from collections.abc import Iterable

from app.config import GradeBoundary
from models.student import Student


def normalise_mark(mark: float, minimum: float = 0.0, maximum: float = 100.0) -> float:
    """Clamp a mark into the configured score range."""
    return min(max(mark, minimum), maximum)


def grade_for_mark(mark: float, boundaries: Iterable[GradeBoundary] | None = None) -> str:
    """Return the grade label matching a numeric mark."""
    ordered = tuple(boundaries or (
        GradeBoundary("HD", 80.0),
        GradeBoundary("D", 70.0),
        GradeBoundary("C", 60.0),
        GradeBoundary("P", 50.0),
        GradeBoundary("N", 0.0),
    ))
    clean_mark = normalise_mark(mark)
    for boundary in sorted(ordered, key=lambda item: item.minimum, reverse=True):
        if clean_mark >= boundary.minimum:
            return boundary.label
    return "N"


def grade_student(student: Student, boundaries: Iterable[GradeBoundary] | None = None) -> str:
    return grade_for_mark(student.weighted_total(), boundaries)


def grade_distribution(students: Iterable[Student], boundaries: Iterable[GradeBoundary] | None = None) -> dict[str, int]:
    labels = [boundary.label for boundary in (boundaries or (
        GradeBoundary("HD", 80.0), GradeBoundary("D", 70.0), GradeBoundary("C", 60.0),
        GradeBoundary("P", 50.0), GradeBoundary("N", 0.0)
    ))]
    counts = {label: 0 for label in labels}
    for student in students:
        label = grade_student(student, boundaries)
        counts[label] = counts.get(label, 0) + 1
    return counts


def describe_grade(label: str) -> str:
    descriptions = {
        "HD": "High Distinction",
        "D": "Distinction",
        "C": "Credit",
        "P": "Pass",
        "N": "Not Yet Passing",
    }
    return descriptions.get(label, "Unknown grade")


def is_borderline(mark: float, pass_mark: float = 50.0, margin: float = 3.0) -> bool:
    return pass_mark - margin <= mark < pass_mark + margin


def students_near_boundary(students: Iterable[Student], boundary: float, margin: float = 2.0) -> list[Student]:
    return [student for student in students if abs(student.weighted_total() - boundary) <= margin]
