---
layout: "note"
title: "65_digital-audio-practice_p8.py"
display_title: "65_digital-audio-practice_p8.py"
kind: "code"
kind_label: "코드 · 문제 8 풀이"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/digital-audio-practice/"
parent_title: "디지털 오디오 계산 연습"
description: "휴먼 인터페이스 미디어 · 디지털 오디오 계산 연습 문제 8 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/65_digital-audio-practice_p8/"
---
{% raw %}
[디지털 오디오 계산 연습](/Hongs_Blog/studies/human-interface-media/digital-audio-practice/) 문서의 문제 8 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 디지털 오디오 계산 연습 p8: 신호 대 가림 비(SMR)로 비트 배분
# 실행: python3 -I 65_digital-audio-practice_p8.py
import math

K = 20 * math.log10(2)           # 비트 하나 = 6.02 dB


def allocate(signal, mask):
    out = []
    for s, m in zip(signal, mask):
        smr = s - m
        out.append(math.ceil(smr / K) if smr > 0 else 0)
    return out


if __name__ == "__main__":
    signal = [70, 58, 40, 66]
    mask = [42, 50, 44, 47]
    assert [s - m for s, m in zip(signal, mask)] == [28, 8, -4, 19]
    bits = allocate(signal, mask)
    assert bits == [5, 2, 0, 4] and sum(bits) == 11
    assert 16 * 4 == 64
    # 하나 적으면 문턱을 넘는지
    for s, m, b in zip(signal, mask, bits):
        if b:
            assert s - K * b <= m < s - K * (b - 1)
    # 변형: 2번 대역의 가림 문턱이 55 dB로 오르면 SMR 3 dB -> 1비트, 합 10비트
    bits2 = allocate(signal, [42, 55, 44, 47])
    assert bits2 == [5, 1, 0, 4] and sum(bits2) == 10
    print("ALL CHECKS PASSED")
```
{% endraw %}
