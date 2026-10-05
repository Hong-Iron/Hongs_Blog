---
layout: "note"
title: "05_rate-and-bandwidth_verify.py"
display_title: "05_rate-and-bandwidth_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
parent_url: "/studies/computer-communication/rate-and-bandwidth/"
parent_title: "전송 속도와 대역폭"
description: "컴퓨터 통신 · 전송 속도와 대역폭 검증 코드"
permalink: "/studies/computer-communication/code/05_rate-and-bandwidth_verify/"
---
{% raw %}
[전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""전송 지연과 전파 지연 계산 검증.

문서: 05.전송 속도와 대역폭 (예시, 비트 폭, 카드 C2·C4)
정의:
  전송 지연 d_trans = L / R   (L: 비트 수, R: 전송률 bps)
  전파 지연 d_prop  = 거리 / 전파 속도
주장: 전송률 R을 바꾸면 전송 지연만 바뀌고 전파 지연은 그대로다.
단위: 1 kbps = 10^3 bps, 1 Mbps = 10^6 bps, 1 Gbps = 10^9 bps, 1바이트 = 8비트.
"""
from fractions import Fraction as F


def d_trans(bits: int, rate_bps: int) -> F:
    return F(bits, rate_bps)


def d_prop(distance_m: int, speed_mps: int) -> F:
    return F(distance_m, speed_mps)


def main() -> None:
    # 예시: 1,500바이트 패킷
    L = 1_500 * 8
    assert L == 12_000
    assert d_trans(L, 100_000_000) == F(120, 1_000_000)  # 100 Mbps -> 120 us
    assert d_trans(L, 1_000_000_000) == F(12, 1_000_000)  # 1 Gbps -> 12 us
    # 400 km 광케이블, 신호 속도 2 x 10^8 m/s -> 2 ms (전송률과 무관)
    assert d_prop(400_000, 200_000_000) == F(2, 1000)
    print("[OK] 예시: 12,000비트, 100 Mbps -> 120 us, 1 Gbps -> 12 us, 400 km -> 2 ms")

    # 예제: 100 m 케이블 -> 0.5 us, 정지 궤도 36,000 km (진공 3 x 10^8 m/s) -> 0.12 s
    assert d_prop(100, 200_000_000) == F(5, 10_000_000)
    assert d_prop(36_000_000, 300_000_000) == F(12, 100)
    print("[OK] 예제: 100 m -> 0.5 us, 36,000 km -> 0.12 s")

    # 카드 rate-and-bandwidth#C2
    L = 1_250 * 8
    t10 = d_trans(L, 10_000_000)
    t100 = d_trans(L, 100_000_000)
    p = d_prop(3_000_000, 200_000_000)
    assert L == 10_000 and t10 == F(1, 1000) and t100 == F(1, 10_000) and p == F(15, 1000)
    print(f"[OK] 카드 C2: 전송 {float(t10) * 1e3:g} ms -> {float(t100) * 1e3:g} ms, 전파 {float(p) * 1e3:g} ms (그대로)")

    # 비트 폭 = 1 / R: 1 Mbps -> 1 us, 2 Mbps -> 0.5 us (슬라이드 그림)
    assert F(1, 1_000_000) == F(1, 10**6) and F(1, 2_000_000) == F(5, 10**7)
    # 예제: 100 m 광케이블 -> 0.5 us
    assert d_prop(100, 200_000_000) == F(5, 10**7)
    print("[OK] 비트 폭: 1 Mbps 1 us, 2 Mbps 0.5 us")

    # 카드 rate-and-bandwidth#C4: 1 KB (2^10 바이트)를 1 kbps로
    bits = 2**10 * 8
    assert bits == 8_192 and d_trans(bits, 1_000) == F(8192, 1000)
    print("[OK] 카드 C4: 8,192비트 / 1,000 bps = 8.192초")

    # 주장: R을 k배 하면 전송 지연은 1/k배, 전파 지연은 R과 무관
    for k in (2, 10, 1000):
        assert d_trans(L, 10_000_000 * k) == t10 / k
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
