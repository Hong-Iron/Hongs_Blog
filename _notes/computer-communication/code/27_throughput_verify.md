---
layout: "note"
title: "27_throughput_verify.py"
display_title: "27_throughput_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "27"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
parent_url: "/studies/computer-communication/throughput/"
parent_title: "처리량"
description: "컴퓨터 통신 · 처리량 검증 코드"
permalink: "/studies/computer-communication/code/27_throughput_verify/"
---
{% raw %}
[처리량](/Hongs_Blog/studies/computer-communication/throughput/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""처리량과 대역폭·소요시간의 상대적 중요성 검증.

문서: 27.처리량 (예시 표, 정의, 카드 C2)
정의 (슬라이드): Throughput = TransferSize / TransferTime
                 회선 스위칭: TransferTime = RTT + TransferSize / Bandwidth
단위: KB = 2^10 바이트, MB = 2^20 바이트 (슬라이드 표기), Mbps = 10^6 bps. 시간은 ms.
"""
from fractions import Fraction as F

KB = 2**10 * 8  # 비트
MB = 2**20 * 8


def total_ms(bits, R_bps, latency_ms):
    return F(latency_ms) + F(bits * 1000, R_bps)


def main():
    # 작은 메시지 1바이트: 소요시간이 지배
    small = {(lat, R): total_ms(8, R, lat) for lat in (1, 100) for R in (10**6, 10**8)}
    assert small[(1, 10**6)] == F(1008, 1000) and small[(100, 10**6)] == F(100008, 1000)
    assert small[(1, 10**8)] == F(100008, 100000)
    # 소요시간 차이(99 ms)가 대역폭 차이(0.00792 ms)를 압도
    assert small[(100, 10**6)] - small[(1, 10**6)] == 99
    assert small[(1, 10**6)] - small[(1, 10**8)] == F(792, 100000)
    # 큰 메시지 25 MB: 대역폭이 지배
    big = 25 * MB
    assert big == 209_715_200
    assert total_ms(big, 10**6, 1) == F(2097152 + 10, 10)       # 209,716.2 ms
    assert total_ms(big, 10**8, 1) == F(2097152 + 1000, 1000)   # 2,098.152 ms
    assert total_ms(big, 10**6, 100) - total_ms(big, 10**6, 1) == 99
    print("[OK] 예시 표: 1바이트는 소요시간이, 25 MB는 대역폭이 지배")

    # 1 MB를 1 Gbps로 = 1 KB를 1 Mbps로 (싣는 시간이 둘 다 약 8 ms)
    a = F(MB * 1000, 10**9)
    b = F(KB * 1000, 10**6)
    assert round(float(a), 2) == 8.39 and round(float(b), 2) == 8.19
    print(f"[OK] 1 MB @ 1 Gbps = {float(a):.2f} ms, 1 KB @ 1 Mbps = {float(b):.2f} ms")

    # 카드 C2: 1 MB, 1 Gbps, RTT 100 ms -> 실효 처리량
    T = total_ms(MB, 10**9, 100)
    thr = F(MB * 1000, 1) / T  # bps
    assert round(float(thr) / 1e6, 1) == 77.4
    assert round(float(thr) / 1e9 * 100, 1) == 7.7
    print(f"[OK] 카드 C2: 전송 완료 {float(T):.2f} ms, 처리량 {float(thr) / 1e6:.1f} Mbps (대역폭의 {float(thr) / 1e9:.1%})")

    # 주장: RTT > 0이면 처리량 < 대역폭, 크기가 커질수록 대역폭에 다가간다
    prev = F(0)
    for bits in [KB, MB, 10 * MB, 100 * MB, 1000 * MB]:
        t = F(bits * 1000, 1) / total_ms(bits, 10**9, 100)
        assert prev < t < 10**9
        prev = t
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
