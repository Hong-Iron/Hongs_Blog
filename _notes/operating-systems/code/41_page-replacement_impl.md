---
layout: "note"
title: "41_page-replacement_impl.py"
display_title: "41_page-replacement_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "41"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/page-replacement/"
parent_title: "페이지 교체 알고리즘"
description: "운영체제 · 페이지 교체 알고리즘 구현 코드"
permalink: "/studies/operating-systems/code/41_page-replacement_impl/"
---
{% raw %}
[페이지 교체 알고리즘](/Hongs_Blog/studies/operating-systems/page-replacement/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""페이지 교체 알고리즘 OPT, LRU, FIFO, CLOCK (Stallings 8.2절, 그림 8.15).
faults_after_fill: 프레임이 처음 다 찬 뒤의 페이지 부재 수 (슬라이드가 세는 방식)."""


def simulate(refs, nframes, how):
    frames, faults, hist = [], [], []
    use, hand = {}, 0          # CLOCK: 사용 비트, 시곗바늘
    order = []                 # FIFO: 들어온 순서
    last = {}                  # LRU: 마지막 사용 시각
    for t, p in enumerate(refs):
        hit = p in frames
        if hit:
            last[p] = t
            use[p] = 1
        else:
            if len(frames) < nframes:
                frames.append(p)
                if how == "CLOCK":
                    hand = (len(frames)) % nframes
            else:
                if how == "OPT":
                    def nxt(q):
                        try:
                            return refs.index(q, t + 1)
                        except ValueError:
                            return float("inf")
                    victim = max(frames, key=nxt)
                    i = frames.index(victim)
                elif how == "LRU":
                    victim = min(frames, key=lambda q: last[q]); i = frames.index(victim)
                elif how == "FIFO":
                    victim = order.pop(0); i = frames.index(victim)
                elif how == "CLOCK":
                    while use[frames[hand]] == 1:
                        use[frames[hand]] = 0          # 1이면 0으로 바꾸고 지나감
                        hand = (hand + 1) % nframes
                    i = hand; victim = frames[i]
                    hand = (hand + 1) % nframes
                frames[i] = p
                faults.append(t)
            last[p] = t
            use[p] = 1
            order.append(p)
        hist.append(list(frames))
    return faults, hist


STREAM = [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2]

if __name__ == "__main__":
    expect = {"OPT": 3, "LRU": 4, "FIFO": 6, "CLOCK": 5}
    for how, n in expect.items():
        f, h = simulate(STREAM, 3, how)
        print(how, "부재 시각", f, "최종", h[-1])
        assert len(f) == n, (how, f)
    # 5가 들어올 때(시각 4) LRU는 3을, OPT와 FIFO는 각각 1과 2를 내보낸다
    assert simulate(STREAM, 3, "LRU")[1][4] == [2, 5, 1]
    assert simulate(STREAM, 3, "OPT")[1][4] == [2, 3, 5]
    assert simulate(STREAM, 3, "FIFO")[1][4] == [5, 3, 1]
    # 그림 8.15의 부재 위치 (0부터 센 참조 순번)
    assert simulate(STREAM, 3, "OPT")[0] == [4, 6, 9]
    assert simulate(STREAM, 3, "LRU")[0] == [4, 6, 8, 9]
    assert simulate(STREAM, 3, "FIFO")[0] == [4, 5, 6, 8, 10, 11]
    assert simulate(STREAM, 3, "CLOCK")[0] == [4, 5, 6, 8, 10]

    # 벨레이디의 이상 현상: FIFO는 프레임을 늘렸는데 부재가 늘 수 있다 (처음 채우는 부재 포함)
    B = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
    def total(refs, n, how):
        return len(simulate(refs, n, how)[0]) + min(n, len(set(refs)))
    assert total(B, 3, "FIFO") == 9 and total(B, 4, "FIFO") == 10
    assert total(B, 3, "LRU") == 10 and total(B, 4, "LRU") == 8     # LRU는 이상 현상이 없다

    # 사다리·카드: 참조열 7 0 1 2 0 3 0 4 2 3, 프레임 3개
    L = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3]
    got = {h: len(simulate(L, 3, h)[0]) for h in expect}
    print("사다리", got)
    assert got == {"OPT": 3, "LRU": 5, "FIFO": 6, "CLOCK": 4}   # 손으로도 따라가 확인함
    print("ALL CHECKS PASSED")
```
{% endraw %}
