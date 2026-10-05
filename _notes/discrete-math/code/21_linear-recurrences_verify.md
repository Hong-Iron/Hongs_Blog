---
layout: "note"
title: "21_linear-recurrences_verify.py"
display_title: "21_linear-recurrences_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/linear-recurrences/"
parent_title: "선형 점화식"
description: "이산수학 · 선형 점화식 검증 코드"
permalink: "/studies/discrete-math/code/21_linear-recurrences_verify/"
---
{% raw %}
[선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형 점화식 검증.

문서: 21.선형 점화식 (예시, 정리, 증명, 예제, 카드 C1~C4, 자주 하는 오해), 4.연습문제/21.점화식 풀이 예제 사다리
방법: 점화식을 그대로 반복 계산한 값과 닫힌 꼴을 n <= 60에서 정확히(정수·유리수로) 비교한다.
주장 1: 하노이 T_n = 2T_{n-1} + 1, T_0 = 0이면 T_n = 2^n - 1.
주장 2: 피보나치 F_n = (φ^n - ψ^n)/√5 (부동소수점, n <= 70에서 반올림하면 정확), F_n = round(φ^n/√5).
주장 3: a_n = 5a_{n-1} - 6a_{n-2}, a_0 = 1, a_1 = 4이면 a_n = 2·3^n - 2^n.
주장 4: 2×n 칸을 도미노로 덮는 방법 = F_{n+1}, 길이 n 이진 문자열 중 11이 없는 것 = F_{n+2} (전수).
사다리: a_n = a_{n-1} + 2a_{n-2} (2, 1) -> 2^n + (-1)^n; a_n = 6a_{n-1} - 9a_{n-2} (1, 6) -> (1+n)3^n; s_10 = 144.
"""
import math
from itertools import product


def run(coeffs, init, n):
    a = list(init)
    while len(a) <= n:
        a.append(sum(c * a[-1 - i] for i, c in enumerate(coeffs)))
    return a


def main():
    T = [0]
    for n in range(1, 61):
        T.append(2 * T[-1] + 1)
    assert all(T[n] == 2 ** n - 1 for n in range(61))
    print("[OK] 주장 1·카드 C4: 하노이 2^n - 1")

    F = run([1, 1], [0, 1], 90)
    phi, psi = (1 + math.sqrt(5)) / 2, (1 - math.sqrt(5)) / 2
    for n in range(71):
        assert round((phi ** n - psi ** n) / math.sqrt(5)) == F[n] == round(phi ** n / math.sqrt(5))
    print("[OK] 주장 2: 비네 공식 (n <= 70)")

    a = run([5, -6], [1, 4], 60)
    assert all(a[n] == 2 * 3 ** n - 2 ** n for n in range(61))
    print("[OK] 주장 3·카드 C2")

    def tilings(n):
        # 2×n을 세로 도미노(1칸) 또는 가로 도미노 두 개(2칸)로 덮는 수를 직접 나열
        if n == 0:
            return 1
        return tilings(n - 1) + (tilings(n - 2) if n >= 2 else 0)
    for n in range(1, 20):
        assert tilings(n) == F[n + 1]
    for n in range(1, 16):
        cnt = sum(1 for b in product("01", repeat=n) if "11" not in "".join(b))
        assert cnt == F[n + 2]
    assert F[12] == 144
    print("[OK] 주장 4·사다리 3·4: 타일링 F_{n+1}, 11 없는 문자열 F_{n+2}, s_10 = 144")

    b = run([1, 2], [2, 1], 60)
    assert all(b[n] == 2 ** n + (-1) ** n for n in range(61))
    c = run([6, -9], [1, 6], 60)
    assert all(c[n] == (1 + n) * 3 ** n for n in range(61))
    print("[OK] 사다리 1·2: 서로 다른 근, 중근")

    calls = [1, 1]
    for n in range(2, 30):
        calls.append(1 + calls[-1] + calls[-2])
    assert calls[25] == 2 * F[26] - 1
    print(f"[OK] 오해: 순진한 재귀 fib(25) 호출 {calls[25]:,}번")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
