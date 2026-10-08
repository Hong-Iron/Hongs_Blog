---
layout: "note"
title: "12_induction_verify.py"
display_title: "12_induction_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/induction/"
parent_title: "수학적 귀납법"
description: "이산수학 · 수학적 귀납법 검증 코드"
permalink: "/studies/discrete-math/code/12_induction_verify/"
---
{% raw %}
[수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""수학적 귀납법 검증.

문서: 12.수학적 귀납법 (예제, 카드 C1~C4, 자주 하는 오해), 4.연습문제/12.귀납법 증명 예제 사다리
귀납법의 결론(모든 n)은 증명으로 얻는다. 여기서는 각 명제를 넓은 범위에서 확인하고,
귀납 단계에서 쓰는 부등식이 필요한 범위에서 성립하는지 본다(실험).
주장 1: n >= 5에서 2^n > n², 귀납 단계의 2n² >= (n+1)²은 n >= 3에서 성립(n = 2에서 깨짐).
주장 2: 12 이상의 모든 금액은 4원·5원 우표로 만들 수 있다. 11은 안 된다.
주장 3: "모든 말은 같은 색" 논증은 n = 1 -> 2에서 두 무리의 겹침이 비어 있다.
사다리: Σ(2k-1) = n², Σ_{k=0}^{n} 2^k = 2^(n+1) - 1, 3 | n³ - n, n >= 4에서 n! > 2^n, (1+x)^n >= 1 + nx (x >= -1).
"""
import math
from fractions import Fraction as F


def stamps(n):
    """강한 귀납법의 구성을 그대로 따른다: 12..15는 직접, 그 이상은 n-4에 4원 한 장."""
    base = {12: (3, 0), 13: (2, 1), 14: (1, 2), 15: (0, 3)}
    extra = 0
    while n not in base:          # 재귀 n -> n - 4를 반복문으로 펼침
        n -= 4
        extra += 1
    a, b = base[n]
    return a + extra, b


def main():
    for n in range(5, 2000):
        assert 2 ** n > n * n
    assert all(2 * n * n >= (n + 1) ** 2 for n in range(3, 2000)) and not (2 * 2 * 2 >= 3 ** 2)
    assert [n for n in range(1, 10) if 2 ** n <= n * n] == [2, 3, 4]
    print("[OK] 주장 1·카드 C2")

    for n in range(12, 5000):
        a, b = stamps(n)
        assert 4 * a + 5 * b == n and a >= 0 and b >= 0
    assert not any(4 * a + 5 * b == 11 for a in range(4) for b in range(3))
    print("[OK] 주장 2·카드 C4: 12..4999를 강한 귀납법의 구성으로 만듦, 11은 불가")

    n = 1
    first = set(range(1, n + 1))       # 말 1..n+1 중 앞 n마리
    last = set(range(2, n + 2))        # 뒤 n마리
    assert first & last == set()
    assert all(set(range(1, m + 1)) & set(range(2, m + 2)) for m in range(2, 50))
    print("[OK] 주장 3·카드 C3: n = 1일 때만 겹침이 비어 논증이 끊긴다")

    for n in range(1, 3000):
        assert sum(2 * k - 1 for k in range(1, n + 1)) == n * n
        assert sum(2 ** k for k in range(n + 1)) == 2 ** (n + 1) - 1
        assert (n ** 3 - n) % 3 == 0
        assert ((n + 1) ** 3 - (n + 1)) - (n ** 3 - n) == 3 * n * n + 3 * n
    assert all(math.factorial(n) > 2 ** n for n in range(4, 500)) and math.factorial(3) < 2 ** 3
    for num in range(-10, 40):
        x = F(num, 10)
        for n in range(0, 40):
            assert (1 + x) ** n >= 1 + n * x
    print("[OK] 사다리 문제 1~4와 변형(베르누이 부등식, x >= -1의 유리수 표본)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
