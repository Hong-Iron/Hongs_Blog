---
layout: "note"
title: "30_em-gmm_impl.py"
display_title: "30_em-gmm_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "30"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/em-algorithm/"
parent_title: "EM 알고리즘"
description: "데이터 과학 · EM 알고리즘 구현 코드"
permalink: "/studies/data-science/code/30_em-gmm_impl/"
---
{% raw %}
[EM 알고리즘](/Hongs_Blog/studies/data-science/em-algorithm/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""가우스 혼합 모델(GMM)과 EM 알고리즘 구현 (1차원).

문서: 29.가우스 혼합 모델 (예시, 정의, 카드), 30.EM 알고리즘 (예시, 의사코드, 실행 추적, 정확성, 카드)
출처: 데이터 과학 7회 슬라이드 7-1 p.22~31
E 단계: [z_i]_α = π_α N(x_i | μ_α, σ²_α) / Σ_l π_l N(x_i | μ_l, σ²_l)   (책임도, 행마다 합 1)
M 단계: μ_α = Σ z x / Σ z,  σ²_α = Σ z (x - μ)² / Σ z,  π_α = (1/n) Σ z
주장:
  1. 로그가능도 Σ_i log Σ_α π_α N(x_i)는 반복마다 줄지 않는다 (무작위 자료 100개).
  2. 평균 0, 5 / 표준편차 1, 1.5 / 비율 0.3, 0.7로 만든 자료 2,000개에서 매개변수를 거의 되찾는다.
  3. 경계의 점은 두 군집에 반씩 가까운 책임도를 받는다(부드러운 배정). 두 정규분포의 경계 근처.
  4. π의 처음 값은 1/k다(슬라이드 p.28의 "1/n"은 오기). π의 합은 늘 1.
  5. 분산을 모두 같게 고정하고 0에 가깝게 보내면 책임도가 0/1이 되어 k-평균의 배정과 같아진다.
"""
import math
import random


def npdf(x, m, v):
    return math.exp(-(x - m) ** 2 / (2 * v)) / math.sqrt(2 * math.pi * v)


def e_step(X, mu, var, pi):
    R = []
    for x in X:
        p = [pi[a] * npdf(x, mu[a], var[a]) for a in range(len(mu))]
        s = sum(p); R.append([q / s for q in p])
    return R


def m_step(X, R):
    k = len(R[0]); n = len(X); mu, var, pi = [], [], []
    for a in range(k):
        na = sum(r[a] for r in R)
        m = sum(r[a] * x for r, x in zip(R, X)) / na
        v = sum(r[a] * (x - m) ** 2 for r, x in zip(R, X)) / na
        mu.append(m); var.append(max(v, 1e-6)); pi.append(na / n)
    return mu, var, pi


def loglik(X, mu, var, pi):
    return sum(math.log(sum(pi[a] * npdf(x, mu[a], var[a]) for a in range(len(mu)))) for x in X)


def em(X, mu, var, pi=None, iters=100, log=None):
    pi = pi or [1 / len(mu)] * len(mu)
    for _ in range(iters):
        if log is not None:
            log.append(loglik(X, mu, var, pi))
        R = e_step(X, mu, var, pi)
        mu, var, pi = m_step(X, R)
    return mu, var, pi


def main():
    rnd = random.Random(2)
    X = [rnd.gauss(0, 1) if rnd.random() < 0.3 else rnd.gauss(5, 1.5) for _ in range(2000)]
    log = []
    mu, var, pi = em(X, [1.0, 2.0], [1.0, 1.0], iters=200, log=log)
    assert all(a <= b + 1e-7 for a, b in zip(log, log[1:]))
    o = sorted(range(2), key=lambda a: mu[a])
    mu = [mu[a] for a in o]; sd = [math.sqrt(var[a]) for a in o]; pi = [pi[a] for a in o]
    print(f"     추정: 평균 {mu[0]:.2f}, {mu[1]:.2f} / 표준편차 {sd[0]:.2f}, {sd[1]:.2f} / 비율 {pi[0]:.2f}, {pi[1]:.2f}")
    assert abs(mu[0]) < 0.2 and abs(mu[1] - 5) < 0.2 and abs(sd[0] - 1) < 0.15 and abs(sd[1] - 1.5) < 0.15
    assert abs(pi[0] - 0.3) < 0.04 and abs(sum(pi) - 1) < 1e-12
    print("[OK] 매개변수를 되찾음, 로그가능도는 줄지 않음, π 합 1")

    for t in range(100):
        r2 = random.Random(100 + t)
        Y = [r2.gauss(r2.choice([0, 3, 7]), 1) for _ in range(60)]
        lg = []
        em(Y, [r2.uniform(-1, 8) for _ in range(3)], [1.0] * 3, iters=30, log=lg)
        assert all(a <= b + 1e-7 for a, b in zip(lg, lg[1:]))
    print("[OK] 무작위 자료 100개(k = 3): 로그가능도 단조 증가")

    # 문서의 추적 표: 점 0, 1, 2, 6, 7, 8 / 처음 μ = 1, 2, σ² = 1, 1, π = 1/2
    Z = [0, 1, 2, 6, 7, 8]
    R = e_step(Z, [1.0, 2.0], [1.0, 1.0], [0.5, 0.5])
    r0 = [round(r[0], 3) for r in R]
    print("     1회 E 단계 군집 1 책임도:", r0)
    assert r0 == [0.818, 0.622, 0.378, 0.011, 0.004, 0.002]
    mu1, var1, pi1 = m_step(Z, R)
    print("     1회 M 단계: μ", [round(m, 3) for m in mu1], "σ²", [round(v, 3) for v in var1], "π", [round(p, 3) for p in pi1])
    mu, var, pi = em(Z, [1.0, 2.0], [1.0, 1.0], iters=100)
    assert abs(min(mu) - 1) < 1e-3 and abs(max(mu) - 7) < 1e-3 and all(abs(p - 0.5) < 1e-3 for p in pi)
    print("[OK] 추적 예는 μ = 1, 7, π = 1/2, 1/2로 수렴")

    # 경계의 점
    R = e_step([2.5], [0.0, 5.0], [1.0, 1.0], [0.5, 0.5])
    assert abs(R[0][0] - 0.5) < 1e-12
    # 분산을 작게: 하드 배정
    R = e_step([2.4], [0.0, 5.0], [0.01, 0.01], [0.5, 0.5])
    assert R[0][0] > 0.999
    print("[OK] 같은 분산·비율의 두 성분 가운데 점의 책임도 0.5, 분산을 0에 가깝게 하면 0/1 (k-평균과 같은 배정)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
