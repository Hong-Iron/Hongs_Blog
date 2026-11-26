---
layout: "note"
title: "65_digital-audio-practice_p1.py"
display_title: "65_digital-audio-practice_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/digital-audio-practice/"
parent_title: "디지털 오디오 계산 연습"
description: "휴먼 인터페이스 미디어 · 디지털 오디오 계산 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/65_digital-audio-practice_p1/"
---
{% raw %}
[디지털 오디오 계산 연습](/Hongs_Blog/studies/human-interface-media/digital-audio-practice/) 문서의 문제 1 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 디지털 오디오 계산 연습 p1: 비트율 = 채널 수 x 표본화율 x 표본당 비트
# 실행: python3 -I 65_digital-audio-practice_p1.py


def bit_rate(channels, fs, bits):
    """초당 비트 수(b/s)."""
    return channels * fs * bits


if __name__ == "__main__":
    # (가) 전화 음성: 1채널, 8 kHz, 8비트 -> 64 kb/s
    assert bit_rate(1, 8_000, 8) == 64_000
    # (나) 스튜디오 녹음: 2채널, 48 kHz, 24비트 -> 2.304 Mb/s
    assert bit_rate(2, 48_000, 24) == 2_304_000
    # 비교: CD 1.4112 Mb/s의 약 1.63배
    assert abs(bit_rate(2, 48_000, 24) / bit_rate(2, 44_100, 16) - 1.633) < 0.001
    # 변형: 6채널(5.1), 48 kHz, 16비트 -> 4.608 Mb/s
    assert bit_rate(6, 48_000, 16) == 4_608_000
    print("ALL CHECKS PASSED")
```
{% endraw %}
