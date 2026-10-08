---
layout: "note"
title: "30_mle_verify.py"
display_title: "30_mle_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "30"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/mle/"
parent_title: "최대가능도 추정"
description: "확률과 통계 · 최대가능도 추정 검증 코드"
permalink: "/studies/probability-statistics/code/30_mle_verify/"
---
{% raw %}
[최대가능도 추정](/Hongs_Blog/studies/probability-statistics/mle/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""최대가능도 추정 검증.

문서: 30.최대가능도 추정, 4.연습문제/30.최대가능도 예제 사다리
주장 1: 예시·카드 C1 — 동전 10번 중 앞면 7번: 가능도 p^7(1-p)^3의 최댓점 0.7(격자 탐색), 로그 가능도의 최댓점도 같다.
주장 2: 닫힌 꼴 — 베르누이 k/n, 포아송 x̄, 지수 1/x̄, 정규 μ̂ = x̄·σ̂² = Σ(x - x̄)²/n: 무작위 자료에서 수치 최적화와 일치.
주장 3: 카드 C2 — 지수분포 자료 평균 2.5 → λ̂ = 0.4.
주장 4: 성질 — 불변성: 지수분포 평균의 MLE는 1/λ̂ = x̄. 일치성: 표본이 늘면 λ̂가 참값으로(모의실험).
주장 5: 오해 — 가능도를 θ에 대해 적분하면 1이 아니다(동전 7/10: ∫ p^7(1-p)^3 dp = 1/1320).
주장 6: 사다리 — 포아송 [2,3,1,4,0] → 2, 지수 [1,3,2,2] → 0.5(2계 도함수 음수), 정규 [4,6,5,9] → 6,
        기하 [1,3,2,4] → 0.4, 균등(0, θ) [0.3, 0.9, 0.5] → 최댓값 0.9(도함수 0이 없음).
"""
import math
import random


def argmax(f, lo, hi, n=200000):
    best = max(range(n + 1), key=lambda i: f(lo + (hi - lo) * i / n))
    return lo + (hi - lo) * best / n


def main():
    L = lambda p: p ** 7 * (1 - p) ** 3
    assert [round(L(q) * 1000, 2) for q in (0.5, 0.6, 0.7, 0.8, 0.9)] == [0.98, 1.79, 2.22, 1.68, 0.48]   # 예시 표
    assert abs(argmax(L, 0, 1) - 0.7) < 1e-4
    assert abs(argmax(lambda p: 7 * math.log(p) + 3 * math.log(1 - p) if 0 < p < 1 else -1e300, 0, 1) - 0.7) < 1e-4
    print("[OK] 주장 1·카드 C1: 0.7")

    rng = random.Random(30)
    for _ in range(20):
        xs = [rng.random() < 0.3 for _ in range(50)]
        k = sum(xs)
        if 0 < k < 50:
            assert abs(argmax(lambda p: k * math.log(p) + (50 - k) * math.log(1 - p) if 0 < p < 1 else -1e300, 0, 1, 20000) - k / 50) < 1e-4
        ys = [rng.randint(0, 6) for _ in range(30)]
        yb = sum(ys) / 30
        ll = lambda lam: sum(y * math.log(lam) - lam - math.lgamma(y + 1) for y in ys) if lam > 0 else -1e300
        assert abs(argmax(ll, 0, 10, 20000) - yb) < 1e-3
        zs = [rng.uniform(0.1, 5) for _ in range(30)]
        zb = sum(zs) / 30
        le = lambda lam: 30 * math.log(lam) - lam * sum(zs) if lam > 0 else -1e300
        assert abs(argmax(le, 0, 5, 50000) - 1 / zb) < 1e-3
        ws = [rng.gauss(3, 2) for _ in range(30)]
        wb = sum(ws) / 30
        s2 = sum((w - wb) ** 2 for w in ws) / 30
        ln = lambda mu, v: -15 * math.log(2 * math.pi * v) - sum((w - mu) ** 2 for w in ws) / (2 * v)
        assert abs(argmax(lambda mu: ln(mu, s2), -5, 10, 30000) - wb) < 1e-3
        assert abs(argmax(lambda v: ln(wb, v) if v > 0 else -1e300, 0, 20, 40000) - s2) < 1e-3
    print("[OK] 주장 2: 닫힌 꼴 넷")

    assert abs(1 / 2.5 - 0.4) < 1e-12
    print("[OK] 주장 3·카드 C2")

    mean_err = []
    for n in (10, 100, 10000):
        errs = []
        for _ in range(50):
            xs = [-math.log(1 - rng.random()) / 2.0 for _ in range(n)]
            errs.append(abs(len(xs) / sum(xs) - 2.0))
        mean_err.append(sum(errs) / 50)
    assert mean_err[0] > mean_err[1] > mean_err[2] and mean_err[2] < 0.03
    print("[OK] 주장 4: 일치성", [round(e, 3) for e in mean_err])

    n = 20000
    integral = sum(((i + 0.5) / n) ** 7 * (1 - (i + 0.5) / n) ** 3 for i in range(n)) / n
    assert abs(integral - 1 / 1320) < 1e-9
    print("[OK] 주장 5: 가능도의 적분 1/1320")

    assert sum([2, 3, 1, 4, 0]) / 5 == 2
    lam = 4 / sum([1, 3, 2, 2])
    assert lam == 0.5 and -4 / lam ** 2 < 0
    assert sum([4, 6, 5, 9]) / 4 == 6
    assert 4 / sum([1, 3, 2, 4]) == 0.4
    xs = [0.3, 0.9, 0.5]
    Lu = lambda th: th ** -3 if th >= max(xs) else 0.0
    assert abs(argmax(Lu, 0.01, 3, 300000) - 0.9) < 1e-4
    print("[OK] 주장 6: 예제 사다리")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
