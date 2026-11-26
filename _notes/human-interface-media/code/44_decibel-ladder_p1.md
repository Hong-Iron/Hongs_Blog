---
layout: "note"
title: "44_decibel-ladder_p1.py"
display_title: "44_decibel-ladder_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "44"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/decibel-ladder/"
parent_title: "데시벨 예제 사다리"
description: "휴먼 인터페이스 미디어 · 데시벨 예제 사다리 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/44_decibel-ladder_p1/"
---
{% raw %}
[데시벨 예제 사다리](/Hongs_Blog/studies/human-interface-media/decibel-ladder/) 문서의 문제 1 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""데시벨 예제 사다리 문제 1: 80 dB와 74 dB 기계를 함께 켜면? (+ 변형 1: 같은 위상 신호라면?)

실행: python3 -I 44_decibel-ladder_p1.py  (표준 라이브러리만 쓴다)
풀이 순서: 조건 확인 -> 세기 비로 풀기 -> 세기로 계산 -> 다시 dB로
"""
import math


def to_intensity_ratio(level_db: float) -> float:
    return 10 ** (level_db / 10)


def to_db(intensity_ratio: float) -> float:
    return 10 * math.log10(intensity_ratio)


def combine_incoherent(*levels: float) -> float:
    return to_db(sum(to_intensity_ratio(L) for L in levels))


def combine_in_phase(*levels: float) -> float:
    """같은 주파수·같은 위상의 신호: 음압 진폭이 더해진다."""
    p = sum(10 ** (L / 20) for L in levels)
    return 20 * math.log10(p)


if __name__ == "__main__":
    a, b = to_intensity_ratio(80), to_intensity_ratio(74)
    assert abs(a - 1e8) < 1e-3 and abs(b - 2.512e7) < 1e4
    assert abs((a + b) - 1.2512e8) < 1e4
    total = combine_incoherent(80, 74)
    assert abs(total - 80.97) < 0.005
    print(f"문제 1: 세기 비 {a:.3e} + {b:.3e} = {a + b:.4e} -> {total:.2f} dB")
    # 변형 1: 같은 신호를 같은 위상으로 내면 음압이 더해진다
    coh = combine_in_phase(80, 74)
    assert abs(coh - 83.53) < 0.005
    print(f"변형 1: 같은 위상이면 음압 1e4 + {10 ** 3.7:.0f} -> {coh:.2f} dB")
    print("ALL CHECKS PASSED")
```
{% endraw %}
