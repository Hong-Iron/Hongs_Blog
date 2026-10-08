---
layout: "note"
title: "04_derivative_verify.py"
display_title: "04_derivative_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/derivative/"
parent_title: "도함수"
description: "미분적분학 · 도함수 검증 코드"
permalink: "/studies/calculus/code/04_derivative_verify/"
---
{% raw %}
[도함수](/Hongs_Blog/studies/calculus/derivative/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""도함수 검증.

문서: 04.도함수 (예시, 정의, 증명, 예제, 활용, 카드 C1~C4, 자주 하는 오해)
주장 1: x²의 평균 변화율 (f(3+h) - f(3))/h = 6 + h는 h -> 0에서 6이다 (유리수로 정확히).
주장 2: 1/x의 도함수는 -1/x² (정의의 몫이 -1/(x(x+h))와 같음을 정확히 확인).
주장 3: |x|는 0에서 오른쪽 몫 1, 왼쪽 몫 -1이라 미분 불가능. 대칭 차분은 0으로 수렴해 "미분 가능"처럼 보인다.
주장 4: x^(1/3)은 0에서 몫 h^(-2/3)이 한없이 커진다(세로 접선).
주장 5: 부동소수점 전진 차분 (e^h - 1)/h의 오차는 h = 1e-8 근처에서 가장 작고, h를 더 줄이면 오히려 커진다.
        중앙 차분은 h = 1e-5 근처가 가장 좋다.
"""
import math
from fractions import Fraction as F


def main():
    f = lambda x: x * x
    for k in range(1, 20):
        h = F(1, 10 ** k)
        assert (f(3 + h) - f(3)) / h == 6 + h
    print("[OK] 주장 1·카드 C2: 몫 = 6 + h")

    for x in (F(1), F(2), F(-3), F(5, 7)):
        for k in range(1, 10):
            h = F(1, 10 ** k)
            assert (1 / (x + h) - 1 / x) / h == -1 / (x * (x + h))
    print("[OK] 주장 2")

    for k in range(1, 15):
        h = 10.0 ** -k
        assert (abs(h) - 0) / h == 1 and (abs(-h) - 0) / (-h) == -1
        assert (abs(h) - abs(-h)) / (2 * h) == 0
    print("[OK] 주장 3·카드 C3: |x|")

    for k in range(1, 10):
        h = 10.0 ** -k
        assert abs(h ** (1 / 3) / h - h ** (-2 / 3)) < 1e-6 * h ** (-2 / 3)
    print("[OK] 주장 4: 몫이 발산")

    errs_fwd = {k: abs((math.exp(10.0 ** -k) - 1) / 10.0 ** -k - 1) for k in range(1, 16)}
    errs_ctr = {k: abs((math.exp(10.0 ** -k) - math.exp(-10.0 ** -k)) / (2 * 10.0 ** -k) - 1) for k in range(1, 16)}
    best_f = min(errs_fwd, key=errs_fwd.get)
    best_c = min(errs_ctr, key=errs_ctr.get)
    assert best_f in (7, 8, 9) and errs_fwd[15] > errs_fwd[best_f] * 1000
    assert best_c in (4, 5, 6)
    print(f"[OK] 주장 5·카드 C4: 전진 차분 최적 h = 1e-{best_f} (오차 {errs_fwd[best_f]:.1e}), h = 1e-15이면 {errs_fwd[15]:.1e}; 중앙 차분 최적 1e-{best_c}")
    for k in (1, 4, 8, 12, 15):
        print(f"     h = 1e-{k:<2}  전진 {errs_fwd[k]:.1e}  중앙 {errs_ctr[k]:.1e}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
