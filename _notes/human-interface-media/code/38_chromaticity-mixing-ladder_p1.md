---
layout: "note"
title: "38_chromaticity-mixing-ladder_p1.py"
display_title: "38_chromaticity-mixing-ladder_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "38"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/chromaticity-mixing-ladder/"
parent_title: "색도도 혼합 예제 사다리"
description: "휴먼 인터페이스 미디어 · 색도도 혼합 예제 사다리 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p1/"
---
{% raw %}
[색도도 혼합 예제 사다리](/Hongs_Blog/studies/human-interface-media/chromaticity-mixing-ladder/) 문서의 문제 1 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""색도도 혼합 예제 사다리, 문제 1과 변형 1·3.

실행: python3 -I 38_chromaticity-mixing-ladder_p1.py  (표준 라이브러리만 쓴다)
문제 1: 빛 P(0.6, 0.3), Q(0.2, 0.7)로 목표 T(0.5, 0.4)를 만드는 비율.
  답: 몫(X+Y+Z의 비) P : Q = 3 : 1, 휘도 비 9 : 7.
변형 1: 같은 두 빛으로 (0.4, 0.4)를 만들 수 있는가? 답: 직선 x + y = 0.9 밖이라 못 만든다.
변형 3: 몫 3 : 1을 휘도 비로 착각해 휘도 3과 1로 켜면 색도는 (0.55, 0.35)가 된다.
"""
from fractions import Fraction as F


def two_light_share(P, Q, T):
    """T = lam*P + (1-lam)*Q 의 lam. 직선 위가 아니면 None."""
    (px, py), (qx, qy), (tx, ty) = P, Q, T
    cross = (qx - px) * (ty - py) - (qy - py) * (tx - px)
    if cross != 0:
        return None
    if qx != px:
        return (qx - tx) / (qx - px)
    return (qy - ty) / (qy - py)


def mix(lights):
    """lights: [(x, y, 휘도 Y)]. 무게 S = Y / y로 평균 낸 색도."""
    S = [Y / y for _, y, Y in lights]
    tot = sum(S)
    return sum(s * x for s, (x, _, _) in zip(S, lights)) / tot, sum(s * y for s, (_, y, _) in zip(S, lights)) / tot


def main():
    P, Q, T = (F(6, 10), F(3, 10)), (F(2, 10), F(7, 10)), (F(5, 10), F(4, 10))
    # 세 점이 모두 x + y = 0.9 위
    assert P[0] + P[1] == Q[0] + Q[1] == T[0] + T[1] == F(9, 10)
    lam = two_light_share(P, Q, T)
    assert lam == F(3, 4)
    yp, yq = lam * P[1], (1 - lam) * Q[1]
    assert yp / yq == F(9, 7)
    # 휘도 9, 7로 켜서 다시 섞으면 T가 나온다
    assert mix([(P[0], P[1], 9), (Q[0], Q[1], 7)]) == T
    print("[OK] 문제 1: 몫 3 : 1, 휘도 비 9 : 7, 휘도 9와 7로 섞으면 (0.5, 0.4)")

    # 변형 1
    assert two_light_share(P, Q, (F(4, 10), F(4, 10))) is None
    print("[OK] 변형 1: (0.4, 0.4)는 x + y = 0.8이라 직선 밖, 두 빛으로 못 만든다")

    # 변형 3
    wrong = mix([(P[0], P[1], 3), (Q[0], Q[1], 1)])
    assert wrong == (F(55, 100), F(35, 100)), wrong
    print("[OK] 변형 3: 휘도 3과 1로 켜면 (0.55, 0.35)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
