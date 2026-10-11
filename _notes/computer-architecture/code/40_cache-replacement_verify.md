---
layout: "note"
title: "40_cache-replacement_verify.py"
display_title: "40_cache-replacement_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "40"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/cache-replacement/"
parent_title: "캐시 교체 정책"
description: "컴퓨터 구조 · 캐시 교체 정책 검증 코드"
permalink: "/studies/computer-architecture/code/40_cache-replacement_verify/"
---
{% raw %}
[캐시 교체 정책](/Hongs_Blog/studies/computer-architecture/cache-replacement/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""캐시 교체 정책: LRU·FIFO·무작위·앞날을 아는 교체의 실패 수, LRU 비트 수를 확인한다.

실행: python3 40_cache-replacement_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def misses(blocks, ways, policy, seed=0):
    """집합 하나(way가 ways개)에 블록 번호 열을 넣었을 때의 실패 수."""
    return run([b * 4 for b in blocks], 1, ways, 4, policy, seed)[1].misses


def opt_misses(blocks, ways):
    """앞날을 다 아는 교체: 가장 나중에 다시 쓰일 블록을 쫓아낸다(견줄 기준)."""
    cache, m = [], 0
    for k, b in enumerate(blocks):
        if b in cache:
            continue
        m += 1
        if len(cache) >= ways:
            def next_use(x):
                return blocks.index(x, k + 1) if x in blocks[k + 1:] else 10 ** 9
            cache.remove(max(cache, key=next_use))
        cache.append(b)
    return m


def one_bit_lru(blocks):
    """2-way 집합 하나를 '덜 최근에 쓴 쪽'을 가리키는 1비트로 돌린다. 적중 여부 목록."""
    way, old, out = [None, None], 0, []
    for b in blocks:
        if b in way:
            out.append(True)
            old = 1 - way.index(b)
        else:
            out.append(False)
            if None in way:
                k = way.index(None)
            else:
                k = old
            way[k] = b
            old = 1 - k
    return out


if __name__ == "__main__":
    # 예시로 보기: way 3개짜리 집합 하나, 블록 7 2 7 5 9 7 2 3 7 9 7 5
    seq = [7, 2, 7, 5, 9, 7, 2, 3, 7, 9, 7, 5]
    c = Cache(1, 3, 4, "lru")
    rows = [c.access(b * 4) for b in seq]
    assert [r[0] for r in rows] == [False, False, True, False, False, True, False, False, True, False, True, False]
    assert [r[4] for r in rows] == [None, None, None, None, 2, None, 5, 9, None, 2, None, 3]
    assert c.misses == 8
    c = Cache(1, 3, 4, "fifo")
    rows = [c.access(b * 4) for b in seq]
    assert [r[0] for r in rows] == [False, False, True, False, False, False, False, False, True, False, False, False]
    assert [r[4] for r in rows] == [None, None, None, None, 7, 2, 5, 9, None, 7, 2, 3]
    assert c.misses == 10
    assert opt_misses(seq, 3) == 6
    rand = [misses(seq, 3, "random", s) for s in range(2000)]
    assert 7.7 < sum(rand) / len(rand) < 8.1 and min(rand) >= 6
    # 어떤 교체도 앞날을 아는 교체보다 실패가 적을 수 없다 (무작위 접근열 300개)
    rng = random.Random(1)
    for _ in range(300):
        s = [rng.randrange(6) for _ in range(30)]
        best = opt_misses(s, 3)
        assert best <= misses(s, 3, "lru") and best <= misses(s, 3, "fifo") and best <= misses(s, 3, "random", 5)

    # LRU가 늘 이기지는 않는다: way 4개, 블록 1 2 3 1 4 1 5 2 1 3 1 4
    seq2 = [1, 2, 3, 1, 4, 1, 5, 2, 1, 3, 1, 4]
    assert (misses(seq2, 4, "lru"), misses(seq2, 4, "fifo"), opt_misses(seq2, 4)) == (8, 6, 6)

    # LRU가 가장 못하는 접근열: way보다 하나 많은 블록을 차례로 돈다
    cyc = [0, 1, 2, 3, 4] * 40
    assert misses(cyc, 4, "lru") == 200 and misses(cyc, 4, "fifo") == 200
    rate = sum(misses(cyc, 4, "random", s) for s in range(500)) / 500 / 200
    assert 0.39 < rate < 0.44          # 무작위는 약 41%만 실패
    assert opt_misses(cyc, 4) == 53

    # LRU 순서를 적는 데 드는 비트: way N개의 순서는 N!가지 -> ceil(log2 N!)비트
    assert [math.ceil(math.log2(math.factorial(n))) for n in (2, 4, 8, 16)] == [1, 5, 16, 45]
    # 2-way는 집합마다 1비트면 정확한 LRU가 된다
    for s in range(200):
        rng = random.Random(s)
        blocks = [rng.randrange(5) for _ in range(60)]
        assert one_bit_lru(blocks) == run([b * 4 for b in blocks], 1, 2, 4, "lru")[0]

    # 카드 C2: way 2개, 블록 4 8 4 6 8 4
    c = Cache(1, 2, 4, "lru")
    rows = [c.access(b * 4) for b in (4, 8, 4, 6, 8, 4)]
    assert [r[0] for r in rows] == [False, False, True, False, False, False]
    assert [r[4] for r in rows] == [None, None, None, 8, 4, 6]
    assert misses([4, 8, 4, 6, 8, 4], 2, "fifo") == 4
    c = Cache(1, 2, 4, "fifo")
    assert [c.access(b * 4)[0] for b in (4, 8, 4, 6, 8, 4)] == [False, False, True, False, True, False]
    print("ALL CHECKS PASSED")
```
{% endraw %}
