---
layout: "note"
title: "08_mean-value-theorem_verify.py"
display_title: "08_mean-value-theorem_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/mean-value-theorem/"
parent_title: "평균값 정리"
description: "미분적분학 · 평균값 정리 검증 코드"
permalink: "/studies/calculus/code/08_mean-value-theorem_verify/"
---
{% raw %}
[평균값 정리](/Hongs_Blog/studies/calculus/mean-value-theorem/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""평균값 정리 검증.

문서: 08.평균값 정리 (예시, 정리, 증명, 예제, 활용, 카드 C1~C3)
주장 1: f(x) = x²를 [0, 2]에서 보면 평균 변화율 2와 같은 순간 변화율은 c = 1에서다. √x를 [0, 4]에서 보면 c = 1.
주장 2: 무작위 매끄러운 함수와 구간에서 f'(c)가 평균 변화율과 같은 c가 구간 안에 있다(격자 탐색).
주장 3: |x|를 [-1, 1]에서 보면 평균 변화율은 0인데 도함수가 0인 점은 없다(±1뿐).
주장 4: |sin x - sin y| <= |x - y| (무작위 2만 쌍).
주장 5: 구간단속: 10 km를 5분에 지나면 평균 시속 120 km이므로 어느 순간 시속 120 km였다(평균값).
"""
import math
import random


def d(f, x, h=1e-6):
    return (f(x + h) - f(x - h)) / (2 * h)


def main():
    assert (2 ** 2 - 0) / 2 == 2 and d(lambda x: x * x, 1.0) - 2 < 1e-6
    assert (math.sqrt(4) - 0) / 4 == 0.5 and abs(d(math.sqrt, 1.0) - 0.5) < 1e-6
    print("[OK] 주장 1·카드 C2: c = 1")

    rng = random.Random(8)
    fs = [math.sin, math.exp, lambda x: x ** 3 - x, lambda x: math.log(1 + x * x)]
    for _ in range(300):
        f = rng.choice(fs)
        a = rng.uniform(-2, 1); b = a + rng.uniform(0.1, 2)
        slope = (f(b) - f(a)) / (b - a)
        g = [d(f, a + (b - a) * i / 4000) - slope for i in range(1, 4000)]
        assert any(x == 0 or x * y <= 0 for x, y in zip(g, g[1:]))
    print("[OK] 주장 2: 무작위 300개 구간에서 c 존재")

    slopes = {d(abs, x) for x in [i / 100 for i in range(-100, 101) if i != 0]}
    assert (abs(1) - abs(-1)) / 2 == 0 and slopes == {1.0, -1.0} or all(abs(abs(s) - 1) < 1e-9 for s in slopes)
    print("[OK] 주장 3·카드 C3")

    for _ in range(20000):
        x, y = rng.uniform(-50, 50), rng.uniform(-50, 50)
        assert abs(math.sin(x) - math.sin(y)) <= abs(x - y) + 1e-15
    print("[OK] 주장 4")

    assert 10 / (5 / 60) == 120
    print("[OK] 주장 5")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
