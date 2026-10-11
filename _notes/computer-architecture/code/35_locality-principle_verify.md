---
layout: "note"
title: "35_locality-principle_verify.py"
display_title: "35_locality-principle_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "35"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/locality-principle/"
parent_title: "지역성의 원리"
description: "컴퓨터 구조 · 지역성의 원리 검증 코드"
permalink: "/studies/computer-architecture/code/35_locality-principle_verify/"
---
{% raw %}
[지역성의 원리](/Hongs_Blog/studies/computer-architecture/locality-principle/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""지역성의 원리: 행 순서·열 순서 훑기, 되풀이 읽기, 흩어진 접근의 실패율을 캐시 흉내기로 확인한다.

실행: python3 35_locality-principle_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


if __name__ == "__main__":
    # 16 x 16 정수 배열(원소 4바이트, 0번지부터 행 우선으로 놓임)
    N = 16
    row = [(i * N + j) * 4 for i in range(N) for j in range(N)]   # a[i][j]를 행 순서로
    col = [(i * N + j) * 4 for j in range(N) for i in range(N)]   # 열 순서로
    # 직접 사상 8줄 x 16바이트(워드 4개) = 128바이트
    _, c = run(row, 8, 1, 16)
    assert (c.misses, len(row)) == (64, 256) and c.miss_rate() == 0.25
    _, c = run(col, 8, 1, 16)
    assert c.misses == 256 and c.miss_rate() == 1.0
    # 2-way로 바꿔도, 줄을 16개로 늘려도 열 순서는 전부 실패
    assert run(col, 4, 2, 16)[1].misses == 256
    assert run(col, 16, 1, 16)[1].misses == 256
    # 배열 전체(1024바이트 = 블록 64개)가 다 들어가는 캐시면 열 순서도 실패 64번
    assert run(col, 64, 1, 16)[1].misses == 64
    # 행 순서는 캐시 크기와 무관하게 블록당 한 번만 실패
    for ns in (8, 16, 64):
        assert run(row, ns, 1, 16)[1].misses == 64

    # 시간 지역성: 워드 8개(블록 2개)를 10번 되풀이해 읽는다 -> 처음 2번만 실패
    loop = [4 * k for k in range(8)] * 10
    _, c = run(loop, 8, 1, 16)
    assert (c.misses, c.hits) == (2, 78)
    # 블록이 워드 1개(공간 지역성을 못 씀)여도 시간 지역성으로 8번만 실패
    _, c = run(loop, 8, 1, 4)
    assert (c.misses, c.hits) == (8, 72)

    # 지역성이 없는 접근: 넓은 범위에서 아무 곳이나 읽으면 거의 다 실패
    rng = random.Random(7)
    scattered = [rng.randrange(0, 1 << 20, 4) for _ in range(2000)]
    _, c = run(scattered, 8, 1, 16)
    assert c.miss_rate() > 0.99

    # 카드 C2: 8 x 8 배열, 직접 사상 4줄 x 8바이트(워드 2개)
    N = 8
    row = [(i * N + j) * 4 for i in range(N) for j in range(N)]
    col = [(i * N + j) * 4 for j in range(N) for i in range(N)]
    assert run(row, 4, 1, 8)[1].misses == 32 and run(col, 4, 1, 8)[1].misses == 64
    print("ALL CHECKS PASSED")
```
{% endraw %}
