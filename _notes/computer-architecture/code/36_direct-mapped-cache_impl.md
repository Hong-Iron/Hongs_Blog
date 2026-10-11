---
layout: "note"
title: "36_direct-mapped-cache_impl.py"
display_title: "36_direct-mapped-cache_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "36"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/direct-mapped-cache/"
parent_title: "직접 사상 캐시"
description: "컴퓨터 구조 · 직접 사상 캐시 구현 코드"
permalink: "/studies/computer-architecture/code/36_direct-mapped-cache_impl/"
---
{% raw %}
[직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""직접 사상 캐시: 주소 쪼개기 식, 접근 추적 표, 전체 비트 수, 블록 크기에 따른 실패율을 확인한다.

실행: python3 36_direct-mapped-cache_impl.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


if __name__ == "__main__":
    # 주소 쪼개기 식을 나눗셈·나머지로 직접 계산한 값과 견준다 (여러 구성 전수)
    for block_bytes in (4, 8, 16, 32, 64):
        for num_sets in (1, 2, 8, 64, 1024):
            t, i, o = field_bits(32, block_bytes, num_sets)
            assert o == math.log2(block_bytes) and i == math.log2(num_sets) and t + i + o == 32
            for addr in list(range(0, 5000, 7)) + [0xFFFFFFFF, 0x12345678]:
                tag, index, offset = split_address(addr, block_bytes, num_sets)
                block_no = addr // block_bytes
                assert offset == addr % block_bytes
                assert index == block_no % num_sets
                assert tag == block_no // num_sets
                # 태그와 인덱스로 블록 번호를 되살릴 수 있다(한 줄에 누가 들었는지 태그만으로 안다)
                assert tag * num_sets + index == block_no

    # 예시로 보기: 8비트 주소, 8줄, 블록 4바이트 -> 태그 3, 인덱스 3, 오프셋 2
    assert field_bits(8, 4, 8) == (3, 3, 2)
    trace = [20, 22, 24, 84, 21, 48, 50, 84, 26, 20]
    c = Cache(8, 1, 4)
    rows = [c.access(a) for a in trace]
    assert [(r[1], r[2], r[3]) for r in rows] == [
        (0, 5, 0), (0, 5, 2), (0, 6, 0), (2, 5, 0), (0, 5, 1),
        (1, 4, 0), (1, 4, 2), (2, 5, 0), (0, 6, 2), (0, 5, 0)]
    assert [r[0] for r in rows] == [False, True, False, False, False, False, True, False, True, False]
    assert [r[4] for r in rows] == [None, None, None, 0, 2, None, None, 0, None, 2]
    assert (c.hits, c.misses) == (3, 7)
    assert c.contents() == [[], [], [], [], [1], [0], [0], []]
    assert classify_misses(trace, 8, 1, 4) == (4, 0, 3, 7)

    # 전체 비트 수: 데이터 64 KiB, 블록 32바이트(워드 8개), 32비트 주소
    blocks = 64 * 1024 // 32
    assert blocks == 2048 and field_bits(32, 32, blocks) == (16, 11, 5)
    assert 1 + 16 + 256 == 273 and total_bits(32, 32, blocks, 1) == 559104
    assert total_bits(32, 32, blocks, 1) / 8 / 1024 == 68.25
    assert round(total_bits(32, 32, blocks, 1) / (64 * 1024 * 8), 3) == 1.066
    # 카드 C2: 1024줄, 블록 4바이트(워드 1개)
    assert field_bits(32, 4, 1024) == (20, 10, 2) and total_bits(32, 4, 1024, 1) == 54272
    assert 54272 / 8 == 6784 and 1024 * 4 == 4096
    # 카드 C4: 주소 0x1234ABCD, 256줄, 블록 16바이트
    assert field_bits(32, 16, 256) == (20, 8, 4)
    assert split_address(0x1234ABCD, 16, 256) == (0x1234A, 0xBC, 0xD)
    # 카드 C3: 8줄, 블록 4바이트, 접근 12, 44, 14, 76, 12
    hits, c = run([12, 44, 14, 76, 12], 8, 1, 4)
    assert hits == [False, False, False, False, False] and c.contents()[3] == [0]
    assert [split_address(a, 4, 8) for a in (12, 44, 14, 76)] == [(0, 3, 0), (1, 3, 0), (0, 3, 2), (2, 3, 0)]

    # 블록 크기 바꾸기: 캐시 데이터 크기를 256바이트로 묶어 두고 블록만 키운다
    tm = mixed_trace()
    rates = {}
    for bb in (4, 8, 16, 32, 64, 128, 256):
        _, c = run(tm, 256 // bb, 1, bb)
        rates[bb] = round(c.miss_rate() * 100, 1)
    assert rates == {4: 53.0, 8: 31.0, 16: 20.0, 32: 19.8, 64: 64.0, 128: 74.2, 256: 96.9}, rates
    assert min(rates, key=rates.get) == 32      # 내려갔다가 다시 올라간다
    # 운영체제 06.캐시 메모리의 예: 워드 주소 16비트, 블록이 워드 4개, 칸 128개
    assert field_bits(16, 4, 128) == (7, 7, 2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
