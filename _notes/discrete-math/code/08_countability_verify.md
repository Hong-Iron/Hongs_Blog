---
layout: "note"
title: "08_countability_verify.py"
display_title: "08_countability_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/countability/"
parent_title: "가산 집합과 대각선 논법"
description: "이산수학 · 가산 집합과 대각선 논법 검증 코드"
permalink: "/studies/discrete-math/code/08_countability_verify/"
---
{% raw %}
[가산 집합과 대각선 논법](/Hongs_Blog/studies/discrete-math/countability/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""가산 집합과 대각선 논법 검증.

문서: 08.가산 집합과 대각선 논법 (예시, 정리, 증명, 예제, 카드 C1~C3)
주장 1: f(n) = n/2 (n 짝수), -(n+1)/2 (n 홀수)는 ℕ -> ℤ 전단사다 (n < 20,001에서 단사이고 -10,000..10,000을 모두 덮음).
주장 2: 분모와 분자의 합(높이) 순서로 기약분수를 늘어놓으면 |p| <= 30, 1 <= q <= 30인 모든 유리수가 유한 번째에 나온다.
주장 3: 대각선 논법 — 어떤 비트열 목록을 주어도, i번째 자리를 뒤집은 d는 목록의 i번째와 i번째 자리에서 다르다.
주장 4: 길이 L 이하의 프로그램(문자열)은 유한 개라서 모든 프로그램을 길이 순으로 번호 매길 수 있다.
"""
import random
from math import gcd


def f(n):
    return n // 2 if n % 2 == 0 else -(n + 1) // 2


def main():
    vals = [f(n) for n in range(20001)]
    assert len(set(vals)) == len(vals) and set(vals) == set(range(-10000, 10001))
    print("[OK] 주장 1·카드 C1: ℕ -> ℤ 전단사")

    order = []
    h = 1
    while len(order) < 20000:
        for q in range(1, h + 1):
            p_abs = h - q
            for p in ([0] if p_abs == 0 else [p_abs, -p_abs]):
                if gcd(abs(p), q) == 1:
                    order.append((p, q))
        h += 1
    pos = {r: i for i, r in enumerate(order)}
    for p in range(-30, 31):
        for q in range(1, 31):
            g = gcd(abs(p), q)
            key = (p // g, q // g)
            assert key in pos
    assert len(pos) == len(order)
    print(f"[OK] 주장 2: 높이 순 목록 {len(order)}개에 |p|,q <= 30의 유리수가 모두 있음 (중복 없음)")

    rng = random.Random(8)
    for _ in range(500):
        n = rng.randint(1, 40)
        listing = [[rng.randint(0, 1) for _ in range(n)] for _ in range(n)]
        d = [1 - listing[i][i] for i in range(n)]
        assert all(d[i] != listing[i][i] for i in range(n)) and d not in listing
    print("[OK] 주장 3·카드 C2: 대각선 비트열은 목록에 없음 (무작위 500개 목록)")

    alphabet = 3
    total = sum(alphabet ** L for L in range(0, 6))
    assert total == 364
    print("[OK] 주장 4: 기호 3개, 길이 5 이하 문자열 364개 — 길이 순 번호 매기기 가능")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
