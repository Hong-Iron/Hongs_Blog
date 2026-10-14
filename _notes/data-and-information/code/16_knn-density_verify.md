---
layout: "note"
title: "16_knn-density_verify.py"
display_title: "16_knn-density_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "16"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/data-and-information/knn-density/"
parent_title: "k-이웃 밀도 추정"
description: "자료와 정보 · k-이웃 밀도 추정 검증 코드"
sitemap: false
permalink: "/studies/data-and-information/code/16_knn-density_verify/"
---
{% raw %}
[k-이웃 밀도 추정](/Hongs_Blog/studies/data-and-information/knn-density/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# k-이웃 밀도 추정 문서의 값을 확인한다. 실행: python3 16_knn-density_verify.py (표준 라이브러리만)
# 1차원에서 x의 k번째로 가까운 표본까지 거리가 r이면 구간은 [x - r, x + r], 부피(길이) V = 2r.
from fractions import Fraction as F

DATA = [3, 4, 5, 5, 6, 7, 12, 13, 14, 20]
LABEL = ["남", "남", "남", "남", "남", "여", "남", "여", "여", "여"]     # 같은 순서
N = len(DATA)


def kth_radius(x, k, data=DATA):
    return sorted(abs(F(x) - d) for d in data)[k - 1]


def knn_density(x, k, data=DATA):
    r = kth_radius(x, k, data)
    return F(k, len(data)) / (2 * r)                 # (k/n)/V


def knn_vote(x, k):
    order = sorted(range(N), key=lambda i: abs(F(x) - DATA[i]))[:k]
    votes = {}
    for i in order:
        votes[LABEL[i]] = votes.get(LABEL[i], 0) + 1
    return votes


def window_vote(x, h):
    votes = {}
    for d, l in zip(DATA, LABEL):
        if abs(F(x) - d) <= F(h, 2):
            votes[l] = votes.get(l, 0) + 1
    return votes


def main():
    x1, x2 = F(26, 5), F(48, 5)                      # 5.2, 9.6
    # 추적 표: x = 9.6에서 가까운 순서
    order = sorted(DATA, key=lambda d: abs(x2 - d))
    assert order[:5] == [12, 7, 13, 6, 14]
    assert [kth_radius(x2, k) for k in (1, 2, 3, 4, 5)] == [F(12, 5), F(13, 5), F(17, 5), F(18, 5), F(22, 5)]
    assert knn_density(x2, 3) == F(3, 68) and abs(float(F(3, 68)) - 0.0441) < 5e-5
    assert knn_density(x2, 5) == F(5, 88) and abs(float(F(5, 88)) - 0.0568) < 5e-5
    print("[OK] x = 9.6: 가까운 순서 12, 7, 13, 6, 14 / k = 3 → r = 3.4, p = 0.0441 / k = 5 → r = 4.4, p = 0.0568")

    assert kth_radius(x1, 3) == F(4, 5) and knn_density(x1, 3) == F(3, 16)       # 0.1875
    assert kth_radius(x1, 5) == F(9, 5) and knn_density(x1, 5) == F(5, 36)       # 0.1389
    assert abs(float(F(5, 36)) - 0.1389) < 5e-5
    print("[OK] x = 5.2: k = 3 → r = 0.8, p = 0.1875 / k = 5 → r = 1.8, p = 0.1389")

    # 표본이 몰린 곳에서는 구간이 좁고, 드문 곳에서는 넓다
    assert kth_radius(x1, 3) < kth_radius(x2, 3)
    # 어디서도 0이 아니다 (표본 위가 아닌 곳)
    grid = [F(i, 10) + F(1, 20) for i in range(-100, 400)]
    assert all(knn_density(t, 3) > 0 for t in grid)
    print("[OK] 몰린 곳은 구간이 좁다. k = 3 추정값은 격자 500곳 모두에서 0보다 크다")

    # k = 1이면 표본 바로 위에서 r = 0이라 값이 끝없이 커진다
    assert kth_radius(12, 1) == 0
    assert knn_density(F(1201, 100), 1) == 5 and knn_density(F(12001, 1000), 1) == 50
    # 같은 값이 둘인 5에서는 k = 2에서도 r = 0
    assert kth_radius(5, 2) == 0
    print("[OK] k = 1: 12에서 0.01 떨어지면 5, 0.001 떨어지면 50. 표본 위에서는 r = 0")

    # 멀리 가면 1/x처럼 천천히 줄어 넓이가 1을 넘어 계속 커진다
    assert knn_density(30, 3) == F(3, 340)
    def area(lo, hi, k, step=F(1, 20)):
        tot, t = 0.0, F(lo) + step / 2
        while t < hi:
            tot += float(knn_density(t, k)) * float(step)
            t += step
        return tot
    a1, a2, a3 = area(-100, 120, 3), area(-1000, 1020, 3), area(-10000, 10020, 3, F(1, 2))
    assert 1 < a1 < a2 < a3
    assert abs((a2 - a1) - 0.3 * 2.3) < 0.1          # 범위를 10배 넓힐 때마다 약 (k/n)·ln 10 씩 는다
    print(f"[OK] k = 3 추정 곡선 아래 넓이: 범위를 넓히면 {a1:.2f} → {a2:.2f} → {a3:.2f} (1에 머물지 않는다)")

    # 분류: 가까운 k개 중 많은 쪽
    assert knn_vote(x1, 3) == {"남": 3}
    assert knn_vote(x2, 3) == {"남": 1, "여": 2}
    assert window_vote(x2, 4) == {}
    assert window_vote(x2, 10) == {"남": 4, "여": 3}
    print("[OK] 분류: x = 5.2, k = 3 → 남 3 / x = 9.6, k = 3 → 여 2, 남 1 / 창 폭 4는 0명, 창 폭 10은 남 4, 여 3")

    # 카드 C2 (추적): 자료 1, 2, 4, 8, 16, x = 5, k = 2 → 거리 1, 3, 3, 4, 11 → r = 3, p = (2/5)/6 = 1/15
    d = [1, 2, 4, 8, 16]
    assert sorted(abs(5 - v) for v in d) == [1, 3, 3, 4, 11]
    assert kth_radius(5, 2, d) == 3 and knn_density(5, 2, d) == F(1, 15)
    print("[OK] 카드 C2: r = 3, p = 1/15")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
