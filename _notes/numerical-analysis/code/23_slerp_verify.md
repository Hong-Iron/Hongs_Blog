---
layout: "note"
title: "23_slerp_verify.py"
display_title: "23_slerp_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "23"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/slerp/"
parent_title: "구면 선형 보간"
description: "수치해석 · 구면 선형 보간 검증 코드"
permalink: "/studies/numerical-analysis/code/23_slerp_verify/"
---
{% raw %}
[구면 선형 보간](/Hongs_Blog/studies/numerical-analysis/slerp/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형 보간과 구면 선형 보간 문서의 주장 검증."""
import math, random


def lerp(a, b, t):
    return [(1 - t) * x + t * y for x, y in zip(a, b)]


def norm(v):
    return math.sqrt(sum(x * x for x in v))


def nlerp(a, b, t):
    v = lerp(a, b, t); n = norm(v); return [x / n for x in v]


def slerp(a, b, t):
    th = math.acos(max(-1.0, min(1.0, sum(x * y for x, y in zip(a, b)))))
    s = math.sin(th)
    return [math.sin(th * (1 - t)) / s * x + math.sin(th * t) / s * y for x, y in zip(a, b)]


def angle(a, b):
    return math.acos(max(-1.0, min(1.0, sum(x * y for x, y in zip(a, b)) / (norm(a) * norm(b)))))


def main():
    q1, q2 = [1.0, 0.0], [0.0, 1.0]                       # 90° 떨어진 두 단위 벡터
    # lerp는 길이가 줄어든다(가운데에서 1/√2)
    assert abs(norm(lerp(q1, q2, 0.5)) - 1 / math.sqrt(2)) < 1e-12
    # 정규화한 lerp는 각이 고르게 늘지 않는다
    angs = [angle(q1, nlerp(q1, q2, k / 4)) for k in range(5)]
    steps = [angs[k + 1] - angs[k] for k in range(4)]
    assert max(steps) - min(steps) > 0.05
    # slerp는 길이 1, 각이 θt로 고르게
    for k in range(11):
        t = k / 10; v = slerp(q1, q2, t)
        assert abs(norm(v) - 1) < 1e-12 and abs(angle(q1, v) - t * math.pi / 2) < 1e-12
    # 카드 C2: θ = 90°, t = 1/3 → 계수 sin60°/1, sin30°/1
    v = slerp(q1, q2, 1 / 3)
    assert abs(v[0] - math.sqrt(3) / 2) < 1e-12 and abs(v[1] - 0.5) < 1e-12
    # 4차원 단위 쿼터니언에서도: 결과는 단위, 끝점 일치
    random.seed(23)
    for _ in range(100):
        a = [random.gauss(0, 1) for _ in range(4)]; b = [random.gauss(0, 1) for _ in range(4)]
        a = [x / norm(a) for x in a]; b = [x / norm(b) for x in b]
        th = angle(a, b)
        assert all(abs(x - y) < 1e-9 for x, y in zip(slerp(a, b, 0), a)) and all(abs(x - y) < 1e-9 for x, y in zip(slerp(a, b, 1), b))
        for t in (0.25, 0.5, 0.8):
            v = slerp(a, b, t)
            assert abs(norm(v) - 1) < 1e-9 and abs(angle(a, v) - t * th) < 1e-7
    # 두 벡터가 거의 같으면 sinθ ≈ 0이라 나눗셈이 불안정 → lerp로 대신
    a = [1.0, 0.0]; b = [math.cos(1e-9), math.sin(1e-9)]
    assert math.sin(angle(a, b)) < 1e-8
    # 쌍선형 보간 (슬라이드 p.35): 네 격자점 값
    f = {(0, 0): 1.0, (1, 0): 3.0, (0, 1): 2.0, (1, 1): 6.0}
    def bil(x, y, x1=0, x2=1, y1=0, y2=1):
        R1 = (x2 - x) / (x2 - x1) * f[(0, 0)] + (x - x1) / (x2 - x1) * f[(1, 0)]
        R2 = (x2 - x) / (x2 - x1) * f[(0, 1)] + (x - x1) / (x2 - x1) * f[(1, 1)]
        return (y2 - y) / (y2 - y1) * R1 + (y - y1) / (y2 - y1) * R2
    assert bil(0.5, 0.5) == 3.0 and bil(0.25, 0.5) == 2.25            # 카드 C3
    # 순서를 바꿔(y 먼저) 보간해도 같다
    def bil_y(x, y):
        C1 = (1 - y) * f[(0, 0)] + y * f[(0, 1)]; C2 = (1 - y) * f[(1, 0)] + y * f[(1, 1)]
        return (1 - x) * C1 + x * C2
    assert all(abs(bil(x / 7, y / 5) - bil_y(x / 7, y / 5)) < 1e-12 for x in range(8) for y in range(6))
    # 삼선형: 정육면체 8꼭짓점, 가운데 값은 평균
    g = {(i, j, k): i + 2 * j + 4 * k + i * j * k for i in (0, 1) for j in (0, 1) for k in (0, 1)}
    tri = lambda x, y, z: sum(g[(i, j, k)] * (x if i else 1 - x) * (y if j else 1 - y) * (z if k else 1 - z) for i, j, k in g)
    assert abs(tri(0.5, 0.5, 0.5) - sum(g.values()) / 8) < 1e-12
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
