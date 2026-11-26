---
layout: "note"
title: "38_chromaticity-mixing-ladder_p4.py"
display_title: "38_chromaticity-mixing-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "38"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/chromaticity-mixing-ladder/"
parent_title: "색도도 혼합 예제 사다리"
description: "휴먼 인터페이스 미디어 · 색도도 혼합 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p4/"
---
{% raw %}
[색도도 혼합 예제 사다리](/Hongs_Blog/studies/human-interface-media/chromaticity-mixing-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""색도도 혼합 예제 사다리, 문제 4.

실행: python3 -I 38_chromaticity-mixing-ladder_p4.py  (표준 라이브러리만 쓴다)
문제 4: 광원 A(0.2, 0.2), B(0.6, 0.3), C(0.1, 0.4)로 선명한 초록 T(0.3, 0.6)를 만들 수 있는가?
  답: 몫이 A -4/3, B 2/3, C 5/3. A가 음수라 만들 수 없다.
  T는 변 BC를 사이에 두고 A의 반대편에 있다(직선 BC: x + 5y = 2.1).
"""
from fractions import Fraction as F


def bary(P, W):
    (x1, y1), (x2, y2), (x3, y3) = P
    x, y = W
    det = (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)
    a = ((x - x3) * (y2 - y3) - (x2 - x3) * (y - y3)) / det
    b = ((x1 - x3) * (y - y3) - (x - x3) * (y1 - y3)) / det
    return a, b, 1 - a - b


def main():
    A, B, C = (F(2, 10), F(2, 10)), (F(6, 10), F(3, 10)), (F(1, 10), F(4, 10))
    T = (F(3, 10), F(6, 10))
    lam = bary([A, B, C], T)
    assert lam == (F(-4, 3), F(2, 3), F(5, 3)), lam
    # 손 풀이 중간 식 (gamma = 1 - alpha - beta를 넣은 뒤): 0.1a + 0.5b = 0.2, 0.2a + 0.1b = -0.2
    a, b, _ = lam
    assert F(1, 10) * a + F(5, 10) * b == F(2, 10) and F(2, 10) * a + F(1, 10) * b == F(-2, 10)
    # 대입하면 T가 나온다 (수학으로는 맞지만 A의 양이 음수)
    back = (sum(l * P[0] for l, P in zip(lam, (A, B, C))), sum(l * P[1] for l, P in zip(lam, (A, B, C))))
    assert back == T
    # 직선 BC: x + 5y = 2.1. A는 1.2 < 2.1, T는 3.3 > 2.1 이라 서로 반대편
    line = lambda p: p[0] + 5 * p[1]
    assert line(B) == line(C) == F(21, 10)
    assert line(A) < F(21, 10) < line(T)
    print("[OK] 문제 4: 몫 (-4/3, 2/3, 5/3), A가 음수라 못 만든다. T와 A는 직선 BC의 반대편")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
