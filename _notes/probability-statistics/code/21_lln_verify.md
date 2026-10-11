---
layout: "note"
title: "21_lln_verify.py"
display_title: "21_lln_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/lln/"
parent_title: "큰 수의 법칙"
description: "확률과 통계 · 큰 수의 법칙 검증 코드"
permalink: "/studies/probability-statistics/code/21_lln_verify/"
---
{% raw %}
[큰 수의 법칙](/Hongs_Blog/studies/probability-statistics/lln/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""큰 수의 법칙 검증.

문서: 21.큰 수의 법칙 (예시, 정리, 증명, 예제, 오해, 카드 C1~C3)
주장 1: 예시 — 동전 던지기에서 앞면 비율은 1/2로 모이지만, 앞면 수와 n/2의 차이(절댓값의 평균)는 √n에 비례해 커진다.
주장 2: 정리 — 체비쇼프 한계 σ²/(nε²)가 실제 이탈 확률 이상(모의실험, 주사위 평균).
주장 3: 예제·카드 C1 — ±0.01, 95%: 체비쇼프 n >= 50,000, 정규 근사 n ≈ 9,604. ±0.05, 90%: 체비쇼프 n >= 1,000.
주장 4: 가정의 필요성 — 코시 분포의 표본평균은 n을 늘려도 퍼짐(사분위 범위)이 줄지 않는다.
"""
import math
import random


def main():
    rng = random.Random(21)
    for n, want in ((100, 0.04), (10000, 0.004)):   # 평균 절대 이탈 ≈ √(2/π)·0.5/√n
        fr = [sum(rng.random() < 0.5 for _ in range(n)) / n for _ in range(300)]
        mad = sum(abs(f - 0.5) for f in fr) / 300
        assert abs(mad / want - 1) < 0.2 and abs(math.sqrt(2 / math.pi) * 0.5 / math.sqrt(n) - want) < 0.001
    devs = {}
    for n in (100, 1600):
        devs[n] = sum(abs(sum(rng.random() < 0.5 for _ in range(n)) - n / 2) for _ in range(400)) / 400
    assert 2.8 < devs[1600] / devs[100] < 5.2    # √16 = 4
    assert abs(devs[100] - 4) < 0.6 and abs(devs[1600] - 16) < 2.4   # ≈ 0.399√n
    print(f"[OK] 주장 1: 비율은 모이고 차이는 커진다 ({devs[100]:.1f} → {devs[1600]:.1f})")

    sigma2 = 35 / 12
    for n, eps in ((10, 0.5), (50, 0.3), (200, 0.2)):
        trials = 4000
        bad = sum(1 for _ in range(trials) if abs(sum(rng.randint(1, 6) for _ in range(n)) / n - 3.5) >= eps) / trials
        assert bad <= sigma2 / (n * eps * eps) + 0.01
    print("[OK] 주장 2: 체비쇼프 한계")

    assert abs(0.25 / (0.01 ** 2 * 0.05) - 50000) < 1e-6
    assert abs((1.96 / 0.01) ** 2 * 0.25 - 9604) < 1e-6
    assert abs(0.25 / (0.05 ** 2 * 0.1) - 1000) < 1e-6
    print("[OK] 주장 3·카드 C1: 표본 크기")

    def iqr(xs):
        s = sorted(xs)
        return s[3 * len(s) // 4] - s[len(s) // 4]
    cauchy = lambda: math.tan(math.pi * (rng.random() - 0.5))
    q10 = iqr([sum(cauchy() for _ in range(10)) / 10 for _ in range(2000)])
    q1000 = iqr([sum(cauchy() for _ in range(1000)) / 1000 for _ in range(2000)])
    normal1000 = iqr([sum(rng.gauss(0, 1) for _ in range(1000)) / 1000 for _ in range(2000)])
    assert 0.6 < q1000 / q10 < 1.6 and normal1000 < 0.1
    print(f"[OK] 주장 4: 코시 평균의 퍼짐 {q10:.2f} → {q1000:.2f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
