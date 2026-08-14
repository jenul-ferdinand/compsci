"""Safe file-writing utilities."""
from __future__ import annotations

import os
import tempfile
from pathlib import Path

from utils.errors import ReportWriteError


def save_text(path: Path, content: str, encoding: str = "utf-8") -> None:
    """Write text atomically by replacing the destination with a temporary file."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_name: str | None = None
    try:
        with tempfile.NamedTemporaryFile("w", encoding=encoding, dir=path.parent, delete=False) as handle:
            temporary_name = handle.name
            handle.write(content)
            handle.flush()
            os.fsync(handle.fileno())
        Path(temporary_name).replace(path)
    except OSError as exc:
        if temporary_name:
            Path(temporary_name).unlink(missing_ok=True)
        raise ReportWriteError(f"Could not write report to {path}: {exc}") from exc


def append_text(path: Path, content: str, encoding: str = "utf-8") -> None:
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding=encoding) as handle:
            handle.write(content)
    except OSError as exc:
        raise ReportWriteError(f"Could not append to {path}: {exc}") from exc
