---
layout: "note"
title: "51_equal-loudness-contours_verify.py"
display_title: "51_equal-loudness-contours_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "51"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/equal-loudness-contours/"
parent_title: "등청감 곡선"
description: "휴먼 인터페이스 미디어 · 등청감 곡선 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/51_equal-loudness-contours_verify/"
---
{% raw %}
[등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 등청감 곡선 문서의 수치를 검증한다.
# 실행: python3 -I 51_equal-loudness-contours_verify.py  (표준 라이브러리만)
# - 조용할 때의 문턱: Terhardt(1979) 근사식 (51~55 문서 공통)
# - A 가중치: IEC 61672의 해석식
# - 바깥귀 길(외이도)의 공명: 한쪽이 막힌 관의 1/4 파장 공명
# - sone: 40 phon 이상에서 10 phon마다 2배
import math


def tq(f):
    k = f / 1000.0
    return 3.64 * k ** -0.8 - 6.5 * math.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4


def a_weight(f):
    ra = (12194.0 ** 2 * f ** 4) / (
        (f ** 2 + 20.6 ** 2)
        * math.sqrt((f ** 2 + 107.7 ** 2) * (f ** 2 + 737.9 ** 2))
        * (f ** 2 + 12194.0 ** 2)
    )
    return 20 * math.log10(ra) + 2.0


def sone(phon):
    return 2 ** ((phon - 40) / 10)


if __name__ == "__main__":
    # 1) 문턱 값 (dB SPL)
    table = {20: 83.22, 100: 22.95, 1000: 3.37, 2000: -0.25, 3300: -4.98, 9000: 7.19, 10000: 10.58, 15000: 51.04}
    for f, v in table.items():
        assert abs(tq(f) - v) < 0.01, (f, tq(f))
    # 가장 낮은 곳: 3.3 kHz 근처 약 -5 dB (1 Hz 간격 전수 탐색)
    fmin = min(range(1000, 8001), key=tq)
    assert 3200 <= fmin <= 3400 and abs(tq(fmin) + 4.98) < 0.01, fmin
    # 0 dB 아래로 내려가는 구간: 약 1.9~4.8 kHz
    below = [f for f in range(1000, 8001) if tq(f) < 0]
    assert 1900 < below[0] < 2000 and 4800 < below[-1] < 4900, (below[0], below[-1])
    # 카드 C2: 50 dB SPL 순음 셋이 문턱 위로 나온 여유 (3.5 kHz > 1 kHz > 50 Hz)
    margin = {f: 50 - tq(f) for f in (50, 1000, 3500)}
    assert abs(tq(50) - 39.98) < 0.01 and abs(tq(3500) + 4.86) < 0.01
    assert margin[3500] > margin[1000] > margin[50]
    assert round(margin[3500]) == 55 and round(margin[1000]) == 47 and round(margin[50]) == 10
    # 카드 C3 (원본 그림에서 읽은 값): 80 phon 100 Hz 82 dB를 40 dB 줄이면 40 phon 곡선(60 dB)보다 18 dB 아래
    assert (82 - 40) == 42 and 60 - 42 == 18
    # 100 Hz의 문턱은 1 kHz보다 약 20 dB 높다
    assert abs((tq(100) - tq(1000)) - 19.58) < 0.01

    # 2) A 가중치 (dB): 1 kHz 0, 100 Hz 약 -19.1, 50 Hz 약 -30.3, 2.5 kHz 약 +1.3
    for f, v in {1000: 0.0, 100: -19.14, 50: -30.27, 2500: 1.27, 4000: 0.96, 10000: -2.49}.items():
        assert abs(a_weight(f) - v) < 0.02, (f, a_weight(f))
    # A 가중치가 가장 큰 곳은 2~3 kHz
    fpk = max(range(500, 10001, 10), key=a_weight)
    assert 2000 <= fpk <= 3000, fpk

    # 3) 외이도 공명: 길이 2.5 cm, 소리 속도 343 m/s -> c/(4L) = 3430 Hz
    L, c = 0.025, 343.0
    assert abs(c / (4 * L) - 3430) < 1e-9

    # 4) sone: 40 phon = 1 sone, 50 phon = 2 sone, 60 phon = 4 sone
    assert sone(40) == 1 and sone(50) == 2 and sone(60) == 4

    print("ALL CHECKS PASSED")
```
{% endraw %}
