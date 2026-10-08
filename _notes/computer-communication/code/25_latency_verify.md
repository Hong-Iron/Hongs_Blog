---
layout: "note"
title: "25_latency_verify.py"
display_title: "25_latency_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "25"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/latency/"
parent_title: "소요시간"
description: "컴퓨터 통신 · 소요시간 검증 코드"
permalink: "/studies/computer-communication/code/25_latency_verify/"
---
{% raw %}
[소요시간](/Hongs_Blog/studies/computer-communication/latency/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""소요시간(latency) 계산 검증.

문서: 25.소요시간 (예시, 카드 C2·C3)
정의 (슬라이드):
  소요시간 = 전파 지연 + 전송 시간 + 큐잉 지연 [+ 스위칭(처리) 시간]
  전파 지연 = 거리 / 신호 속도,  전송 시간 = 크기 / 대역폭
  신호 속도: 진공 3.0e8, 케이블 2.3e8, 광케이블 2.0e8 m/s. 직접 링크에는 큐잉 지연이 없다.
단위: 시간은 ms, 1 Mbps = 10^6 bps.
"""
from fractions import Fraction as F

V = {"vacuum": 300_000_000, "cable": 230_000_000, "fiber": 200_000_000}


def prop_ms(distance_m, medium):
    return F(distance_m * 1000, V[medium])


def trans_ms(bits, R_bps):
    return F(bits * 1000, R_bps)


def main():
    # 예시: 1,000 km
    d = 1_000_000
    assert round(float(prop_ms(d, "vacuum")), 2) == 3.33
    assert round(float(prop_ms(d, "cable")), 2) == 4.35
    assert prop_ms(d, "fiber") == 5
    t = prop_ms(d, "fiber") + trans_ms(8_000, 10_000_000) + 0
    assert t == F(58, 10)
    assert 2 * t == F(116, 10)
    print("[OK] 예시: 1,000 km -> 3.33 / 4.35 / 5 ms, 광케이블 직접 링크 5.8 ms, RTT 11.6 ms")

    # 카드 C2: 1,250바이트, 2 Mbps, 케이블 4,600 km
    L = 1_250 * 8
    tr = trans_ms(L, 2_000_000)
    pr = prop_ms(4_600_000, "cable")
    assert tr == 5 and pr == 20 and tr + pr == 25 and 2 * (tr + pr) == 50
    print("[OK] 카드 C2: 전송 5 ms + 전파 20 ms = 25 ms, RTT 50 ms")

    # 카드 C3: 100바이트, 광케이블 4,000 km, 10 Mbps -> 100 Mbps
    L = 100 * 8
    p = prop_ms(4_000_000, "fiber")
    a = p + trans_ms(L, 10_000_000)
    b = p + trans_ms(L, 100_000_000)
    assert p == 20 and a == F(2008, 100) and b == F(20008, 1000)
    assert (a - b) / a < F(1, 200)  # 0.4% 미만 감소
    print(f"[OK] 카드 C3: {float(a)} ms -> {float(b)} ms (전송률 10배, 소요시간은 {float((a - b) / a):.2%} 감소)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
