---
layout: "note"
title: "26_timing-analysis_verify.py"
display_title: "26_timing-analysis_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/timing-analysis/"
parent_title: "소요시간 분석"
description: "컴퓨터 통신 · 소요시간 분석 검증 코드"
permalink: "/studies/computer-communication/code/26_timing-analysis_verify/"
---
{% raw %}
[소요시간 분석](/Hongs_Blog/studies/computer-communication/timing-analysis/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""소요시간 분석(시간 흐름 그림) 공식 검증.

문서: 26.소요시간 분석 (정리, 예제, 카드), 4.연습문제/26.소요시간 분석 예제 사다리 (문제 1~4, 변형),
      4.연습문제/26.과제 2 (문제 1~4)
모델:
  - 경로의 링크 H개. 링크마다 전송률 R, 전파 지연 p. 중간 스위치 H-1개는 패킷마다 처리 지연 q.
  - 패킷 P개(각 L비트)가 시각 0에 출발지에 모두 있다. 대기 지연(다른 트래픽)은 0.
  - 노드는 패킷을 끝까지 받은 뒤에만 처리하고 내보낸다 (저장 후 전달).
  - overlap=True: 스위치는 앞 패킷을 내보내는 동안 다음 패킷을 처리할 수 있다 (처리기와 송신기가 따로).
    overlap=False: 처리와 송신을 한 장치가 차례로 한다.
주장 1 (패킷): overlap=True이고 q <= L/R이면 마지막 패킷의 도착 시각은
      (H + P - 1)·L/R + H·p + (H - 1)·q
주장 2 (회선): 설정 시간 s 뒤에 M비트를 흘려보내면 마지막 비트의 도착 시각은 s + M/R + H·p.
방법: (a) 정수 틱 시뮬레이션 (공식을 쓰지 않음)  (b) FIFO 점화식  (c) 닫힌 식. 셋을 비교한다.
단위: 시간은 ms, 전송률은 bps. 1 Mbps = 10^6 bps.
"""
from fractions import Fraction as F


def tick_sim(H, P, T, p, q, overlap=True):
    """정수 틱 시뮬레이션. T = L/R (틱), p = 전파 지연 (틱), q = 처리 지연 (틱).
    반환: 패킷별 목적지 도착 시각 리스트."""
    # 노드 0 = 출발지, 1..H-1 = 스위치, H = 목적지
    inbox = {v: [] for v in range(H + 1)}  # (도착 완료 시각, 패킷)
    inbox[0] = [(0, k) for k in range(P)]
    proc_busy_until = {v: 0 for v in range(H)}
    tx_busy_until = {v: 0 for v in range(H)}
    outq = {v: [] for v in range(H)}  # (송신 가능 시각, 패킷)
    arrivals = {}
    in_flight = []  # (다음 노드 도착 시각, 다음 노드, 패킷)
    t = 0
    while len(arrivals) < P:
        for item in [x for x in in_flight if x[0] == t]:
            in_flight.remove(item)
            _, v, k = item
            if v == H:
                arrivals[k] = t
            else:
                inbox[v].append((t, k))
        for v in range(H):
            qv = 0 if v == 0 else q
            if overlap:
                # 처리기: 받은 패킷을 차례로 처리해 송신 대기열로
                while inbox[v] and inbox[v][0][0] <= t and proc_busy_until[v] <= t:
                    _, k = inbox[v].pop(0)
                    proc_busy_until[v] = t + qv
                    outq[v].append((t + qv, k))
                    if qv > 0:
                        break
                # 송신기
                if outq[v] and outq[v][0][0] <= t and tx_busy_until[v] <= t:
                    _, k = outq[v].pop(0)
                    tx_busy_until[v] = t + T
                    in_flight.append((t + T + p, v + 1, k))
            else:
                # 한 장치가 처리 후 송신
                if inbox[v] and inbox[v][0][0] <= t and tx_busy_until[v] <= t:
                    _, k = inbox[v].pop(0)
                    tx_busy_until[v] = t + qv + T
                    in_flight.append((t + qv + T + p, v + 1, k))
        t += 1
        assert t < 10**6
    return [arrivals[k] for k in range(P)]


def fifo(H, P, T, p, q, overlap=True):
    """FIFO 점화식. 반환: 패킷별 목적지 도착 시각."""
    ready = [F(0)] * P  # 노드 v에서 패킷 k를 다룰 수 있게 된 시각
    for v in range(H):
        qv = 0 if v == 0 else q
        proc_end_prev = F(-10**9)
        tx_end_prev = F(-10**9)
        nxt = []
        for k in range(P):
            if overlap:
                proc_end = max(ready[k], proc_end_prev) + qv
                tx_end = max(proc_end, tx_end_prev) + T
                proc_end_prev = proc_end
            else:
                tx_end = max(ready[k], tx_end_prev) + qv + T
            tx_end_prev = tx_end
            nxt.append(tx_end + p)
        ready = nxt
    return ready


def finish_times(H, P, T, p, q):
    """F[k][i]: 패킷 k(1부터)의 마지막 비트가 링크 i(1부터)에 실리는 시각 (처리·송신 따로)."""
    Fm = [[None] * (H + 1) for _ in range(P + 1)]
    E = [[F(-10**9)] * (H + 1) for _ in range(P + 1)]  # E[k][v]: 노드 v에서 처리 끝
    for k in range(P + 1):
        Fm[k][0] = None
    for i in range(1, H + 1):
        Fm[0][i] = F(-10**9)
    for k in range(1, P + 1):
        for i in range(1, H + 1):
            if i == 1:
                Fm[k][1] = max(F(0), Fm[k - 1][1]) + T
            else:
                E[k][i - 1] = max(Fm[k][i - 1] + p, E[k - 1][i - 1]) + q
                Fm[k][i] = max(E[k][i - 1], Fm[k - 1][i]) + T
    return Fm


def closed_packet(H, P, T, p, q):
    return (H + P - 1) * T + H * p + (H - 1) * q


def circuit(setup, M_bits, R_bps, H, p_ms):
    """회선 스위칭: 설정 뒤 M비트를 흘려보냄. 마지막 비트 도착 시각 (ms)."""
    return F(setup) + F(M_bits * 1000, R_bps) + H * F(p_ms)


def ms(bits, R_bps):
    return F(bits * 1000, R_bps)


def main():
    # (a)=(b)=(c): 작은 정수 격자 전수 비교
    cnt = 0
    for H in range(1, 5):
        for P in range(1, 7):
            for T in range(1, 4):
                for p in range(0, 3):
                    for q in range(0, T + 1):  # 가정 q <= L/R
                        a = tick_sim(H, P, T, p, q, overlap=True)
                        b = fifo(H, P, T, p, q, overlap=True)
                        assert [F(x) for x in a] == b, (H, P, T, p, q, a, b)
                        assert b[-1] == closed_packet(H, P, T, p, q)
                        a2 = tick_sim(H, P, T, p, q, overlap=False)
                        b2 = fifo(H, P, T, p, q, overlap=False)
                        assert [F(x) for x in a2] == b2
                        cnt += 1
    print(f"[OK] 틱 시뮬레이션 = FIFO 점화식 = 닫힌 식: {cnt}가지 (H<=4, P<=6, q<=L/R)")

    # 가정 q <= L/R이 필요함: q > L/R이면 처리기가 병목이 되어 닫힌 식보다 늦다
    H, P, T, p, q = 2, 5, 1, 0, 3
    real = fifo(H, P, T, p, q)[-1]
    assert real == F(tick_sim(H, P, T, p, q)[-1])
    assert real > closed_packet(H, P, T, p, q)
    print(f"[OK] 반례 q > L/R: H=2, P=5, L/R=1, q=3 -> 실제 {real}, 닫힌 식 {closed_packet(H, P, T, p, q)}")

    # 가정 overlap이 필요함: 처리와 송신을 한 장치가 하면 늦어진다 (q > 0, P >= 2, H >= 2)
    assert fifo(2, 3, 2, 1, 1, overlap=False)[-1] > closed_packet(2, 3, 2, 1, 1)
    print("[OK] 처리와 송신이 겹치지 못하면 닫힌 식보다 늦다")

    # 문서 예시: 패킷 3개, 링크 3개(스위치 2개), L/R = 2, p = 1, q = 0.5 -> 도착 시각
    arr = fifo(3, 3, F(2), F(1), F(1, 2))
    assert arr == [F(10), F(12), F(14)]
    assert closed_packet(3, 3, F(2), F(1), F(1, 2)) == 14
    Fm = finish_times(3, 3, F(2), F(1), F(1, 2))
    assert Fm[2][2] == F(15, 2) and Fm[1][1] == 2 and Fm[1][2] == F(11, 2)
    # 정리의 증명: F(k, i) = i*T + (i-1)(p+q) + (k-1)*T
    for H_ in range(1, 5):
        for P_ in range(1, 6):
            for T_, p_, q_ in [(F(2), F(1), F(1, 2)), (F(1), F(3), F(1)), (F(3), F(0), F(0))]:
                Fm_ = finish_times(H_, P_, T_, p_, q_)
                for k in range(1, P_ + 1):
                    for i in range(1, H_ + 1):
                        assert Fm_[k][i] == i * T_ + (i - 1) * (p_ + q_) + (k - 1) * T_
    print(f"[OK] 문서 예시: 도착 {[float(x) for x in arr]} ms, 패킷 2가 링크 2에 다 실리는 시각 7.5 ms, 증명의 F(k,i) 식 일치")

    # 카드: 회선 스위칭 예 (설정 30 ms, 3 Mbit, 1.5 Mbps, 링크 3개, 링크당 4 ms)
    assert circuit(30, 3_000_000, 1_500_000, 3, 4) == 2042
    # 카드: 패킷 하나, 링크 3개, L=12,000비트, R=6 Mbps(2 ms), p=4, q=1 -> 3*2 + 3*4 + 2*1 = 20
    assert closed_packet(3, 1, ms(12_000, 6_000_000), 4, 1) == 20
    print("[OK] 카드: 회선 2,042 ms, 패킷 하나 20 ms")

    # ---- 예제 사다리 ----
    # 문제 1: 회선. R = 4 Mbps, 링크 2개, 링크당 3 ms, 설정 10 ms, 2,000,000비트
    assert circuit(10, 2_000_000, 4_000_000, 2, 3) == 516
    # 문제 2: 패킷 하나. 8,000비트, 4 Mbps (2 ms), p = 3 ms, q = 0.5 ms, 링크 2개
    assert closed_packet(2, 1, ms(8_000, 4_000_000), 3, F(1, 2)) == F(21, 2)
    # 문제 3: 링크 3개, 8 Mbps, 8,000비트 (1 ms), p = 1 ms, q = 0.2 ms, 패킷 100개
    t3 = closed_packet(3, 100, ms(8_000, 8_000_000), 1, F(1, 5))
    assert t3 == F(1054, 10)
    assert fifo(3, 100, ms(8_000, 8_000_000), F(1), F(1, 5))[-1] == t3
    # 문제 4: 링크 2개, 10 Mbps, 링크당 5 ms. 회선 설정 = RTT = 20 ms. 파일 10^6비트.
    #         패킷: 데이터 10,000 + 헤더 200비트 (1.02 ms), q = 0.1 ms
    c4 = circuit(20, 1_000_000, 10_000_000, 2, 5)
    T4 = ms(10_200, 10_000_000)
    p4 = closed_packet(2, 100, T4, 5, F(1, 10))
    assert c4 == 130 and T4 == F(102, 100) and p4 == F(11312, 100)
    assert fifo(2, 100, T4, F(5), F(1, 10))[-1] == p4
    # 변형: 파일 10^7비트
    c4b = circuit(20, 10_000_000, 10_000_000, 2, 5)
    p4b = closed_packet(2, 1000, T4, 5, F(1, 10))
    assert c4b == 1030 and p4b == F(103112, 100) and c4b < p4b
    # 두 방식이 같아지는 패킷 수: 30 + P = 11.12 + 1.02 P -> P = 944
    cross = [P for P in range(1, 3000)
             if closed_packet(2, P, T4, 5, F(1, 10)) >= circuit(20, 10_000 * P, 10_000_000, 2, 5)][0]
    assert cross == 944
    print(f"[OK] 사다리: 516, 10.5, {float(t3)}, 회선 {c4} vs 패킷 {float(p4)}; 변형 {c4b} vs {float(p4b)}; 역전 P={cross}")

    # ---- 과제 2 (A - S - B, 링크 8 Mbps, 전파 2 ms) ----
    R = 8_000_000
    # 1) 회선: 설정 20 ms, 40 Mbit
    assert circuit(20, 40_000_000, R, 2, 2) == 5024
    # 2) 패킷 하나: 데이터 1,000바이트 + 헤더 20바이트, 처리 0.1 ms
    L = (1_000 + 20) * 8
    T = ms(L, R)
    assert L == 8_160 and T == F(102, 100)
    assert closed_packet(2, 1, T, 2, F(1, 10)) == F(614, 100)
    # 3) 40 Mbit를 데이터 8,000비트씩 5,000개로
    P = 40_000_000 // 8_000
    assert P == 5_000
    t_overlap = fifo(2, P, T, F(2), F(1, 10), overlap=True)[-1]
    t_serial = fifo(2, P, T, F(2), F(1, 10), overlap=False)[-1]
    assert t_overlap == closed_packet(2, P, T, 2, F(1, 10)) == F(510512, 100)
    assert t_serial == F(560502, 100)
    # 필기 풀이의 식: 스위치가 파일 전체를 다 받은 뒤 보내는 경우 (파이프라인 없음)
    whole = 2 * (T * P) + P * F(1, 10) + 2 * 2
    assert whole == 10704
    # 4) 오버헤드: 회선은 설정 20 ms, 패킷은 헤더 전송 + 파이프라인 채움 + 처리
    header_ms = ms(160 * P, R)
    assert header_ms == 100
    ideal = ms(40_000_000, R) + 2 * 2  # 순수 전송 + 전파
    assert t_overlap - ideal == header_ms + T + F(1, 10)
    # 변형: 데이터 80,000비트 + 헤더 160비트, 500개
    Tv = ms(80_160, R)
    assert Tv == F(1002, 100)
    assert closed_packet(2, 500, Tv, 2, F(1, 10)) == F(502412, 100)
    assert ms(160 * 500, R) == 10
    print(f"[OK] 과제 2: 1) 5,024 ms  2) 6.14 ms  3) {float(t_overlap)} ms (처리·송신 따로), "
          f"{float(t_serial)} ms (한 장치), 파이프라인 없음 {whole} ms  4) 패킷 오버헤드 {float(t_overlap - ideal)} ms, 변형 5,024.12 ms")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
