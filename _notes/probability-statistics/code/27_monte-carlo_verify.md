---
layout: "note"
title: "27_monte-carlo_verify.py"
display_title: "27_monte-carlo_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "27"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/monte-carlo/"
parent_title: "몬테카를로 방법"
description: "확률과 통계 · 몬테카를로 방법 검증 코드"
permalink: "/studies/probability-statistics/code/27_monte-carlo_verify/"
---
{% raw %}
[몬테카를로 방법](/Hongs_Blog/studies/probability-statistics/monte-carlo/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""몬테카를로 방법 검증.

문서: 27.몬테카를로 방법 (예시, 정의, 예제, 활용, 오해, 카드 C1~C3)
주장 1: 예시 — π 추정의 오차(RMS)가 표본 4배마다 약 절반.
주장 2: 카드 C1 — ±0.01, 95%에 필요한 표본 약 103,600개(σ = 4√(p(1-p)) ≈ 1.642). 추정 ± 1.96σ̂/√n 구간이 약 95% 참값을 담는다.
주장 3: 차원 — [0,1]^d에서 Σx_i²의 평균(참값 d/3)을 표본 1만 개로 어림한 상대 오차가 d = 2, 10, 50에서 모두 1% 안팎.
주장 4: 드문 사건 — P(Z > 4) ≈ 3.17e-5: 표본 10만 개의 단순 추정은 상대 오차가 크고, 평균을 4로 옮긴 중요도 샘플링은 5% 안.
주장 5: 카드 C3 — 확률 1e-6을 상대 오차 10%로 어림하려면 표본 약 1e8개(상대 표준오차 ≈ 1/√(np)).
"""
import math
import random

Phi = lambda z: 0.5 * (1 + math.erf(z / math.sqrt(2)))


def main():
    rng = random.Random(27)
    def est(n):
        return 4 * sum(1 for _ in range(n) if rng.random() ** 2 + rng.random() ** 2 <= 1) / n
    rms = []
    for n in (1000, 4000, 16000):
        e = [est(n) - math.pi for _ in range(60)]
        rms.append(math.sqrt(sum(x * x for x in e) / len(e)))
    assert 1.5 < rms[0] / rms[1] < 2.7 and 1.5 < rms[1] / rms[2] < 2.7
    sig = 4 * math.sqrt(math.pi / 4 * (1 - math.pi / 4))
    theo = [sig / math.sqrt(n) for n in (1000, 4000, 16000)]
    assert [round(t, 3) for t in theo] == [0.052, 0.026, 0.013]           # 예시 표
    assert all(abs(r / t - 1) < 0.25 for r, t in zip(rms, theo))
    print("[OK] 주장 1: 오차 1/√n", [round(r, 4) for r in rms])

    p = math.pi / 4
    s = 4 * math.sqrt(p * (1 - p))
    assert abs(s - 1.642) < 1e-3 and 103000 < (1.96 * s / 0.01) ** 2 < 104000
    cover = 0
    for _ in range(400):
        n = 2000
        xs = [4.0 if rng.random() ** 2 + rng.random() ** 2 <= 1 else 0.0 for _ in range(n)]
        m = sum(xs) / n
        sd = math.sqrt(sum((x - m) ** 2 for x in xs) / (n - 1))
        cover += abs(m - math.pi) <= 1.96 * sd / math.sqrt(n)
    assert abs(cover / 400 - 0.95) < 0.035
    print("[OK] 주장 2·카드 C1: 표본 크기와 95% 구간")

    rel = []
    for d in (2, 10, 50):
        n = 10000
        m = sum(sum(rng.random() ** 2 for _ in range(d)) for _ in range(n)) / n
        rel.append(abs(m - d / 3) / (d / 3))
    assert all(r < 0.02 for r in rel)
    print("[OK] 주장 3: 차원과 무관한 오차", [round(r, 4) for r in rel])

    truth = 1 - Phi(4)
    assert abs(truth - 3.17e-5) < 0.01e-5
    naive_errs, is_errs = [], []
    for _ in range(20):
        n = 100000
        naive = sum(1 for _ in range(n) if rng.gauss(0, 1) > 4) / n
        naive_errs.append(abs(naive - truth) / truth)
        tot = 0.0
        for _ in range(n):
            y = rng.gauss(4, 1)
            if y > 4:
                tot += math.exp(-4 * y + 8)     # φ(y)/φ(y-4) = e^{-4y + 8}
        is_errs.append(abs(tot / n - truth) / truth)
    assert sum(naive_errs) / 20 > 0.1 and max(is_errs) < 0.05
    print(f"[OK] 주장 4: 단순 {sum(naive_errs) / 20:.2f}, 중요도 {max(is_errs):.3f}")

    pr = 1e-6
    n_need = 1 / (pr * 0.1 ** 2)
    assert abs(n_need - 1e8) < 1
    print("[OK] 주장 5·카드 C3")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
