---
layout: "note"
title: "46_k-way-merge_verify.py"
display_title: "46_k-way-merge_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "46"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/k-way-merge/"
parent_title: "k-way 병합과 선택 트리"
description: "자료구조 · k-way 병합과 선택 트리 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/46_k-way-merge_verify/"
---
{% raw %}
[k-way 병합과 선택 트리](/Hongs_Blog/studies/data-structures/k-way-merge/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""k-way 병합: 패스 수와 비교 횟수 세기.

실행: python3 46_k-way-merge_verify.py
문서: 46.k-way 병합과 선택 트리 (패스 수 표, 비교 횟수 표, 슬라이드의 선택 트리 예, 카드 C1~C3),
      4.연습문제/46.외부 정렬 시간 계산 예제 사다리
출처: 자료구조 14주차 슬라이드 p.45~52

주장
  1. 패스 수 = ceil(log_k r). 런 20개: k = 2면 5번, k = 4면 3번, k = 5면 2번, k = 20이면 1번.
  2. 맨 앞끼리 한 줄로 견주면 레코드 하나에 비교 k - 1번, 승자 트리면 lg k번(k가 2의 거듭제곱).
     런 64개를 k = 2, 4, 8, 64로 끝까지 합칠 때 레코드 하나당 비교는
     한 줄로 견주기 6, 9, 14, 63번 / 승자 트리 6, 6, 6, 6번에 가깝다(실제로 세어 확인).
  3. (k - 1)/lg k는 k = 2, 4, 8, 16에서 1, 1.5, 2.33, 3.75로 커진다.
  4. 슬라이드의 런 8개: 승자 트리 뿌리 6, 6을 내보낸 뒤 다시 겨룬 값 15, 9, 8 (p.50~51),
     패자 트리의 칸 8 / 9, 17 / 10, 20, 9, 90 과 우승자 6 (p.52). 내보내는 차례 6, 8, 9, 9, 10, 11, 15, 15, 15.
  5. 메모리가 500개로 고정이고 버퍼가 k + 1개 필요하면 블록 크기는 500 // (k + 1) 이하.
"""
import math

INF = float("inf")


def passes_needed(r, k):
    p = 0
    while r > 1:
        r = -(-r // k)
        p += 1
    return p


def merge_naive(runs, cnt):
    """런들의 맨 앞을 한 줄로 견주어 가장 작은 것을 고른다. 살아 있는 런이 m개면 비교 m - 1번."""
    pos = [0] * len(runs)
    out = []
    while True:
        live = [r for r in range(len(runs)) if pos[r] < len(runs[r])]
        if not live:
            return out
        best = live[0]
        for r in live[1:]:
            cnt[0] += 1
            if runs[r][pos[r]] < runs[best][pos[best]]:
                best = r
        out.append(runs[best][pos[best]])
        pos[best] += 1


class WinnerTree:
    """잎이 k개(2의 거듭제곱)인 승자 트리. tree[1]이 뿌리, 잎은 tree[k..2k-1]. 칸에는 런 번호를 적는다."""

    def __init__(self, heads, cnt):
        self.k = len(heads)
        assert self.k & (self.k - 1) == 0
        self.val = list(heads)
        self.cnt = cnt
        self.tree = [0] * (2 * self.k)
        for i in range(self.k):
            self.tree[self.k + i] = i
        for i in range(self.k - 1, 0, -1):
            self.tree[i] = self._play(self.tree[2 * i], self.tree[2 * i + 1])

    def _play(self, x, y):
        self.cnt[0] += 1
        return y if self.val[y] < self.val[x] else x

    def winner(self):
        return self.tree[1]

    def replace(self, run, value):
        """run의 맨 앞 값을 바꾸고 뿌리까지 다시 겨룬다: 비교 lg k번."""
        self.val[run] = value
        i = (self.k + run) // 2
        while i >= 1:
            self.tree[i] = self._play(self.tree[2 * i], self.tree[2 * i + 1])
            i //= 2

    def level_values(self):
        out = []
        size = 1
        while size < self.k:
            out.append([self.val[self.tree[i]] for i in range(size, 2 * size)])
            size *= 2
        return out


def loser_tree(heads):
    """패자 트리의 안쪽 칸(위에서부터 층별)과 우승자. 겨룬 뒤 진 쪽을 칸에 적는다."""
    k = len(heads)
    winner = [None] * (2 * k)
    loser = [None] * k
    for i in range(k):
        winner[k + i] = heads[i]
    for i in range(k - 1, 0, -1):
        a, b = winner[2 * i], winner[2 * i + 1]
        winner[i], loser[i] = (a, b) if a <= b else (b, a)
    levels = []
    size = 1
    while size < k:
        levels.append(loser[size:2 * size])
        size *= 2
    return levels, winner[1]


def merge_tree(runs, cnt):
    pos = [0] * len(runs)
    heads = [r[0] if r else INF for r in runs]
    t = WinnerTree(heads, cnt)
    out = []
    while True:
        w = t.winner()
        if t.val[w] == INF:
            return out
        out.append(t.val[w])
        pos[w] += 1
        t.replace(w, runs[w][pos[w]] if pos[w] < len(runs[w]) else INF)


def full_merge(runs, k, merger):
    """k개씩 합치기를 런이 하나 남을 때까지 되풀이한다. (결과, 비교 횟수, 패스 수)"""
    cnt = [0]
    passes = 0
    while len(runs) > 1:
        runs = [merger(runs[i:i + k], cnt) for i in range(0, len(runs), k)]
        passes += 1
    return runs[0], cnt[0], passes


if __name__ == "__main__":
    # 1. 패스 수
    assert [passes_needed(20, k) for k in (2, 4, 5, 20)] == [5, 3, 2, 1]
    for r in range(1, 301):
        for k in range(2, 11):
            p = passes_needed(r, k)
            assert k ** p >= r and (p == 0 or k ** (p - 1) < r)      # p = ceil(log_k r)
    assert passes_needed(20, 2) == math.ceil(math.log2(20))
    assert [passes_needed(100, k) for k in (2, 4, 10)] == [7, 4, 2]       # 카드 C1

    # 2. 런 64개, 런마다 32개씩 (n = 2,048)
    import random
    rng = random.Random(46)
    r, L = 64, 32
    n = r * L
    runs = [sorted(rng.randrange(10 ** 6) for _ in range(L)) for _ in range(r)]
    want = sorted(x for run in runs for x in run)
    table = {}
    for k in (2, 4, 8, 64):
        out_n, c_naive, p_n = full_merge([list(x) for x in runs], k, merge_naive)
        out_t, c_tree, p_t = full_merge([list(x) for x in runs], k, merge_tree)
        assert out_n == want and out_t == want
        assert p_n == p_t == passes_needed(r, k)
        lg = int(math.log2(k))
        assert c_naive <= (k - 1) * n * p_n                # 레코드 하나에 많아야 k - 1번
        assert c_naive > 0.9 * (k - 1) * n * p_n           # 끝자락에서만 조금 준다
        # 승자 트리: 레코드 하나 내보낼 때마다 lg k번 + 트리마다 만들 때 k - 1번
        trees = sum(r // k ** (i + 1) for i in range(p_t))
        assert c_tree == n * lg * p_t + trees * (k - 1)
        table[k] = (p_n, c_naive / n, c_tree / n)
    assert [table[k][0] for k in (2, 4, 8, 64)] == [6, 3, 2, 1]
    for k, per_naive, per_tree in ((2, 6, 6), (4, 9, 6), (8, 14, 6), (64, 63, 6)):
        assert 0.9 * per_naive < table[k][1] <= per_naive
        assert per_tree <= table[k][2] < per_tree + 1.1    # 트리를 만드는 비교와 끝자락의 빈 런이 조금 더한다

    # 3. (k - 1) / lg k
    ratio = [(k - 1) / math.log2(k) for k in (2, 4, 8, 16)]
    assert [round(x, 2) for x in ratio] == [1.0, 1.5, 2.33, 3.75]

    # 4. 슬라이드의 런 8개 (p.50~52). 보이는 값만 적었다.
    slide_runs = [
        [10, 15, 16], [9, 20, 38], [20, 20, 30], [6, 15, 25, 28],
        [8, 15, 50], [9, 11, 16], [90, 95, 99], [17, 18, 20],
    ]
    heads = [x[0] for x in slide_runs]
    c = [0]
    t = WinnerTree(heads, c)
    assert c[0] == 7                                        # 만들 때 k - 1번
    assert t.level_values() == [[6], [6, 8], [9, 6, 8, 17]]
    c[0] = 0
    t.replace(3, 15)                                        # 6을 내보내고 넷째 런의 다음 값 15가 올라온다
    assert c[0] == 3                                        # lg 8번
    assert t.level_values() == [[8], [9, 8], [9, 15, 8, 17]]
    # 카드 C3: 이어서 8을 내보내면 다섯째 런의 다음 값 15가 올라오고, 다시 겨뤄 9가 뿌리에 온다
    assert t.winner() == 4 and t.val[4] == 8
    t.replace(4, 15)
    assert t.level_values() == [[9], [9, 9], [9, 15, 9, 17]]
    assert t.winner() == 1                                  # 둘째 런의 9 (같으면 왼쪽이 이긴다)
    t = WinnerTree(heads, [0])                              # 아래 검사를 위해 처음 상태로
    levels, champ = loser_tree(heads)
    assert levels == [[8], [9, 17], [10, 20, 9, 90]] and champ == 6
    out = merge_tree([list(x) for x in slide_runs], [0])
    assert out[:9] == [6, 8, 9, 9, 10, 11, 15, 15, 15]
    assert merge_naive([list(x) for x in slide_runs], [0]) == out
    # 한 줄로 견주면 처음 레코드 하나에 7번
    c = [0]
    merge_naive([[h] for h in heads], c)
    assert c[0] == 7 + 6 + 5 + 4 + 3 + 2 + 1

    # 5. 버퍼 모형: 메모리 500개, 버퍼 k + 1개
    sizes = {k: 500 // (k + 1) for k in (2, 4, 5, 9, 19)}
    assert sizes == {2: 166, 4: 100, 5: 83, 9: 50, 19: 25}
    blocks = {k: -(-10000 // s) for k, s in sizes.items()}
    assert blocks[5] == 121 and blocks[9] == 200 and blocks[19] == 400

    # 카드 C2: n = 1,000,000, r = 64: 한 줄로 견주기 k = 8이면 14n, 승자 트리면 6n
    assert (8 - 1) * passes_needed(64, 8) == 14 and 3 * passes_needed(64, 8) == 6

    print("런 20개의 패스 수: k = 2, 4, 5, 20 ->", [passes_needed(20, k) for k in (2, 4, 5, 20)])
    for k in (2, 4, 8, 64):
        print(f"런 64개, k = {k:2d}: 패스 {table[k][0]}번, 레코드당 비교 한 줄 {table[k][1]:.2f} / 승자 트리 {table[k][2]:.2f}")
    print("슬라이드 예: 승자 6 -> 다시 겨뤄 8, 패자 트리 8 / 9, 17 / 10, 20, 9, 90")
    print("ALL CHECKS PASSED")
```
{% endraw %}
