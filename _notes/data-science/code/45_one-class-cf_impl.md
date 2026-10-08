---
layout: "note"
title: "45_one-class-cf_impl.py"
display_title: "45_one-class-cf_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "45"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/one-class-cf/"
parent_title: "단일 클래스 협업 필터링"
description: "데이터 과학 · 단일 클래스 협업 필터링 구현 코드"
permalink: "/studies/data-science/code/45_one-class-cf_impl/"
---
{% raw %}
[단일 클래스 협업 필터링](/Hongs_Blog/studies/data-science/one-class-cf/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""단일 클래스 협업 필터링(WRMF, BPR) 구현과 실험.

문서: 45.단일 클래스 협업 필터링 (예시, 정의, 카드)
출처: 데이터 과학 12회 슬라이드 12-1 p.17~24
자료: 사용자 20명 × 아이템 10개의 상호작용(1) / 없음(0). 사용자 0~9는 아이템 0~4를, 10~19는 5~9를 주로 쓴다(각 70%), 30%는 엉뚱한 아이템 하나도 쓴다.
     시험을 위해 사용자마다 쓴 아이템 하나를 숨긴다.
WRMF: 모든 칸에서 c_ui (x_ui - p_uᵀq_i)² + λ(...)를 경사 하강. 쓴 칸 c = 1, 빈칸 c = δ(작은 값).
BPR: (u, 쓴 i, 안 쓴 j) 쌍마다 ln σ(x̂_ui - x̂_uj) - λ||Θ||²를 최대화(확률적 경사 상승).
주장:
  1. 두 방법 모두 숨긴 아이템을 빈칸들보다 높이 올린다(평균 AUC 0.7 이상). 무작위면 약 0.5.
  2. WRMF에서 빈칸 가중치 δ를 1로 하면(모든 빈칸을 확실한 0으로 믿으면) 숨긴 아이템까지 0으로 맞추려 해 순위가 나빠진다.
  3. 카드 C2: 쓴 칸 3개, 빈칸 5개인 사용자 한 명에 대한 BPR 쌍의 수는 3 × 5 = 15.
  4. 시그모이드 σ(x) = 1/(1+e^-x): 점수 차이가 0이면 0.5, 클수록 1.
"""
import math
import random


NU, NI = 20, 10


def home_of(u):
    return range(0, 5) if u < NU // 2 else range(5, 10)


def make_data(seed=0):
    rnd = random.Random(seed)
    X = [[0] * NI for _ in range(NU)]
    for u in range(NU):
        for i in home_of(u):
            if rnd.random() < 0.7:
                X[u][i] = 1
        if rnd.random() < 0.3:
            X[u][rnd.randrange(NI)] = 1
    hidden = {}
    for u in range(NU):
        home = [i for i in home_of(u) if X[u][i] == 1]
        if len(home) >= 2:
            h = rnd.choice(home); hidden[u] = h; X[u][h] = 0
    return X, hidden


def auc(score, X, hidden):
    tot = 0
    for u, h in hidden.items():
        negs = [j for j in range(NI) if X[u][j] == 0 and j != h]
        tot += sum(score(u, h) > score(u, j) for j in negs) / len(negs)
    return tot / len(hidden)


def wrmf(X, delta, k=2, lam=0.01, lr=0.05, epochs=400, seed=1):
    rnd = random.Random(seed)
    P = [[rnd.gauss(0, 0.3) for _ in range(k)] for _ in range(NU)]
    Q = [[rnd.gauss(0, 0.3) for _ in range(k)] for _ in range(NI)]
    for _ in range(epochs):
        for u in range(NU):
            for i in range(NI):
                c = 1.0 if X[u][i] else delta
                e = X[u][i] - sum(a * b for a, b in zip(P[u], Q[i]))
                for f in range(k):
                    pu, qi = P[u][f], Q[i][f]
                    P[u][f] += lr * (c * e * qi - lam * pu); Q[i][f] += lr * (c * e * pu - lam * qi)
    return lambda u, i: sum(a * b for a, b in zip(P[u], Q[i]))


def sig(x):
    return 1 / (1 + math.exp(-x))


def bpr(X, k=2, lam=0.01, lr=0.05, steps=20000, seed=2):
    rnd = random.Random(seed)
    P = [[rnd.gauss(0, 0.1) for _ in range(k)] for _ in range(NU)]
    Q = [[rnd.gauss(0, 0.1) for _ in range(k)] for _ in range(NI)]
    for _ in range(steps):
        u = rnd.randrange(NU)
        pos = [i for i in range(NI) if X[u][i]]; neg = [j for j in range(NI) if not X[u][j]]
        i, j = rnd.choice(pos), rnd.choice(neg)
        d = sum(a * (b - c) for a, b, c in zip(P[u], Q[i], Q[j]))
        g = 1 - sig(d)                           # d/dx ln σ(x) = 1 - σ(x)
        for f in range(k):
            pu, qi, qj = P[u][f], Q[i][f], Q[j][f]
            P[u][f] += lr * (g * (qi - qj) - lam * pu)
            Q[i][f] += lr * (g * pu - lam * qi)
            Q[j][f] += lr * (-g * pu - lam * qj)
    return lambda u, i: sum(a * b for a, b in zip(P[u], Q[i]))


def main():
    X, hidden = make_data()
    rnd = random.Random(9)
    r = {(u, i): rnd.random() for u in range(NU) for i in range(NI)}
    a_rand = auc(lambda u, i: r[(u, i)], X, hidden)
    a_w = auc(wrmf(X, 0.1), X, hidden)
    a_b = auc(bpr(X, steps=60000), X, hidden)
    a_w1 = auc(wrmf(X, 1.0, k=4, epochs=1500), X, hidden)
    print(f"     AUC: 무작위 {a_rand:.2f}, WRMF(δ = 0.1) {a_w:.2f}, WRMF(δ = 1, 차원 4) {a_w1:.2f}, BPR {a_b:.2f}")
    assert a_w > 0.75 and a_b > 0.7 and abs(a_rand - 0.5) < 0.1
    assert a_w1 < a_w
    print("[OK] WRMF와 BPR 모두 숨긴 아이템을 빈칸보다 높이 올린다. 빈칸을 모두 확실한 0으로 믿으면 나빠진다")
    assert 3 * 5 == 15 and sig(0) == 0.5 and sig(5) > 0.99
    print("[OK] 카드 C2: 쌍 15개, σ(0) = 0.5")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
