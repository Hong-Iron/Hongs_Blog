---
layout: "note"
title: "08_packet-switching_verify.py"
display_title: "08_packet-switching_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
parent_url: "/studies/computer-communication/packet-switching/"
parent_title: "패킷 스위칭"
description: "컴퓨터 통신 · 패킷 스위칭 검증 코드"
permalink: "/studies/computer-communication/code/08_packet-switching_verify/"
---
{% raw %}
[패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""저장 후 전달(store-and-forward) 지연 공식 검증.

문서: 08.패킷 스위칭 (정리, 증명, 카드 C2·C3), 4.연습문제/08.패킷 스위칭 예제 사다리 (문제 1~4)
모델 가정:
  - 경로의 링크(홉) H개, 모든 링크 전송률 R, 패킷 길이 L. 시간 단위 1 = L/R.
  - 전파·처리·대기 지연은 0. 패킷 P개가 시각 0에 출발지에 모두 있다.
  - 링크는 한 번에 패킷 하나만 먼저 온 순서대로 싣는다.
  - 노드는 패킷을 끝까지 받은 뒤에만 다음 링크로 보낸다 (저장 후 전달).
주장: 패킷 k의 도착 시각 = (H + k - 1)·L/R. 특히 P = 1이면 H·L/R,
      P개가 모두 도착하는 시각 = (H + P - 1)·L/R.
방법: (1) 틱 단위 시뮬레이션 (점화식을 쓰지 않음)
      (2) 점화식 F(k,i) = max(F(k,i-1), F(k-1,i)) + 1
      두 결과와 닫힌 식을 H, P = 1..10에서 비교한다.
"""
from fractions import Fraction


def simulate_ticks(H: int, P: int):
    """반환: (목적지 도착 시각 {패킷: 시각}, 틱별 링크 점유 [ {링크: 패킷} ])."""
    queues = [[] for _ in range(H + 1)]  # queues[v] = 노드 v에 완전히 도착한 (패킷, 도착 시각)
    queues[0] = [(k, 0) for k in range(1, P + 1)]
    arrival = {}
    log = []
    t = 0
    while len(arrival) < P:
        busy = {}
        for i in range(1, H + 1):  # 링크 i: 노드 i-1 -> 노드 i
            q = queues[i - 1]
            if q and q[0][1] <= t:
                busy[i] = q.pop(0)[0]
        for i, k in busy.items():  # 이번 틱에 실은 패킷은 t+1에 다음 노드에 완전히 도착
            if i == H:
                arrival[k] = t + 1
            else:
                queues[i].append((k, t + 1))
        log.append(busy)
        t += 1
    return arrival, log


def recurrence(H: int, P: int):
    F = [[0] * (H + 1) for _ in range(P + 1)]  # F[k][0] = 0, F[0][i] = 0
    for k in range(1, P + 1):
        for i in range(1, H + 1):
            F[k][i] = max(F[k][i - 1], F[k - 1][i]) + 1
    return F


def total_time(L_bits: int, R_bps: int, H: int, P: int) -> Fraction:
    """P개가 모두 도착하는 시각 (초)."""
    return (H + P - 1) * Fraction(L_bits, R_bps)


def print_trace(H: int, P: int) -> None:
    _, log = simulate_ticks(H, P)
    print("  시간(L/R)  " + "  ".join(f"링크{i}" for i in range(1, H + 1)))
    for t, busy in enumerate(log):
        cells = "  ".join(f"{('p' + str(busy[i])) if i in busy else '-':>5}" for i in range(1, H + 1))
        print(f"  [{t},{t + 1})     {cells}")


def ms(x: Fraction) -> Fraction:
    return x * 1000


def main() -> None:
    for H in range(1, 11):
        for P in range(1, 11):
            arrival, _ = simulate_ticks(H, P)
            F = recurrence(H, P)
            for k in range(1, P + 1):
                assert arrival[k] == F[k][H] == H + k - 1, (H, P, k)
    print("[OK] H, P = 1..10: 시뮬레이션 = 점화식 = (H + k - 1)·L/R")

    print("\n예시로 보기: 링크 2개(스위치 1개), 패킷 3개")
    print_trace(2, 3)
    assert simulate_ticks(2, 3)[0][3] == 4

    print("\n카드 packet-switching#C2: 링크 3개, 패킷 2개")
    print_trace(3, 2)
    arrival, log = simulate_ticks(3, 2)
    assert arrival[2] == 4
    assert log[1] == {1: 2, 2: 1}  # 구간 [1,2): 링크1 = p2, 링크2 = p1, 링크3 = 비어 있음

    # 카드 packet-switching#C3: L = 8,000 bit, R = 2 Mbps, H = 3
    assert ms(Fraction(8_000, 2_000_000)) == 4
    assert ms(total_time(8_000, 2_000_000, 3, 1)) == 12 and ms(total_time(8_000, 2_000_000, 3, 5)) == 28
    print("\n카드 C3: L/R = 4 ms, 패킷 1개 12 ms, 5개 28 ms")

    # 예제 사다리
    # 문제 1: L = 12,000 bit, R = 3 Mbps, H = 4, P = 10
    assert ms(Fraction(12_000, 3_000_000)) == 4
    assert ms(total_time(12_000, 3_000_000, 4, 1)) == 16 and ms(total_time(12_000, 3_000_000, 4, 10)) == 52
    assert simulate_ticks(4, 10)[0][10] == 13
    # 문제 2: L = 4,000 bit, R = 1 Mbps, H = 5, P = 3
    assert ms(total_time(4_000, 1_000_000, 5, 1)) == 20 and ms(total_time(4_000, 1_000_000, 5, 3)) == 28
    # 문제 3: L = 1,500바이트, R = 10 Mbps, H = 2, P = 5
    L3 = 1_500 * 8
    assert ms(Fraction(L3, 10_000_000)) == Fraction(6, 5)  # 1.2 ms
    assert ms(total_time(L3, 10_000_000, 2, 5)) == Fraction(36, 5)  # 7.2 ms
    # 문제 4: 1 MB 파일, 링크 3개, R = 8 Mbps. 한 덩어리 vs 패킷 1,000개
    file_bits = 1_000_000 * 8
    whole = total_time(file_bits, 8_000_000, 3, 1)
    split = total_time(file_bits // 1_000, 8_000_000, 3, 1_000)
    assert whole == 3 and ms(split) == 1_002
    # 변형 문제: 링크가 1개면 차이가 없다
    assert total_time(file_bits, 8_000_000, 1, 1) == total_time(file_bits // 1_000, 8_000_000, 1, 1_000) == 1
    print("사다리: 1) 16 ms / 52 ms  2) 28 ms  3) 7.2 ms  4) 한 덩어리 3 s, 패킷 1,000개 1.002 s  변형) 둘 다 1 s")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
