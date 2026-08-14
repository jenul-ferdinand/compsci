class ReportError(Exception):
    """Base error for report generation."""


class DataLoadError(ReportError):
    """Raised when input data cannot be loaded."""


class ValidationError(ReportError):
    """Raised when input data is invalid."""


class ReportWriteError(ReportError):
    """Raised when a generated report cannot be written."""
