---
layout: "note"
title: "26_randomized-analysis_verify.py"
display_title: "26_randomized-analysis_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/randomized-analysis/"
parent_title: "해싱과 무작위 알고리즘의 확률"
description: "확률과 통계 · 해싱과 무작위 알고리즘의 확률 검증 코드"
permalink: "/studies/probability-statistics/code/26_randomized-analysis_verify/"
---
{% raw %}
[해싱과 무작위 알고리즘의 확률](/Hongs_Blog/studies/probability-statistics/randomized-analysis/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""해싱과 무작위 알고리즘의 확률 검증.

문서: 26.해싱과 무작위 알고리즘의 확률 (예시, 정의, 예제, 활용, 카드 C1~C3)
주장 1: 체이닝 — 키 n개를 칸 m개에 고르게 넣으면 한 칸의 평균 길이 α = n/m(모의실험), 충돌 쌍 수의 기댓값 C(n, 2)/m.
주장 2: 카드 C3 — 키 1,000개에서 충돌 확률 1% 미만이 되려면 칸이 약 4,970만 개 필요(정확한 곱으로 확인).
주장 3: 예제·카드 C2 — 무작위 퀵정렬: 크기 순 i번째와 j번째가 비교될 확률 2/(j - i + 1)(모의실험),
        기대 비교 횟수 2(n+1)H_n - 4n(점화식으로 분수 확인, n <= 30), n = 1000에서 약 10,986(모의실험).
주장 4: 활용 — 공 n개를 통 n개에(n = 10,000): 무작위 하나는 최대 부하 약 7, 두 개 중 덜 찬 곳은 약 3.
주장 5: 활용 — 블룸 필터(비트 10n개, 해시 7개)의 거짓 양성률 ≈ (1 - e^{-0.7})^7 ≈ 0.0082(모의실험).
"""
from fractions import Fraction
from math import comb, exp, log
import random


def main():
    rng = random.Random(26)
    n, m = 2000, 500
    lens = []
    pairs = 0
    for _ in range(200):
        cnt = [0] * m
        for _ in range(n):
            cnt[rng.randrange(m)] += 1
        lens.append(cnt[0])
        pairs += sum(c * (c - 1) // 2 for c in cnt)
    assert abs(sum(lens) / len(lens) - n / m) < 0.3
    assert abs(pairs / 200 / (comb(n, 2) / m) - 1) < 0.01
    print("[OK] 주장 1: 체인 길이 α, 충돌 쌍 기댓값")

    need = comb(1000, 2) / (-log(0.99))
    assert 4.96e7 < need < 4.98e7
    def p_none(k, M):
        p = 1.0
        for i in range(k):
            p *= 1 - i / M
        return p
    assert 1 - p_none(1000, int(need * 1.01)) < 0.01 < 1 - p_none(1000, int(need * 0.99))
    print(f"[OK] 주장 2·카드 C3: 칸 약 {need:.3g}개")

    def qs(a, counter):
        if len(a) <= 1:
            return a
        p = a[rng.randrange(len(a))]
        counter[0] += len(a) - 1
        return qs([x for x in a if x < p], counter) + [p] + qs([x for x in a if x > p], counter)
    # 쌍이 비교될 확률
    N, trials = 10, 20000
    together = {}
    for _ in range(trials):
        cmp = set()
        def qs2(a):
            if len(a) <= 1:
                return
            p = a[rng.randrange(len(a))]
            for x in a:
                if x != p:
                    cmp.add((min(x, p), max(x, p)))
            qs2([x for x in a if x < p])
            qs2([x for x in a if x > p])
        qs2(list(range(1, N + 1)))
        for pr in cmp:
            together[pr] = together.get(pr, 0) + 1
    for i, j in ((1, 2), (1, 10), (3, 7), (5, 6)):
        assert abs(together.get((i, j), 0) / trials - 2 / (j - i + 1)) < 0.015
    C = [Fraction(0), Fraction(0)]
    for k in range(2, 31):
        C.append(k - 1 + Fraction(2, k) * sum(C[:k]))
    H = lambda k: sum(Fraction(1, t) for t in range(1, k + 1))
    for k in range(1, 31):
        assert C[k] == 2 * (k + 1) * H(k) - 4 * k
    total = 0
    for _ in range(200):
        c = [0]
        a = list(range(1000))
        rng.shuffle(a)
        qs(a, c)
        total += c[0]
    exact1000 = 2 * 1001 * sum(1 / t for t in range(1, 1001)) - 4000
    assert abs(exact1000 - 10986) < 1 and abs(total / 200 / exact1000 - 1) < 0.01
    print("[OK] 주장 3·카드 C2: 퀵정렬")

    nb = 10000
    one, two = [], []
    for _ in range(10):
        b = [0] * nb
        for _ in range(nb):
            b[rng.randrange(nb)] += 1
        one.append(max(b))
        b = [0] * nb
        for _ in range(nb):
            x, y = rng.randrange(nb), rng.randrange(nb)
            b[x if b[x] <= b[y] else y] += 1
        two.append(max(b))
    avg1, avg2 = sum(one) / 10, sum(two) / 10
    assert 6 <= avg1 <= 9 and 3 <= avg2 <= 5 and avg1 - avg2 >= 2
    print(f"[OK] 주장 4: 최대 부하 하나 {avg1}, 둘 중 선택 {avg2}")

    items, bits, k = 2000, 20000, 7
    theory = (1 - exp(-k * items / bits)) ** k
    assert abs(theory - 0.0082) < 1e-4
    arr = [False] * bits
    for _ in range(items):
        for _ in range(k):
            arr[rng.randrange(bits)] = True
    fp = sum(1 for _ in range(200000) if all(arr[rng.randrange(bits)] for _ in range(k))) / 200000
    assert abs(fp / theory - 1) < 0.1
    print(f"[OK] 주장 5: 블룸 필터 {fp:.4f} (이론 {theory:.4f})")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
