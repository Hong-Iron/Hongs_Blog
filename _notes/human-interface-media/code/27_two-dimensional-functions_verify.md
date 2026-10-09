---
layout: "note"
title: "27_two-dimensional-functions_verify.py"
display_title: "27_two-dimensional-functions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "27"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/two-dimensional-functions/"
parent_title: "2차원 함수"
description: "휴먼 인터페이스 미디어 · 2차원 함수 검증 코드"
permalink: "/studies/human-interface-media/code/27_two-dimensional-functions_verify/"
---
{% raw %}
[2차원 함수](/Hongs_Blog/studies/human-interface-media/two-dimensional-functions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""2차원 함수 검증.

문서: 27.2차원 함수 (정의, 원본 오류 의심, 자주 하는 오해, 카드 C2·C3)
주장:
  1. 2차원 사각 함수는 분리된다: rect(x/a, y/b) = rect(x/a) rect(y/b).
     경계값까지: |x| = a/2, |y| < b/2이면 1/2, 모서리 |x| = a/2, |y| = b/2이면 1/4.
  2. 원판 함수는 x와 y로 분리되지 않는다(반지름 1에서 (0.8, 0.8)이 반례).
     극좌표로는 r 하나만의 함수다.
  3. 극좌표 θ = arctan(y/x)는 (1, 1)과 (-1, -1)을 같은 각으로 보낸다. 사분면까지 가리려면 atan2를 쓴다.
  4. 상관이 0이어도 독립이 아니다: X가 -1, 0, 1을 같은 확률로 갖고 Y = X²이면 공분산 0이지만
     Y는 X로 완전히 정해진다.
  5. 내적이 0인 두 벡터(직교)의 예: (1, 2)와 (2, -1).
"""
import math
from fractions import Fraction as Fr


def rect1(u):
    au = abs(u)
    return 1.0 if au < 0.5 else (0.5 if au == 0.5 else 0.0)


def rect2(x, y, a, b):
    ax, ay = abs(x) / a, abs(y) / b
    if ax < 0.5 and ay < 0.5:
        return 1.0
    if ax > 0.5 or ay > 0.5:
        return 0.0
    if ax == 0.5 and ay == 0.5:
        return 0.25
    return 0.5


def disk(x, y, R=1.0):
    return 1.0 if math.hypot(x, y) <= R else 0.0


def main() -> None:
    a, b = 2.0, 4.0
    pts = [(-1.5, 0), (0, 0), (0.9, 1.9), (1.0, 0.5), (0.5, 2.0), (1.0, 2.0), (1.1, 0), (0, 2.1)]
    for x, y in pts:
        assert rect2(x, y, a, b) == rect1(x / a) * rect1(y / b)
    assert rect2(1.0, 0.0, a, b) == 0.5 and rect2(1.0, 2.0, a, b) == 0.25
    # 2. 원판은 분리 불가: 분리된다면 f(.8,.8) = f(.8,0) f(0,.8) / f(0,0) = 1
    f = disk
    assert f(0.8, 0) == 1 and f(0, 0.8) == 1 and f(0, 0) == 1
    assert f(0.8, 0) * f(0, 0.8) / f(0, 0) == 1 and f(0.8, 0.8) == 0
    for th in [0.0, 1.0, 2.5]:
        r = 0.9
        assert f(r * math.cos(th), r * math.sin(th)) == 1
    # 3. arctan과 atan2
    assert math.atan(1 / 1) == math.atan(-1 / -1)
    assert abs(math.atan2(1, 1) - math.pi / 4) < 1e-12 and abs(math.atan2(-1, -1) + 3 * math.pi / 4) < 1e-12
    # 4. 상관 0이지만 종속
    xs = [-1, 0, 1]
    ex = Fr(sum(xs), 3)
    ey = Fr(sum(v * v for v in xs), 3)
    exy = Fr(sum(v * v * v for v in xs), 3)
    assert exy - ex * ey == 0
    assert Fr(1, 3) != Fr(1, 3) * Fr(1, 3)   # P(X=0, Y=0) = 1/3 ≠ P(X=0) P(Y=0) = 1/9 → 종속
    # 5. 직교
    assert 1 * 2 + 2 * (-1) == 0
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
