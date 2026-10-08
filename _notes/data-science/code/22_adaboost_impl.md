---
layout: "note"
title: "22_adaboost_impl.py"
display_title: "22_adaboost_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "22"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/boosting-adaboost/"
parent_title: "부스팅과 AdaBoost"
description: "데이터 과학 · 부스팅과 AdaBoost 구현 코드"
permalink: "/studies/data-science/code/22_adaboost_impl/"
---
{% raw %}
[부스팅과 AdaBoost](/Hongs_Blog/studies/data-science/boosting-adaboost/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""AdaBoost 구현과 실행 추적.

문서: 22.부스팅과 AdaBoost (예시, 의사코드, 실행 추적, 카드)
출처: 데이터 과학 6회 슬라이드 6-2 p.17~18
자료: x = 1..10, y = (+, +, +, -, -, -, +, +, +, -). 약한 모델은 한 점에서 자르는 결정 그루터기
      h(x) = s if x <= t else -s (t는 0.5, 1.5, ..., 10.5, s = ±1). 가중 오류가 가장 작은 것을 고른다.
식: 처음 가중치 1/N, ε_m = Σ w·1[틀림] / Σ w, α_m = ½ ln((1 - ε_m)/ε_m),
    w ← w·exp(-α_m y h(x)) 뒤 합이 1이 되게 나눈다. 최종 F(x) = sign(Σ α_m h_m(x)).
주장:
  1. 1라운드 ε = 0.3, α = ½ ln(7/3) ≈ 0.424. 틀린 점 3개의 가중치가 각각 1/6, 맞힌 점이 1/14로 바뀐다
     (틀린 점들의 가중치 합이 정확히 1/2이 된다).
  2. 3라운드 뒤 훈련 오류 0.
  3. ε < 1/2이면 α > 0, ε = 1/2이면 α = 0.
"""
import math

X = list(range(1, 11))
Y = [1, 1, 1, -1, -1, -1, 1, 1, 1, -1]


def stump(t, s):
    return lambda x: s if x <= t else -s


def best_stump(w):
    best = None
    for t in [k + 0.5 for k in range(0, 11)]:
        for s in (1, -1):
            h = stump(t, s)
            err = sum(wi for wi, x, y in zip(w, X, Y) if h(x) != y) / sum(w)
            if best is None or err < best[0] - 1e-12:
                best = (err, t, s, h)
    return best


def adaboost(M):
    n = len(X); w = [1 / n] * n; models = []; log = []
    for _ in range(M):
        err, t, s, h = best_stump(w)
        a = 0.5 * math.log((1 - err) / err)
        w = [wi * math.exp(-a * y * h(x)) for wi, x, y in zip(w, X, Y)]
        z = sum(w); w = [wi / z for wi in w]
        models.append((a, h)); log.append((err, t, s, a, w[:]))
    return models, log


def predict(models, x):
    return 1 if sum(a * h(x) for a, h in models) > 0 else -1


def main():
    models, log = adaboost(3)
    e1, t1, s1, a1, w1 = log[0]
    assert abs(e1 - 0.3) < 1e-12 and (t1, s1) == (3.5, 1)
    assert abs(a1 - 0.5 * math.log(7 / 3)) < 1e-12 and round(a1, 3) == 0.424
    wrong = [i for i, (x, y) in enumerate(zip(X, Y)) if (1 if x <= t1 else -1) * s1 != y]
    assert len(wrong) == 3
    assert all(abs(w1[i] - 1 / 6) < 1e-12 for i in wrong)
    assert all(abs(w1[i] - 1 / 14) < 1e-12 for i in range(10) if i not in wrong)
    assert abs(sum(w1[i] for i in wrong) - 0.5) < 1e-12
    for m, (e, t, s, a, w) in enumerate(log, 1):
        print(f"     라운드 {m}: 자르는 곳 x <= {t}, 방향 {s:+d}, ε = {e:.4f}, α = {a:.4f}")
    print(f"[OK] 1라운드: ε 0.3, α {a1:.3f}, 틀린 점 {[X[i] for i in wrong]} 가중치 1/6, 맞힌 점 1/14")
    errs = [sum(predict(models[:m], x) != y for x, y in zip(X, Y)) for m in (1, 2, 3)]
    print("     라운드별 훈련 오류 개수:", errs)
    assert errs[-1] == 0
    print("[OK] 3라운드 뒤 훈련 오류 0")
    assert 0.5 * math.log((1 - 0.5) / 0.5) == 0 and 0.5 * math.log(0.9 / 0.1) > 0
    print("[OK] ε = 1/2이면 α = 0, ε < 1/2이면 α > 0")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
