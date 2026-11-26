---
layout: "note"
title: "52_frequency-masking_verify.py"
display_title: "52_frequency-masking_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "52"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/frequency-masking/"
parent_title: "주파수 가림"
description: "휴먼 인터페이스 미디어 · 주파수 가림 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/52_frequency-masking_verify/"
---
{% raw %}
[주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 주파수 가림 문서의 수치를 검증한다.
# 실행: python3 -I 52_frequency-masking_verify.py  (표준 라이브러리만)
# 51~55 문서 공통 모형 (설명용):
#   Tq(f): Terhardt(1979) 근사식, z(f): Zwicker & Terhardt(1980) 바크 식,
#   SF(dz): Schroeder(1979) 퍼짐 함수, 가림 문턱 = (가리는 소리 레벨) - 10 dB + SF(z(f) - z(fm))
import math

OFFSET = 10.0


def tq(f):
    k = f / 1000.0
    return 3.64 * k ** -0.8 - 6.5 * math.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4


def bark(f):
    return 13.0 * math.atan(0.00076 * f) + 3.5 * math.atan((f / 7500.0) ** 2)


def spread(dz):
    u = dz + 0.474
    return 15.81 + 7.5 * u - 17.5 * math.sqrt(1.0 + u * u)


def mask(f, fm, Lm):
    return Lm - OFFSET + spread(bark(f) - bark(fm))


def verdict(f, L, fm, Lm):
    """'들림', '가려짐'(가림 문턱 아래), '작음'(조용할 때의 문턱 아래)"""
    t, m = tq(f), mask(f, fm, Lm)
    if L > max(t, m):
        return "들림"
    return "가려짐" if m >= t else "작음"


def masked_range(fm, Lm):
    lo = hi = None
    for i in range(0, 40001):
        f = 10 ** (2 + 2.2 * i / 40000)      # 100 Hz ~ 15.8 kHz, 로그 간격
        if mask(f, fm, Lm) > tq(f):
            lo = f if lo is None else lo
            hi = f
    return lo, hi


if __name__ == "__main__":
    # 1) 퍼짐 함수의 모양: dz = 0에서 봉우리 0 dB, 아래쪽 약 +25 dB/Bark, 위쪽 약 -10 dB/Bark
    assert abs(spread(0.0)) < 0.01
    peak = max((spread(i / 1000), i / 1000) for i in range(-3000, 3001))[1]
    assert abs(peak) <= 0.001, peak
    assert abs((spread(-10) - spread(-11)) - 24.9) < 0.1
    assert abs((spread(11) - spread(10)) + 9.9) < 0.1
    # 같은 바크 거리라면 위쪽이 덜 줄어든다: 2 Bark 위 -12.3 dB, 2 Bark 아래 -27.6 dB
    assert abs(spread(2) + 12.33) < 0.01 and abs(spread(-2) + 27.56) < 0.01

    # 2) 1 kHz 가리는 소리의 가림 범위가 레벨에 따라 넓어진다 (그림 1)
    prev = None
    for Lm, (lo_w, hi_w) in {40: (729, 1778), 60: (622, 2624), 80: (526, 3776)}.items():
        lo, hi = masked_range(1000.0, Lm)
        assert abs(lo - lo_w) < 3 and abs(hi - hi_w) < 6, (Lm, lo, hi)
        up, down = bark(hi) - bark(1000.0), bark(1000.0) - bark(lo)
        assert up > down          # 위쪽으로 더 넓다
        if prev:
            assert lo < prev[0] and hi > prev[1]   # 클수록 넓다
        prev = (lo, hi)

    # 3) 예시 그림 2: 1 kHz 60 dB와 2 dB짜리 시험 음 셋
    assert verdict(2000, 2, 1000, 60) == "가려짐"
    assert verdict(3100, 2, 1000, 60) == "들림"
    assert verdict(9000, 2, 1000, 60) == "작음"

    # 4) 예제: 1 kHz 60 dB가 있을 때 네 시험 음
    ex = {800: (30, 35.6, "가려짐"), 1200: (50, 44.3, "들림"), 1500: (25, 31.5, "가려짐"), 2000: (20, 13.4, "들림")}
    for f, (L, m_w, v_w) in ex.items():
        assert abs(mask(f, 1000, 60) - m_w) < 0.05, (f, mask(f, 1000, 60))
        assert verdict(f, L, 1000, 60) == v_w, f
    # 예제의 바크 값
    assert abs(bark(1000) - 8.51) < 0.005 and abs(bark(800) - 7.14) < 0.005
    assert abs(bark(1200) - 9.70) < 0.005 and abs(bark(1500) - 11.20) < 0.005 and abs(bark(2000) - 13.10) < 0.005

    # 5) 카드: 2 kHz 70 dB가 있을 때
    #    C3 (1.5 kHz와 2.5 kHz, 둘 다 40 dB): 2.5 kHz만 가려진다
    assert abs(mask(1500, 2000, 70) - 34.5) < 0.05 and verdict(1500, 40, 2000, 70) == "들림"
    assert abs(mask(2500, 2000, 70) - 52.7) < 0.05 and verdict(2500, 40, 2000, 70) == "가려짐"
    #    C4 (네 시험 음의 판정)
    card = {1700: (20, 51.0, 1.0, "가려짐"), 4000: (20, 27.7, -3.4, "가려짐"),
            15000: (40, -37.9, 51.0, "작음"), 500: (30, None, 6.3, "들림")}
    for f, (L, m_w, t_w, v_w) in card.items():
        if m_w is not None:
            assert abs(mask(f, 2000, 70) - m_w) < 0.05, (f, mask(f, 2000, 70))
        assert abs(tq(f) - t_w) < 0.05
        assert verdict(f, L, 2000, 70) == v_w, f
    print("ALL CHECKS PASSED")
```
{% endraw %}
