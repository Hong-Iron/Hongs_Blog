---
layout: "note"
title: "22_clt_verify.py"
display_title: "22_clt_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "22"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/clt/"
parent_title: "중심극한정리"
description: "확률과 통계 · 중심극한정리 검증 코드"
permalink: "/studies/probability-statistics/code/22_clt_verify/"
---
{% raw %}
[중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""중심극한정리 검증.

문서: 22.중심극한정리 (예시, 정리, 예제, 오해, 카드 C1~C4)
주장 1: 예시 — 주사위 n개 합의 표준화 분포가 n = 1, 2, 10, 100으로 갈수록 Φ에 가까워진다(정확한 합성곱으로 최대 CDF 차이).
주장 2: 예제·카드 C1 — 주사위 100개 합이 380 이상: 정확값 0.04203, 정규 근사(연속성 보정) 0.04205, SD 17.08.
주장 3: 카드 C2 — Bin(100, 0.5)에서 P(X >= 60): 정확 0.0284, 정규 근사 0.0287.
주장 4: 치우친 분포는 느리다 — 지수분포 n개 평균의 P(Z > 2)가 n = 5, 50, 500에서 0.0228에 다가간다(정확한 감마 꼬리).
주장 5: 가정의 필요성·카드 C4 — 코시(분산 무한)는 표준화해도 정규가 되지 않고, 모두 같은 값을 복사한 합은 원래 모양 그대로다.
주장 6: 오해 — 표본을 많이 모아도 자료 자체(지수분포)의 치우침은 그대로다(왜도 ≈ 2).
"""
import math
import random

Phi = lambda z: 0.5 * (1 + math.erf(z / math.sqrt(2)))


def dice_sum(n):
    dist = {0: 1.0}
    for _ in range(n):
        nd = {}
        for s, p in dist.items():
            for f in range(1, 7):
                nd[s + f] = nd.get(s + f, 0) + p / 6
        dist = nd
    return dist


def main():
    gaps = []
    for n in (1, 2, 10, 100):
        d = dice_sum(n)
        mu, sd = 3.5 * n, math.sqrt(n * 35 / 12)
        cdf, worst = 0.0, 0.0
        for s in sorted(d):
            cdf += d[s]
            worst = max(worst, abs(cdf - Phi((s + 0.5 - mu) / sd)))
        gaps.append(worst)
    assert gaps[0] > gaps[1] > gaps[2] > gaps[3] and gaps[3] < 0.002
    print("[OK] 주장 1: 최대 CDF 차이", [round(g, 4) for g in gaps])

    d = dice_sum(100)
    exact = sum(p for s, p in d.items() if s >= 380)
    sd = math.sqrt(100 * 35 / 12)
    approx = 1 - Phi((379.5 - 350) / sd)
    assert abs(exact - 0.04203) < 1e-5 and abs(approx - 0.04205) < 1e-5 and abs(sd - 17.08) < 0.01
    print("[OK] 주장 2·카드 C1: 주사위 100개")

    from math import comb
    b = sum(comb(100, k) for k in range(60, 101)) / 2 ** 100
    assert abs(b - 0.0284) < 1e-4 and abs(1 - Phi((59.5 - 50) / 5) - 0.0287) < 1e-4
    print("[OK] 주장 3·카드 C2: 이항 근사")

    # 지수(1) n개의 합은 감마(n, 1): P(합 > t) = e^{-t} Σ_{k<n} t^k/k! (큰 n에서 넘치지 않게 로그로 계산)
    tails = []
    for n in (5, 50, 500):
        t = n + 2 * math.sqrt(n)      # 평균 n, SD √n에서 표준편차 2개 위
        logs, term_log = [0.0], 0.0
        for k in range(1, n):
            term_log += math.log(t / k)
            logs.append(term_log)
        mx = max(logs)
        tails.append(math.exp(-t + mx) * sum(math.exp(v - mx) for v in logs))
    target = 1 - Phi(2)
    assert abs(tails[0] - target) > abs(tails[1] - target) > abs(tails[2] - target)
    assert abs(tails[2] - target) < 0.003 and tails[0] > target
    print("[OK] 주장 4: 지수분포 평균의 꼬리", [round(x, 4) for x in tails], "→", round(target, 4))

    rng = random.Random(22)
    cauchy = lambda: math.tan(math.pi * (rng.random() - 0.5))
    means = [sum(cauchy() for _ in range(500)) / 500 for _ in range(3000)]
    frac_big = sum(1 for m in means if abs(m) > 3) / len(means)
    assert abs(frac_big - (1 - 2 * math.atan(3) / math.pi)) < 0.03   # 여전히 표준 코시: P(|C| > 3) ≈ 0.205
    copies = [500 * (1 if rng.random() < 0.5 else 0) for _ in range(3000)]
    assert set(copies) <= {0, 500}
    print(f"[OK] 주장 5·카드 C4: 코시 평균이 |x| > 3일 비율 {frac_big:.3f}, 복사한 합은 두 값뿐")

    data = [-math.log(1 - rng.random()) for _ in range(200000)]
    m = sum(data) / len(data)
    s = math.sqrt(sum((x - m) ** 2 for x in data) / len(data))
    skew = sum(((x - m) / s) ** 3 for x in data) / len(data)
    assert abs(skew - 2) < 0.15
    print(f"[OK] 주장 6: 자료의 왜도 {skew:.2f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
