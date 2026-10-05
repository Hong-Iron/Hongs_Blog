---
layout: "note"
title: "06_exponential-function_verify.py"
display_title: "06_exponential-function_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/exponential-function/"
parent_title: "지수함수"
description: "대학수학 · 지수함수 검증 코드"
permalink: "/studies/college-math/code/06_exponential-function_verify/"
---
{% raw %}
[지수함수](/Hongs_Blog/studies/college-math/exponential-function/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""지수함수 검증.

문서: 06.지수함수 (예시, 정의, 예제, 활용, 카드 C1~C4, 자주 하는 오해)
주장 1: 0.1 mm 종이를 n번 접으면 0.1 × 2^n mm. 10번 10.24 cm, 20번 약 104.9 m, 42번 약 439,805 km.
주장 2: (1 + 1/n)^n은 n = 1, 2, 12, 365, 10^6에서 2, 2.25, 2.613…, 2.7146…, 2.71828…로 e에 다가간다.
주장 3: b^x의 x = 0에서의 기울기 (b^h - 1)/h는 b = 2에서 약 0.693, b = 3에서 약 1.099, b = e에서 1이다.
주장 4: 월 20% 성장 12개월은 약 8.92배, 월 +20명 선형 성장은 100 -> 340명.
주장 5: 2^50 / 10^9 초 ≈ 13.0일, 2^60 / 10^9 초 ≈ 36.5년.
주장 6: math.exp(709)는 계산되고 math.exp(710)은 OverflowError다.
주장 7: 1.01^x는 x = 917에서야 처음으로 10x를 넘는다.
주장 8: 지수함수는 같은 간격마다 같은 비율로 변한다 (표 판별, 카드 C2).
"""
import math
from fractions import Fraction as F


def main():
    fold = lambda n: 0.1 * 2 ** n  # mm
    assert math.isclose(fold(10), 102.4)                    # 10.24 cm
    assert round(fold(20) / 1000, 1) == 104.9               # m
    km42 = fold(42) / 1e6
    assert round(km42) == 439_805 and km42 > 384_400
    print(f"[OK] 종이 접기: 10번 {fold(10)/10:.2f} cm, 20번 {fold(20)/1000:.1f} m, 42번 {km42:,.0f} km")

    vals = {n: (1 + 1 / n) ** n for n in (1, 2, 12, 365, 10 ** 6)}
    assert vals[1] == 2 and vals[2] == 2.25
    assert f"{vals[12]:.4f}" == "2.6130" and f"{vals[365]:.4f}" == "2.7146" and f"{vals[10**6]:.5f}" == "2.71828"
    assert all(a < b for a, b in zip(list(vals.values()), list(vals.values())[1:]))
    print("[OK] 연속 복리: " + ", ".join(f"n={n}: {v:.5f}" for n, v in vals.items()))

    h = 1e-8
    slope = {b: (b ** h - 1) / h for b in (2, math.e, 3)}
    assert f"{slope[2]:.3f}" == "0.693" and f"{slope[3]:.3f}" == "1.099" and abs(slope[math.e] - 1) < 1e-6
    print(f"[OK] x = 0에서의 기울기: 2 -> {slope[2]:.4f}, e -> {slope[math.e]:.6f}, 3 -> {slope[3]:.4f}")

    assert f"{1.2 ** 12:.2f}" == "8.92" and 100 * 1.2 ** 12 > 891 and 100 + 12 * 20 == 340
    print(f"[OK] 예제: 1.2^12 = {1.2**12:.3f}, 12개월 뒤 {100*1.2**12:.1f}명 vs 340명")

    days50 = 2 ** 50 / 1e9 / 86400
    years60 = 2 ** 60 / 1e9 / (86400 * 365.25)
    assert round(days50, 1) == 13.0 and round(years60, 1) == 36.5
    print(f"[OK] 카드 C4: 2^50 -> {days50:.1f}일, 2^60 -> {years60:.1f}년")

    math.exp(709)
    try:
        math.exp(710)
        raise AssertionError
    except OverflowError:
        pass
    print(f"[OK] 활용: exp(709) = {math.exp(709):.3e}, exp(710)은 OverflowError")

    cross = next(x for x in range(1, 5000) if 1.01 ** x > 10 * x)
    assert cross == 917 and 1.01 ** 900 < 9000 and 1.01 ** 1000 > 10000
    print(f"[OK] 오해: 1.01^x가 10x를 처음 넘는 정수 x = {cross} (x = 100에서 {1.01**100:.2f} vs 1000)")

    def kind(ys):
        d = [b - a for a, b in zip(ys, ys[1:])]
        r = [F(b, a) for a, b in zip(ys, ys[1:])]
        if len(set(d)) == 1:
            return "선형"
        if len(set(r)) == 1:
            return "지수"
        return "둘 다 아님"

    assert kind([5, 10, 20, 40]) == "지수" and kind([5, 10, 15, 20]) == "선형" and kind([5, 10, 17, 26]) == "둘 다 아님"
    assert all(x * x + 4 * x + 5 == y for x, y in enumerate([5, 10, 17, 26]))
    print("[OK] 카드 C2: 5,10,20,40 지수 / 5,10,15,20 선형 / 5,10,17,26 = x^2 + 4x + 5")

    # 카드 C3: f(0) = 3, f(2) = 12 -> 3·2^x, f(5) = 96
    a = 3
    b = math.sqrt(12 / 3)
    assert b == 2 and a * b ** 5 == 96
    print("[OK] 카드 C3: 3·2^x, f(5) = 96")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
