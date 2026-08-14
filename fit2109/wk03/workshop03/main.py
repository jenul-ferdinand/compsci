"""Command-line entry point for the Student Report System."""
from app.cli import run_application


def main() -> int:
    """Start the application and return a process exit code."""
    return run_application()


if __name__ == "__main__":
    raise SystemExit(main())
