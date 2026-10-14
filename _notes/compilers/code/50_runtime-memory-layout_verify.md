---
layout: "note"
title: "50_runtime-memory-layout_verify.py"
display_title: "50_runtime-memory-layout_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "50"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/runtime-memory-layout/"
parent_title: "실행 시 메모리 배치"
description: "컴파일러 · 실행 시 메모리 배치 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/50_runtime-memory-layout_verify/"
---
{% raw %}
[실행 시 메모리 배치](/Hongs_Blog/studies/compilers/runtime-memory-layout/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 실행 시 메모리 배치: 코드, 전역 데이터, 힙, 스택.
# 실행: python3 50_runtime-memory-layout_verify.py  (표준 라이브러리만 쓴다)
# 슬라이드 14회 p.33~39의 그림을 작은 모형으로 옮겨, 스택과 힙이 서로 마주 보고 자랄 때의 성질을 확인한다.
import random


class Memory:
    """주소 0 ~ size-1. 낮은 주소부터 코드, 전역 데이터, 힙(위로 자람). 맨 위에서 스택(아래로 자람)."""

    def __init__(self, size, code, static):
        self.size = size
        self.code_end = code                 # 코드: [0, code)
        self.static_end = code + static      # 전역 데이터: [code, code+static)
        self.heap_top = self.static_end      # 힙: [static_end, heap_top)
        self.stack_top = size                # 스택: [stack_top, size)
        self.frames = []

    def gap(self):
        return self.stack_top - self.heap_top

    def call(self, n):                       # 활성 레코드 n칸을 쌓는다
        if n > self.gap():
            return False
        self.stack_top -= n
        self.frames.append(n)
        return True

    def ret(self):                           # 맨 위 레코드를 걷는다
        self.stack_top += self.frames.pop()

    def malloc(self, n):                     # 힙에서 n칸을 받는다 (이 모형은 힙 꼭대기만 올린다)
        if n > self.gap():
            return None
        addr = self.heap_top
        self.heap_top += n
        return addr

    def ok(self):
        return 0 <= self.code_end <= self.static_end <= self.heap_top <= self.stack_top <= self.size


def fits_shared(heap, stack, room):
    """마주 보고 자랄 때: 둘의 합이 빈 공간 이하면 들어간다."""
    return heap + stack <= room


def fits_split(heap, stack, room):
    """빈 공간을 반으로 미리 갈라 줄 때: 저마다 자기 몫 이하여야 한다."""
    return heap <= room // 2 and stack <= room - room // 2


if __name__ == "__main__":
    m = Memory(size=100, code=20, static=10)
    # p.39의 순서: 낮은 주소부터 코드 < 전역 < 힙 < (빈 곳) < 스택
    assert (m.code_end, m.static_end, m.heap_top, m.stack_top) == (20, 30, 30, 100) and m.gap() == 70
    # 스택은 높은 주소에서 낮은 주소로 (p.36): 부를 때마다 꼭대기 주소가 줄어든다
    tops = []
    for n in (8, 5, 12):
        assert m.call(n)
        tops.append(m.stack_top)
    assert tops == [92, 87, 75] and tops == sorted(tops, reverse=True)
    # 힙은 낮은 주소에서 높은 주소로 (p.39): 받을 때마다 주소가 늘어난다
    addrs = [m.malloc(10), m.malloc(10)]
    assert addrs == [30, 40] and m.heap_top == 50
    # 전역 변수 자리는 스택과 힙이 어떻게 움직여도 그대로다 (p.34 "fixed address")
    assert (m.code_end, m.static_end) == (20, 30)
    # 함수가 끝나면 스택은 줄지만 힙에서 받은 자리는 그대로 남는다 (free를 부를 때까지, p.38)
    m.ret(); m.ret(); m.ret()
    assert m.stack_top == 100 and m.heap_top == 50
    # 가운데 빈 곳이 바닥나면 더 못 쌓는다
    assert m.gap() == 50 and not m.call(51) and m.call(50) and m.gap() == 0 and m.malloc(1) is None

    # ---- 무작위로 부르고 돌아가고 받아도 네 구역은 겹치지 않는다 ----
    rnd = random.Random(4)
    for _ in range(300):
        m = Memory(200, rnd.randint(1, 30), rnd.randint(0, 30))
        for _ in range(60):
            r = rnd.random()
            if r < 0.4:
                m.call(rnd.randint(1, 20))
            elif r < 0.6 and m.frames:
                m.ret()
            else:
                m.malloc(rnd.randint(1, 20))
            assert m.ok()

    # ---- 마주 보고 자라면 빈 공간을 어떤 비율로든 나눠 쓴다. 반으로 갈라 두면 그렇지 못하다 ----
    room = 12
    lost = []
    for heap in range(room + 1):
        for stack in range(room + 1):
            if fits_split(heap, stack, room):
                assert fits_shared(heap, stack, room)       # 갈라 줘서 되는 것은 마주 보고도 된다
            elif fits_shared(heap, stack, room):
                lost.append((heap, stack))                  # 합은 들어가는데 갈라 줘서 못 쓰는 경우
    assert (10, 2) in lost and (2, 10) in lost and len(lost) == 42
    print("ALL CHECKS PASSED")
```
{% endraw %}
