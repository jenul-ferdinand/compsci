from app.parser import parse_line


def test_parse_line():
    entry = parse_line("ERROR 404 Page not found")
    assert entry["level"] == "ERROR"
    assert entry["code"] == "404"
