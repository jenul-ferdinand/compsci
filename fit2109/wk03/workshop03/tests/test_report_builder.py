from pathlib import Path

from app.config import AppConfig
from models.student import Student
from services.report_builder import build_report


def test_build_report() -> None:
    student = Student("S1", "Example", "Student", "student@example.edu", 82)
    student.add_assessment("Exam", 70, 1.0)
    report = build_report([student], Path("students.csv"), AppConfig.default())
    assert report.statistics.average == 70
    assert report.grade_distribution.counts["D"] == 1
    assert report.students[0].is_passing()
