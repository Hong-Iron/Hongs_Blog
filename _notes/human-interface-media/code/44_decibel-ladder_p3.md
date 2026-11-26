---
layout: "note"
title: "44_decibel-ladder_p3.py"
display_title: "44_decibel-ladder_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "44"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/decibel-ladder/"
parent_title: "데시벨 예제 사다리"
description: "휴먼 인터페이스 미디어 · 데시벨 예제 사다리 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/44_decibel-ladder_p3/"
---
{% raw %}
[데시벨 예제 사다리](/Hongs_Blog/studies/human-interface-media/decibel-ladder/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""데시벨 예제 사다리 문제 3: 85 dB 스피커 4대면? 95 dB 이상이 되려면 몇 대? (+ 변형 2: 0.2 Pa의 dB SPL과 dB IL)

실행: python3 -I 44_decibel-ladder_p3.py  (표준 라이브러리만 쓴다)
풀이 순서: 조건 확인 -> 세기 비로 풀기 -> 세기로 계산 -> 다시 dB로
"""
import math

P_R = 20e-6          # Pa
I_R = 1e-12          # W/m^2
Z_AIR = 1.204 * 343.2  # 공기 rho c, Pa.s/m (20 도)


def n_speakers(level_one: float, n: int) -> float:
    return 10 * math.log10(n * 10 ** (level_one / 10))


def min_count(level_one: float, target: float) -> int:
    n = 1
    while n_speakers(level_one, n) < target - 1e-9:
        n += 1
    return n


if __name__ == "__main__":
    I1 = 10 ** 8.5
    assert abs(4 * I1 - 1.265e9) < 1e6
    L4 = n_speakers(85, 4)
    assert abs(L4 - 91.02) < 0.005
    n = min_count(85, 95)
    assert n == 10 and abs(n_speakers(85, 10) - 95.0) < 1e-9 and n_speakers(85, 9) < 95
    print(f"문제 3: 4대 {L4:.2f} dB, 95 dB 이상은 {n}대 (9대면 {n_speakers(85, 9):.2f} dB)")
    # 변형 2
    p = 0.2
    spl = 20 * math.log10(p / P_R)
    il = 10 * math.log10((p ** 2 / Z_AIR) / I_R)
    assert abs(spl - 80.0) < 1e-9 and abs(il - 79.86) < 0.005
    print(f"변형 2: 0.2 Pa -> {spl:.1f} dB SPL, 세기 {p ** 2 / Z_AIR:.3e} W/m^2 -> {il:.2f} dB IL")
    print("ALL CHECKS PASSED")
```
{% endraw %}
