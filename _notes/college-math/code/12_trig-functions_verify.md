---
layout: "note"
title: "12_trig-functions_verify.py"
display_title: "12_trig-functions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/trig-functions/"
parent_title: "삼각함수"
description: "대학수학 · 삼각함수 검증 코드"
permalink: "/studies/college-math/code/12_trig-functions_verify/"
---
{% raw %}
[삼각함수](/Hongs_Blog/studies/college-math/trig-functions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""삼각함수 검증.

문서: 12.삼각함수 (예시, 정의, 증명, 예제, 활용, 카드 C1~C4, 자주 하는 오해)
주장 1: 특수각의 값 sin(π/6) = 1/2, cos(π/6) = √3/2, sin(π/4) = cos(π/4) = √2/2, sin(π/3) = √3/2.
주장 2: 모든 θ에서 sin²θ + cos²θ = 1, sin(-θ) = -sin θ, cos(-θ) = cos θ, 주기 2π (tan은 π).
주장 3: 직각삼각형 정의(높이/빗변)와 단위원 정의가 예각에서 같다 (닮음).
주장 4: 예제 sin(5π/6) = 1/2, cos(5π/6) = -√3/2, sin(7π/4) = -√2/2, tan(2π/3) = -√3, sin 120° = √3/2.
주장 5: math.sin(math.pi)는 0이 아니라 약 1.22e-16이다.
주장 6: 카드 C3 — θ가 π/2에서 π로 갈 때 sin은 1 -> 0으로 줄고 cos은 0 -> -1로 준다.
"""
import math
import random


def main():
    s3 = math.sqrt(3)
    assert math.isclose(math.sin(math.pi / 6), 0.5) and math.isclose(math.cos(math.pi / 6), s3 / 2)
    assert math.isclose(math.sin(math.pi / 4), math.sqrt(2) / 2) and math.isclose(math.cos(math.pi / 4), math.sqrt(2) / 2)
    assert math.isclose(math.sin(math.pi / 3), s3 / 2) and math.isclose(math.cos(math.pi / 3), 0.5)
    print("[OK] 주장 1: 특수각")

    rng = random.Random(12)
    for _ in range(20000):
        t = rng.uniform(-100, 100)
        assert math.isclose(math.sin(t) ** 2 + math.cos(t) ** 2, 1, rel_tol=1e-12)
        assert math.isclose(math.sin(-t), -math.sin(t), abs_tol=1e-12) and math.isclose(math.cos(-t), math.cos(t), abs_tol=1e-12)
        assert math.isclose(math.sin(t + 2 * math.pi), math.sin(t), abs_tol=1e-9)
        if abs(math.cos(t)) > 1e-3:
            assert math.isclose(math.tan(t + math.pi), math.tan(t), rel_tol=1e-6, abs_tol=1e-9)
    print("[OK] 주장 2: 무작위 2만 각에서 항등식·대칭·주기 (부동소수점 오차 이내)")

    for _ in range(1000):
        t = rng.uniform(0.01, math.pi / 2 - 0.01)
        hyp = rng.uniform(0.1, 50)
        opp, adj = hyp * math.sin(t), hyp * math.cos(t)
        assert math.isclose(math.hypot(opp, adj), hyp) and math.isclose(opp / hyp, math.sin(t)) and math.isclose(math.atan2(opp, adj), t)
    print("[OK] 주장 3: 빗변을 늘려도 높이/빗변은 같은 값 (닮음)")

    assert math.isclose(math.sin(5 * math.pi / 6), 0.5) and math.isclose(math.cos(5 * math.pi / 6), -s3 / 2)
    assert math.isclose(math.sin(7 * math.pi / 4), -math.sqrt(2) / 2) and math.isclose(math.tan(2 * math.pi / 3), -s3)
    assert math.isclose(math.sin(math.radians(120)), s3 / 2)
    print("[OK] 주장 4·카드 C2: 예제 값")

    assert math.sin(math.pi) != 0 and f"{math.sin(math.pi):.2e}" == "1.22e-16"
    print(f"[OK] 주장 5: math.sin(math.pi) = {math.sin(math.pi):.3e}")

    ts = [math.pi / 2 + k * (math.pi / 2) / 100 for k in range(101)]
    sins, coss = [math.sin(t) for t in ts], [math.cos(t) for t in ts]
    assert all(a > b for a, b in zip(sins, sins[1:])) and all(a > b for a, b in zip(coss, coss[1:]))
    assert math.isclose(sins[0], 1) and abs(sins[-1]) < 1e-12 and abs(coss[0]) < 1e-12 and math.isclose(coss[-1], -1)
    print("[OK] 카드 C3: π/2 -> π에서 sin 1 -> 0, cos 0 -> -1, 둘 다 감소")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
