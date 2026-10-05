---
layout: "note"
title: "08_log-scale_verify.py"
display_title: "08_log-scale_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/log-scale/"
parent_title: "로그함수와 로그 스케일"
description: "대학수학 · 로그함수와 로그 스케일 검증 코드"
permalink: "/studies/college-math/code/08_log-scale_verify/"
---
{% raw %}
[로그함수와 로그 스케일](/Hongs_Blog/studies/college-math/log-scale/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""로그함수와 로그 스케일 검증.

문서: 08.로그함수와 로그 스케일 (예시, 정의, 예제, 활용, 카드 C1~C3, 자주 하는 오해)
주장 1: y = c·x^k이면 로그-로그 좌표에서 기울기 k인 직선, y = a·b^x이면 반로그 좌표에서 기울기 log b인 직선이다.
주장 2: 두 측정점 (x1, y1), (x2, y2)의 로그-로그 기울기 (log y2 - log y1)/(log x2 - log x1)는 로그의 밑과 무관하다.
주장 3: 역순 입력의 삽입 정렬 비교 횟수는 정확히 n(n-1)/2이고, n = 1000 -> 8000의 로그-로그 기울기는 약 2.00이다.
        병합 정렬의 비교 횟수는 기울기가 약 1.1로, 1과 2 사이다 (n lg n).
주장 4: 10 log10 2 ≈ 3.01 dB, 1/1000은 -30 dB.
주장 5: lg x는 x = 1, 2, 1024, 10^6, 10^9에서 0, 1, 10, 19.9, 29.9로 아주 느리게 자란다.
"""
import math
import random


def insertion_sort_comparisons(a):
    a = list(a)
    count = 0
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0:
            count += 1
            if a[j] > key:
                a[j + 1] = a[j]
                j -= 1
            else:
                break
        a[j + 1] = key
    assert a == sorted(a)
    return count


def merge_sort_comparisons(a):
    if len(a) <= 1:
        return list(a), 0
    mid = len(a) // 2
    left, cl = merge_sort_comparisons(a[:mid])
    right, cr = merge_sort_comparisons(a[mid:])
    out, i, j, c = [], 0, 0, cl + cr
    while i < len(left) and j < len(right):
        c += 1
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out += left[i:] + right[j:]
    return out, c


def slope(p1, p2, base=10):
    (x1, y1), (x2, y2) = p1, p2
    L = lambda t: math.log(t, base)
    return (L(y2) - L(y1)) / (L(x2) - L(x1))


def main():
    for base in (2, math.e, 10):
        assert math.isclose(slope((2, 5 * 2 ** 3), (7, 5 * 7 ** 3), base), 3)
        ys = [3 * 2 ** x for x in range(6)]
        diffs = [math.log(b, base) - math.log(a, base) for a, b in zip(ys, ys[1:])]
        assert all(math.isclose(d, math.log(2, base)) for d in diffs)
    print("[OK] 주장 1·2: 5x^3의 로그-로그 기울기 3, 3·2^x의 반로그 간격 log 2 — 밑 2, e, 10에서 같다")

    counts = {n: insertion_sort_comparisons(range(n, 0, -1)) for n in (1000, 2000, 4000, 8000)}
    assert all(c == n * (n - 1) // 2 for n, c in counts.items())
    s_ins = slope((1000, counts[1000]), (8000, counts[8000]))
    assert f"{s_ins:.2f}" == "2.00"
    rng = random.Random(8)
    mc = {n: merge_sort_comparisons([rng.random() for _ in range(n)])[1] for n in (1000, 2000, 4000, 8000)}
    s_merge = slope((1000, mc[1000]), (8000, mc[8000]))
    assert mc == {1000: 8690, 2000: 19412, 4000: 42761, 8000: 93643} and f"{s_merge:.2f}" == "1.14"
    print(f"[OK] 예시: 삽입 정렬 비교 {counts[1000]:,} -> {counts[8000]:,}, 기울기 {s_ins:.3f} / 병합 정렬 {mc[1000]:,} -> {mc[8000]:,}, 기울기 {s_merge:.3f}")

    assert math.isclose(slope((1000, 0.02), (8000, 1.28)), 2)
    print("[OK] 카드 C1: (1000, 0.02 s), (8000, 1.28 s)의 기울기 2")

    assert f"{10 * math.log10(2):.2f}" == "3.01" and 10 * math.log10(1 / 1000) == -30
    print(f"[OK] 카드 C3: 2배 = {10*math.log10(2):.2f} dB, 1/1000 = -30 dB")

    vals = [math.log2(x) for x in (1, 2, 1024, 1e6, 1e9)]
    assert vals[:3] == [0, 1, 10] and f"{vals[3]:.1f}" == "19.9" and f"{vals[4]:.1f}" == "29.9"
    print("[OK] lg: 1, 2, 1024, 10^6, 10^9 -> " + ", ".join(f"{v:.1f}" for v in vals))

    # 오해: y = x^2은 로그-로그에서 직선(기울기 2)이지만 선형 관계가 아니다
    assert math.isclose(slope((1, 1), (10, 100)), 2) and (2 * 10) ** 2 != 2 * 10 ** 2
    print("[OK] 오해: y = x^2도 로그-로그 직선(기울기 2). 선형이면 기울기가 1이어야 한다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
