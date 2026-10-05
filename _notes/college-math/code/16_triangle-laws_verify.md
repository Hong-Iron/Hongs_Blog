---
layout: "note"
title: "16_triangle-laws_verify.py"
display_title: "16_triangle-laws_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "16"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/triangle-laws/"
parent_title: "사인 법칙과 코사인 법칙"
description: "대학수학 · 사인 법칙과 코사인 법칙 검증 코드"
permalink: "/studies/college-math/code/16_triangle-laws_verify/"
---
{% raw %}
[사인 법칙과 코사인 법칙](/Hongs_Blog/studies/college-math/triangle-laws/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""사인 법칙과 코사인 법칙 검증.

문서: 16.사인 법칙과 코사인 법칙 (예시, 정리, 증명, 예제, 카드 C1~C3)
주장 1: 무작위 삼각형에서 c² = a² + b² - 2ab cos C, a/sin A = b/sin B = c/sin C, 넓이 = ½ab sin C.
주장 2: 두 변 5, 8과 끼인각 60°이면 셋째 변은 7이다.
주장 3: 기선 10 m 양 끝에서 목표까지의 각이 60°, 70°이면 첫째 끝에서 목표까지 10 sin 70° / sin 50° ≈ 12.27 m.
주장 4: a = 6, b = 8, A = 30°이면 B ≈ 41.81° 또는 138.19°로 삼각형이 둘이다.
주장 5: C = 90°이면 코사인 법칙이 피타고라스 정리가 된다.
"""
import math
import random


def angle(opposite, s1, s2):
    return math.acos((s1 * s1 + s2 * s2 - opposite * opposite) / (2 * s1 * s2))


def main():
    rng = random.Random(16)
    for _ in range(5000):
        P = [(rng.uniform(-10, 10), rng.uniform(-10, 10)) for _ in range(3)]
        a, b, c = math.dist(P[1], P[2]), math.dist(P[0], P[2]), math.dist(P[0], P[1])
        area = abs((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1])) / 2
        if area < 1e-3:
            continue
        # 각은 좌표에서 벡터로 직접 잰다 (코사인 법칙을 쓰지 않고)
        def ang(Q, R1, R2):
            v1 = (R1[0] - Q[0], R1[1] - Q[1]); v2 = (R2[0] - Q[0], R2[1] - Q[1])
            return abs(math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1[0] * v2[0] + v1[1] * v2[1]))
        A, B, C = ang(P[0], P[1], P[2]), ang(P[1], P[0], P[2]), ang(P[2], P[0], P[1])
        assert math.isclose(A + B + C, math.pi)
        assert math.isclose(c * c, a * a + b * b - 2 * a * b * math.cos(C), rel_tol=1e-9, abs_tol=1e-9)
        assert math.isclose(a / math.sin(A), b / math.sin(B), rel_tol=1e-7) and math.isclose(b / math.sin(B), c / math.sin(C), rel_tol=1e-7)
        assert math.isclose(area, 0.5 * a * b * math.sin(C), rel_tol=1e-9)
    print("[OK] 주장 1: 무작위 삼각형 5,000개 (각은 좌표에서 직접 측정)")

    c = math.sqrt(25 + 64 - 2 * 5 * 8 * math.cos(math.radians(60)))
    assert math.isclose(c, 7)
    area = 0.5 * 5 * 8 * math.sin(math.radians(60))
    assert math.isclose(area, 10 * math.sqrt(3)) and f"{area:.2f}" == "17.32"
    print("[OK] 주장 2·카드 C1: 5, 8, 60° -> 7, 넓이 10√3 ≈ 17.32")

    d = 10 * math.sin(math.radians(70)) / math.sin(math.radians(50))
    assert f"{d:.2f}" == "12.27"
    print(f"[OK] 주장 3: 삼각측량 {d:.3f} m")

    sB = 8 * math.sin(math.radians(30)) / 6
    B1 = math.degrees(math.asin(sB)); B2 = 180 - B1
    assert f"{B1:.2f}" == "41.81" and f"{B2:.2f}" == "138.19" and 30 + B2 < 180
    assert f"{180 - 30 - B1:.2f}" == "108.19" and f"{180 - 30 - B2:.2f}" == "11.81"
    for B in (B1, B2):
        Cc = 180 - 30 - B
        cc = 6 * math.sin(math.radians(Cc)) / math.sin(math.radians(30))
        assert math.isclose(math.degrees(angle(6, 8, cc)), 30)
    print(f"[OK] 주장 4·카드 C3: B = {B1:.2f}° 또는 {B2:.2f}°, 두 삼각형 모두 A = 30°")

    for _ in range(100):
        a, b = rng.uniform(1, 10), rng.uniform(1, 10)
        assert math.isclose(a * a + b * b - 2 * a * b * math.cos(math.pi / 2), a * a + b * b)
    print("[OK] 주장 5: C = 90°이면 보정항 0")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
