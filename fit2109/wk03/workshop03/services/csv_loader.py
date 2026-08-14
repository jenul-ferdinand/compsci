"""CSV loading pipeline for converting rows into Student objects."""
from __future__ import annotations

import csv
from dataclasses import dataclass, field
from pathlib import Path

from app.config import AppConfig
from models.student import Student
from services.validation import (
    ValidationIssue,
    ValidationResult,
    find_duplicate_ids,
    validate_attendance,
    validate_email,
    validate_required_fields,
    validate_score,
    validate_student_id,
)
from utils.errors import DataLoadError

REQUIRED_COLUMNS = ("student_id", "first_name", "last_name", "email", "attendance")
ASSESSMENT_COLUMNS = {
    "assignment": 0.30,
    "project": 0.40,
    "exam": 0.30,
}


@dataclass
class LoadResult:
    students: list[Student] = field(default_factory=list)
    issues: list[ValidationIssue] = field(default_factory=list)
    rows_read: int = 0
    rows_skipped: int = 0

    @property
    def has_errors(self) -> bool:
        return any(issue.severity == "error" for issue in self.issues)

    def summary(self) -> str:
        return (
            f"Read {self.rows_read} data rows; loaded {len(self.students)} students; "
            f"skipped {self.rows_skipped}; found {len(self.issues)} issues"
        )


def load_students(path: Path, config: AppConfig | None = None) -> LoadResult:
    config = config or AppConfig.default()
    if not path.exists():
        raise DataLoadError(f"Input file does not exist: {path}")
    if not path.is_file():
        raise DataLoadError(f"Input path is not a regular file: {path}")
    try:
        with path.open("r", encoding=config.encoding, newline="") as handle:
            reader = csv.DictReader(handle, delimiter=config.delimiter)
            _validate_headers(reader.fieldnames)
            result = _read_rows(reader, config)
    except UnicodeDecodeError as exc:
        raise DataLoadError(f"Could not decode {path} using {config.encoding}") from exc
    except OSError as exc:
        raise DataLoadError(f"Could not read {path}: {exc}") from exc
    _add_duplicate_issues(result)
    return result


def _validate_headers(fieldnames: list[str] | None) -> None:
    if not fieldnames:
        raise DataLoadError("CSV file does not contain a header row")
    missing = [name for name in (*REQUIRED_COLUMNS, *ASSESSMENT_COLUMNS) if name not in fieldnames]
    if missing:
        raise DataLoadError(f"CSV file is missing required columns: {', '.join(missing)}")


def _read_rows(reader: csv.DictReader, config: AppConfig) -> LoadResult:
    result = LoadResult()
    for row_number, row in enumerate(reader, start=2):
        result.rows_read += 1
        student, validation = _student_from_row(row, row_number, config)
        result.issues.extend(validation.issues)
        if student is None or not validation.is_valid:
            result.rows_skipped += 1
            continue
        result.students.append(student)
    return result


def _student_from_row(row: dict[str, str], row_number: int, config: AppConfig) -> tuple[Student | None, ValidationResult]:
    validation = validate_required_fields(row, REQUIRED_COLUMNS)
    student_id = row.get("student_id", "").strip()
    first_name = row.get("first_name", "").strip()
    last_name = row.get("last_name", "").strip()
    email = row.get("email", "").strip()
    validation.extend(validate_student_id(student_id))
    validation.extend(validate_email(email))
    attendance, attendance_result = validate_attendance(row.get("attendance", ""))
    validation.extend(attendance_result)
    parsed_assessments: list[tuple[str, float, float]] = []
    for column, weight in ASSESSMENT_COLUMNS.items():
        score, score_result = validate_score(row.get(column, ""), column, config)
        validation.extend(score_result)
        if score is not None:
            parsed_assessments.append((column.title(), score, weight))
    for issue in validation.issues:
        issue.message = f"row {row_number}: {issue.message}"
    if not validation.is_valid or attendance is None:
        return None, validation
    student = Student(student_id, first_name, last_name, email, attendance)
    for name, score, weight in parsed_assessments:
        student.add_assessment(name, score, weight)
    return student, validation


def _add_duplicate_issues(result: LoadResult) -> None:
    duplicates = find_duplicate_ids(result.students)
    if not duplicates:
        return
    result.students = [student for student in result.students if student.student_id not in duplicates]
    for student_id in sorted(duplicates):
        result.issues.append(ValidationIssue("student_id", "duplicate student ID removed", student_id))
        result.rows_skipped += 1
