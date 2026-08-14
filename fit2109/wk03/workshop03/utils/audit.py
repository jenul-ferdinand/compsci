"""Small audit logger used to demonstrate cross-module references."""
from __future__ import annotations

from datetime import datetime
from pathlib import Path


def write_audit_event(path: Path, event: str, details: str = "") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().isoformat(timespec="seconds")
    line = f"{timestamp}\t{event}\t{details}\n"
    with path.open("a", encoding="utf-8") as handle:
        handle.write(line)


def read_recent_events(path: Path, limit: int = 10) -> list[str]:
    if not path.exists():
        return []
    lines = path.read_text(encoding="utf-8").splitlines()
    return lines[-limit:]
