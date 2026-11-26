---
layout: "note"
title: "54_temporal-masking_verify.py"
display_title: "54_temporal-masking_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "54"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/temporal-masking/"
parent_title: "시간 가림"
description: "휴먼 인터페이스 미디어 · 시간 가림 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/54_temporal-masking_verify/"
---
{% raw %}
[시간 가림](/Hongs_Blog/studies/human-interface-media/temporal-masking/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 시간 가림 문서의 수치와 주장을 검증한다.
# 실행: python3 -I 54_temporal-masking_verify.py  (표준 라이브러리만)
# 모형은 54_temporal-masking_plot.py의 모식도와 같다 (51~55 공통 식으로 높이를 정함).
#   가리는 소리 1 kHz 60 dB, 0~200 ms.  동시 가림 문턱 M0 = 50 dB,  조용할 때의 문턱 Tq = 3.37 dB
#   뒤 가림: T(d) = Tq + (M0 - Tq)(1 - ln(1 + d/5)/ln(31)),  0 <= d <= 150 ms
#   앞 가림: T(t) = Tq + (M0 - Tq)(1 + t/20)^2,  -20 <= t < 0 ms
import math


def tq(f):
    k = f / 1000.0
    return 3.64 * k ** -0.8 - 6.5 * math.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4


def spread(dz):
    u = dz + 0.474
    return 15.81 + 7.5 * u - 17.5 * math.sqrt(1.0 + u * u)


TQ = tq(1000.0)
M0 = 60.0 - 10.0 + spread(0.0)
PRE, POST, TAU = 20.0, 150.0, 5.0


def post(d):
    return TQ + (M0 - TQ) * (1 - math.log(1 + d / TAU) / math.log(1 + POST / TAU))


def heard_after_off(L):
    """가리는 소리가 꺼지고 몇 ms 뒤부터 L dB 시험 음이 들리는가 (이분법으로 post(d) = L을 푼다)."""
    if L >= M0:
        return 0.0
    lo, hi = 0.0, POST
    for _ in range(200):
        mid = (lo + hi) / 2
        if post(mid) > L:
            lo = mid
        else:
            hi = mid
    return hi


if __name__ == "__main__":
    assert abs(TQ - 3.37) < 0.01 and abs(M0 - 50.0) < 0.01
    # 뒤 가림이 끝나는 곳: 150 ms 뒤 조용할 때의 문턱으로 돌아온다
    assert abs(post(POST) - TQ) < 1e-9 and abs(post(0) - M0) < 1e-9
    # 시험 음이 클수록 빨리 들린다: 40 dB 약 5.4 ms, 30 dB 약 16.8 ms, 20 dB 약 40.5 ms, 10 dB 약 90 ms
    want = {40: 5.4, 30: 16.8, 20: 40.5, 10: 90.1}
    for L, d in want.items():
        assert abs(heard_after_off(L) - d) < 0.6, (L, heard_after_off(L))
    seq = [heard_after_off(L) for L in range(4, 50)]
    assert all(a > b for a, b in zip(seq, seq[1:]))
    # 닫힌 식과 이분법이 같다: d = 5 (31^(1 - frac) - 1)
    for L in (12, 25, 33, 47):
        frac = (L - TQ) / (M0 - TQ)
        assert abs(TAU * (31 ** (1 - frac) - 1) - heard_after_off(L)) < 1e-6
    # 가려진 동안 시험 음이 들리려면 동시 가림 문턱 50 dB를 넘어야 한다
    assert heard_after_off(55) == 0.0
    # 앞 가림은 뒤 가림보다 훨씬 짧다 (20 ms 대 150 ms)
    assert PRE < POST / 5
    print("ALL CHECKS PASSED")
```
{% endraw %}
