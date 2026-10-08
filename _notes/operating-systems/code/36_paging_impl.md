---
layout: "note"
title: "36_paging_impl.py"
display_title: "36_paging_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "36"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/paging/"
parent_title: "페이징"
description: "운영체제 · 페이징 구현 코드"
permalink: "/studies/operating-systems/code/36_paging_impl/"
---
{% raw %}
[페이징](/Hongs_Blog/studies/operating-systems/paging/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""페이징과 세그먼테이션의 주소 변환을 비트 단위로 확인한다 (Stallings 7.3~7.4절, 그림 7.11~7.12)."""


def page_translate(logical, offset_bits, page_table):
    page, offset = logical >> offset_bits, logical & ((1 << offset_bits) - 1)
    frame = page_table[page]
    return page, offset, (frame << offset_bits) | offset


def seg_translate(logical, offset_bits, seg_table):
    seg, offset = logical >> offset_bits, logical & ((1 << offset_bits) - 1)
    base, length = seg_table[seg]
    if offset >= length:
        raise IndexError("세그먼트 길이를 넘음 -> 보호 오류")
    return seg, offset, base + offset


if __name__ == "__main__":
    # 그림 7.11: 16비트 주소, 페이지 1K(오프셋 10비트). 논리 주소 1502 = 1번 페이지, 오프셋 478
    p, o, phys = page_translate(1502, 10, {0: 5, 1: 6, 2: 7})
    assert (p, o) == (1, 478) and phys == 6 * 1024 + 478 == 6622
    assert format(1502, "016b") == "0000010111011110" and format(phys, "016b") == "0001100111011110"

    # 슬라이드 p.32: 프로세스 D(5페이지)는 프레임 4, 5, 6, 11, 12
    D = {0: 4, 1: 5, 2: 6, 3: 11, 4: 12}
    # 카드 C3: 페이지 크기 100바이트로 단순화(10진), D의 논리 주소 340 -> 3번 페이지 40 -> 프레임 11
    assert divmod(340, 100) == (3, 40) and D[3] * 100 + 40 == 1140

    # 카드 C2: 0000 1001 0110 1100, 오프셋 10비트, 2번 페이지 -> 프레임 5
    p, o, phys = page_translate(0b0000100101101100, 10, {2: 5})
    assert (p, o, phys) == (2, 364, 5484) and format(phys, "016b") == "0001010101101100"
    # 33번 문서 카드 C3: 기준 30000, 경계 34000
    assert 30000 + 2500 <= 34000 and 30000 + 4200 > 34000

    # 사다리: 32비트 주소, 페이지 4KB(오프셋 12비트)
    p, o, phys = page_translate(0x00003A7C, 12, {3: 0x2F})
    assert (p, o, phys) == (3, 0xA7C, 0x2FA7C)
    p, o, phys = page_translate(0x00005123, 12, {5: 0x10})
    assert (p, o, phys) == (5, 0x123, 0x10123)
    p, o, phys = page_translate(0x0000BEEF, 12, {0xB: 0x7})
    assert (p, o, phys) == (0xB, 0xEEF, 0x7EEF)
    assert 2 ** 20 == 1048576                     # 32비트, 12비트 오프셋 -> 페이지 2^20개
    pages = -(-10000 // 4096)
    assert pages == 3 and pages * 4096 - 10000 == 2288   # 사다리 문제 4 (3)

    # 세그먼테이션 슬라이드 p.35: 세그먼트 1 = (base 12, len 12), 2 = (0, 10), 3 = (26, 4)
    T = {1: (12, 12), 2: (0, 10), 3: (26, 4)}
    assert seg_translate((1 << 4) | 5, 4, T)[2] == 17       # 세그먼트 1, 오프셋 5 -> 17
    try:
        seg_translate((3 << 4) | 6, 4, T)                    # 세그먼트 3 길이 4를 넘음
        raise AssertionError
    except IndexError:
        pass
    # 그림 7.12b: 16비트, 세그먼트 번호 4비트 + 오프셋 12비트. 세그먼트 1, 오프셋 752, base 8224
    s, o, phys = seg_translate((1 << 12) | 752, 12, {1: (8224, 4096)})
    assert (s, o, phys) == (1, 752, 8976)
    print("ALL CHECKS PASSED")
```
{% endraw %}
