---
layout: "note"
title: "13_bernoulli-process_verify.py"
display_title: "13_bernoulli-process_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/data-and-information/bernoulli-process/"
parent_title: "베르누이 과정"
description: "자료와 정보 · 베르누이 과정 검증 코드"
sitemap: false
permalink: "/studies/data-and-information/code/13_bernoulli-process_verify/"
---
{% raw %}
[베르누이 과정](/Hongs_Blog/studies/data-and-information/bernoulli-process/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 베르누이 과정 문서와 '베르누이 시행과 이항분포' 문서의 자료와 정보 단락을 확인한다.
# 실행: python3 13_bernoulli-process_verify.py (표준 라이브러리만)
import itertools
import math
import random
from fractions import Fraction as F
from math import comb


def binom(n, k, p):
    return comb(n, k) * p ** k * (1 - p) ** (n - k)


def main():
    # 주장 1: 베르누이 시행의 평균 p, 분산 p(1 - p)
    for p in (F(1, 2), F(1, 10), F(3, 10)):
        mean = 1 * p + 0 * (1 - p)
        var = (1 - mean) ** 2 * p + (0 - mean) ** 2 * (1 - p)
        assert mean == p and var == p * (1 - p)
    print("[OK] 주장 1: Bern(p)의 평균 p, 분산 p(1 - p)")

    # 주장 2: 슬라이드의 칸 13개 0010000101100
    s = "0010000101100"
    assert len(s) == 13 and s.count("1") == 4
    arrivals = [i + 1 for i, c in enumerate(s) if c == "1"]
    assert arrivals == [3, 8, 10, 11]
    running = list(itertools.accumulate(int(c) for c in s))
    assert running == [0, 0, 1, 1, 1, 1, 1, 2, 2, 3, 4, 4, 4]
    p = F(3, 10)
    one = p ** 4 * (1 - p) ** 9
    assert comb(13, 4) == 715
    assert abs(float(one) - 0.000327) < 5e-7
    assert abs(float(715 * one) - 0.2337) < 5e-5
    assert binom(13, 4, p) == 715 * one
    print("[OK] 주장 2: 1이 4개, 자리 3·8·10·11, 누적 개수, p = 0.3일 때 0.000327과 0.2337")

    # 주장 3: 길이 n인 0/1 수열을 모두 세면 1의 개수는 Bin(n, p) (n <= 10 전수)
    for n in (1, 3, 6, 10):
        for p in (F(1, 2), F(1, 10), F(3, 10)):
            dist = [F(0)] * (n + 1)
            for seq in itertools.product((0, 1), repeat=n):
                k = sum(seq)
                dist[k] += p ** k * (1 - p) ** (n - k)
            assert dist == [binom(n, k, p) for k in range(n + 1)]
            assert sum(dist) == 1
            mean = sum(k * q for k, q in enumerate(dist))
            var = sum((k - mean) ** 2 * q for k, q in enumerate(dist))
            assert mean == n * p and var == n * p * (1 - p)
    print("[OK] 주장 3: 처음 n칸의 1의 개수는 Bin(n, p), 평균 np, 분산 np(1 - p) (전수)")

    # 주장 4: 겹치지 않는 구간의 개수는 독립 (n = 4 + 3 전수)
    p = F(3, 10)
    joint = {}
    for seq in itertools.product((0, 1), repeat=7):
        a, b = sum(seq[:4]), sum(seq[4:])
        k = sum(seq)
        joint[(a, b)] = joint.get((a, b), 0) + p ** k * (1 - p) ** (7 - k)
    for (a, b), q in joint.items():
        assert q == binom(4, a, p) * binom(3, b, p)
    print("[OK] 주장 4: 앞 4칸과 뒤 3칸의 개수는 독립")

    # 슬라이드 p.11: 동전 3개
    h = F(1, 2)
    assert [binom(3, k, h) for k in range(4)] == [F(1, 8), F(3, 8), F(3, 8), F(1, 8)]
    print("[OK] 슬라이드 p.11: 1/8, 3/8, 3/8, 1/8")

    # 슬라이드 p.12: 해밍 부호. 원본의 0.468은 0.478이 맞다.
    q = F(1, 10)
    p0, p1 = binom(7, 0, q), binom(7, 1, q)
    assert round(float(p0), 3) == 0.478 and round(float(p1), 3) == 0.372
    assert round(float(p0 + p1), 3) == 0.850
    plain = binom(4, 0, q)
    assert round(float(plain), 3) == 0.656
    assert abs(float(p0 + p1) - float(plain) - 0.194) < 5e-4
    assert abs(float((p0 + p1) / plain) - 1.296) < 5e-4
    assert abs((0.468 + 0.372) - 0.840) < 1e-9          # 원본 숫자를 그대로 더하면 0.850이 아니다
    print("[OK] 슬라이드 p.12: 0.478 + 0.372 = 0.850, 부호 없이 0.656, 차 0.194, 비 1.296")

    # 슬라이드 p.13: n = 20 그림의 두 값
    assert abs(binom(20, 16, 0.6) - 0.03499) < 5e-6
    assert abs(binom(20, 7, 0.1) - 0.00197) < 5e-6
    assert max(range(21), key=lambda k: binom(20, k, 0.6)) == 12 == round(20 * 0.6)
    assert max(range(21), key=lambda k: binom(20, k, 0.1)) == 2 == round(20 * 0.1)
    print("[OK] 슬라이드 p.13: P(X = 16) = 0.03499, P(X = 7) = 0.00197, 봉우리 12와 2")

    # 슬라이드 p.14: 광고 1000번. 지수는 998이 아니라 990이다.
    right = binom(1000, 10, 0.01)
    wrong = comb(1000, 10) * 0.01 ** 10 * 0.99 ** 998
    pois = math.exp(-10) * 10 ** 10 / math.factorial(10)
    assert abs(right - 0.1257) < 5e-5 and round(right, 3) == 0.126
    assert abs(wrong - 0.1160) < 5e-5
    assert abs(pois - 0.1251) < 5e-5
    print(f"[OK] 슬라이드 p.14: 지수 990이면 {right:.4f}, 998이면 {wrong:.4f}, 포아송 근사 {pois:.4f}")

    # 카드: 베르누이 과정 C2 (10칸에 1이 정확히 2개, p = 0.1), C3는 위 주장 2
    assert abs(binom(10, 2, 0.1) - 0.1937) < 5e-5
    # 카드 C4: 첫 칸을 나머지 칸이 그대로 베끼면 n칸의 1의 개수는 0 아니면 n뿐이다
    n, p = 5, F(3, 10)
    copied = {0: 1 - p, n: p}
    assert sum(copied.values()) == 1 and copied[n] == p != p ** n
    assert sum(k * q for k, q in copied.items()) == n * p            # 평균은 np로 같다
    assert binom(n, n, p) == p ** n == F(243, 100000)
    # 이항분포 문서 카드 C4: 해밍 부호 (위와 같은 값)
    # 모의실험: 13칸 과정에서 1이 4개일 비율
    rng = random.Random(13)
    trials = 200000
    hit = sum(1 for _ in range(trials) if sum(rng.random() < 0.3 for _ in range(13)) == 4)
    assert abs(hit / trials - 0.2337) < 0.004
    print("[OK] 카드 값과 모의실험 20만 회")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
