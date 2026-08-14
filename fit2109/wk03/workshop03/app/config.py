"""Configuration objects and defaults used across the application."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Mapping


@dataclass(frozen=True)
class GradeBoundary:
    label: str
    minimum: float


@dataclass(frozen=True)
class AppConfig:
    """Central configuration for input, output, validation, and grading."""

    project_root: Path
    input_file: Path
    output_file: Path
    audit_file: Path
    delimiter: str = ","
    encoding: str = "utf-8"
    minimum_score: float = 0.0
    maximum_score: float = 100.0
    attendance_warning_threshold: float = 75.0
    pass_mark: float = 50.0
    include_student_details: bool = True
    include_grade_distribution: bool = True
    include_risk_summary: bool = True
    grade_boundaries: tuple[GradeBoundary, ...] = field(default_factory=lambda: (
        GradeBoundary("HD", 80.0),
        GradeBoundary("D", 70.0),
        GradeBoundary("C", 60.0),
        GradeBoundary("P", 50.0),
        GradeBoundary("N", 0.0),
    ))

    @classmethod
    def default(cls) -> "AppConfig":
        project_root = Path(__file__).resolve().parents[1]
        data_dir = project_root / "data"
        return cls(
            project_root=project_root,
            input_file=data_dir / "students.csv",
            output_file=data_dir / "class_report.txt",
            audit_file=data_dir / "audit.log",
        )

    @classmethod
    def from_environment(cls, environment: Mapping[str, str]) -> "AppConfig":
        """Create configuration while allowing selected paths to be overridden."""
        base = cls.default()
        input_file = Path(environment.get("REPORT_INPUT", str(base.input_file)))
        output_file = Path(environment.get("REPORT_OUTPUT", str(base.output_file)))
        audit_file = Path(environment.get("REPORT_AUDIT", str(base.audit_file)))
        return cls(
            project_root=base.project_root,
            input_file=input_file,
            output_file=output_file,
            audit_file=audit_file,
            delimiter=environment.get("REPORT_DELIMITER", base.delimiter),
            encoding=environment.get("REPORT_ENCODING", base.encoding),
            minimum_score=base.minimum_score,
            maximum_score=base.maximum_score,
            attendance_warning_threshold=base.attendance_warning_threshold,
            pass_mark=base.pass_mark,
            include_student_details=base.include_student_details,
            include_grade_distribution=base.include_grade_distribution,
            include_risk_summary=base.include_risk_summary,
            grade_boundaries=base.grade_boundaries,
        )

    def describe(self) -> list[str]:
        """Return readable configuration lines for diagnostics."""
        return [
            f"Project root: {self.project_root}",
            f"Input file: {self.input_file}",
            f"Output file: {self.output_file}",
            f"Audit file: {self.audit_file}",
            f"Score range: {self.minimum_score:.0f}-{self.maximum_score:.0f}",
            f"Pass mark: {self.pass_mark:.0f}",
            f"Attendance warning: below {self.attendance_warning_threshold:.0f}%",
        ]
