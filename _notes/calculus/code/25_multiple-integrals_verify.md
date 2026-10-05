---
layout: "note"
title: "25_multiple-integrals_verify.py"
display_title: "25_multiple-integrals_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "25"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/multiple-integrals/"
parent_title: "중적분과 변수변환"
description: "미분적분학 · 중적분과 변수변환 검증 코드"
permalink: "/studies/calculus/code/25_multiple-integrals_verify/"
---
{% raw %}
[중적분과 변수변환](/Hongs_Blog/studies/calculus/multiple-integrals/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""중적분과 변수변환 검증.

문서: 25.중적분과 변수변환 (예시, 정의, 정리, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — ∫∫_{[0,1]²} xy = 1/4: 두 순서의 반복적분(심프슨), 2차원 중점 리만 합.
주장 2: 원판 넓이 πR² (극좌표에서 배율 r 포함), 배율을 빼면 2πR. 카드 C2.
주장 3: 예제 — ∫ e^{-x²} = √π (수치), 극좌표 안쪽 적분 1/2, I² = π.
주장 4: 타원 x²/a² + y²/b² <= 1의 넓이 πab (변환 x = au, y = bv, 행렬식 ab), 몬테카를로로도 근사.
주장 5: 카드 C1 — ∫∫_{[0,1]×[0,2]} (x + y) = 3.
주장 6: 활용 — 몬테카를로 원 넓이 오차가 표본 수 4배에 약 절반, 박스–뮬러 표본의 평균 ≈ 0, 분산 ≈ 1, 두 좌표의 상관 ≈ 0.
"""
import math
import random


def simpson(f, a, b, n=2000):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    I1 = simpson(lambda y: simpson(lambda x: x * y, 0, 1, 200), 0, 1, 200)
    I2 = simpson(lambda x: simpson(lambda y: x * y, 0, 1, 200), 0, 1, 200)
    n = 300
    R = sum(((i + 0.5) / n) * ((j + 0.5) / n) for i in range(n) for j in range(n)) / (n * n)
    assert abs(I1 - 0.25) < 1e-12 and abs(I2 - 0.25) < 1e-12 and abs(R - 0.25) < 1e-6
    print("[OK] 주장 1: 1/4")

    for Rr in (1.0, 2.5):
        with_r = simpson(lambda th: simpson(lambda r: r, 0, Rr, 100), 0, 2 * math.pi, 100)
        without = simpson(lambda th: simpson(lambda r: 1.0, 0, Rr, 100), 0, 2 * math.pi, 100)
        assert abs(with_r - math.pi * Rr * Rr) < 1e-9 and abs(without - 2 * math.pi * Rr) < 1e-9
    print("[OK] 주장 2·카드 C2·C3: 원판 넓이와 배율 r")

    I = simpson(lambda x: math.exp(-x * x), -10, 10, 4000)
    inner = simpson(lambda r: math.exp(-r * r) * r, 0, 10, 4000)
    assert abs(I - math.sqrt(math.pi)) < 1e-12 and abs(inner - 0.5) < 1e-9 and abs(2 * math.pi * inner - math.pi) < 1e-8
    print("[OK] 주장 3: 가우스 적분 √π")

    rng = random.Random(25)
    for a, b in ((2.0, 1.0), (3.0, 0.5)):
        det = a * b
        area = det * math.pi   # 단위원 넓이 × |det|
        N = 200000
        hits = sum(1 for _ in range(N) if (lambda x, y: x * x / (a * a) + y * y / (b * b) <= 1)(rng.uniform(-a, a), rng.uniform(-b, b)))
        mc = hits / N * (2 * a) * (2 * b)
        assert abs(mc - area) / area < 0.01
    print("[OK] 주장 4: 타원 넓이 πab")

    v = simpson(lambda y: simpson(lambda x: x + y, 0, 1, 100), 0, 2, 100)
    assert abs(v - 3) < 1e-12
    print("[OK] 주장 5·카드 C1: 3")

    errs = []
    for N in (4000, 16000, 64000):
        trials = []
        for _ in range(40):
            hits = sum(1 for _ in range(N) if rng.random() ** 2 + rng.random() ** 2 <= 1)
            trials.append(4 * hits / N)
        errs.append(math.sqrt(sum((t - math.pi) ** 2 for t in trials) / len(trials)))
    assert 1.4 < errs[0] / errs[1] < 2.8 and 1.4 < errs[1] / errs[2] < 2.8
    zs, ws = [], []
    for _ in range(100000):
        u1, u2 = 1 - rng.random(), rng.random()
        r = math.sqrt(-2 * math.log(u1))
        zs.append(r * math.cos(2 * math.pi * u2))
        ws.append(r * math.sin(2 * math.pi * u2))
    for s in (zs, ws):
        m = sum(s) / len(s)
        var = sum((t - m) ** 2 for t in s) / len(s)
        assert abs(m) < 0.02 and abs(var - 1) < 0.02
    cov = sum(z * w for z, w in zip(zs, ws)) / len(zs)
    assert abs(cov) < 0.02
    within1 = sum(1 for z in zs if abs(z) < 1) / len(zs)
    assert abs(within1 - 0.6827) < 0.01
    print(f"[OK] 주장 6: 몬테카를로 오차비 {errs[0] / errs[1]:.2f}, {errs[1] / errs[2]:.2f}, 박스–뮬러")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
