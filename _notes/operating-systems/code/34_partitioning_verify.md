---
layout: "note"
title: "34_partitioning_verify.py"
display_title: "34_partitioning_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/memory-partitioning/"
parent_title: "메모리 분할"
description: "운영체제 · 메모리 분할 검증 코드"
permalink: "/studies/operating-systems/code/34_partitioning_verify/"
---
{% raw %}
[메모리 분할](/Hongs_Blog/studies/operating-systems/memory-partitioning/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""동적 분할 예(Stallings 그림 7.4)와 배치 알고리즘(그림 7.5)을 다시 계산한다."""


def place(holes, size, how, last=0):
    """holes: [(시작, 크기)] 주소 순. how: best/first/next. 고른 구멍의 번호를 돌려준다."""
    fits = [i for i, (_, s) in enumerate(holes) if s >= size]
    if not fits:
        return None
    if how == "first":
        return fits[0]
    if how == "best":
        return min(fits, key=lambda i: holes[i][1] - size)
    # next: 마지막으로 놓은 곳 다음부터 돌며 처음 맞는 것
    n = len(holes)
    for k in range(n):
        i = (last + k) % n
        if holes[i][1] >= size:
            return i


if __name__ == "__main__":
    # 그림 7.4: 1 MB 중 운영체제 128K, 나머지 896K
    free = 1024 - 128
    assert free == 896
    p1, p2, p3 = 320, 224, 288
    assert free - p1 - p2 - p3 == 64            # (d) 끝에 64K 구멍
    assert p2 - 128 == 96                         # (f) P2 자리에 P4(128K) -> 96K 구멍
    assert p1 - p2 == 96                          # (h) P1 자리에 P2(224K) -> 96K 구멍
    holes_h = [96, 96, 64]
    assert sum(holes_h) == 256 and max(holes_h) < 128   # 합은 256K인데 128K 프로세스도 못 들어감

    # 그림 7.5: 16K 요청. 빈 블록(주소 순)과 마지막 배치 위치(14K 블록 직후)
    holes = [(0, 8), (1, 12), (2, 22), (3, 18), (4, 8), (5, 6), (6, 14), (7, 36)]
    # 슬라이드 그림에서 14K는 마지막으로 할당된 블록이고, 그 뒤 36K가 next-fit이 처음 보는 구멍
    holes_free = [h for h in holes if h[0] != 6]
    sizes = [s for _, s in holes_free]
    i_first = place(holes_free, 16, "first")
    i_best = place(holes_free, 16, "best")
    i_next = place(holes_free, 16, "next", last=[h[0] for h in holes_free].index(7))
    got = {k: (sizes[i], sizes[i] - 16) for k, i in [("first", i_first), ("best", i_best), ("next", i_next)]}
    print(got)
    assert got == {"first": (22, 6), "best": (18, 2), "next": (36, 20)}

    # 카드 C3: 빈 블록 [10, 4, 20, 18, 7, 9, 12, 15], 요청 12, 10, 9 차례로 (first-fit)
    def run(blocks, reqs, how):
        blocks = blocks[:]; chosen = []; last = 0
        for r in reqs:
            i = place([(k, s) for k, s in enumerate(blocks)], r, how, last)
            chosen.append(blocks[i]); blocks[i] -= r; last = i
        return chosen
    B = [10, 4, 20, 18, 7, 9, 12, 15]
    assert run(B, [12, 10, 9], "first") == [20, 10, 18]
    assert run(B, [12, 10, 9], "best") == [12, 10, 9]
    print("ALL CHECKS PASSED")
```
{% endraw %}
