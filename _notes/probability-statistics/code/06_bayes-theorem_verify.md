---
layout: "note"
title: "06_bayes-theorem_verify.py"
display_title: "06_bayes-theorem_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/bayes-theorem/"
parent_title: "베이즈 정리"
description: "확률과 통계 · 베이즈 정리 검증 코드"
permalink: "/studies/probability-statistics/code/06_bayes-theorem_verify/"
---
{% raw %}
[베이즈 정리](/Hongs_Blog/studies/probability-statistics/bayes-theorem/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""베이즈 정리 검증.

문서: 06.베이즈 정리, 4.연습문제/06.베이즈 정리 예제 사다리
주장 1: 예시 — 유병률 1%, 민감도 95%, 위양성률 5%: P(병 | 양성) = 95/590 ≈ 0.161(자연 빈도 1만 명 표와 공식).
주장 2: 정리 — 무작위 사전확률·가능도에서 베이즈 공식 = 결합확률표의 행 비율, 오즈 형태 = 확률 형태.
주장 3: 예제 — 두 번째 독립 양성 후 0.785. 가정의 필요성: 분할이 전체를 덮지 않으면 분모가 틀린다.
주장 4: 카드 C1 — 유병률 0.1%, 민감도 99%, 위양성 1%: 약 0.090. 카드 C3 — 오즈 1:99 × 19 = 19:99 → 0.161.
주장 5: 사다리 — 공장 B 0.625, 스팸 0.952, 택시 0.414, 세 공장 문제.
주장 6: 모의실험 — 인구 20만 명 시뮬레이션에서 양성 중 병의 비율이 0.161에 가깝다.
"""
from fractions import Fraction
import random


def post(prior, sens, fpr):
    return prior * sens / (prior * sens + (1 - prior) * fpr)


def main():
    pop = 10000
    sick = pop // 100
    tp = sick * 95 // 100
    fp = (pop - sick) * 5 // 100
    assert (sick, tp, fp) == (100, 95, 495)
    assert Fraction(tp, tp + fp) == post(Fraction(1, 100), Fraction(95, 100), Fraction(5, 100)) == Fraction(95, 590)
    assert abs(95 / 590 - 0.161) < 1e-3
    print("[OK] 주장 1: 0.161")

    rng = random.Random(6)
    for _ in range(500):
        k = rng.randint(2, 5)
        pri = [rng.random() for _ in range(k)]
        s = sum(pri)
        pri = [p / s for p in pri]
        lik = [rng.random() for _ in range(k)]
        joint = [p * l for p, l in zip(pri, lik)]
        pe = sum(joint)
        for i in range(k):
            assert abs(lik[i] * pri[i] / pe - joint[i] / pe) < 1e-12
        if k == 2:
            odds = (pri[0] / pri[1]) * (lik[0] / lik[1])
            assert abs(odds / (1 + odds) - joint[0] / pe) < 1e-12
    print("[OK] 주장 2: 공식·오즈 형태")

    first = post(Fraction(1, 100), Fraction(95, 100), Fraction(5, 100))
    second = post(first, Fraction(95, 100), Fraction(5, 100))
    assert abs(float(second) - 0.785) < 1e-3
    # 분할이 빠지면: 원인이 셋(A 0.5, B 0.3, C 0.2)인데 C를 빼고 분모를 계산하면 틀린다
    pr = {"A": 0.5, "B": 0.3, "C": 0.2}
    lk = {"A": 0.1, "B": 0.4, "C": 0.9}
    right = pr["A"] * lk["A"] / sum(pr[h] * lk[h] for h in pr)
    wrong = pr["A"] * lk["A"] / (pr["A"] * lk["A"] + pr["B"] * lk["B"])
    assert abs(right - 0.05 / 0.35) < 1e-12 and abs(wrong - 0.05 / 0.17) < 1e-12 and wrong > 2 * right
    print("[OK] 주장 3: 두 번째 양성, 분할의 필요성")

    assert abs(post(0.001, 0.99, 0.01) - 0.0902) < 1e-4
    o = Fraction(1, 99) * 19
    assert o == Fraction(19, 99) and Fraction(19, 118) == Fraction(95, 590)
    print("[OK] 주장 4: 카드 C1·C3")

    assert abs(0.4 * 0.05 / (0.6 * 0.02 + 0.4 * 0.05) - 0.625) < 1e-12
    assert abs(post(0.4, 0.3, 0.01) - 0.952) < 1e-3
    assert abs(post(0.15, 0.8, 0.2) - 0.414) < 1e-3
    shares, rates = [0.5, 0.3, 0.2], [0.01, 0.02, 0.05]
    tot = sum(s * r for s, r in zip(shares, rates))
    assert abs(tot - 0.021) < 1e-12 and abs(0.2 * 0.05 / tot - 0.476) < 1e-3
    print("[OK] 주장 5: 사다리")

    n_pos = n_both = 0
    for _ in range(200000):
        d = rng.random() < 0.01
        pos = rng.random() < (0.95 if d else 0.05)
        if pos:
            n_pos += 1
            n_both += d
    assert abs(n_both / n_pos - 0.161) < 0.015
    print("[OK] 주장 6: 모의실험")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
