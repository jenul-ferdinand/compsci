"""Command-line interface for the Student Report System."""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from app.config import AppConfig
from services.report_service import ReportService
from utils.audit import read_recent_events
from utils.errors import ReportError


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="student-report",
        description="Generate a detailed class-performance report from CSV data.",
    )
    parser.add_argument("--input", type=Path, help="CSV input file")
    parser.add_argument("--output", type=Path, help="text report destination")
    parser.add_argument("--preview", action="store_true", help="print the report without saving it")
    parser.add_argument("--show-config", action="store_true", help="display active configuration")
    parser.add_argument("--audit", action="store_true", help="display recent audit events")
    return parser


def run_application(argv: list[str] | None = None) -> int:
    parser = build_parser()
    arguments = parser.parse_args(argv)
    config = AppConfig.from_environment(os.environ)
    if arguments.show_config:
        _print_configuration(config)
        return 0
    if arguments.audit:
        _print_audit_events(config)
        return 0
    service = ReportService(config)
    try:
        if arguments.preview:
            print(service.preview(arguments.input))
            return 0
        result = service.generate(arguments.input, arguments.output)
    except ReportError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    print(result.message)
    print(result.load_result.summary())
    print(f"Report written to: {result.output_path}")
    return 0


def _print_configuration(config: AppConfig) -> None:
    print("Active configuration")
    print("--------------------")
    for line in config.describe():
        print(line)


def _print_audit_events(config: AppConfig) -> None:
    events = read_recent_events(config.audit_file, limit=15)
    print("Recent audit events")
    print("-------------------")
    if not events:
        print("No audit events have been recorded.")
        return
    for event in events:
        print(event)
