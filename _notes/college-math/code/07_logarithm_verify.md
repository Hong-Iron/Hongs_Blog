---
layout: "note"
title: "07_logarithm_verify.py"
display_title: "07_logarithm_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/logarithm/"
parent_title: "로그"
description: "대학수학 · 로그 검증 코드"
permalink: "/studies/college-math/code/07_logarithm_verify/"
---
{% raw %}
[로그](/Hongs_Blog/studies/college-math/logarithm/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""로그 검증.

문서: 07.로그 (예시, 정의, 증명, 예제, 활용, 카드 C1~C4, 자주 하는 오해)
      4.연습문제/07.로그 계산 예제 사다리 (문제 1~4와 변형)
주장 1: 로그 법칙 log_b(xy) = log_b x + log_b y, log_b(x/y), log_b(x^r) = r log_b x, 밑변환 공식.
주장 2: 2^20 = 1,048,576 ≈ 10^6이고 lg 10^6 ≈ 19.93, lg 10^9 ≈ 29.9.
주장 3: 2^x = 1000의 해는 약 9.966, 월 20% 성장의 두 배 시간은 약 3.80개월, log2 48 - log2 3 = 4.
주장 4: n^(lg 3) = 3^(lg n) (a^(log_b c) = c^(log_b a)).
주장 5: 0.01을 1000번 곱하면 부동소수점에서 0.0이 되고(가장 작은 양수 약 4.94e-324보다 작다), 로그의 합은 약 -4605.17이다.
주장 6: math.log(x)는 자연로그이고, math.log(1000, 10)은 3.0이 아니라 2.9999999999999996이다.
주장 7: log10(1 + 1) ≠ log10 1 + log10 1.
"""
import math
import random


def main():
    rng = random.Random(7)
    for _ in range(5000):
        x, y = rng.uniform(1e-6, 1e6), rng.uniform(1e-6, 1e6)
        b = rng.choice([2, math.e, 10, 0.5, 7.3])
        r = rng.uniform(-20, 20)
        L = lambda t: math.log(t) / math.log(b)
        assert math.isclose(L(x * y), L(x) + L(y), rel_tol=1e-9, abs_tol=1e-9)
        assert math.isclose(L(x / y), L(x) - L(y), rel_tol=1e-9, abs_tol=1e-9)
        assert math.isclose(L(x ** r) if 1e-300 < x ** r < 1e300 else r * L(x), r * L(x), rel_tol=1e-9, abs_tol=1e-9)
        assert math.isclose(math.log2(x), math.log10(x) / math.log10(2), rel_tol=1e-12, abs_tol=1e-12)
    # 정수로 정확히: 2^a * 2^b = 2^(a+b) 이므로 비트 길이로 확인
    for a in range(0, 200):
        for c in range(0, 50):
            assert (2 ** a * 2 ** c).bit_length() - 1 == a + c
    print("[OK] 로그 법칙과 밑변환: 무작위 5,000세트 (밑 2, e, 10, 0.5, 7.3)")

    assert 2 ** 20 == 1_048_576
    assert f"{math.log2(1e6):.2f}" == "19.93" and f"{math.log2(1e9):.1f}" == "29.9"
    print(f"[OK] 예시: lg 10^6 = {math.log2(1e6):.2f}, lg 10^9 = {math.log2(1e9):.2f}")

    x = math.log(1000) / math.log(2)
    assert f"{x:.3f}" == "9.966" and math.isclose(2 ** x, 1000)
    t = math.log(2) / math.log(1.2)
    assert f"{t:.2f}" == "3.80" and math.isclose(1.2 ** t, 2)
    assert math.log2(48) - math.log2(3) == 4.0
    print(f"[OK] 예제·카드 C3: 2^x = 1000 -> x = {x:.4f}, 두 배 시간 {t:.3f}개월, log2 48 - log2 3 = 4")

    for n in (2, 10, 1000, 10 ** 6):
        assert math.isclose(n ** math.log2(3), 3 ** math.log2(n), rel_tol=1e-9)
    assert f"{math.log2(3):.3f}" == "1.585"
    print(f"[OK] 예제: n^(lg 3) = 3^(lg n), lg 3 = {math.log2(3):.4f}")

    prod = 1.0
    for _ in range(1000):
        prod *= 0.01
    s = sum(math.log(0.01) for _ in range(1000))
    assert prod == 0.0 and f"{s:.2f}" == "-4605.17"
    assert 5e-324 > 0 and 5e-324 / 2 == 0.0 and f"{5e-324:.2e}" == "4.94e-324"  # 가장 작은 양의 배정밀도 수
    print(f"[OK] 카드 C4: 0.01^1000 -> {prod}, 로그의 합 {s:.2f} (= 1000 ln 0.01)")

    assert math.log(math.e) == 1.0 and math.log(1000, 10) == 2.9999999999999996 and math.log10(1000) == 3.0
    print(f"[OK] 활용: math.log(e) = 1, math.log(1000, 10) = {math.log(1000, 10)!r}, math.log10(1000) = 3.0")

    assert f"{math.log10(2):.3f}" == "0.301" and math.log10(1) + math.log10(1) == 0
    print("[OK] 오해: log10(1+1) = 0.301 ≠ 0 = log10 1 + log10 1")

    # 예제 사다리 (4.연습문제/07.로그 계산 예제 사다리)
    t1 = math.log(10) / math.log(1.15)
    assert f"{t1:.2f}" == "16.48"
    x2 = math.log(40) / math.log(3)
    assert f"{x2:.3f}" == "3.358" and math.isclose(5 * 3 ** x2, 200)
    x3 = math.log(2) / (math.log(3) - math.log(2))
    assert f"{x3:.3f}" == "1.710" and math.isclose(2 ** (x3 + 1), 3 ** x3)
    n4 = 6 * math.log(10) / -math.log(0.9)
    first = next(n for n in range(1, 1000) if 0.9 ** n < 1e-6)
    assert f"{n4:.2f}" == "131.13" and first == 132
    assert 0.9 ** 1000 < 1e-40 and f"{1000 * math.log10(0.9):.2f}" == "-45.76"
    v = math.log(2) / math.log(1.15)
    assert f"{v:.2f}" == "4.96" and 72 / 15 == 4.8
    assert 1.15 ** 16 < 10 < 1.15 ** 17 and 3 ** 3 < 40 < 3 ** 4
    assert f"{2 ** (x3 + 1):.2f}" == f"{3 ** x3:.2f}" == "6.54"
    print(f"[OK] 사다리: 1) {t1:.2f}개월 2) {x2:.3f} 3) {x3:.3f} 4) n = {first}, 0.9^1000 = 10^{1000*math.log10(0.9):.2f}, 변형 {v:.2f}개월")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
