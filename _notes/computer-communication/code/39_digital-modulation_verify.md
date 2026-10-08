---
layout: "note"
title: "39_digital-modulation_verify.py"
display_title: "39_digital-modulation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "39"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/digital-modulation/"
parent_title: "진폭·주파수·위상 변조"
description: "컴퓨터 통신 · 진폭·주파수·위상 변조 검증 코드"
permalink: "/studies/computer-communication/code/39_digital-modulation_verify/"
---
{% raw %}
[진폭·주파수·위상 변조](/Hongs_Blog/studies/computer-communication/digital-modulation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""진폭·주파수·위상 변조의 심볼 수와 비트 수 검증.

문서: 39.진폭·주파수·위상 변조 (정의, 예시, 카드 C2·C3)
출처: 2장-1 슬라이드 27~30
주장:
  1. 신호 모양(심볼)이 M가지면 심볼 하나에 lg M 비트를 싣는다. 2 -> 1, 4 -> 2, 8 -> 3, 16 -> 4.
  2. 데이터 속도 = 1초에 보내는 심볼 수 x 심볼 하나의 비트 수.
  3. 슬라이드 30의 위상 변조 심볼 수 2 -> 4 -> 8은 같은 심볼 속도에서 데이터 속도를 1 : 2 : 3배로 만든다.
     ("2배씩"이 아니다. 2배가 되려면 심볼 수를 제곱해야 한다: 4 -> 16.)
  4. 진폭 4단계 예(5, 3.5, 1.5, 0 V)에 2비트씩 붙이면 4단계가 서로 다른 2비트를 하나씩 맡는다.
"""
from math import log2


def bits_per_symbol(m):
    b = log2(m)
    assert b == int(b), "심볼 수가 2의 거듭제곱일 때만 정수 비트"
    return int(b)


def data_rate(symbols_per_sec, m):
    return symbols_per_sec * bits_per_symbol(m)


def main():
    assert [bits_per_symbol(m) for m in (2, 4, 8, 16, 64, 256)] == [1, 2, 3, 4, 6, 8]
    print("[OK] 심볼 2, 4, 8, 16, 64, 256가지 -> 1, 2, 3, 4, 6, 8비트")

    base = 1_000_000  # 1초에 심볼 100만 개
    rates = [data_rate(base, m) for m in (2, 4, 8)]
    assert rates == [1_000_000, 2_000_000, 3_000_000]
    assert data_rate(base, 16) == 2 * data_rate(base, 4)
    print("[OK] 심볼 2 -> 4 -> 8: 1 -> 2 -> 3 Mbps. 4 -> 16이어야 2배")

    # 카드 C3: 심볼 2,400개/초, 16가지 -> 9,600 bps
    assert data_rate(2_400, 16) == 9_600
    print("[OK] 카드 C3: 2,400 심볼/초 x 4비트 = 9,600 bps")

    # 4단계 진폭 예: 단계마다 2비트 이름이 하나씩, 겹치지 않는다
    mapping = {5.0: "00", 3.5: "11", 1.5: "01", 0.0: "10"}
    assert len(set(mapping.values())) == 4 and all(len(v) == 2 for v in mapping.values())
    print("[OK] 진폭 4단계 -> 2비트 이름 4개")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
