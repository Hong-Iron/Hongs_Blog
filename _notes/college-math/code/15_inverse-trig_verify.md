---
layout: "note"
title: "15_inverse-trig_verify.py"
display_title: "15_inverse-trig_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/inverse-trig/"
parent_title: "역삼각함수"
description: "대학수학 · 역삼각함수 검증 코드"
permalink: "/studies/college-math/code/15_inverse-trig_verify/"
---
{% raw %}
[역삼각함수](/Hongs_Blog/studies/college-math/inverse-trig/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""역삼각함수 검증.

문서: 15.역삼각함수 (예시, 정의, 예제, 활용, 카드 C1~C3, 자주 하는 오해)
주장 1: arcsin: [-1, 1] -> [-π/2, π/2], arccos: [-1, 1] -> [0, π], arctan: ℝ -> (-π/2, π/2).
주장 2: sin θ = 1/2의 [0, 2π) 해는 π/6, 5π/6이고 arcsin(1/2)는 π/6 하나만 돌려준다.
주장 3: 점 (-1, -1)의 방향은 atan2(-1, -1) = -3π/4이고, arctan(y/x) = π/4는 반대 방향이다.
주장 4: arcsin x + arccos x = π/2, sin(arccos x) = √(1 - x²).
주장 5: arcsin(sin(2π/3)) = π/3 ≠ 2π/3.
주장 6: 부동소수점 코사인 유사도가 1을 조금 넘으면 math.acos가 ValueError를 낸다. [-1, 1]로 잘라서 쓴다.
"""
import math
import random


def main():
    rng = random.Random(15)
    for _ in range(10000):
        x = rng.uniform(-1, 1)
        assert -math.pi / 2 <= math.asin(x) <= math.pi / 2 and 0 <= math.acos(x) <= math.pi
        assert math.isclose(math.sin(math.asin(x)), x, abs_tol=1e-12)
        assert math.isclose(math.asin(x) + math.acos(x), math.pi / 2)
        assert math.isclose(math.sin(math.acos(x)), math.sqrt(1 - x * x), abs_tol=1e-12)
        y = rng.uniform(-1e6, 1e6)
        assert -math.pi / 2 < math.atan(y) < math.pi / 2
    print("[OK] 주장 1·4: 치역, 되돌리기, arcsin + arccos = π/2, sin(arccos x) = √(1-x²)")

    sols = [t for t in (math.pi / 6, 5 * math.pi / 6) if math.isclose(math.sin(t), 0.5)]
    grid = [k * 2 * math.pi / 720000 for k in range(720000)]
    near = [t for t in grid if abs(math.sin(t) - 0.5) < 1e-5]
    assert len(sols) == 2 and all(min(abs(t - s) for s in sols) < 1e-4 for t in near)
    assert math.isclose(math.asin(0.5), math.pi / 6)
    print("[OK] 카드 C2: [0, 2π)의 해 π/6, 5π/6 뿐, arcsin(1/2) = π/6")

    assert math.isclose(math.atan2(-1, -1), -3 * math.pi / 4) and math.isclose(math.atan(-1 / -1), math.pi / 4)
    print("[OK] 카드 C3: atan2(-1, -1) = -3π/4, arctan(1) = π/4")

    assert math.isclose(math.asin(math.sin(2 * math.pi / 3)), math.pi / 3)
    print("[OK] 오해: arcsin(sin 2π/3) = π/3")

    u, v = (-0.4, 0.5, 0.2), (-0.4, 0.5, 0.2)
    cos_sim = sum(a * b for a, b in zip(u, v)) / (math.sqrt(sum(a * a for a in u)) * math.sqrt(sum(b * b for b in v)))
    assert cos_sim > 1  # 1.0000000000000002
    try:
        math.acos(cos_sim)
        raise AssertionError
    except ValueError:
        pass
    assert math.acos(max(-1.0, min(1.0, cos_sim))) == 0.0
    print(f"[OK] 주장 6: 같은 벡터의 코사인 유사도 {cos_sim!r} -> acos 오류, 잘라 쓰면 0")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
