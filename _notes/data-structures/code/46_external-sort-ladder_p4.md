---
layout: "note"
title: "46_external-sort-ladder_p4.py"
display_title: "46_external-sort-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "46"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/external-sort-ladder/"
parent_title: "외부 정렬 시간 계산 예제 사다리"
description: "자료구조 · 외부 정렬 시간 계산 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/46_external-sort-ladder_p4/"
---
{% raw %}
[외부 정렬 시간 계산 예제 사다리](/Hongs_Blog/studies/data-structures/external-sort-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""외부 정렬 시간 계산 예제 사다리: 문제 1~4의 답 확인.

실행: python3 46_external-sort-ladder_p4.py
문서: 4.연습문제/46.외부 정렬 시간 계산 예제 사다리
출처: 자료구조 14주차 슬라이드 p.29~49
답을 식으로 계산하고, 블록 읽기·쓰기를 흉내 낸 모의실험으로 다시 세어 맞춘다.
모의실험은 3.개념집/45_external-merge-sort_verify.py의 것을 옮겨 적었다(파일끼리 불러오지 않는다).
짝이 없는 런도 읽어서 다시 쓴다고 본다(슬라이드의 식).
"""
import random


def passes_needed(r, k):
    p = 0
    while r > 1:
        r = -(-r // k)
        p += 1
    return p


def formula(records, mem, blk, k):
    """(블록 수, 런 수, 런 만들기 (t_IO, t_IS), 한 패스 (t_IO, t_IM), 패스 수, 전체 (t_IO, t_IS, t_IM))"""
    blocks = records // blk
    runs = records // mem
    gen = (2 * blocks, runs)
    one_pass = (2 * blocks, blocks)
    p = passes_needed(runs, k)
    total = (gen[0] + p * one_pass[0], gen[1], p * one_pass[1])
    return blocks, runs, gen, one_pass, p, total


def to_blocks(records, blk):
    return [records[i:i + blk] for i in range(0, len(records), blk)]


def simulate(records, mem, blk, k):
    """실제로 정렬하며 센다. (런 수의 변화, 런 만들기 (t_IO, t_IS), 패스마다 (t_IO, t_IM), 정렬 결과)"""
    io = sorts = 0
    runs = []
    disk = to_blocks(records, blk)
    per_load = mem // blk
    for i in range(0, len(disk), per_load):
        load = [x for b in disk[i:i + per_load] for x in b]
        io += len(disk[i:i + per_load])
        load.sort()
        sorts += 1
        run = to_blocks(load, blk)
        io += len(run)
        runs.append(run)
    gen = (io, sorts)
    counts = [len(runs)]
    per_pass = []
    while len(runs) > 1:
        io = merges = 0
        nxt = []
        for g in range(0, len(runs), k):
            group = runs[g:g + k]
            pos = [0] * len(group)
            buf = [[] for _ in group]
            out, out_buf = [], []
            while True:
                for r, run in enumerate(group):
                    if not buf[r] and pos[r] < len(run):
                        buf[r] = list(run[pos[r]])
                        pos[r] += 1
                        io += 1
                live = [r for r in range(len(group)) if buf[r]]
                if not live:
                    break
                r = min(live, key=lambda x: buf[x][0])
                out_buf.append(buf[r].pop(0))
                if len(out_buf) == blk:
                    out.append(out_buf)
                    out_buf = []
                    io += 1
                    merges += 1
            nxt.append(out)
        runs = nxt
        counts.append(len(runs))
        per_pass.append((io, merges))
    return counts, gen, per_pass, [x for b in runs[0] for x in b]


def check(records, mem, blk, k, want_counts, rng):
    data = [rng.randrange(10 ** 6) for _ in range(records)]
    blocks, runs, gen, one_pass, p, total = formula(records, mem, blk, k)
    counts, sim_gen, per_pass, out = simulate(data, mem, blk, k)
    assert out == sorted(data)
    assert counts == want_counts and counts[0] == runs and len(per_pass) == p
    assert sim_gen == gen
    assert all(x == one_pass for x in per_pass)
    return blocks, runs, gen, one_pass, p, total


if __name__ == "__main__":
    rng = random.Random(4646)

    # 문제 1: 슬라이드의 수
    r = check(10000, 500, 100, 2, [20, 10, 5, 3, 2, 1], rng)
    assert r == (100, 20, (200, 20), (200, 100), 5, (1200, 20, 500))

    # 문제 2: 40,000개, 메모리 1,000개, 블록 100개, 둘씩
    r = check(40000, 1000, 100, 2, [40, 20, 10, 5, 3, 2, 1], rng)
    assert r == (400, 40, (800, 40), (800, 400), 6, (5600, 40, 2400))

    # 문제 3: 같은 자료를 넷씩 (버퍼 5개 = 500개 <= 메모리 1,000개)
    r = check(40000, 1000, 100, 4, [40, 10, 3, 1], rng)
    assert r == (400, 40, (800, 40), (800, 400), 3, (3200, 40, 1200))
    assert (4 + 1) * 100 <= 1000
    # 메모리 안의 비교(레코드 하나당): 한 줄로 견주면 3번 * 3패스, 둘씩이면 1번 * 6패스
    assert (4 - 1) * 3 == 9 and (2 - 1) * 6 == 6

    # 문제 4: 90,000개, 메모리 3,000개, 블록 300개
    r2 = check(90000, 3000, 300, 2, [30, 15, 8, 4, 2, 1], rng)
    assert r2 == (300, 30, (600, 30), (600, 300), 5, (3600, 30, 1500))
    # 패스 2번 이하가 되는 가장 작은 k
    k = next(k for k in range(2, 31) if passes_needed(30, k) <= 2)
    assert k == 6 and 5 * 5 < 30 <= 6 * 6
    assert (k + 1) * 300 <= 3000                           # 버퍼 7개가 메모리에 들어간다
    r6 = check(90000, 3000, 300, 6, [30, 5, 1], rng)
    assert r6 == (300, 30, (600, 30), (600, 300), 2, (1800, 30, 600))
    assert (6 - 1) * 2 == 10 and (2 - 1) * 5 == 5          # 레코드 하나당 비교: 한 줄로 견주기

    print("문제 1: 1,200 t_IO + 20 t_IS + 500 t_IM")
    print("문제 2: 5,600 t_IO + 40 t_IS + 2,400 t_IM / 문제 3: 3,200 t_IO + 40 t_IS + 1,200 t_IM")
    print("문제 4: 둘씩 3,600 t_IO + 30 t_IS + 1,500 t_IM, 여섯씩 1,800 t_IO + 30 t_IS + 600 t_IM")
    print("ALL CHECKS PASSED")
```
{% endraw %}
