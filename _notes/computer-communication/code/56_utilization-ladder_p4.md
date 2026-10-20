---
layout: "note"
title: "56_utilization-ladder_p4.py"
display_title: "56_utilization-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "56"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/utilization-ladder/"
parent_title: "링크 사용률 예제 사다리"
description: "컴퓨터 통신 · 링크 사용률 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/computer-communication/code/56_utilization-ladder_p4/"
---
{% raw %}
[링크 사용률 예제 사다리](/Hongs_Blog/studies/computer-communication/utilization-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 링크 사용률 예제 사다리 문제 4: 정지궤도 위성을 거치는 1 Mbps 링크
# 실행: python3 56_utilization-ladder_p4.py  (표준 라이브러리만 씀)
# 편도 전파 시간은 지상국 → 위성 → 지상국 약 240 ms로 잡는다(위성통신 문서의 약 239 ms를 반올림).
import math


def stop_and_wait_util(L_bits, R_bps, tprop_s):
    """정지 대기 사용률 = 싣는 시간 ÷ (싣는 시간 + 2 × 전파 시간). ACK 싣는 시간과 처리 시간은 뺀다."""
    tf = L_bits / R_bps
    return tf / (tf + 2 * tprop_s)


def window_util(N, L_bits, R_bps, tprop_s):
    """창 크기 N인 슬라이딩 윈도우의 사용률 = min(1, N × 싣는 시간 ÷ (싣는 시간 + 2 × 전파 시간))."""
    return min(1.0, N * stop_and_wait_util(L_bits, R_bps, tprop_s))


def window_needed(L_bits, R_bps, tprop_s):
    """쉬지 않으려면 N × 싣는 시간 ≥ 싣는 시간 + 2 × 전파 시간, 곧 N ≥ 1 + 2 × 전파 ÷ 싣기."""
    tf = L_bits / R_bps
    return math.ceil(1 + 2 * tprop_s / tf - 1e-12)


if __name__ == "__main__":
    R, TP = 1e6, 0.240
    # (가) 1,000바이트 프레임, 정지 대기
    u_a = stop_and_wait_util(8000, R, TP)
    assert abs(8000 / R - 0.008) < 1e-12 and abs(u_a - 8 / 488) < 1e-12
    print(f"(가) 싣기 8 ms, 반복 구간 488 ms, 사용률 {u_a * 100:.2f}%")          # 1.64%
    # (나) 쉬지 않게 하는 창 크기
    n_b = window_needed(8000, R, TP)
    assert n_b == 61
    print(f"(나) 필요한 창 크기 {n_b}")
    # (다) 프레임을 4,000바이트로 키우면
    u_c, n_c = stop_and_wait_util(32000, R, TP), window_needed(32000, R, TP)
    assert abs(u_c - 32 / 512) < 1e-12 and n_c == 16
    print(f"(다) 사용률 {u_c * 100:.2f}%, 필요한 창 크기 {n_c}")                # 6.25%, 16
    # (라) 전송률을 10 Mbps로 올리면(1,000바이트)
    u_d, n_d = stop_and_wait_util(8000, 10e6, TP), window_needed(8000, 10e6, TP)
    assert abs(u_d - 0.8 / 480.8) < 1e-12 and n_d == 601
    print(f"(라) 사용률 {u_d * 100:.3f}%, 필요한 창 크기 {n_d}")               # 0.166%, 601
    # 창 16개로 1,000바이트 프레임을 보내면
    assert abs(window_util(16, 8000, R, TP) - 16 * 8 / 488) < 1e-12
    # 사다리 문제 1~3: 10 Mbps, 2,000 km 광케이블(전파 10 ms), 1,500바이트
    u1 = stop_and_wait_util(12000, 10e6, 0.010)
    assert abs(u1 - 1.2 / 21.2) < 1e-12                                      # 5.66%
    assert abs(window_util(8, 12000, 10e6, 0.010) - 9.6 / 21.2) < 1e-12        # 45.3%
    assert window_needed(12000, 10e6, 0.010) == 18 and abs(1 + 20 / 1.2 - 17.67) < 0.01
    # 사다리 문제 3: 100 Mbps, 50 km(전파 0.25 ms), 1,250바이트
    assert abs(stop_and_wait_util(10000, 100e6, 0.25e-3) - 1 / 6) < 1e-12 and window_needed(10000, 100e6, 0.25e-3) == 6
    assert window_util(6, 10000, 100e6, 0.25e-3) == 1.0 and window_util(5, 10000, 100e6, 0.25e-3) < 1.0
    # 문제 4 (다): 4배로 키워도 사용률은 4배(6.56%)보다 조금 작다
    assert abs(4 * u_a - 0.0656) < 1e-4 and u_c < 4 * u_a
    # 슬라이딩 윈도우 사용률 문서의 카드: 창 17이면 96.2%, 1.5 Mbps 링크에서 창 8은 86.6%, 16은 100%
    assert abs(window_util(17, 12000, 10e6, 0.010) - 20.4 / 21.2) < 1e-12 and abs(20.4 / 21.2 - 0.962) < 1e-3
    assert abs(window_util(8, 8192, 1.5e6, 0.0225) - 0.8658) < 1e-3 and window_util(16, 8192, 1.5e6, 0.0225) == 1.0
    print("ALL CHECKS PASSED")
```
{% endraw %}
