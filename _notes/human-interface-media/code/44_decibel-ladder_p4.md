---
layout: "note"
title: "44_decibel-ladder_p4.py"
display_title: "44_decibel-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "44"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/decibel-ladder/"
parent_title: "데시벨 예제 사다리"
description: "휴먼 인터페이스 미디어 · 데시벨 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/44_decibel-ladder_p4/"
---
{% raw %}
[데시벨 예제 사다리](/Hongs_Blog/studies/human-interface-media/decibel-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""데시벨 예제 사다리 문제 4: 1 m에서 110 dB SPL인 스피커 두 대(서로 다른 소리) -> 85 dB 이하가 되는 거리

실행: python3 -I 44_decibel-ladder_p4.py  (표준 라이브러리만 쓴다)
"""
import math


def level_two_speakers(r_m: float) -> float:
    one_at_1m = 110.0
    both_at_1m = 10 * math.log10(2 * 10 ** (one_at_1m / 10))
    return both_at_1m - 20 * math.log10(r_m)


if __name__ == "__main__":
    both = level_two_speakers(1.0)
    assert abs(both - 113.01) < 0.005
    need = both - 85
    assert abs(need - 28.01) < 0.005
    r = 10 ** (need / 20)
    assert abs(r - 25.15) < 0.005
    assert abs(level_two_speakers(r) - 85) < 1e-9
    assert level_two_speakers(25.0) > 85 and level_two_speakers(25.2) < 85
    # 한 대만이라면
    r_one = 10 ** ((110 - 85) / 20)
    assert abs(r_one - 17.78) < 0.005 and abs(r / r_one - math.sqrt(2)) < 1e-9
    print(f"문제 4: 1 m에서 {both:.2f} dB, {need:.2f} dB를 줄여야 하므로 r >= {r:.2f} m (한 대면 {r_one:.2f} m)")
    print("ALL CHECKS PASSED")
```
{% endraw %}
