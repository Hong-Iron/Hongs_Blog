---
layout: "note"
title: "28_choosing-k_verify.py"
display_title: "28_choosing-k_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/choosing-k/"
parent_title: "군집 수 고르기"
description: "데이터 과학 · 군집 수 고르기 검증 코드"
permalink: "/studies/data-science/code/28_choosing-k_verify/"
---
{% raw %}
[군집 수 고르기](/Hongs_Blog/studies/data-science/choosing-k/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""군집 수 고르기(엘보, 실루엣) 검증.

문서: 28.군집 수 고르기 (예시, 정의, 원본 오류 의심, 카드)
출처: 데이터 과학 7회 슬라이드 7-1 p.17~20
식: a(i) = 같은 군집 다른 점까지 평균 거리, b(i) = 다른 군집들 중 평균 거리가 가장 작은 군집까지의 평균 거리,
    s(i) = (b - a) / max(a, b), S = 평균 s(i).
주장:
  1. a는 작을수록 응집, b는 클수록 분리 (슬라이드의 "높을수록/낮을수록" 설명은 반대).
  2. s(i)는 -1 ~ 1. 다른 군집에 더 가까운 점은 s < 0 (슬라이드의 "s(i) < 1"은 "s(i) < 0"이어야 한다).
  3. 1차원 점 1, 2, 3 / 10, 11, 12 / 20, 21, 22: 엘보가 k = 3에서 꺾이고 실루엣도 k = 3에서 가장 크다.
  4. 카드 C2: 군집 A = {0, 1}, B = {5, 6}에서 점 1의 a = 1, b = 4.5, s = 3.5/4.5 ≈ 0.778.
"""
from itertools import product


def sil(X, lab):
    ks = sorted(set(lab)); out = []
    for i, x in enumerate(X):
        same = [abs(x - y) for j, y in enumerate(X) if lab[j] == lab[i] and j != i]
        if not same:
            out.append(0.0); continue
        a = sum(same) / len(same)
        b = min(sum(abs(x - y) for j, y in enumerate(X) if lab[j] == c) / lab.count(c) for c in ks if c != lab[i])
        out.append((b - a) / max(a, b))
    return out


def best(X, k):
    bj, bl = None, None
    for lab in product(range(k), repeat=len(X)):
        if len(set(lab)) < k or lab[0] != 0:
            continue
        cents = [sum(x for x, l in zip(X, lab) if l == c) / lab.count(c) for c in range(k)]
        j = sum((x - cents[l]) ** 2 for x, l in zip(X, lab))
        if bj is None or j < bj:
            bj, bl = j, list(lab)
    return bj, bl


def main():
    X = [1, 2, 3, 10, 11, 12, 20, 21, 22]
    res = {k: best(X, k) for k in range(1, 6)}
    Js = [res[k][0] for k in range(1, 6)]
    drops = [Js[i] - Js[i + 1] for i in range(4)]
    print("     k별 J:", [round(j, 1) for j in Js], "줄어든 양:", [round(d, 1) for d in drops])
    assert drops[1] > 10 * drops[2]
    S = {k: sum(sil(X, res[k][1])) / len(X) for k in range(2, 6)}
    print("     k별 평균 실루엣:", {k: round(v, 3) for k, v in S.items()})
    assert max(S, key=S.get) == 3
    print("[OK] 엘보와 실루엣 모두 k = 3")

    s = sil([0, 1, 5, 6], [0, 0, 1, 1])
    assert abs(s[1] - 3.5 / 4.5) < 1e-12
    print("[OK] 카드 C2: s = 3.5/4.5 ≈ 0.778")
    bad = sil([0, 1, 5, 6], [0, 1, 1, 1])
    assert bad[1] < 0
    print(f"[OK] 점 1을 B에 잘못 넣으면 s = {bad[1]:.3f} < 0")
    for lab in product(range(2), repeat=6):
        if len(set(lab)) == 2:
            assert all(-1 <= v <= 1 for v in sil([0, 1, 2, 7, 8, 9], list(lab)))
    print("[OK] 모든 2분할에서 -1 <= s <= 1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
