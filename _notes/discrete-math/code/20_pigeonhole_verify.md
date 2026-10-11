---
layout: "note"
title: "20_pigeonhole_verify.py"
display_title: "20_pigeonhole_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "20"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/pigeonhole/"
parent_title: "비둘기집 원리"
description: "이산수학 · 비둘기집 원리 검증 코드"
permalink: "/studies/discrete-math/code/20_pigeonhole_verify/"
---
{% raw %}
[비둘기집 원리](/Hongs_Blog/studies/discrete-math/pigeonhole/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""비둘기집 원리 검증.

문서: 20.비둘기집 원리 (예시, 정리, 증명, 예제, 카드 C1~C3)
주장 1: n개를 k칸에 넣으면 어떤 칸에는 ⌈n/k⌉개 이상 (작은 n, k에서 모든 배치 전수).
주장 2: 파일 100개를 폴더 7개에 나누면 어떤 폴더에는 15개 이상, 14개씩만 넣을 수는 없다.
주장 3: {1..2n}에서 n+1개를 고르면 이웃한 두 수가 반드시 있다 (n <= 6 전수). n개로는 없을 수 있다.
주장 4: 길이 n 비트 파일은 2^n개, 길이 n 미만 파일은 2^n - 1개.
주장 5: 무작위 64비트 해시 대신 8비트 해시로 257개를 넣으면 늘 충돌이 있다.
"""
import math
import random
from itertools import combinations, product


def main():
    for n in range(1, 8):
        for k in range(1, 5):
            for assign in product(range(k), repeat=n):
                assert max(assign.count(b) for b in range(k)) >= math.ceil(n / k)
    print("[OK] 주장 1: n <= 7, k <= 4 모든 배치")

    assert math.ceil(100 / 7) == 15 and 7 * 14 < 100
    print("[OK] 주장 2·카드 C2")

    for n in range(1, 7):
        for pick in combinations(range(1, 2 * n + 1), n + 1):
            assert any(b - a == 1 for a, b in zip(pick, pick[1:]))
        assert not any(b - a == 1 for a, b in zip(range(1, 2 * n + 1, 2), range(3, 2 * n + 1, 2)))
    print("[OK] 주장 3: n <= 6 전수, 홀수 n개는 이웃 없음")

    for n in range(0, 20):
        assert sum(2 ** L for L in range(n)) == 2 ** n - 1
    print("[OK] 주장 4·카드 C3")

    rng = random.Random(20)
    for _ in range(200):
        keys = rng.sample(range(10 ** 9), 257)
        hashes = [hash(("salt", k)) & 0xFF for k in keys]
        assert len(set(hashes)) < 257
    print("[OK] 주장 5")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
