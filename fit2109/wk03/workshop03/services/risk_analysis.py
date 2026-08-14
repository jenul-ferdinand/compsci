"""Identify students who may need academic support."""
from __future__ import annotations

from collections.abc import Iterable

from app.config import AppConfig
from models.report import RiskEntry
from models.student import Student


def classify_severity(reasons: list[str]) -> str:
    if len(reasons) >= 3:
        return "high"
    if len(reasons) == 2:
        return "medium"
    if len(reasons) == 1:
        return "low"
    return "none"


def analyse_student_risk(student: Student, config: AppConfig) -> RiskEntry | None:
    reasons = student.risk_reasons(config.pass_mark, config.attendance_warning_threshold)
    if not reasons:
        return None
    return RiskEntry(student=student, reasons=tuple(reasons), severity=classify_severity(reasons))


def build_risk_register(students: Iterable[Student], config: AppConfig) -> list[RiskEntry]:
    entries: list[RiskEntry] = []
    for student in students:
        entry = analyse_student_risk(student, config)
        if entry is not None:
            entries.append(entry)
    severity_order = {"high": 0, "medium": 1, "low": 2}
    return sorted(entries, key=lambda item: (severity_order[item.severity], item.student.weighted_total()))


def risk_counts(entries: Iterable[RiskEntry]) -> dict[str, int]:
    counts = {"high": 0, "medium": 0, "low": 0}
    for entry in entries:
        counts[entry.severity] = counts.get(entry.severity, 0) + 1
    return counts


def recommended_action(entry: RiskEntry) -> str:
    if entry.severity == "high":
        return "Arrange a priority meeting and create an intervention plan."
    if entry.severity == "medium":
        return "Contact the student and review recent assessment performance."
    return "Monitor progress and send a supportive reminder."
