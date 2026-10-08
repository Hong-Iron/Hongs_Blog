---
layout: "note"
title: "54_raid_verify.py"
display_title: "54_raid_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "54"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/raid/"
parent_title: "RAID"
description: "운영체제 · RAID 검증 코드"
permalink: "/studies/operating-systems/code/54_raid_verify/"
---
{% raw %}
[RAID](/Hongs_Blog/studies/operating-systems/raid/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""RAID 4·5의 패리티: 데이터 스트립들의 비트별 XOR. 디스크 하나가 고장 나면 나머지의 XOR로 되살린다.
RAID 5는 패리티 위치를 스트라이프마다 돌린다."""
import random
from functools import reduce


def parity(strips):
    return bytes(reduce(lambda a, b: a ^ b, col) for col in zip(*strips))


if __name__ == "__main__":
    rnd = random.Random(0)
    for _ in range(200):
        n = rnd.randint(2, 6)
        data = [bytes(rnd.randrange(256) for _ in range(16)) for _ in range(n)]
        p = parity(data)
        lost = rnd.randrange(n)
        rebuilt = parity([d for i, d in enumerate(data) if i != lost] + [p])
        assert rebuilt == data[lost]
    # 작은 예: 1010 ^ 0110 ^ 1100 = 0000 -> 둘째 디스크 고장 시 1010 ^ 1100 ^ 0000 = 0110
    a, b, c = 0b1010, 0b0110, 0b1100
    P = a ^ b ^ c
    assert P == 0b0000 and a ^ c ^ P == b
    # 갱신(작은 쓰기): 새 패리티 = 옛 패리티 ^ 옛 데이터 ^ 새 데이터 -> 읽기 2, 쓰기 2
    new_b = 0b0011
    assert P ^ b ^ new_b == a ^ new_b ^ c
    # RAID 5: 디스크 5개, 스트라이프 k의 패리티 디스크 = (4 - k) mod 5 (왼쪽 대칭 배치의 한 예)
    pos = [(4 - k) % 5 for k in range(5)]
    assert sorted(pos) == [0, 1, 2, 3, 4]       # 다섯 스트라이프 동안 패리티가 모든 디스크에 한 번씩
    # 용량: 디스크 N개, RAID 1은 절반, RAID 4·5는 N-1개, RAID 6은 N-2개만큼 데이터
    N = 6
    assert (N // 2, N - 1, N - 2) == (3, 5, 4)
    # 카드 C2: A=1011, B=0101, C=1110 -> P=0000, B = A^C^P
    A_, B_, C_ = 0b1011, 0b0101, 0b1110
    assert A_ ^ B_ ^ C_ == 0 and A_ ^ C_ ^ 0 == B_
    print("ALL CHECKS PASSED")
```
{% endraw %}
