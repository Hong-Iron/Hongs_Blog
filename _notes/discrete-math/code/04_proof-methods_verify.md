---
layout: "note"
title: "04_proof-methods_verify.py"
display_title: "04_proof-methods_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/proof-methods/"
parent_title: "추론 규칙과 증명 방법"
description: "이산수학 · 추론 규칙과 증명 방법 검증 코드"
permalink: "/studies/discrete-math/code/04_proof-methods_verify/"
---
{% raw %}
[추론 규칙과 증명 방법](/Hongs_Blog/studies/discrete-math/proof-methods/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""추론 규칙과 증명 방법 검증.

문서: 04.추론 규칙과 증명 방법 (정의, 예제, 카드 C1~C4, 자주 하는 오해)
주장 1: 추론 규칙의 타당성 = (전제들의 곱) → 결론이 항진식. 전건 긍정·후건 부정·삼단논법·선언 삼단논법은 타당하고,
        후건 긍정·전건 부정은 타당하지 않다(진리표 전수).
주장 2: 홀수의 제곱은 홀수, 제곱이 짝수이면 원래 수도 짝수 (|n| <= 10^5 확인. 증명은 문서).
주장 3: n² + n은 늘 짝수 (|n| <= 10^5).
주장 4: n² + n + 41은 n = 0..39에서 소수이지만 n = 40에서 1681 = 41²이다.
주장 5: p² = 2q²인 양의 정수 p, q는 q <= 10^5에 없다 (실험. √2의 무리수성 증명은 문서).
주장 6: (√2^√2)^√2 = 2.
"""
from itertools import product
import math

B = [True, False]
IMP = lambda p, q: (not p) or q


def valid(premises, conclusion, n):
    return all(IMP(all(pr(*v) for pr in premises), conclusion(*v)) for v in product(B, repeat=n))


def is_prime(n):
    if n < 2:
        return False
    return all(n % d for d in range(2, int(n ** 0.5) + 1))


def main():
    assert valid([lambda p, q: IMP(p, q), lambda p, q: p], lambda p, q: q, 2)             # 전건 긍정
    assert valid([lambda p, q: IMP(p, q), lambda p, q: not q], lambda p, q: not p, 2)     # 후건 부정
    assert valid([lambda p, q, r: IMP(p, q), lambda p, q, r: IMP(q, r)], lambda p, q, r: IMP(p, r), 3)
    assert valid([lambda p, q: p or q, lambda p, q: not p], lambda p, q: q, 2)
    assert not valid([lambda p, q: IMP(p, q), lambda p, q: q], lambda p, q: p, 2)         # 후건 긍정
    assert not valid([lambda p, q: IMP(p, q), lambda p, q: not p], lambda p, q: not q, 2) # 전건 부정
    print("[OK] 주장 1·카드 C4: 타당한 규칙 4개, 오류 2개")

    for n in range(-10 ** 5, 10 ** 5 + 1):
        if n % 2:
            assert (n * n) % 2 == 1
        if (n * n) % 2 == 0:
            assert n % 2 == 0
        assert (n * n + n) % 2 == 0
    print("[OK] 주장 2·3")

    assert all(is_prime(n * n + n + 41) for n in range(40))
    assert 40 * 40 + 40 + 41 == 1681 == 41 ** 2 and not is_prime(1681) and 41 * 41 + 41 + 41 == 41 * 43
    print("[OK] 주장 4·카드 C3: n = 0..39 소수, n = 40에서 41²")

    for q in range(1, 10 ** 5 + 1):
        p = math.isqrt(2 * q * q)
        assert p * p != 2 * q * q
    print("[OK] 주장 5: p² = 2q² 해 없음 (q <= 10^5)")

    s = math.sqrt(2)
    assert math.isclose((s ** s) ** s, 2)
    print(f"[OK] 주장 6: (√2^√2)^√2 = {(s ** s) ** s:.15f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
