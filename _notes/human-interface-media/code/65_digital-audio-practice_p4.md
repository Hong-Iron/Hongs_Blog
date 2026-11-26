---
layout: "note"
title: "65_digital-audio-practice_p4.py"
display_title: "65_digital-audio-practice_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/digital-audio-practice/"
parent_title: "디지털 오디오 계산 연습"
description: "휴먼 인터페이스 미디어 · 디지털 오디오 계산 연습 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/65_digital-audio-practice_p4/"
---
{% raw %}
[디지털 오디오 계산 연습](/Hongs_Blog/studies/human-interface-media/digital-audio-practice/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 디지털 오디오 계산 연습 p4: SQNR과 필요한 비트 수 (두 정의)
# 실행: python3 -I 65_digital-audio-practice_p4.py
import math

K = 20 * math.log10(2)           # 6.0206 dB / 비트
S = 10 * math.log10(1.5)         # 1.7609 dB


def bits_peak(target_db):
    """최대 진폭 정의 SQNR = 6.02N >= target."""
    return math.ceil(target_db / K)


def bits_sine(target_db):
    """꽉 찬 정현파 전력 정의 SQNR = 6.02N + 1.76 >= target."""
    return math.ceil((target_db - S) / K)


if __name__ == "__main__":
    # 80 dB 이상: 최대 진폭 정의 14비트, 정현파 정의 13비트
    assert bits_peak(80) == 14 and bits_sine(80) == 13
    assert K * 13 < 80 <= K * 14
    assert K * 13 + S >= 80 > K * 12 + S
    # 12비트의 SQNR: 72.2 dB, 74.0 dB
    assert round(K * 12, 1) == 72.2 and round(K * 12 + S, 1) == 74.0
    # 변형: 16비트에서 꽉 찬 진폭의 1/10인 정현파 -> 98.1 - 20 = 78.1 dB
    assert abs((K * 16 + S) - 20 * math.log10(10) - 78.09) < 0.01
    print("ALL CHECKS PASSED")
```
{% endraw %}
