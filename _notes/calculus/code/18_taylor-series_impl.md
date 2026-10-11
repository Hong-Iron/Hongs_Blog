---
layout: "note"
title: "18_taylor-series_impl.py"
display_title: "18_taylor-series_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "18"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/taylor-series/"
parent_title: "테일러 급수"
description: "미분적분학 · 테일러 급수 구현 코드"
permalink: "/studies/calculus/code/18_taylor-series_impl/"
---
{% raw %}
[테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""테일러 급수로 exp와 sin 계산하기.

문서: 18.테일러 급수 (활용)
exp(x): x = k·ln 2 + r (|r| <= ln2/2 ≈ 0.347)로 나눠 e^x = 2^k · e^r. e^r은 테일러 급수를 항이 충분히 작아질 때까지 더한다.
       ln 2를 한 번에 곱하면 x가 클 때 r의 오차가 커져서, ln 2를 두 조각으로 나눠 뺀다.
sin(x): x를 2π의 배수만큼 옮겨 [-π, π]로 가져온 뒤 테일러 급수를 더한다.
실제 수학 라이브러리는 같은 "범위 줄이기 + 짧은 다항식" 구조를 쓰되, 계수를 오차가 고르게 퍼지는 다항식(최소최대 근사)으로 고른다.
"""
import math

LN2 = math.log(2)
# ln 2를 앞부분(뒤쪽 비트가 0)과 나머지로 나눈 상수(fdlibm의 값). k·LN2_HI가 정확히 계산되어
# x - k·ln 2의 반올림 오차가 커지지 않는다(코디–웨이트 방식).
LN2_HI = 6.93147180369123816490e-01
LN2_LO = 1.90821492927058770002e-10


def taylor_exp_small(r, tol=1e-17):
    """|r|이 작을 때 Σ r^k/k!. 반환: (값, 더한 항 수)."""
    term, total, k = 1.0, 1.0, 0
    while abs(term) > tol * abs(total):
        k += 1
        term *= r / k
        total += term
    return total, k + 1


def my_exp(x):
    if x > 709.78:
        raise OverflowError("배정밀도로 나타낼 수 없는 크기")
    k = round(x / LN2)
    r = (x - k * LN2_HI) - k * LN2_LO
    er, _ = taylor_exp_small(r)
    return math.ldexp(er, k)  # er × 2^k


def my_sin(x, tol=1e-17):
    x = math.remainder(x, 2 * math.pi)  # [-π, π]
    term, total, k = x, x, 1
    while abs(term) > tol * max(1.0, abs(total)):
        term *= -x * x / ((k + 1) * (k + 2))
        k += 2
        total += term
    return total


if __name__ == "__main__":
    for x in [-700, -50.5, -1, -1e-8, 0, 1e-8, 0.5, 1, 10, 100.25, 700]:
        got, ref = my_exp(x), math.exp(x)
        assert abs(got - ref) <= 5e-16 * ref, (x, got, ref)
    _, terms = taylor_exp_small(LN2 / 2)
    assert terms <= 16
    for x in [-20.0, -3.0, -0.1, 0.0, 0.3, 1.0, 2.5, 3.1, 50.0]:
        assert abs(my_sin(x) - math.sin(x)) < 1e-14 * max(1.0, abs(x)), x
    try:
        my_exp(1000)
        raise AssertionError("예외가 나야 한다")
    except OverflowError:
        pass
    print(f"|r| <= ln2/2에서 필요한 항 수: {terms}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
