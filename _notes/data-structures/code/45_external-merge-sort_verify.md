---
layout: "note"
title: "45_external-merge-sort_verify.py"
display_title: "45_external-merge-sort_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "45"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/external-merge-sort/"
parent_title: "외부 병합 정렬"
description: "자료구조 · 외부 병합 정렬 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/45_external-merge-sort_verify/"
---
{% raw %}
[외부 병합 정렬](/Hongs_Blog/studies/data-structures/external-merge-sort/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""외부 병합 정렬 모의실험: 블록 입출력 횟수와 패스 수를 센다.

실행: python3 45_external-merge-sort_verify.py
문서: 45.외부 병합 정렬 (시간 계산 표, 추적 예, 카드 C1~C4), 4.연습문제/46.외부 정렬 시간 계산 예제 사다리

모형
  - 디스크의 파일은 블록의 줄이고, 블록 하나에 레코드가 blk개 들어간다.
  - 블록을 한 번 읽거나 쓸 때마다 입출력 1번(t_IO)으로 센다.
  - 런 만들기: 메모리에 들어가는 만큼(mem개) 읽어 정렬(t_IS 1번)하고 런으로 쓴다.
  - 런 합치기: 런마다 입력 버퍼 1블록, 출력 버퍼 1블록. 입력 버퍼가 비면 읽고 출력 버퍼가 차면 쓴다.
    출력 블록 하나를 채우는 일을 내부 병합 1번(t_IM)으로 센다.
  - 짝이 없는 런은 copy_unpaired=True면 그대로 읽어 다시 쓰고(문서 본문의 식), False면 손대지 않는다.

주장
  1. 10,000개, 메모리 500개, 블록 100개: 런 20개(5블록씩), 런 만들기 200 t_IO + 20 t_IS.
  2. 2개씩 합치면 런 수가 20 -> 10 -> 5 -> 3 -> 2 -> 1, 패스 5번 = ceil(lg 20).
  3. R1과 R2를 합치는 데 20 t_IO + 10 t_IM, 패스 1과 2는 각각 200 t_IO + 100 t_IM.
  4. 짝 없는 런도 옮겨 적으면 패스마다 200 t_IO + 100 t_IM, 합치기 전체 1,000 t_IO + 500 t_IM.
     전체는 1,200 t_IO + 20 t_IS + 500 t_IM.
  5. 짝 없는 런을 그대로 두면 3, 4번째 패스가 160 t_IO + 80 t_IM로 줄어 합치기가 920 t_IO + 460 t_IM.
  6. 끝난 파일은 정렬되어 있고 레코드가 하나도 빠지지 않는다.
  7. 문서의 작은 추적 예(16개, 메모리 4개, 블록 2개)와 사다리 문제의 수치.
"""
import math
import random


def to_blocks(records, blk):
    return [records[i:i + blk] for i in range(0, len(records), blk)]


def generate_runs(disk_blocks, mem, blk, cnt):
    """mem개씩 읽어 정렬하고 런(블록의 줄)으로 쓴다."""
    per_load = mem // blk
    runs = []
    for i in range(0, len(disk_blocks), per_load):
        load = []
        for b in disk_blocks[i:i + per_load]:
            cnt["io"] += 1                      # 블록 읽기
            load.extend(b)
        load.sort()
        cnt["sort"] += 1
        run = to_blocks(load, blk)
        cnt["io"] += len(run)                   # 블록 쓰기
        runs.append(run)
    return runs


def merge_group(group, blk, cnt):
    """런 여러 개를 하나로 합친다. 입력 버퍼는 런마다 1블록, 출력 버퍼 1블록."""
    pos = [0] * len(group)                      # 다음에 읽을 블록 번호
    buf = [[] for _ in group]                   # 입력 버퍼
    out, out_buf = [], []
    while True:
        for r, run in enumerate(group):         # 빈 입력 버퍼를 채운다
            if not buf[r] and pos[r] < len(run):
                buf[r] = list(run[pos[r]])
                pos[r] += 1
                cnt["io"] += 1
        live = [r for r in range(len(group)) if buf[r]]
        if not live:
            break
        r = min(live, key=lambda x: buf[x][0])
        out_buf.append(buf[r].pop(0))
        if len(out_buf) == blk:                 # 출력 버퍼가 차면 쓴다
            out.append(out_buf)
            out_buf = []
            cnt["io"] += 1
            cnt["merge"] += 1
    if out_buf:
        out.append(out_buf)
        cnt["io"] += 1
        cnt["merge"] += 1
    return out


def merge_pass(runs, k, blk, cnt, copy_unpaired=True):
    nxt = []
    for i in range(0, len(runs), k):
        group = runs[i:i + k]
        if len(group) == 1 and not copy_unpaired:
            nxt.append(group[0])                # 손대지 않는다
        else:
            nxt.append(merge_group(group, blk, cnt))
    return nxt


def external_sort(records, mem, blk, k=2, copy_unpaired=True):
    cnt = {"io": 0, "sort": 0, "merge": 0}
    runs = generate_runs(to_blocks(records, blk), mem, blk, cnt)
    gen = dict(cnt)
    passes = []
    run_counts = [len(runs)]
    while len(runs) > 1:
        before = dict(cnt)
        runs = merge_pass(runs, k, blk, cnt, copy_unpaired)
        passes.append((cnt["io"] - before["io"], cnt["merge"] - before["merge"]))
        run_counts.append(len(runs))
    result = [x for b in runs[0] for x in b] if runs else []
    return result, gen, passes, run_counts, cnt


def passes_needed(r, k):
    p = 0
    while r > 1:
        r = -(-r // k)
        p += 1
    return p


if __name__ == "__main__":
    rng = random.Random(45)
    data = [rng.randrange(10 ** 6) for _ in range(10000)]

    # 1~4, 6. 문서 본문의 수치 (짝 없는 런도 옮겨 적는다)
    out, gen, passes, run_counts, cnt = external_sort(data, 500, 100)
    assert out == sorted(data)
    assert gen == {"io": 200, "sort": 20, "merge": 0}
    assert run_counts == [20, 10, 5, 3, 2, 1]
    assert len(passes) == 5 == math.ceil(math.log2(20)) == passes_needed(20, 2)
    assert passes == [(200, 100)] * 5
    assert cnt == {"io": 1200, "sort": 20, "merge": 500}

    # 3. R1과 R2만 합치기
    c = {"io": 0, "sort": 0, "merge": 0}
    runs = generate_runs(to_blocks(data, 100), 500, 100, c)
    assert len(runs) == 20 and all(len(r) == 5 for r in runs)
    c = {"io": 0, "sort": 0, "merge": 0}
    s1 = merge_group(runs[:2], 100, c)
    assert c == {"io": 20, "sort": 0, "merge": 10} and len(s1) == 10
    # S1과 S2 합치기: 40 t_IO + 20 t_IM
    s2 = merge_group(runs[2:4], 100, {"io": 0, "sort": 0, "merge": 0})
    c = {"io": 0, "sort": 0, "merge": 0}
    merge_group([s1, s2], 100, c)
    assert c == {"io": 40, "sort": 0, "merge": 20}

    # 5. 짝 없는 런을 그대로 두면
    out, gen, passes, run_counts, cnt = external_sort(data, 500, 100, copy_unpaired=False)
    assert out == sorted(data)
    assert passes == [(200, 100), (200, 100), (160, 80), (160, 80), (200, 100)]
    assert cnt["io"] - gen["io"] == 920 and cnt["merge"] == 460

    # 7. 문서의 작은 추적 예
    small = [9, 4, 7, 1, 8, 2, 6, 3, 5, 16, 10, 13, 12, 11, 15, 14]
    c = {"io": 0, "sort": 0, "merge": 0}
    runs = generate_runs(to_blocks(small, 2), 4, 2, c)
    flat = [[x for b in r for x in b] for r in runs]
    assert flat == [[1, 4, 7, 9], [2, 3, 6, 8], [5, 10, 13, 16], [11, 12, 14, 15]]
    assert c == {"io": 16, "sort": 4, "merge": 0}
    p1 = merge_pass(runs, 2, 2, c)
    flat = [[x for b in r for x in b] for r in p1]
    assert flat == [[1, 2, 3, 4, 6, 7, 8, 9], [5, 10, 11, 12, 13, 14, 15, 16]]
    out, gen, passes, run_counts, cnt = external_sort(small, 4, 2)
    assert out == list(range(1, 17))
    assert passes == [(16, 8), (16, 8)] and cnt == {"io": 48, "sort": 4, "merge": 16}

    # 카드 C2: 6,000개, 메모리 600개, 블록 100개 -> 런 10개(6블록씩), 패스 4번
    data2 = [rng.randrange(10 ** 6) for _ in range(6000)]
    out, gen, passes, run_counts, cnt = external_sort(data2, 600, 100)
    assert out == sorted(data2)
    assert gen == {"io": 120, "sort": 10, "merge": 0}
    assert run_counts == [10, 5, 3, 2, 1] and passes == [(120, 60)] * 4
    assert cnt == {"io": 600, "sort": 10, "merge": 240}

    # 사다리 문제 2: 40,000개, 메모리 1,000개, 블록 100개 -> 런 40개, 패스 6번
    data3 = [rng.randrange(10 ** 6) for _ in range(40000)]
    out, gen, passes, run_counts, cnt = external_sort(data3, 1000, 100)
    assert out == sorted(data3)
    assert gen == {"io": 800, "sort": 40, "merge": 0}
    assert run_counts == [40, 20, 10, 5, 3, 2, 1] and passes == [(800, 400)] * 6
    assert cnt == {"io": 5600, "sort": 40, "merge": 2400}

    # 패스 수 = ceil(log_k r) (r <= 300, k <= 10): 정수 계산으로 확인
    for r in range(1, 301):
        for k in range(2, 11):
            p = passes_needed(r, k)
            assert k ** p >= r and (p == 0 or k ** (p - 1) < r)

    print("런 만들기 200 t_IO + 20 t_IS, 런 수 20 -> 10 -> 5 -> 3 -> 2 -> 1 (패스 5번)")
    print("짝 없는 런도 옮겨 적으면 합치기 1,000 t_IO + 500 t_IM, 그대로 두면 920 t_IO + 460 t_IM")
    print("ALL CHECKS PASSED")
```
{% endraw %}
