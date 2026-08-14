"""Text formatting for ClassReport objects.

This module is intentionally long and sectioned so it works well for teaching
Sticky Scroll, the minimap, Outline, folding, and symbol navigation in VS Code.
"""
from __future__ import annotations

from dataclasses import dataclass

from app.config import AppConfig
from models.report import ClassReport, RiskEntry
from models.student import Student
from services.grading import describe_grade, grade_student
from services.risk_analysis import recommended_action, risk_counts
from services.statistics import assessment_averages, performance_bands


@dataclass(frozen=True)
class TableColumn:
    heading: str
    width: int
    alignment: str = "left"


class TextReportFormatter:
    """Convert a report model into a multi-section plain-text document."""

    def __init__(self, config: AppConfig, line_width: int = 92) -> None:
        self.config = config
        self.line_width = line_width

    def format(self, report: ClassReport) -> str:
        sections = [
            self._format_title(report),
            self._format_metadata(report),
            self._format_executive_summary(report),
            self._format_class_statistics(report),
            self._format_assessment_statistics(report),
            self._format_grade_distribution(report),
            self._format_performance_bands(report),
        ]
        if self.config.include_risk_summary:
            sections.append(self._format_risk_summary(report))
        if self.config.include_student_details:
            sections.append(self._format_student_details(report))
        sections.append(self._format_warnings(report))
        sections.append(self._format_footer(report))
        return "\n\n".join(section for section in sections if section.strip()) + "\n"

    def _format_title(self, report: ClassReport) -> str:
        border = "=" * self.line_width
        centred = report.title.center(self.line_width)
        return "\n".join((border, centred, border))

    def _format_metadata(self, report: ClassReport) -> str:
        lines = [
            self._section_heading("Report information"),
            f"Generated: {report.generated_at:%Y-%m-%d %H:%M:%S}",
            f"Source file: {report.source_name or 'unknown'}",
            f"Valid student records: {len(report.students)}",
            f"Pass mark: {self.config.pass_mark:.1f}",
            f"Attendance warning threshold: {self.config.attendance_warning_threshold:.1f}%",
        ]
        return "\n".join(lines)

    def _format_executive_summary(self, report: ClassReport) -> str:
        stats = report.statistics
        top_student = max(report.students, key=lambda s: s.weighted_total(), default=None)
        lines = [self._section_heading("Executive summary")]
        if not report.students:
            lines.append("No valid student records were available for analysis.")
            return "\n".join(lines)
        lines.extend([
            f"The class average is {stats.average:.1f}, with a median of {stats.median:.1f}.",
            f"The overall pass rate is {stats.pass_rate:.1f}%.",
            f"Average attendance is {stats.attendance_average:.1f}%.",
        ])
        if top_student is not None:
            lines.append(
                f"The highest result belongs to {top_student.full_name} "
                f"({top_student.student_id}) with {top_student.weighted_total():.1f}."
            )
        high_risk = report.high_risk_students()
        if high_risk:
            lines.append(f"{len(high_risk)} student(s) are currently classified as high risk.")
        else:
            lines.append("No students are currently classified as high risk.")
        return "\n".join(lines)

    def _format_class_statistics(self, report: ClassReport) -> str:
        stats = report.statistics
        rows = [
            ("Students", str(stats.count)),
            ("Average mark", f"{stats.average:.2f}"),
            ("Median mark", f"{stats.median:.2f}"),
            ("Minimum mark", f"{stats.minimum:.2f}"),
            ("Maximum mark", f"{stats.maximum:.2f}"),
            ("Standard deviation", f"{stats.standard_deviation:.2f}"),
            ("Pass rate", f"{stats.pass_rate:.2f}%"),
            ("Average attendance", f"{stats.attendance_average:.2f}%"),
        ]
        lines = [self._section_heading("Class statistics")]
        lines.extend(f"{label:<28} {value:>12}" for label, value in rows)
        return "\n".join(lines)

    def _format_assessment_statistics(self, report: ClassReport) -> str:
        averages = assessment_averages(report.students)
        lines = [self._section_heading("Assessment averages")]
        if not averages:
            lines.append("No assessment data available.")
            return "\n".join(lines)
        columns = (
            TableColumn("Assessment", 28),
            TableColumn("Average", 12, "right"),
            TableColumn("Visual", 42),
        )
        lines.append(self._table_header(columns))
        lines.append(self._table_rule(columns))
        for name, average in sorted(averages.items()):
            bar = self._progress_bar(average, width=36)
            lines.append(self._table_row((name, f"{average:.1f}", bar), columns))
        return "\n".join(lines)

    def _format_grade_distribution(self, report: ClassReport) -> str:
        lines = [self._section_heading("Grade distribution")]
        columns = (
            TableColumn("Grade", 8),
            TableColumn("Description", 24),
            TableColumn("Count", 8, "right"),
            TableColumn("Percent", 10, "right"),
            TableColumn("Distribution", 34),
        )
        lines.append(self._table_header(columns))
        lines.append(self._table_rule(columns))
        for grade, count in report.grade_distribution.counts.items():
            percent = report.grade_distribution.percentage(grade)
            lines.append(self._table_row((
                grade,
                describe_grade(grade),
                str(count),
                f"{percent:.1f}%",
                self._progress_bar(percent, width=28),
            ), columns))
        return "\n".join(lines)

    def _format_performance_bands(self, report: ClassReport) -> str:
        bands = performance_bands(report.students)
        lines = [self._section_heading("Performance bands")]
        explanations = {
            "top": "Students at or above the 67th percentile",
            "middle": "Students between the 33rd and 67th percentiles",
            "lower": "Students below the 33rd percentile",
        }
        for band_name in ("top", "middle", "lower"):
            students = bands[band_name]
            lines.append(f"{band_name.title()} band — {explanations[band_name]}")
            if not students:
                lines.append("  No students")
                continue
            for student in sorted(students, key=lambda item: item.weighted_total(), reverse=True):
                lines.append(f"  {student.student_id:<10} {student.full_name:<28} {student.weighted_total():>6.1f}")
        return "\n".join(lines)

    def _format_risk_summary(self, report: ClassReport) -> str:
        counts = risk_counts(report.risk_entries)
        lines = [
            self._section_heading("Student risk summary"),
            f"High: {counts.get('high', 0)} | Medium: {counts.get('medium', 0)} | Low: {counts.get('low', 0)}",
        ]
        if not report.risk_entries:
            lines.append("No students currently match the configured risk criteria.")
            return "\n".join(lines)
        for entry in report.risk_entries:
            lines.extend(self._format_risk_entry(entry))
        return "\n".join(lines)

    def _format_risk_entry(self, entry: RiskEntry) -> list[str]:
        student = entry.student
        lines = [
            "",
            f"[{entry.severity.upper():<6}] {student.full_name} ({student.student_id})",
            f"         Mark: {student.weighted_total():.1f} | Attendance: {student.attendance:.1f}%",
        ]
        for reason in entry.reasons:
            lines.append(f"         - {reason}")
        lines.append(f"         Recommended action: {recommended_action(entry)}")
        return lines

    def _format_student_details(self, report: ClassReport) -> str:
        lines = [self._section_heading("Individual student details")]
        for position, student in enumerate(report.students_by_mark(), start=1):
            if position > 1:
                lines.append("-" * self.line_width)
            lines.extend(self._format_student(student, position))
        if not report.students:
            lines.append("No student details available.")
        return "\n".join(lines)

    def _format_student(self, student: Student, rank: int) -> list[str]:
        grade = grade_student(student, self.config.grade_boundaries)
        lines = [
            f"Rank {rank}: {student.full_name} ({student.student_id})",
            f"Email: {student.email}",
            f"Attendance: {student.attendance:.1f}%",
            f"Weighted total: {student.weighted_total():.2f} — {grade} ({describe_grade(grade)})",
            "Assessments:",
        ]
        for assessment in student.assessments:
            lines.append(
                f"  {assessment.name:<18} score {assessment.score:>6.1f} | "
                f"weight {assessment.weight:>5.0%} | contribution {assessment.weighted_score():>6.2f}"
            )
        lowest = student.lowest_assessment()
        highest = student.highest_assessment()
        if lowest is not None and highest is not None:
            lines.append(f"Strongest assessment: {highest.name} ({highest.score:.1f})")
            lines.append(f"Assessment needing most attention: {lowest.name} ({lowest.score:.1f})")
        reasons = student.risk_reasons(self.config.pass_mark, self.config.attendance_warning_threshold)
        lines.append("Risk indicators: " + ("; ".join(reasons) if reasons else "none"))
        return lines

    def _format_warnings(self, report: ClassReport) -> str:
        lines = [self._section_heading("Warnings and data notes")]
        if not report.warnings:
            lines.append("No warnings were generated.")
        else:
            for number, warning in enumerate(report.warnings, start=1):
                lines.append(f"{number}. {warning}")
        return "\n".join(lines)

    def _format_footer(self, report: ClassReport) -> str:
        return "\n".join((
            "=" * self.line_width,
            report.summary(),
            "End of report".center(self.line_width),
            "=" * self.line_width,
        ))

    def _section_heading(self, title: str) -> str:
        return f"{title}\n{'-' * min(len(title), self.line_width)}"

    def _progress_bar(self, percent: float, width: int = 30) -> str:
        bounded = max(0.0, min(percent, 100.0))
        filled = round(width * bounded / 100.0)
        return "[" + "#" * filled + "." * (width - filled) + "]"

    def _table_header(self, columns: tuple[TableColumn, ...]) -> str:
        return self._table_row(tuple(column.heading for column in columns), columns)

    def _table_rule(self, columns: tuple[TableColumn, ...]) -> str:
        return "-+-".join("-" * column.width for column in columns)

    def _table_row(self, values: tuple[str, ...], columns: tuple[TableColumn, ...]) -> str:
        cells: list[str] = []
        for value, column in zip(values, columns):
            clipped = value[:column.width]
            cells.append(clipped.rjust(column.width) if column.alignment == "right" else clipped.ljust(column.width))
        return " | ".join(cells)


def format_report(report: ClassReport, config: AppConfig | None = None) -> str:
    return TextReportFormatter(config or AppConfig.default()).format(report)
