---
layout: "note"
title: "53_disk-scheduling_impl.py"
display_title: "53_disk-scheduling_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "53"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/disk-scheduling/"
parent_title: "디스크 스케줄링"
description: "운영체제 · 디스크 스케줄링 구현 코드"
permalink: "/studies/operating-systems/code/53_disk-scheduling_impl/"
---
{% raw %}
[디스크 스케줄링](/Hongs_Blog/studies/operating-systems/disk-scheduling/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""디스크 스케줄링 (Stallings 11.5절, 표 11.2). 헤드 시작 위치 100, 트랙 0~199.
Stallings의 SCAN·C-SCAN은 그 방향의 마지막 '요청'에서 돌아선다(다른 교재의 LOOK·C-LOOK)."""
from fractions import Fraction as F

REQ = [55, 58, 39, 18, 90, 160, 150, 38, 184]


def schedule(policy, reqs=REQ, head=100, up=True, last_track=199):
    pending, order, pos = list(reqs), [], head
    if policy == "FIFO":
        order = list(reqs)
    elif policy == "SSTF":
        while pending:
            nxt = min(pending, key=lambda r: (abs(r - pos), r)); pending.remove(nxt); order.append(nxt); pos = nxt
    elif policy in ("SCAN", "LOOK"):
        hi = sorted(r for r in pending if r >= pos); lo = sorted((r for r in pending if r < pos), reverse=True)
        order = hi + lo if up else lo + hi
    elif policy in ("C-SCAN", "C-LOOK"):
        hi = sorted(r for r in pending if r >= pos); lo = sorted(r for r in pending if r < pos)
        order = hi + lo
    moves, pos = [], head
    for i, r in enumerate(order):
        moves.append(abs(r - pos)); pos = r
    return order, moves


def scan_to_edge(reqs=REQ, head=100, last=199):
    """끝 트랙까지 갔다가 돌아오는 '진짜' SCAN (Silberschatz 정의)."""
    hi = sorted(r for r in reqs if r >= head); lo = sorted((r for r in reqs if r < head), reverse=True)
    dist = (last - head) + (last - lo[-1]) if lo else hi[-1] - head
    return hi + lo, dist


def access_time(seek_ms, rpm, sector_bytes, sectors_per_track, bytes_):
    r = rpm / 60 / 1000                       # 1 ms당 회전 수
    rot = 1 / (2 * r)                          # 평균 회전 지연 = 반 바퀴
    transfer = bytes_ / (r * sector_bytes * sectors_per_track)
    return seek_ms + rot + transfer


if __name__ == "__main__":
    # 표 11.2: 순서와 이동 합. 평균은 표에 55.3, 27.5, 27.8, 35.8로 적혀 있다.
    # SSTF만 248/9 = 27.56을 소수 첫째 자리에서 버렸고(27.5), 나머지는 반올림했다.
    table = {"FIFO": ([55, 58, 39, 18, 90, 160, 150, 38, 184], 498),
             "SSTF": ([90, 58, 55, 39, 38, 18, 150, 160, 184], 248),
             "SCAN": ([150, 160, 184, 90, 58, 55, 39, 38, 18], 250),
             "C-SCAN": ([150, 160, 184, 18, 38, 39, 55, 58, 90], 322)}
    for pol, (exp_order, exp_sum) in table.items():
        order, moves = schedule(pol)
        avg = F(sum(moves), len(moves))
        print(f"{pol:6s} {order} 이동 {moves} 합 {sum(moves)} 평균 {float(avg):.1f}")
        assert order == exp_order and sum(moves) == exp_sum
    # 끝까지 가는 SCAN이면 이동 합이 더 크다: 100 -> 199 -> 18
    o, d = scan_to_edge()
    assert d == 99 + 181 == 280 and sum(schedule("SCAN")[1]) == 250

    # 접근 시간 (교재 예): 평균 탐색 4ms, 15,000rpm, 섹터 512B, 트랙당 500섹터
    full_track = access_time(4, 15000, 512, 500, 512 * 500)
    assert abs(full_track - 10) < 1e-9                     # 4 + 2 + 4
    seq = full_track + 4 * (2 + 4)                         # 이어지는 4트랙은 탐색 없이 회전 지연 + 한 바퀴
    assert abs(seq - 34) < 1e-9
    one_sector = access_time(4, 15000, 512, 500, 512)
    assert abs(one_sector - 6.008) < 1e-9 and abs(2500 * one_sector - 15020) < 1e-6

    # 카드·사다리: 헤드 50, 요청 82 170 43 140 24 16 190
    R2 = [82, 170, 43, 140, 24, 16, 190]
    got = {p: sum(schedule(p, R2, 50)[1]) for p in ["FIFO", "SSTF", "SCAN", "C-SCAN"]}
    print("사다리", got, {p: schedule(p, R2, 50)[0] for p in got})
    assert got == {"FIFO": 642, "SSTF": 208, "SCAN": 314, "C-SCAN": 341}
    # 카드 C5: 흩어진 섹터 1,000개 -> 6,008 ms
    assert abs(1000 * one_sector - 6008) < 1e-6
    # 사다리 문제 4: 끝까지 가는 C-SCAN 50 -> 199 -> 0 -> 43
    assert (199 - 50) + 199 + 43 == 391
    print("ALL CHECKS PASSED")
```
{% endraw %}
