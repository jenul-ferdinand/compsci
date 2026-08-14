from services.grading import grade_for_mark, is_borderline


def test_grade_for_mark() -> None:
    assert grade_for_mark(85) == "HD"
    assert grade_for_mark(45) == "N"


def test_is_borderline() -> None:
    assert is_borderline(49)
    assert not is_borderline(70)
