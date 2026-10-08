---
layout: "note"
title: "28_bandwidth-delay-product_verify.py"
display_title: "28_bandwidth-delay-product_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/bandwidth-delay-product/"
parent_title: "대역폭-지연 곱"
description: "컴퓨터 통신 · 대역폭-지연 곱 검증 코드"
permalink: "/studies/computer-communication/code/28_bandwidth-delay-product_verify/"
---
{% raw %}
[대역폭-지연 곱](/Hongs_Blog/studies/computer-communication/bandwidth-delay-product/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""대역폭-지연 곱(BDP) 계산 검증.

문서: 28.대역폭-지연 곱 (예시, 카드 C1·C3)
정의: BDP = R x d_prop (비트). 첫 비트가 도착한 순간 링크 위에 떠 있는 비트 수의 상한.
주장: 첫 비트가 도착한 순간 프레임이 링크(파이프)를 채운 비율 = min(1, L / BDP).
보충: 한 번에 프레임 하나를 보내고 답을 기다리면 링크 사용률 = (L/R) / (L/R + RTT).
단위: 시간은 초, Mbps = 10^6 bps.
"""
from fractions import Fraction as F


def bdp(R_bps, d_prop_s):
    return R_bps * F(d_prop_s)


def bits_on_link_when_first_bit_arrives(L, R_bps, d_prop_s):
    """시각 d_prop에 링크 위에 있는 프레임의 비트 수 (직접 계산)."""
    sent = min(L, R_bps * F(d_prop_s))  # d_prop 동안 실은 비트
    arrived = 0  # 첫 비트가 막 도착
    return sent - arrived


def main():
    d = F(1, 1000)  # 1 ms
    L = 12_000
    # 링크 1: 10 Mbps
    b1 = bdp(10**7, d)
    on1 = bits_on_link_when_first_bit_arrives(L, 10**7, d)
    assert b1 == 10_000 and on1 == 10_000 and on1 / b1 == 1 and L - on1 == 2_000
    # 링크 2: 100 Mbps
    b2 = bdp(10**8, d)
    on2 = bits_on_link_when_first_bit_arrives(L, 10**8, d)
    assert b2 == 100_000 and on2 == 12_000 and on2 / b2 == F(12, 100)
    for R in (10**6, 10**7, 10**8, 10**9):
        assert bits_on_link_when_first_bit_arrives(L, R, d) / bdp(R, d) == min(1, F(L) / bdp(R, d))
    print("[OK] 예시: 10 Mbps -> 파이프 100% (A에 2,000비트 남음), 100 Mbps -> 12%")

    # 카드 C1: 1 Gbps, 50 ms
    c1 = bdp(10**9, F(50, 1000))
    assert c1 == 50_000_000 and c1 / 8 == 6_250_000
    print("[OK] 카드 C1: 5 x 10^7비트 = 6,250,000바이트")

    # 카드 C3: 한 프레임씩 보내고 기다리기, RTT 2 ms
    def util(L, R, rtt):
        t = F(L, R)
        return t / (t + rtt)
    u10 = util(12_000, 10**7, F(2, 1000))
    u100 = util(12_000, 10**8, F(2, 1000))
    assert u10 == F(3, 8) and round(float(u100), 3) == 0.057
    print(f"[OK] 카드 C3: 10 Mbps {float(u10):.1%}, 100 Mbps {float(u100):.1%}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
