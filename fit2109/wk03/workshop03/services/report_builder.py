"""Assemble a complete ClassReport from loaded student records."""
from __future__ import annotations

from datetime import datetime
from pathlib import Path

from app.config import AppConfig
from models.report import ClassReport, GradeDistribution
from models.student import Student
from services.grading import grade_distribution, students_near_boundary
from services.risk_analysis import build_risk_register
from services.statistics import build_class_statistics, find_outliers


class ReportBuilder:
    """Coordinates calculations required to construct a report model."""

    def __init__(self, config: AppConfig) -> None:
        self.config = config

    def build(self, students: list[Student], source: Path, warnings: list[str] | None = None) -> ClassReport:
        prepared = self._prepare_students(students)
        statistics = build_class_statistics(prepared, self.config.pass_mark)
        distribution = GradeDistribution(grade_distribution(prepared, self.config.grade_boundaries))
        risk_entries = build_risk_register(prepared, self.config)
        report_warnings = list(warnings or [])
        report_warnings.extend(self._discover_report_warnings(prepared))
        return ClassReport(
            title="Student Performance Report",
            generated_at=datetime.now(),
            students=prepared,
            statistics=statistics,
            grade_distribution=distribution,
            risk_entries=risk_entries,
            warnings=report_warnings,
            source_name=source.name,
        )

    def _prepare_students(self, students: list[Student]) -> list[Student]:
        """Return a predictable copy ordered by family name and student ID."""
        return sorted(students, key=lambda item: (item.last_name.casefold(), item.first_name.casefold(), item.student_id))

    def _discover_report_warnings(self, students: list[Student]) -> list[str]:
        warnings: list[str] = []
        if not students:
            warnings.append("No valid students were loaded; report sections may be empty.")
            return warnings
        if len(students) < 5:
            warnings.append("The class contains fewer than five valid records; statistics may be unstable.")
        outliers = find_outliers(students)
        if outliers:
            names = ", ".join(student.short_name for student in outliers)
            warnings.append(f"Potential statistical outliers: {names}")
        borderline = students_near_boundary(students, self.config.pass_mark, margin=2.0)
        if borderline:
            names = ", ".join(student.short_name for student in borderline)
            warnings.append(f"Students close to the pass boundary: {names}")
        low_attendance = [student for student in students if student.has_low_attendance(self.config.attendance_warning_threshold)]
        if len(low_attendance) > len(students) / 3:
            warnings.append("More than one third of the class has low attendance.")
        # TODO: add comparison against the previous teaching period.
        return warnings


def build_report(students: list[Student], source: Path, config: AppConfig | None = None) -> ClassReport:
    """Convenience function used by the application service and tests."""
    active_config = config or AppConfig.default()
    return ReportBuilder(active_config).build(students, source)
