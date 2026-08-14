from models.student import Student
from services.statistics import calculate_average, build_class_statistics


def make_student(student_id: str, mark: float) -> Student:
    student = Student(student_id, "Test", "Student", f"{student_id}@example.edu", 80)
    student.add_assessment("Exam", mark, 1.0)
    return student


def test_calculate_average() -> None:
    assert calculate_average([10, 20, 30]) == 20


def test_build_class_statistics() -> None:
    statistics = build_class_statistics([make_student("1", 60), make_student("2", 80)])
    assert statistics.average == 70
    assert statistics.pass_rate == 100
