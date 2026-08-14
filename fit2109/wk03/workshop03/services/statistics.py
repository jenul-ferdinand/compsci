"""Statistical calculations for class and assessment reports."""
from __future__ import annotations

from collections import defaultdict
from collections.abc import Iterable
from math import sqrt
from statistics import mean, median

from models.report import ClassStatistics
from models.student import Student


def calculate_average(values: Iterable[float]) -> float:
    numbers = list(values)
    return mean(numbers) if numbers else 0.0


def calculate_median(values: Iterable[float]) -> float:
    numbers = list(values)
    return median(numbers) if numbers else 0.0


def calculate_standard_deviation(values: Iterable[float]) -> float:
    numbers = list(values)
    if len(numbers) < 2:
        return 0.0
    average = calculate_average(numbers)
    variance = sum((number - average) ** 2 for number in numbers) / len(numbers)
    return sqrt(variance)


def calculate_percentile(values: Iterable[float], percentile: float) -> float:
    numbers = sorted(values)
    if not numbers:
        return 0.0
    if percentile <= 0:
        return numbers[0]
    if percentile >= 100:
        return numbers[-1]
    position = (len(numbers) - 1) * percentile / 100
    lower = int(position)
    upper = min(lower + 1, len(numbers) - 1)
    fraction = position - lower
    return numbers[lower] + (numbers[upper] - numbers[lower]) * fraction


def calculate_pass_rate(students: Iterable[Student], pass_mark: float = 50.0) -> float:
    student_list = list(students)
    if not student_list:
        return 0.0
    passing = sum(student.weighted_total() >= pass_mark for student in student_list)
    return passing / len(student_list) * 100.0


def build_class_statistics(students: Iterable[Student], pass_mark: float = 50.0) -> ClassStatistics:
    student_list = list(students)
    marks = [student.weighted_total() for student in student_list]
    attendance = [student.attendance for student in student_list]
    if not student_list:
        return ClassStatistics(0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
    return ClassStatistics(
        count=len(student_list),
        average=calculate_average(marks),
        median=calculate_median(marks),
        minimum=min(marks),
        maximum=max(marks),
        pass_rate=calculate_pass_rate(student_list, pass_mark),
        attendance_average=calculate_average(attendance),
        standard_deviation=calculate_standard_deviation(marks),
    )


def assessment_averages(students: Iterable[Student]) -> dict[str, float]:
    grouped: dict[str, list[float]] = defaultdict(list)
    for student in students:
        for assessment in student.assessments:
            grouped[assessment.name].append(assessment.score)
    return {name: calculate_average(scores) for name, scores in grouped.items()}


def find_outliers(students: Iterable[Student], z_threshold: float = 1.5) -> list[Student]:
    student_list = list(students)
    marks = [student.weighted_total() for student in student_list]
    average = calculate_average(marks)
    deviation = calculate_standard_deviation(marks)
    if deviation == 0:
        return []
    return [student for student in student_list if abs(student.weighted_total() - average) / deviation >= z_threshold]


def performance_bands(students: Iterable[Student]) -> dict[str, list[Student]]:
    bands: dict[str, list[Student]] = {"top": [], "middle": [], "lower": []}
    student_list = list(students)
    marks = [student.weighted_total() for student in student_list]
    lower_cut = calculate_percentile(marks, 33)
    upper_cut = calculate_percentile(marks, 67)
    for student in student_list:
        mark = student.weighted_total()
        if mark >= upper_cut:
            bands["top"].append(student)
        elif mark < lower_cut:
            bands["lower"].append(student)
        else:
            bands["middle"].append(student)
    return bands
