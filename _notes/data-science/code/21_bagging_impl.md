---
layout: "note"
title: "21_bagging_impl.py"
display_title: "21_bagging_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "21"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/bagging-random-forest/"
parent_title: "배깅과 랜덤 포레스트"
description: "데이터 과학 · 배깅과 랜덤 포레스트 구현 코드"
permalink: "/studies/data-science/code/21_bagging_impl/"
---
{% raw %}
[배깅과 랜덤 포레스트](/Hongs_Blog/studies/data-science/bagging-random-forest/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""배깅(부트스트랩 집계) 구현과 실험.

문서: 21.배깅과 랜덤 포레스트 (예시, 의사코드, 카드)
출처: 데이터 과학 6회 슬라이드 6-2 p.15~16
모형: 1차원 회귀. 참 함수 f(x) = sin(2πx), 잡음 표준편차 0.3, 훈련 자료 40개.
기본 모델: 깊이 제한 없는 회귀 나무 대신, 가장 가까운 이웃 1개(1-NN) 예측 — 분산이 큰 모델.
주장:
  1. 부트스트랩 표본(복원 추출 n개)에 서로 다른 원래 자료는 평균 약 63%가 들어간다.
  2. 같은 시험 점들에서, 1-NN의 예측 분산(훈련 자료를 바꿀 때)이 배깅(모델 50개 평균)으로 크게 준다.
  3. 편향은 거의 그대로다.
  4. 랜덤 포레스트의 속성 뽑기: 속성 n개 중 m개를 뽑으면 두 나무가 같은 속성 집합을 쓸 확률이 1/C(n, m)로 작아져 서로 덜 닮는다.
"""
import math
import random


def f(x):
    return math.sin(2 * math.pi * x)


def nn1(train, x):
    return min(train, key=lambda p: abs(p[0] - x))[1]


def bagged(train, x, B, rnd):
    n = len(train); s = 0.0
    for _ in range(B):
        boot = [train[rnd.randrange(n)] for _ in range(n)]
        s += nn1(boot, x)
    return s / B


def main():
    rnd = random.Random(1)
    n = 40
    uniq = sum(len({rnd.randrange(n) for _ in range(n)}) for _ in range(5000)) / 5000 / n
    assert abs(uniq - (1 - (1 - 1 / n) ** n)) < 0.01 and 0.62 < uniq < 0.65
    print(f"[OK] 부트스트랩 표본 속 서로 다른 자료 비율 {uniq:.3f} (이론 {1 - (1 - 1/n) ** n:.3f})")

    xs = [0.1, 0.35, 0.6, 0.85]
    single = {x: [] for x in xs}; bag = {x: [] for x in xs}
    for _ in range(150):
        train = [(u, f(u) + rnd.gauss(0, 0.3)) for u in (rnd.random() for _ in range(n))]
        for x in xs:
            single[x].append(nn1(train, x)); bag[x].append(bagged(train, x, 50, rnd))
    def var(v):
        m = sum(v) / len(v); return sum((a - m) ** 2 for a in v) / len(v)
    def bias2(v, x):
        return (sum(v) / len(v) - f(x)) ** 2
    vs = sum(var(single[x]) for x in xs) / len(xs); vb = sum(var(bag[x]) for x in xs) / len(xs)
    bs = sum(bias2(single[x], x) for x in xs) / len(xs); bb = sum(bias2(bag[x], x) for x in xs) / len(xs)
    assert vb < 0.7 * vs and bb < 0.02 and bs < 0.02
    print(f"[OK] 1-NN 분산 {vs:.3f} -> 배깅 {vb:.3f}, 편향² {bs:.4f} -> {bb:.4f}")

    assert math.comb(10, 3) == 120
    print("[OK] 속성 10개 중 3개: 같은 조합일 확률 1/120")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
