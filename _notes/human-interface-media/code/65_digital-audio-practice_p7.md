---
layout: "note"
title: "65_digital-audio-practice_p7.py"
display_title: "65_digital-audio-practice_p7.py"
kind: "code"
kind_label: "코드 · 문제 7 풀이"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/digital-audio-practice/"
parent_title: "디지털 오디오 계산 연습"
description: "휴먼 인터페이스 미디어 · 디지털 오디오 계산 연습 문제 7 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/65_digital-audio-practice_p7/"
---
{% raw %}
[디지털 오디오 계산 연습](/Hongs_Blog/studies/human-interface-media/digital-audio-practice/) 문서의 문제 7 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 디지털 오디오 계산 연습 p7: 부분 대역 폭과 임계 대역 비교
# 실행: python3 -I 65_digital-audio-practice_p7.py  (부분 대역 번호는 1부터 센다)
import math

CB = [0, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320,
      2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 22050]


def subband_width(fs, n=32):
    return fs / 2 / n


def subband_of(f, fs):
    return math.floor(f / subband_width(fs)) + 1


def critical_band_of(f):
    for i in range(25):
        if CB[i] <= f < CB[i + 1]:
            return i + 1, CB[i + 1] - CB[i]
    raise ValueError(f)


if __name__ == "__main__":
    W = subband_width(44_100)
    assert W == 689.0625
    assert subband_width(48_000) == 750.0
    # 1 kHz: 부분 대역 2번(689 ~ 1378 Hz), 임계 대역 9번(920 ~ 1080 Hz, 폭 160 Hz)
    assert subband_of(1_000, 44_100) == 2
    assert critical_band_of(1_000) == (9, 160)
    assert abs(W / 160 - 4.31) < 0.01             # 부분 대역이 임계 대역의 약 4.3배
    # 변형: 10 kHz: 부분 대역 15번(9647 ~ 10336 Hz), 임계 대역 23번(9500 ~ 12000 Hz, 폭 2500 Hz)
    assert subband_of(10_000, 44_100) == 15
    assert abs(14 * W - 9646.9) < 0.1 and abs(15 * W - 10335.9) < 0.1
    assert critical_band_of(10_000) == (23, 2500)
    assert abs(2500 / W - 3.63) < 0.01            # 임계 대역이 부분 대역의 약 3.6배
    print("ALL CHECKS PASSED")
```
{% endraw %}
