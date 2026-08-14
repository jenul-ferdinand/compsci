"""Validation helpers for raw rows and domain objects."""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Mapping

from app.config import AppConfig
from models.student import Student

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{3,20}$")


@dataclass
class ValidationIssue:
    field: str
    message: str
    value: object = None
    severity: str = "error"

    def __str__(self) -> str:
        return f"{self.severity.upper()}: {self.field}: {self.message} ({self.value!r})"


@dataclass
class ValidationResult:
    issues: list[ValidationIssue] = field(default_factory=list)

    @property
    def is_valid(self) -> bool:
        return not any(issue.severity == "error" for issue in self.issues)

    @property
    def errors(self) -> list[ValidationIssue]:
        return [issue for issue in self.issues if issue.severity == "error"]

    @property
    def warnings(self) -> list[ValidationIssue]:
        return [issue for issue in self.issues if issue.severity == "warning"]

    def add_error(self, field: str, message: str, value: object = None) -> None:
        self.issues.append(ValidationIssue(field, message, value, "error"))

    def add_warning(self, field: str, message: str, value: object = None) -> None:
        self.issues.append(ValidationIssue(field, message, value, "warning"))

    def extend(self, other: "ValidationResult") -> None:
        self.issues.extend(other.issues)


def validate_required_fields(row: Mapping[str, str], required: tuple[str, ...]) -> ValidationResult:
    result = ValidationResult()
    for field_name in required:
        value = row.get(field_name, "").strip()
        if not value:
            result.add_error(field_name, "required value is missing", value)
    return result


def validate_student_id(student_id: str) -> ValidationResult:
    result = ValidationResult()
    if not student_id:
        result.add_error("student_id", "student ID is required", student_id)
    elif not ID_PATTERN.match(student_id):
        result.add_error("student_id", "use 3-20 letters, digits, underscores, or hyphens", student_id)
    return result


def validate_email(email: str) -> ValidationResult:
    result = ValidationResult()
    if not email:
        result.add_error("email", "email address is required", email)
    elif not EMAIL_PATTERN.match(email):
        result.add_error("email", "email address has an invalid format", email)
    return result


def parse_number(value: str, field_name: str, result: ValidationResult) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        result.add_error(field_name, "must be a number", value)
        return None


def validate_score(value: str, field_name: str, config: AppConfig) -> tuple[float | None, ValidationResult]:
    result = ValidationResult()
    score = parse_number(value, field_name, result)
    if score is None:
        return None, result
    if not config.minimum_score <= score <= config.maximum_score:
        result.add_error(field_name, f"must be between {config.minimum_score} and {config.maximum_score}", score)
    return score, result


def validate_attendance(value: str) -> tuple[float | None, ValidationResult]:
    result = ValidationResult()
    attendance = parse_number(value, "attendance", result)
    if attendance is None:
        return None, result
    if not 0 <= attendance <= 100:
        result.add_error("attendance", "must be between 0 and 100", attendance)
    elif attendance < 50:
        result.add_warning("attendance", "attendance is unusually low", attendance)
    return attendance, result


def validate_student(student: Student, config: AppConfig) -> ValidationResult:
    result = ValidationResult()
    result.extend(validate_student_id(student.student_id))
    result.extend(validate_email(student.email))
    if not student.first_name.strip():
        result.add_error("first_name", "first name is required", student.first_name)
    if not student.last_name.strip():
        result.add_error("last_name", "last name is required", student.last_name)
    if not 0 <= student.attendance <= 100:
        result.add_error("attendance", "must be between 0 and 100", student.attendance)
    for assessment in student.assessments:
        if not config.minimum_score <= assessment.score <= config.maximum_score:
            result.add_error(assessment.name, "assessment score is out of range", assessment.score)
        if assessment.weight <= 0:
            result.add_error(assessment.name, "assessment weight must be positive", assessment.weight)
    if student.assessments:
        total_weight = sum(item.weight for item in student.assessments)
        if abs(total_weight - 1.0) > 0.01:
            result.add_warning("assessments", "weights do not add to 1.0", total_weight)
    return result


def find_duplicate_ids(students: list[Student]) -> set[str]:
    seen: set[str] = set()
    duplicates: set[str] = set()
    for student in students:
        if student.student_id in seen:
            duplicates.add(student.student_id)
        seen.add(student.student_id)
    return duplicates
