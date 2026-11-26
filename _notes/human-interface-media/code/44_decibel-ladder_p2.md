---
layout: "note"
title: "44_decibel-ladder_p2.py"
display_title: "44_decibel-ladder_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "44"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/decibel-ladder/"
parent_title: "데시벨 예제 사다리"
description: "휴먼 인터페이스 미디어 · 데시벨 예제 사다리 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/44_decibel-ladder_p2/"
---
{% raw %}
[데시벨 예제 사다리](/Hongs_Blog/studies/human-interface-media/decibel-ladder/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""데시벨 예제 사다리 문제 2: 점음원, 2 m에서 90 dB SPL -> 8 m에서? (+ 변형 3: 선음원 10 m 75 dB -> 40 m)

실행: python3 -I 44_decibel-ladder_p2.py  (표준 라이브러리만 쓴다)
풀이 순서: 조건 확인 -> 세기 비로 풀기 -> 세기로 계산 -> 다시 dB로
"""
import math


def level_at(level_db: float, r_from: float, r_to: float, power: int) -> float:
    """세기가 거리의 power제곱에 반비례할 때(점음원 2, 선음원 1) r_to에서의 dB."""
    I = 10 ** (level_db / 10)
    I_to = I * (r_from / r_to) ** power
    return 10 * math.log10(I_to)


if __name__ == "__main__":
    I2 = 10 ** (90 / 10)
    I8 = I2 / 16
    assert abs(I8 - 6.25e7) < 1e-3
    L8 = level_at(90, 2, 8, 2)
    assert abs(L8 - 77.96) < 0.005
    assert abs((90 - L8) - 12.04) < 0.005
    print(f"문제 2: 세기 {I2:.0e} -> {I8:.3e} (1/16) -> {L8:.2f} dB (-{90 - L8:.2f} dB)")
    L40 = level_at(75, 10, 40, 1)
    assert abs(L40 - 68.98) < 0.005
    print(f"변형 3: 선음원 10 m 75 dB -> 40 m {L40:.2f} dB")
    print("ALL CHECKS PASSED")
```
{% endraw %}
