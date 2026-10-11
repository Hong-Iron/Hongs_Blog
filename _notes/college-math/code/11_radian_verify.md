---
layout: "note"
title: "11_radian_verify.py"
display_title: "11_radian_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/radian/"
parent_title: "각과 라디안"
description: "대학수학 · 각과 라디안 검증 코드"
permalink: "/studies/college-math/code/11_radian_verify/"
---
{% raw %}
[각과 라디안](/Hongs_Blog/studies/college-math/radian/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""각과 라디안 검증.

문서: 11.각과 라디안 (예시, 정의, 예제, 활용, 카드 C1~C3, 자주 하는 오해)
주장 1: 1 rad = 180/π ° ≈ 57.2958°, 30°·45°·60°·90°·180°·360° = π/6·π/4·π/3·π/2·π·2π.
주장 2: 호의 길이 s = rθ, 부채꼴 넓이 A = r²θ/2 (θ는 라디안). 원 전체에서 2πr, πr².
주장 3: 7200 rpm 원판에서 반지름 4 cm 지점은 ω ≈ 753.98 rad/s, v ≈ 30.16 m/s.
주장 4: 파이썬 %는 양수 법에 대해 늘 0 이상을 돌려주므로 θ % (2π)가 [0, 2π)로 맞춘다. C의 fmod는 부호를 유지한다.
주장 5: math.sin(30) ≈ -0.988 (30 라디안), sin 30° = 0.5.
"""
import math


def main():
    assert f"{math.degrees(1):.4f}" == "57.2958"
    for deg, rad in ((30, math.pi / 6), (45, math.pi / 4), (60, math.pi / 3), (90, math.pi / 2), (180, math.pi), (360, 2 * math.pi)):
        assert math.isclose(math.radians(deg), rad)
    print("[OK] 주장 1: 1 rad = 57.2958°, 특수각 변환")

    r = 2.0
    assert math.isclose(r * 1.0, 2.0)                      # 예시: 반지름 2, 호 2 -> 1 rad
    for rr in (0.5, 1, 3, 10):
        assert math.isclose(rr * 2 * math.pi, 2 * math.pi * rr)
        assert math.isclose(rr ** 2 * 2 * math.pi / 2, math.pi * rr ** 2)
    # 호 길이를 잘게 쪼갠 선분 합과 비교 (실험)
    theta, n = 1.3, 100_000
    pts = [(r * math.cos(theta * k / n), r * math.sin(theta * k / n)) for k in range(n + 1)]
    polyline = sum(math.dist(pts[k], pts[k + 1]) for k in range(n))
    assert math.isclose(polyline, r * theta, rel_tol=1e-9)
    print(f"[OK] 주장 2: s = rθ (선분 10만 개 합 {polyline:.9f} vs {r*theta}), 원 전체 2πr·πr²")

    w = 7200 * 2 * math.pi / 60
    v = 0.04 * w
    assert f"{w:.2f}" == "753.98" and f"{v:.2f}" == "30.16"
    print(f"[OK] 주장 3: ω = {w:.2f} rad/s, v = {v:.2f} m/s")

    t = -math.pi / 3
    wrapped = t % (2 * math.pi)
    assert math.isclose(wrapped, 5 * math.pi / 3) and math.fmod(t, 2 * math.pi) < 0
    assert math.isclose(math.cos(t), math.cos(wrapped)) and math.isclose(math.sin(t), math.sin(wrapped))
    print(f"[OK] 주장 4·카드 C3: -π/3 % 2π = {wrapped:.4f} = 5π/3, fmod는 {math.fmod(t, 2*math.pi):.4f}")

    assert f"{math.sin(30):.3f}" == "-0.988" and math.isclose(math.sin(math.radians(30)), 0.5)
    print(f"[OK] 오해: math.sin(30) = {math.sin(30):.4f}, sin 30° = 0.5")

    # 카드 C2
    assert math.isclose(math.radians(150), 5 * math.pi / 6) and f"{math.degrees(3):.1f}" == "171.9" and math.isclose(5 * 0.8, 4)
    print("[OK] 카드 C2: 150° = 5π/6, 3 rad = 171.9°, r = 5·θ = 0.8 -> 호 4")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
