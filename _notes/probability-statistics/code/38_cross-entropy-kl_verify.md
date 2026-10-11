---
layout: "note"
title: "38_cross-entropy-kl_verify.py"
display_title: "38_cross-entropy-kl_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "38"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/cross-entropy-kl/"
parent_title: "교차 엔트로피와 KL 발산"
description: "확률과 통계 · 교차 엔트로피와 KL 발산 검증 코드"
permalink: "/studies/probability-statistics/code/38_cross-entropy-kl_verify/"
---
{% raw %}
[교차 엔트로피와 KL 발산](/Hongs_Blog/studies/probability-statistics/cross-entropy-kl/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""교차 엔트로피와 KL 발산 검증.

문서: 38.교차 엔트로피와 KL 발산 (예시, 정의, 증명, 예제, 카드 C1~C3)
주장 1: 예시·카드 C1 — p = (1/2, 1/4, 1/8, 1/8)을 균등 부호(2비트)로: 교차 엔트로피 2, KL 0.25 = 2 - 1.75.
주장 2: 기브스 부등식 — 무작위 p, q에서 D(p||q) >= 0, 같을 때만 0, H(p, q) = H(p) + D(p||q).
주장 3: 카드 C3 — 비대칭: p = (0.9, 0.1), q = (0.5, 0.5)에서 D(p||q) ≈ 0.531, D(q||p) ≈ 0.737. q가 0인 곳에 p가 양수면 무한대.
주장 4: 예제·카드 C2 — 분류: 평균 교차 엔트로피 최소화 = 로그 가능도 최대화(동전 모델 q에서 최소점 = 표본 비율),
        정답 확률 0.9 → 손실 -ln 0.9 ≈ 0.105, 0.1 → 2.303.
"""
import math
import random


def H(p):
    return -sum(a * math.log2(a) for a in p if a > 0)


def CE(p, q):
    return -sum(a * math.log2(b) for a, b in zip(p, q) if a > 0)


def KL(p, q):
    return sum(a * math.log2(a / b) for a, b in zip(p, q) if a > 0)


def main():
    p = [0.5, 0.25, 0.125, 0.125]
    q = [0.25] * 4
    assert CE(p, q) == 2 and KL(p, q) == 0.25 and CE(p, q) - H(p) == 0.25
    print("[OK] 주장 1·카드 C1")

    rng = random.Random(38)
    for _ in range(500):
        n = rng.randint(2, 8)
        a = [rng.random() + 1e-3 for _ in range(n)]
        b = [rng.random() + 1e-3 for _ in range(n)]
        pa, pb = [x / sum(a) for x in a], [x / sum(b) for x in b]
        assert KL(pa, pb) >= -1e-12 and abs(KL(pa, pa)) < 1e-12
        assert abs(CE(pa, pb) - H(pa) - KL(pa, pb)) < 1e-12
    print("[OK] 주장 2: 기브스 부등식")

    p, q = [0.9, 0.1], [0.5, 0.5]
    assert abs(KL(p, q) - 0.531) < 1e-3 and abs(KL(q, p) - 0.737) < 1e-3
    try:
        KL([0.5, 0.5], [1.0, 0.0])
        raise AssertionError("무한대여야 한다")
    except ZeroDivisionError:
        pass
    assert KL([1.0, 0.0], [0.5, 0.5]) == 1.0          # 반대 방향은 유한(1비트)
    print("[OK] 주장 3·카드 C3: 비대칭, 무한대")

    ys = [rng.random() < 0.3 for _ in range(1000)]
    k = sum(ys)
    ce = lambda t: -sum(math.log(t) if y else math.log(1 - t) for y in ys) / len(ys)
    grid = [i / 10000 for i in range(1, 10000)]
    best = min(grid, key=ce)
    assert abs(best - k / 1000) < 1e-4
    assert abs(-math.log(0.9) - 0.105) < 1e-3 and abs(-math.log(0.1) - 2.303) < 1e-3
    print("[OK] 주장 4·카드 C2: 최소점 = 표본 비율")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
