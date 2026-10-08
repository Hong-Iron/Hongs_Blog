---
layout: "note"
title: "41_collaborative-filtering_impl.py"
display_title: "41_collaborative-filtering_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "41"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/collaborative-filtering/"
parent_title: "협업 필터링"
description: "데이터 과학 · 협업 필터링 구현 코드"
permalink: "/studies/data-science/code/41_collaborative-filtering_impl/"
---
{% raw %}
[협업 필터링](/Hongs_Blog/studies/data-science/collaborative-filtering/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""협업 필터링(사용자 기반, 아이템 기반) 구현과 자체 테스트.

문서: 41.협업 필터링 (예시, 의사코드, 실행 추적, 카드)
출처: 데이터 과학 11회 슬라이드 11-1 p.20~27
유사도: 함께 평가한 아이템 S_xy 위에서 피어슨(평균은 S_xy 위 평균)과 코사인.
예측: (1) 이웃 평균, (2) 유사도 가중 합 k Σ sim·r (k = 1/Σ|sim|), (3) 평균 보정 r̄_c + k Σ sim·(r_c's - r̄_c')
주장:
  1. 슬라이드 p.23의 사용자 A, B, C: A와 B는 비슷(피어슨 > 0.8), A와 C는 반대(피어슨 < 0).
  2. 평균 보정 예측은 후하게 주는 사람과 짜게 주는 사람의 차이를 지운다:
     A가 늘 B보다 1점씩 짜게 주면, B의 평점으로 A의 평점을 정확히 맞힌다.
  3. 아이템 기반: 같은 사용자들이 비슷하게 평가한 아이템끼리 유사도가 높다.
  4. 함께 평가한 아이템이 하나뿐이면 피어슨은 정의되지 않는다(분모 0) -> 차가운 시작.
"""
import math

NAN = None
R = {"A": [4.0, 1.0, 4.5, 5.0, 2.0, NAN],
     "B": [NAN, 1.5, 5.0, 4.5, 2.0, 5.0],
     "C": [1.0, NAN, 1.5, 1.0, 5.0, 1.0]}


def common(x, y):
    return [i for i in range(len(x)) if x[i] is not None and y[i] is not None]


def pcc(x, y):
    S = common(x, y)
    if len(S) < 2:
        return None
    mx = sum(x[i] for i in S) / len(S); my = sum(y[i] for i in S) / len(S)
    num = sum((x[i] - mx) * (y[i] - my) for i in S)
    den = math.sqrt(sum((x[i] - mx) ** 2 for i in S)) * math.sqrt(sum((y[i] - my) ** 2 for i in S))
    return num / den if den else None


def cosine(x, y):
    S = common(x, y)
    num = sum(x[i] * y[i] for i in S)
    return num / (math.sqrt(sum(x[i] ** 2 for i in S)) * math.sqrt(sum(y[i] ** 2 for i in S)))


def mean(x):
    v = [a for a in x if a is not None]; return sum(v) / len(v)


def predict(R, c, s, sim=pcc, mode="adjusted", neighbors=None):
    nb = [u for u in (neighbors or R) if u != c and R[u][s] is not None]
    sims = {u: sim(R[c], R[u]) for u in nb}
    nb = [u for u in nb if sims[u] is not None]
    if mode == "average":
        return sum(R[u][s] for u in nb) / len(nb)
    k = 1 / sum(abs(sims[u]) for u in nb)
    if mode == "weighted":
        return k * sum(sims[u] * R[u][s] for u in nb)
    return mean(R[c]) + k * sum(sims[u] * (R[u][s] - mean(R[u])) for u in nb)


def main():
    ab, ac = pcc(R["A"], R["B"]), pcc(R["A"], R["C"])
    print(f"     피어슨 A-B {ab:.3f}, A-C {ac:.3f}, 코사인 A-B {cosine(R['A'], R['B']):.3f}, A-C {cosine(R['A'], R['C']):.3f}")
    assert ab > 0.8 and ac < 0
    print("[OK] p.23: A와 B는 비슷, A와 C는 반대")

    T = {"A": [2, 3, 4, None], "B": [3, 4, 5, 4], "D": [1, 5, 3, 2]}
    p = predict(T, "A", 3, neighbors=["B"])
    assert abs(p - 3) < 1e-12
    print("[OK] 평균 보정: B보다 늘 1점 짠 A의 네 번째 평점을 3으로 맞힌다 (B는 4)")
    pw = predict(T, "A", 3, mode="weighted", neighbors=["B"])
    assert pw == 4
    print("[OK] 보정 없는 가중 합은 B의 4를 그대로 쓴다")

    items = [[R[u][i] for u in "ABC"] for i in range(6)]
    s34 = pcc(items[2], items[3]); s35 = pcc(items[2], items[4])
    assert s34 > 0 > s35
    print(f"[OK] 아이템 기반: i3-i4 유사도 {s34:.3f} > 0 > i3-i5 {s35:.3f}")

    assert pcc([5, None, 3], [4, 2, None]) is None
    print("[OK] 함께 평가한 아이템이 하나면 피어슨 정의 불가 (차가운 시작)")

    # 카드 C3: 평균 보정 예측 계산
    U = {"c": [4, 2, None], "x": [5, 3, 5], "y": [2, 4, 1]}
    sx, sy = pcc(U["c"], U["x"]), pcc(U["c"], U["y"])
    assert abs(sx - 1) < 1e-12 and abs(sy + 1) < 1e-12
    pr = predict(U, "c", 2)
    assert abs(pr - 4) < 1e-12           # 3 + 1/2 · (1·(5 - 13/3) + (-1)·(1 - 7/3)) = 3 + 1/2 · 2
    print(f"[OK] 카드 C3: sim 1, -1, 예측 {pr}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
