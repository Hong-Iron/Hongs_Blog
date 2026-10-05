---
layout: "note"
title: "01_function_verify.py"
display_title: "01_function_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/function/"
parent_title: "함수"
description: "대학수학 · 함수 검증 코드"
permalink: "/studies/college-math/code/01_function_verify/"
---
{% raw %}
[함수](/Hongs_Blog/studies/college-math/function/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""함수의 정의와 자연 정의역 검증.

문서: 01.함수 (예시, 카드 C2·C3, 자주 하는 오해)
주장 1: 유한한 대응(순서쌍 목록)이 함수인지는 "정의역의 모든 입력에 출력이 정확히 하나"로 판정한다.
주장 2: f(x) = sqrt(x - 1) / (x - 3)의 자연 정의역은 [1, 3) ∪ (3, ∞)이다.
주장 3: 파이썬은 정의역 밖의 입력을 오류로 알린다 (math.sqrt(-1) -> "math domain error").
주장 4: 같은 식 x^2도 정의역이 다르면 다른 함수다 (일대일 여부가 달라진다).
"""
import math
import random


def is_function(pairs, domain):
    """pairs: (입력, 출력) 목록. domain의 모든 원소에 출력이 정확히 하나면 True."""
    outs = {}
    for x, y in pairs:
        outs.setdefault(x, set()).add(y)
    return all(len(outs.get(x, set())) == 1 for x in domain)


def f(x):
    return math.sqrt(x - 1) / (x - 3)


def defined(x):
    try:
        f(x)
        return True
    except (ValueError, ZeroDivisionError):
        return False


def main():
    # 주장 1: 카드 C2 (a)(b)를 작은 예로
    people = {"민지": "03-14", "도윤": "07-01", "서연": "03-14"}
    birthday = [(p, d) for p, d in people.items()]
    assert is_function(birthday, people)                                   # 사람 -> 생일: 함수
    inverse = [(d, p) for p, d in people.items()]
    assert not is_function(inverse, {"03-14", "07-01", "12-25"})           # 생일 -> 사람: 아님
    # (c) x -> x^2 + y^2 = 1을 만족하는 y: x = 0에서 y = ±1, x = 2에서 없음
    circle = [(0, 1), (0, -1)]
    assert not is_function(circle, {0, 2})
    # (d) 같은 입력에 매번 다른 출력
    g = lambda x: random.random() + x
    assert g(1) != g(1)
    print("[OK] 카드 C2: 사람->생일 함수, 생일->사람·원·random 아님")

    # 주장 2: 자연 정의역 [1, 3) ∪ (3, ∞)
    grid = [i / 100 for i in range(-500, 1001)]
    for x in grid:
        expected = (1 <= x < 3) or (x > 3)
        assert defined(x) == expected, x
    assert defined(1) and not defined(3) and not defined(0.999)
    print("[OK] 카드 C3: 자연 정의역 [1, 3) ∪ (3, ∞) — 격자 1,501점 전수 확인")

    # 주장 3: 정의역 밖 입력의 오류 메시지
    try:
        math.sqrt(-1)
        raise AssertionError
    except ValueError as e:
        assert str(e) in ("math domain error", "expected a nonnegative input, got -1.0"), str(e)
        print(f"[OK] math.sqrt(-1) -> ValueError: {e}")

    # 주장 4: x^2은 실수 전체에서 일대일이 아니고, [0, ∞)에서는 일대일이다
    assert (-2) ** 2 == 2 ** 2
    xs = [i / 10 for i in range(0, 101)]
    assert len({x * x for x in xs}) == len(xs)
    print("[OK] 오해: x^2은 정의역 ℝ에서 f(-2) = f(2), [0, ∞)에서는 서로 다른 입력이 서로 다른 출력")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
