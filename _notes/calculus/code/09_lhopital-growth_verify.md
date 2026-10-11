---
layout: "note"
title: "09_lhopital-growth_verify.py"
display_title: "09_lhopital-growth_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/lhopital-growth/"
parent_title: "로피탈 정리와 증가 속도"
description: "미분적분학 · 로피탈 정리와 증가 속도 검증 코드"
permalink: "/studies/calculus/code/09_lhopital-growth_verify/"
---
{% raw %}
[로피탈 정리와 증가 속도](/Hongs_Blog/studies/calculus/lhopital-growth/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""로피탈 정리와 증가 속도 검증.

문서: 09.로피탈 정리와 증가 속도 (예시, 정리, 예제, 활용, 카드 C1~C3, 자주 하는 오해)
주장 1: (e^x - 1 - x)/x² -> 1/2 (x -> 0).
주장 2: x ln x -> 0 (x -> 0+), (1 + a/x)^x -> e^a.
주장 3: ln x / x^0.1 -> 0이지만 느리다: x = 10^10에서 약 2.3, x = 10^100에서 약 2.3e-8.
주장 4: x^10 / 1.1^x -> 0 (로그로 계산).
주장 5: 로피탈을 0/0이 아닌 곳에 쓰면 틀린다: (x+1)/(x+2) -> 1/2인데 도함수의 비는 1.
주장 6: (e^x - 1)/x를 작은 x에서 그대로 계산하면 오차가 크고 math.expm1은 정확하다.
"""
import math


def main():
    for k in range(2, 6):
        x = 10.0 ** -k
        assert abs((math.expm1(x) - x) / (x * x) - 0.5) < x
    print("[OK] 주장 1·카드 C2")

    for k in range(2, 12):
        x = 10.0 ** -k
        assert abs(x * math.log(x)) < 30 * x
    for a in (1, 2, -1):
        assert abs((1 + a / 1e7) ** 1e7 - math.exp(a)) < 1e-5 * math.exp(a) * 10
    print("[OK] 주장 2")

    r10 = math.log(1e10) / (1e10) ** 0.1
    r100 = math.log(1e100) / (1e100) ** 0.1
    assert f"{r10:.1f}" == "2.3" and f"{r100:.1e}" == "2.3e-08"
    print(f"[OK] 주장 3: {r10:.2f}, {r100:.2e}")

    ratio = lambda x: math.exp(10 * math.log(x) - x * math.log(1.1))
    assert ratio(100) > 1e15 and ratio(1000) < 1e-10 and ratio(5000) < 1e-150
    print("[OK] 주장 4")

    assert abs((1e-9 + 1) / (1e-9 + 2) - 0.5) < 1e-8 and 1 / 1 == 1
    print("[OK] 주장 5·카드 C3·오해")

    x = 1e-12
    naive = (math.exp(x) - 1) / x
    good = math.expm1(x) / x
    assert abs(naive - 1) > 1e-5 and abs(good - 1) < 1e-11
    print(f"[OK] 주장 6: 그대로 {naive!r}, expm1 {good!r}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
