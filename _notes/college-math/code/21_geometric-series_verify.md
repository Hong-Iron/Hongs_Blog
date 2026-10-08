---
layout: "note"
title: "21_geometric-series_verify.py"
display_title: "21_geometric-series_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/geometric-series/"
parent_title: "등비급수"
description: "대학수학 · 등비급수 검증 코드"
permalink: "/studies/college-math/code/21_geometric-series_verify/"
---
{% raw %}
[등비급수](/Hongs_Blog/studies/college-math/geometric-series/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""등비급수 검증.

문서: 21.등비급수 (예시, 정리, 증명, 예제, 활용, 카드 C1~C3)
주장 1: r ≠ 1이면 Σ_{k=0}^{n-1} r^k = (r^n - 1)/(r - 1) (유리수 r로 정확히).
주장 2: 1 + 2 + … + 2^k = 2^(k+1) - 1.
주장 3: |r| < 1이면 부분합이 1/(1 - r)로 다가간다. r = 1/2 -> 2, r = 0.9 -> 10.
주장 4: 0.999… = 1, 0.121212… = 4/33.
주장 5: 동적 배열이 용량 1에서 두 배씩 늘며 1000개를 넣으면 복사는 1 + 2 + … + 512 = 1023번 < 2·1000.
주장 6: 높이 h인 완전 이진 트리의 노드는 2^(h+1) - 1개이고 잎은 2^h개로 절반보다 많다.
주장 7: r = 1이면 n, r = -1이면 부분합이 1, 0, 1, 0, …으로 수렴하지 않는다.
"""
from fractions import Fraction as F


def main():
    for num in range(-7, 8):
        for den in range(1, 6):
            r = F(num, den)
            if r == 1:
                continue
            for n in range(0, 25):
                assert sum(r ** k for k in range(n)) == (r ** n - 1) / (r - 1)
    print("[OK] 주장 1: 유리수 r 70여 개 × n < 25")

    for k in range(0, 64):
        assert sum(2 ** i for i in range(k + 1)) == 2 ** (k + 1) - 1
    print("[OK] 주장 2")

    for r, lim in ((F(1, 2), F(2)), (F(9, 10), F(10))):
        s = sum(r ** k for k in range(200))
        assert 0 < lim - s < F(1, 10 ** 8)
    print("[OK] 주장 3: 부분합이 2와 10에 다가감")

    s9 = sum(F(9, 10 ** k) for k in range(1, 60))
    assert 1 - s9 == F(1, 10 ** 59)
    assert F(12, 100) / (1 - F(1, 100)) == F(4, 33)
    print("[OK] 주장 4: 0.999… -> 1, 0.1212… = 4/33")

    cap, size, copies = 1, 0, 0
    for _ in range(1000):
        if size == cap:
            copies += size
            cap *= 2
        size += 1
    assert copies == 1023 and copies < 2 * 1000 and cap == 1024
    print(f"[OK] 주장 5·카드 C2: 복사 {copies}번, 최종 용량 {cap}")

    for h in range(0, 20):
        nodes = sum(2 ** d for d in range(h + 1))
        assert nodes == 2 ** (h + 1) - 1 and 2 * 2 ** h > nodes
    print("[OK] 주장 6")

    partial = [sum((-1) ** k for k in range(n)) for n in range(1, 9)]
    assert partial == [1, 0, 1, 0, 1, 0, 1, 0] and sum(1 ** k for k in range(10)) == 10
    print("[OK] 주장 7·카드 C3: r = -1 진동, r = 1이면 n")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
