---
layout: "note"
title: "53_critical-band-bark_verify.py"
display_title: "53_critical-band-bark_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "53"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/critical-band-bark/"
parent_title: "임계 대역과 바크 스케일"
description: "휴먼 인터페이스 미디어 · 임계 대역과 바크 스케일 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/53_critical-band-bark_verify/"
---
{% raw %}
[임계 대역과 바크 스케일](/Hongs_Blog/studies/human-interface-media/critical-band-bark/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 임계 대역과 바크 스케일 문서의 수치를 검증한다.
# 실행: python3 -I 53_critical-band-bark_verify.py  (표준 라이브러리만)
# - 문서의 임계 대역 표 25줄이 스스로 맞는지 (폭 = 위 - 아래, 빈틈없이 이어짐)
# - Zwicker & Terhardt(1980)의 바크 식, 임계 대역 폭 식과 표를 맞대어 본다
import math

TABLE = [(1, None, 50, 100, None), (2, 100, 150, 200, 100), (3, 200, 250, 300, 100), (4, 300, 350, 400, 100),
         (5, 400, 450, 510, 110), (6, 510, 570, 630, 120), (7, 630, 700, 770, 140), (8, 770, 840, 920, 150),
         (9, 920, 1000, 1080, 160), (10, 1080, 1170, 1270, 190), (11, 1270, 1370, 1480, 210),
         (12, 1480, 1600, 1720, 240), (13, 1720, 1850, 2000, 280), (14, 2000, 2150, 2320, 320),
         (15, 2320, 2500, 2700, 380), (16, 2700, 2900, 3150, 450), (17, 3150, 3400, 3700, 550),
         (18, 3700, 4000, 4400, 700), (19, 4400, 4800, 5300, 900), (20, 5300, 5800, 6400, 1100),
         (21, 6400, 7000, 7700, 1300), (22, 7700, 8500, 9500, 1800), (23, 9500, 10500, 12000, 2500),
         (24, 12000, 13500, 15500, 3500), (25, 15500, 18775, 22050, 6550)]


def bark(f):
    return 13.0 * math.atan(0.00076 * f) + 3.5 * math.atan((f / 7500.0) ** 2)


def cbw(f):
    return 25.0 + 75.0 * (1.0 + 1.4 * (f / 1000.0) ** 2) ** 0.69


def band_of(f):
    """표에서 f가 들어 있는 대역 번호 (아래 경계 포함, 위 경계 제외)."""
    for b, lo, c, hi, w in TABLE:
        if (lo is None or lo <= f) and f < hi:
            return b
    return None


if __name__ == "__main__":
    # 1) 표 자체: 폭 = 위 경계 - 아래 경계, 다음 대역의 아래 경계 = 이 대역의 위 경계
    for i, (b, lo, c, hi, w) in enumerate(TABLE):
        assert b == i + 1
        if lo is not None:
            assert hi - lo == w, b
            assert lo == TABLE[i - 1][3], b
            assert lo < c < hi, b
    # 25번의 가운데는 두 경계의 산술 평균: (15500 + 22050) / 2 = 18775
    assert (15500 + 22050) / 2 == 18775
    # 22,050 Hz는 CD 표본화율 44,100 Hz의 절반
    assert 44100 / 2 == 22050

    # 2) 500 Hz 아래(2~5번)는 폭 100~110 Hz, 700 Hz 위(7~24번)는 폭이 가운데 주파수의 15~26 %
    assert all(100 <= w <= 110 for b, lo, c, hi, w in TABLE[1:5])
    ratios = [w / c for b, lo, c, hi, w in TABLE[6:24]]
    assert all(0.148 <= r <= 0.26 for r in ratios), ratios
    # 가장 넓은 24번 3,500 Hz, 25번 6,550 Hz (4 kHz보다 넓다)
    assert TABLE[23][4] == 3500 and TABLE[24][4] == 6550

    # 3) 바크 식: 대역 k의 위 경계에서 z = k (1~24번, 오차 0.2 Bark 안)
    worst = max(abs(bark(hi) - b) for b, lo, c, hi, w in TABLE[:24])
    assert worst < 0.2, worst
    # 1 kHz는 8.51 Bark, 2 kHz는 13.10 Bark: 사이가 4.59 Bark
    assert abs(bark(1000) - 8.51) < 0.005 and abs(bark(2000) - 13.10) < 0.005
    assert abs((bark(2000) - bark(1000)) - 4.59) < 0.005
    # 25번 대역(15,500~22,050 Hz)은 0.73 Bark뿐이다
    assert abs((bark(22050) - bark(15500)) - 0.73) < 0.01

    # 4) 폭 식: 2~24번에서 표와 10 % 안 (가장 큰 차이는 21번 약 9.7 %)
    errs = {b: abs(cbw(c) - w) / w for b, lo, c, hi, w in TABLE[1:24]}
    assert max(errs.values()) < 0.10, errs
    assert abs(cbw(1000) - 162.3) < 0.1     # 1 kHz 근처 약 160 Hz

    # 5) 카드: 1 kHz와 2 kHz 사이의 대역 수
    assert band_of(1000) == 9 and band_of(2000) == 14   # 2000 Hz는 13번과 14번의 경계
    # 1000 Hz(9번 가운데)~1080 Hz는 9번 폭 160 Hz의 절반, 그 뒤 10~13번 네 개 -> 4.5개
    half9 = (1080 - 1000) / 160
    assert half9 == 0.5 and half9 + 4 == 4.5
    # 같은 100 Hz 차이도 낮은 곳과 높은 곳에서 바크 거리가 다르다
    assert abs((bark(200) - bark(100)) - 0.98) < 0.01      # 거의 1 Bark
    assert (bark(10100) - bark(10000)) < 0.05              # 0.05 Bark도 안 된다
    # 6) 오해 상자: 1,080 Hz 자리의 칸 폭 약 171 Hz, 1,000 Hz와 1,080 Hz는 약 0.5 Bark
    assert abs(cbw(1080) - 171.3) < 0.1
    assert abs((bark(1080) - bark(1000)) - 0.50) < 0.01
    # 낮은 쪽 근사: z(f) 약 0.00988 f (100 Hz마다 약 1 Bark)
    assert abs(13 * 0.00076 - 0.00988) < 1e-12 and abs(bark(50) - 0.00988 * 50) < 0.001
    print("ALL CHECKS PASSED")
```
{% endraw %}
