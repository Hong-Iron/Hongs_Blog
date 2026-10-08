---
layout: "note"
title: "49_internet-checksum_impl.py"
display_title: "49_internet-checksum_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "49"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/internet-checksum/"
parent_title: "인터넷 체크섬"
description: "컴퓨터 통신 · 인터넷 체크섬 구현 코드"
permalink: "/studies/computer-communication/code/49_internet-checksum_impl/"
---
{% raw %}
[인터넷 체크섬](/Hongs_Blog/studies/computer-communication/internet-checksum/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""인터넷 체크섬 구현과 검증 (슬라이드 p.50의 C 코드를 옮김)."""
import random


def cksum(words):
    s = 0
    for w in words:
        s += w
        if s & 0xFFFF0000:                     # 자리올림이 생기면 맨 아래로 되돌려 더한다
            s &= 0xFFFF
            s += 1
    return ~s & 0xFFFF


def ones_sum(words):
    s = 0
    for w in words:
        s += w
        s = (s & 0xFFFF) + (s >> 16)
    return s


def main():
    msg = [0x4500, 0x0073, 0x0000, 0x4000, 0x4011, 0x0000, 0xC0A8, 0x0001, 0xC0A8, 0x00C7]
    c = cksum(msg)
    assert c == 0xB861                         # IPv4 헤더 체크섬의 잘 알려진 예
    # 받는 쪽: 체크섬까지 모두 1의 보수로 더하면 0xFFFF
    assert ones_sum(msg + [c]) == 0xFFFF
    # 자리올림 되돌리기: 0xFFFF + 0x0001 = 0x0001
    assert ones_sum([0xFFFF, 0x0001]) == 0x0001 and cksum([0xFFFF, 0x0001]) == 0xFFFE
    # 카드 C2: 두 워드 0x8000, 0x8001 → 합 0x10001 → 0x0002 → 체크섬 0xFFFD
    assert cksum([0x8000, 0x8001]) == 0xFFFD
    random.seed(49)
    # 1비트 오류는 늘 검출
    for _ in range(2000):
        ws = [random.randrange(65536) for _ in range(8)]
        c = cksum(ws); i = random.randrange(8); b = random.randrange(16)
        bad = list(ws); bad[i] ^= 1 << b
        assert ones_sum(bad + [c]) != 0xFFFF
    # 놓치는 오류: 워드 순서가 바뀌면 합이 같다
    ws = [0x1234, 0xABCD, 0x0F0F]
    assert cksum(ws) == cksum([0xABCD, 0x1234, 0x0F0F])
    # 한 워드에 +1, 다른 워드에 −1
    assert cksum([0x0005, 0x0010]) == cksum([0x0006, 0x000F])
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
