# TODO: handle malformed lines more carefully


def parse_line(line):
    parts = line.strip().split(maxsplit=2)
    if len(parts) == 3:
        level, code, message = parts
    else:
        return {"level": "UNKNOWN", "code": "NONE", "message": line.strip()}
    return {"level": level, "code": code, "message": message}


def count_by_level(entries):
    counts = {}
    for entry in entries:
        level = entry["level"]
        counts[level] = counts.get(level, 0) + 1
    return counts
