# Student Report System — VS Code Teaching Project

A deliberately expanded Python project for teaching code navigation and editor features in VS Code. The application reads student assessment data from CSV, validates it, calculates statistics and grades, identifies students at risk, formats a detailed report, saves it safely, and records audit events.

## Why this version is useful for teaching

The project contains **more than 1,300 lines of Python** and several long, structured modules:

- `services/report_formatter.py` — about 280 lines; ideal for **Sticky Scroll**, minimap, folding, and Outline.
- `services/validation.py` — many related validation functions; useful for Outline and Find All References.
- `services/csv_loader.py` — a multi-stage data-loading pipeline; useful for tracing calls.
- `services/statistics.py` — reusable calculations referenced from several modules.
- `services/report_service.py` — shows how an entry point connects to helper services.

The code is still readable by early-stage computer science students and uses only the Python standard library.

## Run the project

```bash
python main.py
```

Useful alternatives:

```bash
python main.py --preview
python main.py --show-config
python main.py --audit
python -m pytest
```

## Suggested VS Code demonstrations

1. **Quick Open:** open `report_formatter.py` without using Explorer.
2. **Sticky Scroll:** scroll through `TextReportFormatter` and observe the class and method context remaining visible.
3. **Minimap:** use the minimap to jump between the formatter's major report sections.
4. **Outline:** jump directly to `_format_risk_summary()` or `_format_student_details()`.
5. **Breadcrumbs:** move between the file, class, and current method.
6. **Go to Definition:** start at `run_application()`, then follow `ReportService.generate()`, `load_students()`, `ReportBuilder.build()`, and `TextReportFormatter.format()`.
7. **Find All References:** locate every use of `calculate_average()`, `write_audit_event()`, or `AppConfig`.
8. **Search Across Workspace:** search for `TODO`, `risk`, `attendance`, or `report.warnings`.
9. **Split Editor:** compare `report_builder.py` with `report_formatter.py` or `student.py` with `risk_analysis.py`.
10. **Peek Definition:** preview `grade_student()` without leaving the current file.
11. **Rename Symbol:** safely rename a helper such as `recommended_action` and inspect the proposed changes.
12. **Call hierarchy:** inspect callers of `format_report()` or `load_students()` where supported.

## Project structure

```text
student_report_system/
├── main.py
├── app/
│   ├── cli.py
│   └── config.py
├── models/
│   ├── report.py
│   └── student.py
├── services/
│   ├── csv_loader.py
│   ├── grading.py
│   ├── report_builder.py
│   ├── report_formatter.py
│   ├── report_service.py
│   ├── risk_analysis.py
│   ├── statistics.py
│   └── validation.py
├── utils/
│   ├── audit.py
│   ├── errors.py
│   └── file_writer.py
├── data/
└── tests/
```

## Suggested tracing scenario

A lecturer notices that the generated report has an incorrect class average. Students should begin at `main.py`, trace the application into `ReportService`, follow report construction into `ReportBuilder`, and locate the statistical calculation in `services/statistics.py`. They can then use Find All References to see everywhere `calculate_average()` is used.
