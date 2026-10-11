---
layout: "note"
title: "37_cache-tracing-ladder_p4.py"
display_title: "37_cache-tracing-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "37"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/cache-tracing-ladder/"
parent_title: "캐시 적중과 실패 추적 예제 사다리"
description: "컴퓨터 구조 · 캐시 적중과 실패 추적 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/computer-architecture/code/37_cache-tracing-ladder_p4/"
---
{% raw %}
[캐시 적중과 실패 추적 예제 사다리](/Hongs_Blog/studies/computer-architecture/cache-tracing-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""캐시 적중과 실패 추적 예제 사다리: 문제 1~4의 추적 표와 답을 캐시 흉내기로 확인한다.

실행: python3 37_cache-tracing-ladder_p4.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
캐시 흉내기는 실제 하드웨어가 아니라 동작 규칙을 옮긴 파이썬 코드다.
주소는 0부터 세는 바이트 주소, 줄·집합·way 번호도 0부터 센다.
"""
import math
import random


def split_address(addr, block_bytes, num_sets):
    """주소를 (태그, 인덱스, 오프셋)으로 쪼갠다. 블록 크기와 집합 수는 2의 거듭제곱."""
    off_bits = int(math.log2(block_bytes))
    idx_bits = int(math.log2(num_sets))
    offset = addr & (block_bytes - 1)
    index = (addr >> off_bits) & (num_sets - 1)
    tag = addr >> (off_bits + idx_bits)
    return tag, index, offset


def field_bits(addr_bits, block_bytes, num_sets):
    """(태그 비트 수, 인덱스 비트 수, 오프셋 비트 수)"""
    off_bits = int(math.log2(block_bytes))
    idx_bits = int(math.log2(num_sets))
    return addr_bits - idx_bits - off_bits, idx_bits, off_bits


def total_bits(addr_bits, block_bytes, num_sets, ways, dirty=False):
    """캐시 전체 비트 수 = 블록 수 x (유효 1 + [더티 1] + 태그 + 데이터)"""
    tag_bits, _, _ = field_bits(addr_bits, block_bytes, num_sets)
    per_line = 1 + (1 if dirty else 0) + tag_bits + 8 * block_bytes
    return num_sets * ways * per_line


class Cache:
    """캐시 흉내기. ways=1이면 직접 사상, num_sets=1이면 완전 연관.
    policy: 'lru' | 'fifo' | 'random'.  write: 'through' | 'back'.
    실제 하드웨어가 아니라 동작 규칙만 옮긴 파이썬 흉내다."""

    def __init__(self, num_sets, ways, block_bytes, policy="lru",
                 write="through", write_allocate=True, seed=0, memory=None):
        self.num_sets, self.ways, self.block_bytes = num_sets, ways, block_bytes
        self.policy, self.write, self.write_allocate = policy, write, write_allocate
        self.rng = random.Random(seed)
        # 각 집합은 줄(line)의 목록. 줄 = dict(tag, dirty, last, came, data)
        self.sets = [[] for _ in range(num_sets)]
        self.clock = 0
        self.hits = self.misses = 0
        self.block_reads = 0      # 아래층에서 블록을 가져온 횟수
        self.mem_writes = 0       # 아래층에 쓴 횟수 (워드 쓰기 또는 블록 되쓰기)
        self.memory = {} if memory is None else memory   # 워드 주소 -> 값
        self.log = []

    def _block_base(self, addr):
        return addr - (addr % self.block_bytes)

    def _load(self, addr):
        base = self._block_base(addr)
        return {a: self.memory.get(a, 0) for a in range(base, base + self.block_bytes, 4)} \
            if self.block_bytes >= 4 else {base: self.memory.get(base, 0)}

    def _evict(self, lines, index):
        if self.policy == "lru":
            victim = min(lines, key=lambda l: l["last"])
        elif self.policy == "fifo":
            victim = min(lines, key=lambda l: l["came"])
        else:
            victim = self.rng.choice(lines)
        lines.remove(victim)
        if victim["dirty"]:
            self.memory.update(victim["data"])
            self.mem_writes += 1
        return victim["tag"]

    def access(self, addr, is_write=False, value=None):
        """한 번 접근한다. (적중 여부, 태그, 인덱스, 오프셋, 쫓겨난 태그 또는 None)을 돌려준다."""
        self.clock += 1
        tag, index, offset = split_address(addr, self.block_bytes, self.num_sets)
        lines = self.sets[index]
        line = next((l for l in lines if l["tag"] == tag), None)
        hit = line is not None
        evicted = None
        if hit:
            self.hits += 1
        else:
            self.misses += 1
            if is_write and not self.write_allocate:
                self.memory[addr - addr % 4] = value
                self.mem_writes += 1
                self.log.append((addr, False, tag, index, offset, None))
                return False, tag, index, offset, None
            if len(lines) >= self.ways:
                evicted = self._evict(lines, index)
            self.block_reads += 1
            line = {"tag": tag, "dirty": False, "last": 0, "came": self.clock,
                    "data": self._load(addr)}
            lines.append(line)
        line["last"] = self.clock
        if is_write:
            line["data"][addr - addr % 4] = value
            if self.write == "through":
                self.memory[addr - addr % 4] = value
                self.mem_writes += 1
            else:
                line["dirty"] = True
        self.log.append((addr, hit, tag, index, offset, evicted))
        return hit, tag, index, offset, evicted

    def read(self, addr):
        self.access(addr)
        tag, index, _ = split_address(addr, self.block_bytes, self.num_sets)
        line = next(l for l in self.sets[index] if l["tag"] == tag)
        return line["data"].get(addr - addr % 4, 0)

    def flush(self):
        """더티 블록을 모두 아래층에 되쓴다."""
        for lines in self.sets:
            for l in lines:
                if l["dirty"]:
                    self.memory.update(l["data"])
                    self.mem_writes += 1
                    l["dirty"] = False

    def contents(self):
        """집합마다 들어 있는 태그 목록 (오래 안 쓴 순)."""
        return [[l["tag"] for l in sorted(s, key=lambda l: l["last"])] for s in self.sets]

    def miss_rate(self):
        return self.misses / (self.hits + self.misses)


def run(trace, num_sets, ways, block_bytes, policy="lru", seed=0):
    c = Cache(num_sets, ways, block_bytes, policy, seed=seed)
    return [c.access(a)[0] for a in trace], c


def classify_misses(trace, num_sets, ways, block_bytes, policy="lru"):
    """세 가지 실패로 가른다.
    강제 = 무한 캐시에서도 나는 실패(블록을 처음 건드림),
    용량 = 같은 크기 완전 연관(LRU) 캐시의 실패 - 강제,
    충돌 = 실제 캐시의 실패 - 같은 크기 완전 연관 캐시의 실패."""
    seen, compulsory = set(), 0
    for a in trace:
        b = a // block_bytes
        if b not in seen:
            compulsory += 1
            seen.add(b)
    _, fa = run(trace, 1, num_sets * ways, block_bytes, "lru")
    _, real = run(trace, num_sets, ways, block_bytes, policy)
    return compulsory, fa.misses - compulsory, real.misses - fa.misses, real.misses


def table(trace, num_sets, ways, block_bytes):
    c = Cache(num_sets, ways, block_bytes)
    return [c.access(a) for a in trace], c


if __name__ == "__main__":
    # 문제 1: 8비트 주소, 직접 사상 4줄, 블록 8바이트
    assert field_bits(8, 8, 4) == (3, 2, 3)
    t1 = [0x08, 0x0C, 0x28, 0x10, 0x0A, 0x48, 0x2C, 0x14]
    rows, c = table(t1, 4, 1, 8)
    assert [(r[1], r[2], r[3]) for r in rows] == [(0, 1, 0), (0, 1, 4), (1, 1, 0), (0, 2, 0), (0, 1, 2), (2, 1, 0), (1, 1, 4), (0, 2, 4)]
    assert [r[0] for r in rows] == [False, True, False, False, False, False, False, True]
    assert [r[4] for r in rows] == [None, None, 0, None, 1, 0, 2, None]
    assert (c.hits, c.misses) == (2, 6) and c.contents() == [[], [1], [0], []]
    assert total_bits(8, 8, 4, 1) == 4 * (1 + 3 + 64) == 272

    # 문제 2: 10비트 주소, 직접 사상 8줄, 블록 4바이트
    assert field_bits(10, 4, 8) == (5, 3, 2)
    t2 = [0x0A4, 0x0A6, 0x1C4, 0x0B0, 0x2A4, 0x1C5, 0x0A5, 0x0B3, 0x3B0, 0x1C4]
    rows, c = table(t2, 8, 1, 4)
    assert [(r[1], r[2], r[3]) for r in rows] == [(5, 1, 0), (5, 1, 2), (14, 1, 0), (5, 4, 0), (21, 1, 0),
                                                  (14, 1, 1), (5, 1, 1), (5, 4, 3), (29, 4, 0), (14, 1, 0)]
    assert [r[0] for r in rows] == [False, True, False, False, False, False, False, True, False, False]
    assert (c.hits, c.misses) == (2, 8)
    assert c.contents() == [[], [14], [], [], [29], [], [], []]

    # 문제 3: 8비트 주소, 2-way 집합 4개, 블록 4바이트, LRU
    assert field_bits(8, 4, 4) == (4, 2, 2)
    t3 = [0x10, 0x30, 0x12, 0x50, 0x10, 0x14, 0x30, 0x52, 0x34, 0x16]
    rows, c = table(t3, 4, 2, 4)
    assert [(r[1], r[2]) for r in rows] == [(1, 0), (3, 0), (1, 0), (5, 0), (1, 0), (1, 1), (3, 0), (5, 0), (3, 1), (1, 1)]
    assert [r[0] for r in rows] == [False, False, True, False, True, False, False, False, False, True]
    assert [r[4] for r in rows] == [None, None, None, 3, None, None, 5, 1, None, None]
    assert (c.hits, c.misses) == (3, 7)
    assert c.contents() == [[3, 5], [3, 1], [], []]
    # 같은 접근열을 같은 크기 직접 사상(8줄)에 넣으면
    assert run(t3, 8, 1, 4)[1].misses == 10

    # 문제 4: 8비트 주소, 2-way 집합 2개, 블록 8바이트, LRU
    assert field_bits(8, 8, 2) == (4, 1, 3)
    t4 = [0x24, 0x38, 0x44, 0x20, 0x64, 0x3C, 0x48, 0x84, 0x26, 0x68]
    rows, c = table(t4, 2, 2, 8)
    assert [(r[1], r[2], r[3]) for r in rows] == [(2, 0, 4), (3, 1, 0), (4, 0, 4), (2, 0, 0), (6, 0, 4),
                                                  (3, 1, 4), (4, 1, 0), (8, 0, 4), (2, 0, 6), (6, 1, 0)]
    assert [r[0] for r in rows] == [False, False, False, True, False, True, False, False, False, False]
    assert [r[4] for r in rows] == [None, None, None, None, 4, None, None, 2, 6, 3]
    assert (c.hits, c.misses) == (2, 8)
    assert c.contents() == [[8, 2], [4, 6]]
    assert total_bits(8, 8, 2, 2) == 4 * (1 + 4 + 64) == 276
    assert classify_misses(t4, 2, 2, 8) == (7, 1, 0, 8)
    print("ALL CHECKS PASSED")
```
{% endraw %}
