---
layout: "note"
title: "39_cache-write-policy_verify.py"
display_title: "39_cache-write-policy_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "39"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/cache-write-policy/"
parent_title: "캐시 쓰기 정책"
description: "컴퓨터 구조 · 캐시 쓰기 정책 검증 코드"
permalink: "/studies/computer-architecture/code/39_cache-write-policy_verify/"
---
{% raw %}
[캐시 쓰기 정책](/Hongs_Blog/studies/computer-architecture/cache-write-policy/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""캐시 쓰기 정책: write-through와 write-back의 아래층 쓰기 횟수, 낡은 값, 쓰기 버퍼의 멈춤 사이클을 확인한다.

실행: python3 39_cache-write-policy_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def program(write, write_allocate=True):
    """for i in 0..7: a[i] = i; count = i + 1   (a는 0x100부터, count는 0x220)"""
    c = Cache(4, 1, 16, write=write, write_allocate=write_allocate)
    for i in range(8):
        c.access(0x100 + 4 * i, True, i)
        c.access(0x220, True, i + 1)
    return c


def write_buffer_stall(arrivals, depth, write_time):
    """저장 명령이 arrivals 시각(사이클)에 온다. 쓰기 버퍼는 depth칸이고,
    메모리는 한 번에 하나씩 write_time 사이클에 걸쳐 쓴다. 프로세서가 멈춘 사이클의 합.
    depth = 0이면 버퍼가 없어 쓰기가 끝날 때까지 기다린다."""
    stall, shift, done = 0, 0, []
    for t in arrivals:
        t += shift                              # 앞에서 멈춘 만큼 뒤 명령도 밀린다
        pending = sorted(d for d in done if d > t)
        if depth == 0:
            stall += write_time
            shift += write_time
            done.append(t + write_time)
            continue
        if len(pending) >= depth:               # 버퍼가 꽉 참: 한 칸 빌 때까지 멈춘다
            wait = pending[len(pending) - depth] - t
            stall += wait
            shift += wait
            t += wait
        done.append(max([t] + done) + write_time)
    return stall


if __name__ == "__main__":
    # 세 블록이 서로 다른 줄에 들어간다
    assert [split_address(a, 16, 4)[1] for a in (0x100, 0x110, 0x220)] == [0, 1, 2]
    final = [0, 1, 2, 3, 4, 5, 6, 7]

    wt = program("through")
    assert (wt.mem_writes, wt.misses, wt.block_reads) == (16, 3, 3)
    assert wt.memory[0x220] == 8                # 메모리가 늘 최신

    wb = program("back")
    assert (wb.mem_writes, wb.misses, wb.block_reads) == (0, 3, 3)
    assert wb.memory.get(0x220, 0) == 0         # 메모리에는 낡은 값
    assert wb.read(0x220) == 8                  # 캐시에는 새 값
    assert sum(l["dirty"] for s in wb.sets for l in s) == 3
    wb.flush()
    assert wb.mem_writes == 3 and wb.memory[0x220] == 8
    assert [wb.memory[0x100 + 4 * i] for i in range(8)] == final
    assert [wt.memory[0x100 + 4 * i] for i in range(8)] == final

    # 쓰기 실패 때 블록을 안 가져오는 방식(write-through와 짝)
    na = program("through", write_allocate=False)
    assert (na.mem_writes, na.misses, na.block_reads) == (16, 16, 0)
    assert [na.memory[0x100 + 4 * i] for i in range(8)] == final and na.memory[0x220] == 8

    # 더티 블록은 쫓겨날 때 되써진다
    c = Cache(4, 1, 16, write="back")
    c.access(0x100, True, 7)
    assert c.memory.get(0x100, 0) == 0 and c.mem_writes == 0
    assert split_address(0x300, 16, 4)[1] == 0          # 0x100과 같은 줄
    c.access(0x300)
    assert c.memory[0x100] == 7 and c.mem_writes == 1
    # 읽기만 한 블록은 쫓겨나도 되쓰지 않는다
    c = Cache(4, 1, 16, write="back")
    c.access(0x100)
    c.access(0x300)
    assert c.mem_writes == 0

    # 어느 정책이든, 끝에 다 되쓰고 나면 메모리 내용이 같다 (무작위 읽기·쓰기 300회 x 50번)
    for seed in range(50):
        rng = random.Random(seed)
        ops = [(rng.randrange(0, 512, 4), rng.random() < 0.5, rng.randrange(1, 100)) for _ in range(300)]
        mems = []
        for write, alloc in (("through", True), ("back", True), ("through", False)):
            c = Cache(4, 2, 16, write=write, write_allocate=alloc)
            truth = {}
            for a, w, v in ops:
                if w:
                    c.access(a, True, v)
                    truth[a] = v
                else:
                    assert c.read(a) == truth.get(a, 0)
            c.flush()
            assert {k: v for k, v in c.memory.items() if v} == {k: v for k, v in truth.items() if v}
            mems.append(c.mem_writes)
        assert mems[1] <= mems[0]               # write-back이 아래층 쓰기가 적거나 같다

    # 쓰기 버퍼: 메모리 쓰기 10사이클
    burst = [0, 2, 4, 6, 100, 102, 104, 106]    # 저장 4개가 몰려 오고, 한참 쉬었다 또 4개
    assert [write_buffer_stall(burst, d, 10) for d in (0, 1, 2, 4)] == [80, 48, 28, 0]
    steady = [5 * i for i in range(40)]         # 5사이클마다 저장: 메모리가 빼는 속도의 두 배
    assert [write_buffer_stall(steady, d, 10) for d in (0, 1, 4, 8)] == [400, 195, 165, 125]
    # 카드 C3: 저장 6개가 3사이클 간격, 버퍼 2칸, 쓰기 8사이클
    assert write_buffer_stall([0, 3, 6, 9, 12, 15], 2, 8) == 17
    assert write_buffer_stall([0, 3, 6, 9, 12, 15], 0, 8) == 48
    print("ALL CHECKS PASSED")
```
{% endraw %}
