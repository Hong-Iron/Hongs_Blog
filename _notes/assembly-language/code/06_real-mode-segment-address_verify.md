---
layout: "note"
title: "06_real-mode-segment-address_verify.py"
display_title: "06_real-mode-segment-address_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/real-mode-segment-address/"
parent_title: "실주소 모드의 세그먼트 주소"
description: "어셈블리어 · 실주소 모드의 세그먼트 주소 검증 코드"
permalink: "/studies/assembly-language/code/06_real-mode-segment-address_verify/"
---
{% raw %}
[실주소 모드의 세그먼트 주소](/Hongs_Blog/studies/assembly-language/real-mode-segment-address/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""실주소 모드의 세그먼트 주소 검증.

문서: 06.실주소 모드의 세그먼트 주소
출처: 어셈블리어 3주차 3-3 p.9~10, 13주차 2-1 p.7~8
주장:
  1. 선형 주소 = 세그먼트 × 16 + 오프셋. 16을 곱하는 것은 16진수 끝에 0을 하나 붙이는 것과 같다.
  2. 슬라이드 예: 08F1:0100 → 09010h. 그림: 8000:0000 → 80000h, 8000:0250 → 80250h, 8000:FFFF → 8FFFFh.
  3. 세그먼트 하나는 오프셋 0000h ~ FFFFh, 곧 65,536바이트(64KB)다.
  4. 서로 다른 세그먼트:오프셋 쌍이 같은 선형 주소가 될 수 있다. 09010h를 만드는 쌍은 2,306개, 80250h를 만드는 쌍은 4,096개다.
  5. 가장 큰 쌍 FFFF:FFFF는 10FFEFh로, 20비트(FFFFFh)를 넘는다.
  6. 카드 값.
"""


def linear(seg, off):
    assert 0 <= seg <= 0xFFFF and 0 <= off <= 0xFFFF
    return seg * 16 + off


def main():
    for seg in range(0, 0x10000, 37):
        assert seg * 16 == int(format(seg, "X") + "0", 16) == seg << 4
    print("[OK] ×16 = 16진수 끝에 0 붙이기 = 왼쪽으로 4비트 밀기")

    assert linear(0x08F1, 0x0100) == 0x09010
    assert 0x08F10 + 0x0100 == 0x09010
    assert linear(0x8000, 0x0000) == 0x80000
    assert linear(0x8000, 0x0250) == 0x80250
    assert linear(0x8000, 0xFFFF) == 0x8FFFF
    print("[OK] 08F1:0100 → 09010h, 8000:0000/0250/FFFF → 80000h/80250h/8FFFFh")

    assert 0xFFFF + 1 == 65536 == 64 * 1024
    print("[OK] 세그먼트 하나 = 65,536바이트 = 64KB")

    target = 0x09010
    pairs = [(s, target - s * 16) for s in range(0x10000) if 0 <= target - s * 16 <= 0xFFFF]
    assert len(pairs) == 0x0901 + 1 == 2306        # 0000:9010 부터 0901:0000 까지
    assert (0x08F1, 0x0100) in pairs and (0x0900, 0x0010) in pairs and (0x0901, 0x0000) in pairs
    assert (0x0000, 0x9010) in pairs
    big = 0x80250
    pairs2 = [s for s in range(0x10000) if 0 <= big - s * 16 <= 0xFFFF]
    assert len(pairs2) == 4096
    print("[OK] 09010h를 만드는 쌍 2,306개, 80250h를 만드는 쌍 4,096개")

    assert linear(0xFFFF, 0xFFFF) == 0x10FFEF > 0xFFFFF
    assert 0xFFFF + 0xFFFF == 0x1FFFE < 2 ** 17 and 65536 * 16 == 2 ** 20
    print("[OK] FFFF:FFFF → 10FFEFh (20비트를 넘는다). 곱하지 않고 더하면 많아야 1FFFEh(17비트)")

    assert linear(0x1234, 0x0010) == 0x12350
    assert linear(0xB800, 0x0000) == 0xB8000
    assert linear(0x0040, 0x0017) == 0x00417
    assert linear(0x1000, 0x2350) == linear(0x1234, 0x0010)
    print("[OK] 카드: 1234:0010 → 12350h (= 1000:2350), B800:0000 → B8000h, 0040:0017 → 00417h")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
