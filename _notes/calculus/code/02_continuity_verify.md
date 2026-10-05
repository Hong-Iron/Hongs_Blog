---
layout: "note"
title: "02_continuity_verify.py"
display_title: "02_continuity_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/continuity/"
parent_title: "연속과 사잇값 정리"
description: "미분적분학 · 연속과 사잇값 정리 검증 코드"
permalink: "/studies/calculus/code/02_continuity_verify/"
---
{% raw %}
[연속과 사잇값 정리](/Hongs_Blog/studies/calculus/continuity/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""연속과 사잇값 정리 검증.

문서: 02.연속과 사잇값 정리 (예시, 정의, 예제, 활용, 카드 C1~C3)
주장 1: x³ - x - 2는 [1, 2]에서 부호가 바뀌고, 이분법의 처음 다섯 구간은 표와 같다. 근은 약 1.52138.
주장 2: 오차 tol 이하로 줄이려면 ⌈lg((b-a)/tol)⌉번이면 된다 (tol = 1e-6이면 20번).
주장 3: 1/x는 [-1, 1]의 양 끝에서 부호가 다르지만 근이 없다(0에서 끊김).
주장 4: 첫 "나쁜" 커밋 찾기(단조 술어의 경계)는 이분 탐색으로 ⌈lg n⌉번 안에 끝난다.
"""
import math


def bisect(f, a, b, steps):
    rows = []
    for _ in range(steps):
        m = (a + b) / 2
        rows.append((a, b, m, f(m)))
        if f(a) * f(m) <= 0:
            b = m
        else:
            a = m
    return rows, (a, b)


def main():
    f = lambda x: x ** 3 - x - 2
    assert f(1) < 0 < f(2)
    rows, _ = bisect(f, 1, 2, 5)
    mids = [r[2] for r in rows]
    assert mids == [1.5, 1.75, 1.625, 1.5625, 1.53125]
    signs = ["+" if r[3] > 0 else "-" for r in rows]
    assert signs == ["-", "+", "+", "+", "+"]
    _, (a, b) = bisect(f, 1, 2, 60)
    assert f"{a:.5f}" == "1.52138"
    print(f"[OK] 주장 1·카드 C2: 중점 {mids}, 부호 {signs}, 근 ≈ {a:.6f}")

    tol = 1e-6
    k = math.ceil(math.log2((2 - 1) / tol))
    _, (a, b) = bisect(f, 1, 2, k)
    assert k == 20 and b - a <= tol
    print("[OK] 주장 2: 20번")

    g = lambda x: 1 / x
    assert g(-1) < 0 < g(1)
    assert all(g(x) != 0 for x in [i / 1000 for i in range(-1000, 1001) if i != 0])
    print("[OK] 주장 3·카드 C3")

    for n in (1, 2, 7, 100, 1000, 12345):
        for first_bad in (0, n // 3, n - 1):
            lo, hi, tests = 0, n - 1, 0
            while lo < hi:
                mid = (lo + hi) // 2
                tests += 1
                if mid >= first_bad:
                    hi = mid
                else:
                    lo = mid + 1
            assert lo == first_bad and tests <= math.ceil(math.log2(n)) if n > 1 else True
    print("[OK] 주장 4: 커밋 이분 탐색")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
