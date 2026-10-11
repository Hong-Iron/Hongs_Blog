---
layout: "note"
title: "42_multilevel-cache_verify.py"
display_title: "42_multilevel-cache_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "42"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/multilevel-cache/"
parent_title: "다단계 캐시"
description: "컴퓨터 구조 · 다단계 캐시 검증 코드"
permalink: "/studies/computer-architecture/code/42_multilevel-cache_verify/"
---
{% raw %}
[다단계 캐시](/Hongs_Blog/studies/computer-architecture/multilevel-cache/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""다단계 캐시: 2단계 평균 접근 시간, 지역·전역 실패율의 관계를 계산과 흉내기로 확인한다.

실행: python3 42_multilevel-cache_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def mixed_trace(n=4096):
    """배열 하나를 차례로 훑는 접근과, 멀리 떨어진 변수 4개를 돌아가며 쓰는 접근을 번갈아 낸다."""
    t, a = [], 0
    hot = [0x1000 + 0x124 * k for k in range(4)]
    for i in range(n):
        if i % 2 == 0:
            t.append(a)
            a += 4
        else:
            t.append(hot[(i // 2) % 4])
    return t


def amat2(t1, m1, t2, m2_local, mem):
    """2단계 캐시의 평균 접근 시간. m2_local은 L2의 지역 실패율."""
    return t1 + m1 * (t2 + m2_local * mem)


def close(a, b):
    return abs(a - b) < 1e-9


if __name__ == "__main__":
    # 예시로 보기: L1 적중 1, L1 실패율 5%, L2 적중 10, L2 지역 실패율 20%, 메모리 100 (사이클)
    assert close(1 + 0.05 * 100, 6.0)                   # L2가 없을 때
    assert close(amat2(1, 0.05, 10, 0.20, 100), 2.5)    # L2가 있을 때
    assert close(0.05 * 0.20, 0.01)                     # L2의 전역 실패율 1%
    # 전역 실패율로 써도 같은 값
    assert close(1 + 0.05 * 10 + 0.01 * 100, 2.5)
    # 1000번 접근으로 세어 보기
    n, l1_miss = 1000, 50
    l2_miss = 10
    assert l1_miss / n == 0.05 and l2_miss / l1_miss == 0.20 and l2_miss / n == 0.01
    assert (n * 1 + l1_miss * 10 + l2_miss * 100) / n == 2.5

    # 흉내기: L1은 직접 사상 256바이트, L2는 4-way 2 KiB (블록 16바이트). L2는 L1이 실패할 때만 본다.
    tm = mixed_trace()
    L1, L2 = Cache(16, 1, 16), Cache(32, 4, 16)
    time = 0
    for a in tm:
        time += 1
        if not L1.access(a)[0]:
            time += 10
            if not L2.access(a)[0]:
                time += 100
    n = len(tm)
    assert (n, L1.misses, L2.misses) == (4096, 821, 512)
    assert L2.hits + L2.misses == L1.misses             # L2가 본 접근 수 = L1 실패 수
    local1, local2, global2 = L1.misses / n, L2.misses / L1.misses, L2.misses / n
    assert close(local1 * local2, global2)              # 전역 = 지역 x 지역
    assert round(local1 * 100, 1) == 20.0 and round(local2 * 100, 1) == 62.4 and global2 == 0.125
    assert close(time / n, amat2(1, local1, 10, local2, 100))
    assert round(time / n, 2) == 15.5
    assert round(1 + local1 * 100, 2) == 21.04          # L2 없이 L1만
    # L2의 지역 실패율은 같은 캐시를 혼자 쓸 때의 실패율보다 높다 (쉬운 접근은 L1이 다 걸러 간다)
    alone = Cache(32, 4, 16)
    for a in tm:
        alone.access(a)
    assert alone.misses == 512 and round(alone.miss_rate() * 100, 1) == 12.5
    assert local2 > alone.miss_rate()

    # 3단계로 늘린 식
    def amat3(t1, m1, t2, m2, t3, m3, mem):
        return t1 + m1 * (t2 + m2 * (t3 + m3 * mem))
    assert close(amat3(1, 0.05, 10, 0.20, 30, 0.5, 100), 1 + 0.05 * (10 + 0.2 * (30 + 50)))
    assert close(amat3(1, 0.05, 10, 0.20, 30, 0.5, 100), 2.3)

    # 카드 C2: L1 적중 1, 실패율 8%, L2 적중 12, 지역 실패율 25%, 메모리 150
    assert close(amat2(1, 0.08, 12, 0.25, 150), 4.96) and close(0.08 * 0.25, 0.02)
    assert close(1 + 0.08 * 150, 13.0)
    assert close(1 + 0.05 * 10 + 0.2 * 100, 21.5)        # 지역 실패율을 전역 자리에 넣은 흔한 실수
    assert close(0.05 * 0.6, 0.03)                       # 카드 C3
    print("ALL CHECKS PASSED")
```
{% endraw %}
