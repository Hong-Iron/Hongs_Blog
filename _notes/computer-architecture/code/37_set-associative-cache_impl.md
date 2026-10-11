---
layout: "note"
title: "37_set-associative-cache_impl.py"
display_title: "37_set-associative-cache_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "37"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/set-associative-cache/"
parent_title: "집합 연관 캐시"
description: "컴퓨터 구조 · 집합 연관 캐시 구현 코드"
permalink: "/studies/computer-architecture/code/37_set-associative-cache_impl/"
---
{% raw %}
[집합 연관 캐시](/Hongs_Blog/studies/computer-architecture/set-associative-cache/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""집합 연관 캐시: 직접 사상·2-way·완전 연관의 추적, 비트 수, 대조 문서의 수치를 확인한다.

실행: python3 37_set-associative-cache_impl.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def steady_hits(cycle, num_sets, ways, block_bytes, rounds=20):
    """같은 접근열을 되풀이할 때, 마지막 한 바퀴에서 적중한 횟수."""
    hits, _ = run(cycle * rounds, num_sets, ways, block_bytes)
    return sum(hits[-len(cycle):])


if __name__ == "__main__":
    # 예시로 보기: 블록 4개짜리 캐시 세 가지(블록 4바이트), 블록 번호 1, 5, 1, 5, 9, 1, 5, 9
    trace = [4, 20, 4, 20, 36, 4, 20, 36]
    assert [a // 4 for a in trace] == [1, 5, 1, 5, 9, 1, 5, 9]
    hits, dm = run(trace, 4, 1, 4)
    assert dm.misses == 8 and all(split_address(a, 4, 4)[1] == 1 for a in trace)
    c = Cache(2, 2, 4)
    rows = [c.access(a) for a in trace]
    assert [r[2] for r in rows] == [1] * 8                      # 모두 집합 1
    assert [r[1] for r in rows] == [0, 2, 0, 2, 4, 0, 2, 4]     # 태그
    assert [r[0] for r in rows] == [False, False, True, True, False, False, False, False]
    assert [r[4] for r in rows] == [None, None, None, None, 0, 2, 4, 0]
    assert c.misses == 6 and c.contents() == [[], [2, 4]]
    hits, fa = run(trace, 1, 4, 4)
    assert hits == [False, False, True, True, False, True, True, True] and fa.misses == 3
    assert [split_address(a, 4, 1)[0] for a in trace] == [1, 5, 1, 5, 9, 1, 5, 9]
    # 세 가지 실패로 가르기
    assert classify_misses(trace, 4, 1, 4) == (3, 0, 5, 8)
    assert classify_misses(trace, 2, 2, 4) == (3, 0, 3, 6)
    assert classify_misses(trace, 1, 4, 4) == (3, 0, 0, 3)

    # 비트 수: 데이터 64 KiB, 블록 32바이트 -> 블록 2048개. way 수를 두 배 할 때마다
    # 집합이 반으로 줄어 인덱스가 1비트 줄고 태그가 1비트 는다.
    expect = {1: ((16, 11, 5), 559104), 2: ((17, 10, 5), 561152), 4: ((18, 9, 5), 563200),
              8: ((19, 8, 5), 565248), 2048: ((27, 0, 5), 581632)}
    for ways, (fields, bits) in expect.items():
        sets = 2048 // ways
        assert field_bits(32, 32, sets) == fields
        assert total_bits(32, 32, sets, ways) == bits
    # 직접 사상(way 1개)과 완전 연관(집합 1개)은 n-way의 양 끝
    for trace2 in ([random.Random(s).randrange(0, 256) for _ in range(300)] for s in range(20)):
        a, _ = run(trace2, 8, 1, 4)
        # 직접 사상: 줄마다 태그 하나만 기억하는 가장 단순한 흉내와 같아야 한다
        slot, ref = {}, []
        for x in trace2:
            b = x // 4
            ref.append(slot.get(b % 8) == b // 8)
            slot[b % 8] = b // 8
        assert a == ref
        # 완전 연관 LRU: 목록 하나로 짠 흉내와 같아야 한다
        f, _ = run(trace2, 1, 8, 4)
        lst, ref = [], []
        for x in trace2:
            b = x // 4
            ref.append(b in lst)
            if b in lst:
                lst.remove(b)
            elif len(lst) == 8:
                lst.pop(0)
            lst.append(b)
        assert f == ref

    # 카드 C3: 4집합 2-way, 블록 4바이트, 접근 0x10 0x30 0x12 0x50 0x10
    c = Cache(4, 2, 4)
    rows = [c.access(a) for a in (0x10, 0x30, 0x12, 0x50, 0x10)]
    assert [r[0] for r in rows] == [False, False, True, False, True]
    assert rows[3][4] == 3 and c.contents()[0] == [5, 1]
    # 카드 C2: 16 KiB, 4-way, 블록 16바이트
    sets = 16 * 1024 // 16 // 4
    assert sets == 256 and field_bits(32, 16, sets) == (20, 8, 4)
    assert total_bits(32, 16, sets, 4) == 1024 * (1 + 20 + 128) == 152576

    # 대조 문서(38)의 수치: 8줄짜리 캐시 셋, 블록 4바이트
    three = [b * 4 for b in (2, 10, 5)]            # 블록 2와 10이 같은 줄에서 부딪친다
    assert [steady_hits(three, ns, w, 4) for ns, w in ((8, 1), (4, 2), (1, 8))] == [1, 3, 3]
    nine = [b * 4 for b in range(9)]               # 블록 9개를 차례로 돈다(캐시보다 하나 많다)
    assert [steady_hits(nine, ns, w, 4) for ns, w in ((8, 1), (4, 2), (1, 8))] == [7, 6, 0]
    # 카드 C4: 블록 4개짜리 캐시에 블록 0~4를 되풀이
    five = [b * 4 for b in range(5)]
    assert [steady_hits(five, ns, w, 4) for ns, w in ((4, 1), (1, 4))] == [3, 0]
    assert round((565248 / 559104 - 1) * 100, 1) == 1.1      # 8-way와 직접 사상의 비트 수 차이
    print("ALL CHECKS PASSED")
```
{% endraw %}
