---
layout: "note"
title: "55_psychoacoustic-model_impl.py"
display_title: "55_psychoacoustic-model_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "55"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/psychoacoustic-model/"
parent_title: "심리음향 모델"
description: "휴먼 인터페이스 미디어 · 심리음향 모델 구현 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/55_psychoacoustic-model_impl/"
---
{% raw %}
[심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 심리음향 모델을 아주 단순하게 구현하고 스스로 검사한다.
# 실행: python3 -I 55_psychoacoustic-model_impl.py  (표준 라이브러리만)
# 입력: 스펙트럼 성분 목록 [(주파수 Hz, 레벨 dB SPL), ...]
# 출력: 성분마다 '남김' / '버림(작아서)' / '버림(가려져서)'과, 남긴 성분이 문턱 위로 나온 여유(dB)
# 51~55 문서 공통 식 (설명용 모형):
#   Tq(f): Terhardt(1979),  z(f): Zwicker & Terhardt(1980),  SF(dz): Schroeder(1979)
#   성분 하나가 만드는 가림 문턱 = L - 10 dB + SF(z(f) - z(fi))
#   전체 가림 문턱 = 조용할 때의 문턱과 다른 성분들의 가림 문턱을 세기(10^(dB/10))로 더한 것
# 실제 MPEG 부호기는 성분을 하나씩 지우지 않고, 대역마다 비트를 나눠 양자화 잡음을 문턱 아래에 둔다.
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


def mask_by(f, comp):
    """성분 comp = (fi, Li)가 주파수 f에 만드는 가림 문턱 (dB)."""
    fi, Li = comp
    return Li - OFFSET + spread(bark(f) - bark(fi))


def power_sum(dbs):
    """dB 값들을 세기로 바꿔 더한 뒤 다시 dB로."""
    return 10.0 * math.log10(sum(10.0 ** (d / 10.0) for d in dbs))


def global_threshold(f, comps, skip=None):
    """주파수 f에서의 전체 가림 문턱. skip 번째 성분(자기 자신)은 뺀다."""
    parts = [tq(f)] + [mask_by(f, c) for i, c in enumerate(comps) if i != skip]
    return power_sum(parts)


def analyze(comps):
    """성분마다 (주파수, 레벨, 조용할 때의 문턱, 전체 문턱, 판정, 여유)를 돌려준다."""
    out = []
    for i, (f, L) in enumerate(comps):
        t_quiet = tq(f)
        t_all = global_threshold(f, comps, skip=i)
        if L > t_all:
            verdict = "남김"
        elif L <= t_quiet:
            verdict = "버림(작아서)"
        else:
            verdict = "버림(가려져서)"
        out.append((f, L, t_quiet, t_all, verdict, L - t_all))
    return out


EXAMPLE = [(60, 45), (150, 15), (500, 40), (1000, 80), (1200, 60),
           (1600, 40), (2000, 50), (2500, 25), (8000, 15), (15000, 40)]


if __name__ == "__main__":
    # 1) 세기 더하기: 같은 두 소리를 더하면 약 3 dB 오른다
    assert abs(power_sum([60, 60]) - 63.01) < 0.01
    # 2) 가리는 소리가 하나도 없으면 전체 문턱 = 조용할 때의 문턱
    for f in (100, 1000, 4000):
        assert abs(global_threshold(f, []) - tq(f)) < 1e-9
    # 3) 예제 성분 10개의 판정
    res = analyze(EXAMPLE)
    want = {60: "남김", 150: "버림(작아서)", 500: "남김", 1000: "남김", 1200: "버림(가려져서)",
            1600: "버림(가려져서)", 2000: "남김", 2500: "버림(가려져서)", 8000: "남김", 15000: "버림(작아서)"}
    for f, L, tqv, tall, v, margin in res:
        assert v == want[f], (f, v, round(tall, 1))
        # 판정이 경계에 걸치지 않는다 (여유 3 dB 이상)
        assert abs(margin) > 3.0, (f, margin)
    kept = [r for r in res if r[4] == "남김"]
    assert len(kept) == 5
    # 4) 문서 표의 값 (소수 첫째 자리)
    table = {f: (round(tqv, 1), round(tall, 1)) for f, L, tqv, tall, v, m in res}
    assert table == {60: (34.5, 34.5), 150: (16.6, 31.6), 500: (6.3, 8.6), 1000: (3.4, 38.9), 1200: (2.7, 64.3),
                     1600: (1.4, 48.0), 2000: (-0.3, 34.3), 2500: (-2.6, 32.9), 8000: (4.8, 4.9),
                     15000: (51.0, 51.0)}, table
    # 5) 재생 음량을 20 dB 올리면 '작아서' 버린 15 kHz(40 -> 60 dB)는 조용할 때의 문턱(51 dB) 위로 올라온다
    louder = [(f, L + 20) for f, L in EXAMPLE]
    res2 = {r[0]: r[4] for r in analyze(louder)}
    assert res2[15000] == "남김"
    # '가려져서' 버린 1200 Hz는 가리는 소리도 같이 커지므로 그대로 가려진다
    assert res2[1200] == "버림(가려져서)"
    # 6) 카드 C2의 성분 넷
    card = analyze([(500, 70), (600, 45), (4000, 12), (16000, 50)])
    got = [(r[0], round(r[2], 1), round(r[3], 1), r[4]) for r in card]
    assert got == [(500, 6.3, 29.3, "남김"), (600, 5.4, 56.7, "버림(가려져서)"),
                   (4000, -3.4, -3.4, "남김"), (16000, 65.9, 65.9, "버림(작아서)")], got
    # 7) CD 음질의 비트율: 44,100 x 16비트 x 2채널 = 1,411.2 kbit/s, 128 kbit/s는 약 11분의 1
    assert 44100 * 16 * 2 / 1000 == 1411.2 and round(1411.2 / 128, 1) == 11.0
    # 8) 여유(dB)와 비트: 1비트에 약 6.02 dB, 여유 41.1 dB는 약 7비트
    assert round(41.1 / (20 * math.log10(2)), 1) == 6.8
    for f, L, tqv, tall, v, m in res:
        print(f"{f:>6} Hz {L:>3} dB  Tq {tqv:6.1f}  전체 문턱 {tall:6.1f}  {v}  여유 {m:+.1f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
