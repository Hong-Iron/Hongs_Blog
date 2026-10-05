---
layout: "note"
title: "14_counting-rules_verify.py"
display_title: "14_counting-rules_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/counting-rules/"
parent_title: "셈의 기본 법칙"
description: "이산수학 · 셈의 기본 법칙 검증 코드"
permalink: "/studies/discrete-math/code/14_counting-rules_verify/"
---
{% raw %}
[셈의 기본 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""셈의 기본 법칙 검증.

문서: 14.셈의 기본 법칙 (예시, 정의, 예제, 카드 C1~C4, 자주 하는 오해)
주장 1: 곱의 법칙·합의 법칙·나눗셈 법칙을 작은 경우에서 전수로 확인한다.
주장 2: 소문자+숫자(36자) 8자리 비밀번호 36^8 = 2,821,109,907,456개, 숫자를 하나 이상 포함 36^8 - 26^8 = 2,612,282,842,880개.
        (작은 판: 3글자·기호 {a,b,1}에서 전수)
주장 3: 원탁에 n명 앉히는 방법(회전만 같은 것으로 봄)은 (n-1)!이다 (n <= 7 전수).
주장 4: 서로 다른 세 글자 문자열 26·25·24 = 15,600.
주장 5: 오해 — 첫 자리나 끝자리가 0인 네 자리 PIN은 2,000이 아니라 1,900개.
"""
import math
from itertools import permutations, product


def main():
    A, B = range(4), range(7)
    assert len(list(product(A, B))) == 4 * 7
    assert len(set(range(0, 5)) | set(range(10, 13))) == 5 + 3
    print("[OK] 주장 1: 곱·합의 법칙")

    assert 36 ** 8 == 2_821_109_907_456 and 36 ** 8 - 26 ** 8 == 2_612_282_842_880 and 26 ** 8 == 208_827_064_576
    assert round(36 ** 8 / 1e9 / 60) == 47 and round(36 ** 12 / 1e9 / (365.25 * 86400)) == 150
    small = ["".join(p) for p in product("ab1", repeat=3)]
    assert sum(1 for w in small if any(c.isdigit() for c in w)) == 3 ** 3 - 2 ** 3
    print("[OK] 주장 2·카드 C2: 여사건으로 세기")

    for n in range(1, 8):
        seen = set()
        for p in permutations(range(n)):
            i = p.index(0)
            seen.add(p[i:] + p[:i])      # 0이 맨 앞에 오게 돌린 표준형
        assert len(seen) == math.factorial(n - 1) == math.factorial(n) // n
    print("[OK] 주장 3·카드 C3: 원탁 (n-1)! (n <= 7), 나눗셈 법칙")

    assert len(list(permutations("abcdefghijklmnopqrstuvwxyz", 3))) == 26 * 25 * 24 == 15600
    print("[OK] 주장 4")

    pins = ["".join(p) for p in product("0123456789", repeat=4)]
    cnt = sum(1 for w in pins if w[0] == "0" or w[-1] == "0")
    assert cnt == 1900 and 1000 + 1000 - 100 == 1900
    print("[OK] 주장 5·오해: 1,900개")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
