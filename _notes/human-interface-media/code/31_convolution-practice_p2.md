---
layout: "note"
title: "31_convolution-practice_p2.py"
display_title: "31_convolution-practice_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "31"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/convolution-practice/"
parent_title: "합성곱 연습"
description: "휴먼 인터페이스 미디어 · 합성곱 연습 문제 2 풀이 코드"
permalink: "/studies/human-interface-media/code/31_convolution-practice_p2/"
---
{% raw %}
[합성곱 연습](/Hongs_Blog/studies/human-interface-media/convolution-practice/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""합성곱 연습 p1·p2: 사각 펄스끼리의 합성곱 (강의 6 p.12~13).

p1: f = h = 1 (0 ≤ t < 1)이면 f * h는 0~1에서 t, 1~2에서 2 - t인 삼각형.
p2: x = 2 (0 ≤ t < 2), h = 1 (0 ≤ t < 1)이면
    y = 0 (t < 0), 2t (0~1), 2 (1~2), 2(3 - t) (2~3), 0 (t > 3).
연속 합성곱은 간격 dt로 잘게 나눈 리만 합으로 근사한다.
"""


def rect(a, b, height=1.0):
    return lambda t: height if a <= t < b else 0.0


def conv_at(f, h, t, lo=-1.0, hi=5.0, dt=1e-3):
    n = int((hi - lo) / dt)
    return sum(f(lo + (k + 0.5) * dt) * h(t - (lo + (k + 0.5) * dt)) for k in range(n)) * dt


def main() -> None:
    f = h = rect(0, 1)
    tri = lambda t: t if 0 <= t <= 1 else (2 - t if 1 < t <= 2 else 0.0)
    for t in [-0.5, 0.25, 0.5, 1.0, 1.5, 1.9, 2.5]:
        assert abs(conv_at(f, h, t) - tri(t)) < 5e-3
    x, h2 = rect(0, 2, 2.0), rect(0, 1)
    def y(t):
        if t < 0 or t > 3:
            return 0.0
        if t <= 1:
            return 2 * t
        if t <= 2:
            return 2.0
        return 2 * (3 - t)
    for t in [-0.5, 0.3, 0.9, 1.4, 2.0, 2.6, 3.4]:
        assert abs(conv_at(x, h2, t) - y(t)) < 1e-2
    h3 = rect(0, 2)                                    # 변형 1: h 폭 2 → 꼭대기 (2, 4)인 삼각형
    for t, want in [(1.0, 2.0), (2.0, 4.0), (3.0, 2.0), (4.2, 0.0)]:
        assert abs(conv_at(x, h3, t) - want) < 1e-2
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
