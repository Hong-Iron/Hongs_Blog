---
layout: "note"
title: "31_convolution-practice_p4.py"
display_title: "31_convolution-practice_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "31"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/convolution-practice/"
parent_title: "합성곱 연습"
description: "휴먼 인터페이스 미디어 · 합성곱 연습 문제 4 풀이 코드"
permalink: "/studies/human-interface-media/code/31_convolution-practice_p4/"
---
{% raw %}
[합성곱 연습](/Hongs_Blog/studies/human-interface-media/convolution-practice/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""합성곱 연습 p3·p4: 임펄스와의 합성곱과 강의 6 p.15 문제 2의 네 줄.

x는 0 ≤ t < 0.5에서 1인 사각 펄스(둘째 줄은 1 ≤ t < 1.5의 펄스가 하나 더 있다).
  줄 1: h = 같은 펄스 → 0~1의 삼각형, 꼭대기 (0.5, 0.5)
  줄 2: x가 펄스 둘 → 0~1과 1~2에 같은 삼각형 둘
  줄 3: h = δ(t - 1) → x를 1만큼 옮긴 펄스, 1 ≤ t < 1.5
  줄 4: h = δ(t - 0.5) + c δ(t - 1.5) → 0.5~1에 높이 1, 1.5~2에 높이 c인 펄스 둘
        (c는 슬라이드 화살표 높이로 읽은 값, 약 1/2)
임펄스와의 합성곱은 x를 그 자리로 옮겨 놓는 일이라 식으로 바로 계산한다.
"""


def pulse(a, b, height=1.0):
    return lambda t: height if a <= t < b else 0.0


def conv_at(f, h, t, lo=-1.0, hi=4.0, dt=1e-3):
    n = int((hi - lo) / dt)
    return sum(f(lo + (k + 0.5) * dt) * h(t - (lo + (k + 0.5) * dt)) for k in range(n)) * dt


def main() -> None:
    x = pulse(0, 0.5)
    # 줄 1
    tri = lambda t: t if 0 <= t <= 0.5 else (1 - t if 0.5 < t <= 1 else 0.0)
    for t in [0.1, 0.5, 0.8, 1.2]:
        assert abs(conv_at(x, x, t) - tri(t)) < 5e-3
    # 줄 2
    x2 = lambda t: x(t) + x(t - 1)
    for t in [0.5, 1.0, 1.5, 1.75]:
        assert abs(conv_at(x2, x, t) - (tri(t) + tri(t - 1))) < 5e-3
    assert abs(conv_at(x2, x, 1.5) - 0.5) < 5e-3
    # 줄 3, 4: δ(t - a)와의 합성곱은 x(t - a)
    shift = lambda f, a: (lambda t: f(t - a))
    y3 = shift(x, 1)
    assert y3(0.9) == 0 and y3(1.2) == 1 and y3(1.6) == 0
    c = 0.5
    y4 = lambda t: x(t - 0.5) + c * x(t - 1.5)
    assert y4(0.7) == 1 and y4(1.2) == 0 and y4(1.7) == 0.5 and y4(2.1) == 0
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
