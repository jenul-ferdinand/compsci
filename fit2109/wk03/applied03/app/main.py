import os

from app.io_utils import load_lines
from app.parser import parse_line, count_by_level
from app.report import build_report

DEFAULT_INPUT = "data/server.log"


def main():
    lines = load_lines(DEFAULT_INPUT)
    entries = [parse_line(line) for line in lines if line.strip()]
    summary = count_by_level(entries)
    print(build_report(summary))


if __name__ == "__main__":
    main()
