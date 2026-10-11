---
layout: "note"
title: "15_parzen-window_verify.py"
display_title: "15_parzen-window_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "확률과 데이터"
parent_url: "/studies/data-and-information/parzen-window/"
parent_title: "파젠 창"
description: "자료와 정보 · 파젠 창 검증 코드"
permalink: "/studies/data-and-information/code/15_parzen-window_verify/"
---
{% raw %}
[파젠 창](/Hongs_Blog/studies/data-and-information/parzen-window/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 파젠 창 문서의 값을 확인한다. 실행: python3 15_parzen-window_verify.py (표준 라이브러리만)
# 창 함수 phi(u)는 |u| <= 1/2이면 1, 아니면 0이다(1차원 상자). 창 폭 h, 부피 V = h^d.
import math
from fractions import Fraction as F

DATA = [3, 4, 5, 5, 6, 7, 12, 13, 14, 20]
N = len(DATA)


def phi(u):
    """u는 좌표들의 튜플. 모든 좌표가 [-1/2, 1/2] 안이면 1."""
    return 1 if all(abs(c) <= F(1, 2) for c in u) else 0


def k_in_window(x, h, data=DATA):
    return sum(phi(((F(x) - xi) / h,)) for xi in data)


def parzen(x, h, data=DATA):
    return F(k_in_window(x, h, data), len(data)) / h      # (k/n)/V, V = h (1차원)


def parzen_gauss(x, h, data=DATA):
    return sum(math.exp(-((x - xi) / h) ** 2 / 2) / math.sqrt(2 * math.pi) for xi in data) / (len(data) * h)


def main():
    x1, x2, x3, x4 = F(26, 5), F(48, 5), F(79, 10), F(81, 10)    # 5.2, 9.6, 7.9, 8.1
    assert [k_in_window(x1, h) for h in (1, 4, 10)] == [2, 5, 6]
    assert [parzen(x1, h) for h in (1, 4, 10)] == [F(1, 5), F(1, 8), F(3, 50)]
    assert [k_in_window(x2, h) for h in (1, 4, 10)] == [0, 0, 7]
    assert [parzen(x2, h) for h in (1, 4, 10)] == [0, 0, F(7, 100)]
    print("[OK] p(5.2): h = 1, 4, 10에서 0.2, 0.125, 0.06 / p(9.6): 0, 0, 0.07")

    # 창은 x를 따라 움직이므로 칸 경계에서 뚝 끊기지 않는다
    assert parzen(x3, 4) == F(1, 20) and parzen(x4, 4) == F(1, 40)
    print("[OK] h = 4: p(7.9) = 0.05, p(8.1) = 0.025")

    # 두 번째 식: 표본마다 높이 1/V인 상자를 놓고 평균 낸 것과 같다
    for h in (1, 4, 10):
        for x in (x1, x2, x3, x4, F(0), F(13), F(25)):
            delta = lambda t: F(phi((t / h,)), h)             # delta_n(t) = phi(t/h)/V
            assert sum(delta(F(x) - xi) for xi in DATA) / N == parzen(x, h)
    print("[OK] (k/n)/V 와 (1/n) * sum delta_n(x - x_i) 가 같다")

    # 넓이는 늘 1 (상자 하나의 넓이가 h * (1/h) = 1, 그것 n개의 평균)
    for h in (1, 4, 10):
        step = F(1, 100)
        total = 0
        t = F(-10) + step / 2
        while t < 40:
            total += parzen(t, h) * step
            t += step
        assert abs(total - 1) < F(1, 50), (h, float(total))
    print("[OK] 창 폭 1, 4, 10에서 추정 곡선 아래 넓이는 1 (격자 합)")

    # 창이 너무 작으면 대부분의 x에서 0, 너무 크면 두 무리가 한 덩어리
    def zero_length(h, lo=0, hi=24):
        """[lo, hi]에서 어느 표본의 창에도 덮이지 않는 길이 (구간 합치기로 정확히)."""
        iv = sorted((max(lo, d - F(h, 2)), min(hi, d + F(h, 2))) for d in DATA)
        covered, end = 0, lo
        for a, b in iv:
            a = max(a, end)
            if b > a:
                covered += b - a
                end = b
        return (hi - lo) - covered
    assert [zero_length(h) for h in (1, 4, 10)] == [15, 6, 0]
    # h = 10이면 7과 12 사이 골짜기(9.6)가 양쪽 무리 한가운데(5.2, 13)보다 낮지 않다
    assert parzen(x2, 10) >= parzen(x1, 10) and parzen(x2, 10) >= parzen(13, 10)
    # h = 4면 골짜기가 보인다
    assert parzen(x2, 4) < parzen(x1, 4) and parzen(x2, 4) < parzen(13, 4)
    print("[OK] 0~24 가운데 추정값이 0인 길이: h = 1은 15, h = 4는 6, h = 10은 0. h = 10은 골짜기를 지운다")

    # 2차원: V = h^2. 점 (1,1), (2,1), (4,4)와 x = (1.5, 1.5), h = 2 → 2개, p = (2/3)/4 = 1/6
    pts = [(1, 1), (2, 1), (4, 4)]
    x, h = (F(3, 2), F(3, 2)), 2
    k = sum(phi(tuple((a - b) / h for a, b in zip(x, p))) for p in pts)
    assert k == 2 and F(k, 3) / h ** 2 == F(1, 6)
    print("[OK] 카드 C3 (2차원): k = 2, p = 1/6")

    # 카드 C2: 자료 2, 3, 7, x = 3, h = 2 → [2, 4]에 2개 → (2/3)/2 = 1/3
    assert parzen(3, 2, [2, 3, 7]) == F(1, 3)
    print("[OK] 카드 C2: 1/3")

    # 매끄러운 창(정규 곡선)도 넓이 1, 그리고 0이 되는 곳이 없다
    tot = sum(parzen_gauss(-30 + i * 0.01, 2) * 0.01 for i in range(8000))
    assert abs(tot - 1) < 1e-3 and parzen_gauss(9.6, 2) > 0
    print("[OK] 정규 곡선 창: 넓이 1, p(9.6) > 0")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
