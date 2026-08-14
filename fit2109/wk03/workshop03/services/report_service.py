"""Application service orchestrating the complete report-generation workflow."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from app.config import AppConfig
from models.report import ClassReport
from services.csv_loader import LoadResult, load_students
from services.report_builder import ReportBuilder
from services.report_formatter import TextReportFormatter
from utils.audit import write_audit_event
from utils.file_writer import save_text


@dataclass(frozen=True)
class GenerationResult:
    report: ClassReport
    load_result: LoadResult
    output_path: Path

    @property
    def message(self) -> str:
        return f"Generated {self.output_path.name} for {len(self.report.students)} students"


class ReportService:
    """Facade used by the CLI, tests, and potential future user interfaces."""

    def __init__(self, config: AppConfig) -> None:
        self.config = config
        self.builder = ReportBuilder(config)
        self.formatter = TextReportFormatter(config)

    def generate(self, input_path: Path | None = None, output_path: Path | None = None) -> GenerationResult:
        source = input_path or self.config.input_file
        destination = output_path or self.config.output_file
        write_audit_event(self.config.audit_file, "generation_started", str(source))
        load_result = self._load(source)
        report = self._build(load_result, source)
        text = self._format(report)
        self._save(destination, text)
        write_audit_event(
            self.config.audit_file,
            "generation_completed",
            f"students={len(report.students)}; output={destination}",
        )
        return GenerationResult(report, load_result, destination)

    def preview(self, input_path: Path | None = None) -> str:
        source = input_path or self.config.input_file
        load_result = self._load(source)
        report = self._build(load_result, source)
        return self._format(report)

    def _load(self, source: Path) -> LoadResult:
        result = load_students(source, self.config)
        write_audit_event(
            self.config.audit_file,
            "data_loaded",
            f"rows={result.rows_read}; valid={len(result.students)}; issues={len(result.issues)}",
        )
        return result

    def _build(self, load_result: LoadResult, source: Path) -> ClassReport:
        warning_messages = [str(issue) for issue in load_result.issues]
        report = self.builder.build(load_result.students, source, warning_messages)
        write_audit_event(self.config.audit_file, "report_built", report.summary())
        return report

    def _format(self, report: ClassReport) -> str:
        text = self.formatter.format(report)
        write_audit_event(self.config.audit_file, "report_formatted", f"characters={len(text)}")
        return text

    def _save(self, destination: Path, text: str) -> None:
        save_text(destination, text, self.config.encoding)
        write_audit_event(self.config.audit_file, "report_saved", str(destination))


def generate_class_report(config: AppConfig | None = None) -> GenerationResult:
    return ReportService(config or AppConfig.default()).generate()
