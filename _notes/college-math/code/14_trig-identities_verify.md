---
layout: "note"
title: "14_trig-identities_verify.py"
display_title: "14_trig-identities_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/trig-identities/"
parent_title: "삼각함수 항등식"
description: "대학수학 · 삼각함수 항등식 검증 코드"
permalink: "/studies/college-math/code/14_trig-identities_verify/"
---
{% raw %}
[삼각함수 항등식](/Hongs_Blog/studies/college-math/trig-identities/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""삼각함수 항등식 검증.

문서: 14.삼각함수 항등식 (예시, 정리, 증명, 예제, 카드 C1~C4, 자주 하는 오해)
      4.연습문제/14.삼각함수 항등식 예제 사다리 (문제 1~4와 변형)
방법: 항등식은 증명이 문서에 있다. 여기서는 무작위 각 2만 개에서 양변의 차가 1e-9 이내인지(실험),
      특수값은 정확한 값과 비교한다.
주장 1: 덧셈정리, tan 덧셈정리, 배각, 반각(차수 내림), 곱->합, 합성 공식.
주장 2: 증명의 핵심 — 두 단위원 점 사이 거리 제곱은 2 - 2cos(α - β)이다.
주장 3: cos 75° = (√6 - √2)/4 ≈ 0.2588.
주장 4: sin²x의 한 주기 평균은 1/2이다 (교류의 실효값 A/√2).
주장 5: cos(2π·64000t)·cos(2π·1000t) = ½[cos(2π·63000t) + cos(2π·65000t)].
주장 6: sin x + √3 cos x = 2 sin(x + π/3).
주장 7: sin(α + β) ≠ sin α + sin β (α = β = π/2에서 0 vs 2).
사다리: (sinθ+cosθ)² = 1 + sin2θ, cos⁴θ - sin⁴θ = cos2θ, tanθ + 1/tanθ = 2/sin2θ, sin3θ = 3sinθ - 4sin³θ, cos3θ = 4cos³θ - 3cosθ.
"""
import math
import random

S, C, T = math.sin, math.cos, math.tan


def close(a, b):
    return math.isclose(a, b, rel_tol=1e-9, abs_tol=1e-9)


def main():
    rng = random.Random(14)
    for _ in range(20000):
        a, b = rng.uniform(-10, 10), rng.uniform(-10, 10)
        assert close(S(a + b), S(a) * C(b) + C(a) * S(b)) and close(S(a - b), S(a) * C(b) - C(a) * S(b))
        assert close(C(a + b), C(a) * C(b) - S(a) * S(b)) and close(C(a - b), C(a) * C(b) + S(a) * S(b))
        if abs(1 - T(a) * T(b)) > 1e-3 and abs(C(a)) > 1e-3 and abs(C(b)) > 1e-3 and abs(C(a + b)) > 1e-3:
            assert math.isclose(T(a + b), (T(a) + T(b)) / (1 - T(a) * T(b)), rel_tol=1e-6, abs_tol=1e-6)
        assert close(S(2 * a), 2 * S(a) * C(a))
        assert close(C(2 * a), C(a) ** 2 - S(a) ** 2) and close(C(2 * a), 2 * C(a) ** 2 - 1) and close(C(2 * a), 1 - 2 * S(a) ** 2)
        assert close(S(a) ** 2, (1 - C(2 * a)) / 2) and close(C(a) ** 2, (1 + C(2 * a)) / 2)
        assert close(S(a) * S(b), (C(a - b) - C(a + b)) / 2) and close(C(a) * C(b), (C(a - b) + C(a + b)) / 2)
        assert close(S(a) * C(b), (S(a + b) + S(a - b)) / 2)
        assert close(S(a) + S(b), 2 * S((a + b) / 2) * C((a - b) / 2))
        pa = (C(a), S(a)); pb = (C(b), S(b))
        assert close(math.dist(pa, pb) ** 2, 2 - 2 * C(a - b))
        assert close(math.dist(pa, pb), math.dist((C(a - b), S(a - b)), (1, 0)))
    print("[OK] 주장 1·2: 덧셈정리·배각·반각·곱->합·합->곱, 거리 불변 — 무작위 2만 쌍")

    assert close(C(math.radians(75)), (math.sqrt(6) - math.sqrt(2)) / 4) and f"{C(math.radians(75)):.4f}" == "0.2588"
    print("[OK] 주장 3·카드 C3: cos 75° = (√6-√2)/4 ≈ 0.2588")

    n = 100000
    avg = sum(S(2 * math.pi * k / n) ** 2 for k in range(n)) / n
    assert close(avg, 0.5)
    print(f"[OK] 주장 4: sin² 한 주기 평균 {avg:.6f}")

    for k in range(3000):
        t = k * 1.3e-6
        lhs = C(2 * math.pi * 64000 * t) * C(2 * math.pi * 1000 * t)
        rhs = 0.5 * (C(2 * math.pi * 63000 * t) + C(2 * math.pi * 65000 * t))
        assert close(lhs, rhs)
    print("[OK] 주장 5·카드 C4: 64 kHz × 1 kHz = 63 kHz + 65 kHz 성분")

    for _ in range(2000):
        x = rng.uniform(-10, 10)
        assert close(S(x) + math.sqrt(3) * C(x), 2 * S(x + math.pi / 3))
    print("[OK] 주장 6: sin x + √3 cos x = 2 sin(x + π/3)")

    assert close(S(math.pi), 0) and S(math.pi / 2) + S(math.pi / 2) == 2
    print("[OK] 오해: sin(π/2 + π/2) = 0 ≠ 2")

    for _ in range(20000):
        t = rng.uniform(-10, 10)
        assert close((S(t) + C(t)) ** 2, 1 + S(2 * t))
        assert close(C(t) ** 4 - S(t) ** 4, C(2 * t))
        if abs(S(2 * t)) > 1e-3:
            assert math.isclose(T(t) + 1 / T(t), 2 / S(2 * t), rel_tol=1e-7)
        assert close(S(3 * t), 3 * S(t) - 4 * S(t) ** 3) and close(C(3 * t), 4 * C(t) ** 3 - 3 * C(t))
    assert close(3 * 0.5 - 4 * 0.125, 1.0)
    print("[OK] 사다리 문제 1~4와 변형: 무작위 2만 각, sin(π/2) 확인 1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
