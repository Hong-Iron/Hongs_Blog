---
layout: "note"
title: "41_cache-performance-amat_verify.py"
display_title: "41_cache-performance-amat_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "41"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/cache-performance-amat/"
parent_title: "캐시 성능과 평균 접근 시간"
description: "컴퓨터 구조 · 캐시 성능과 평균 접근 시간 검증 코드"
permalink: "/studies/computer-architecture/code/41_cache-performance-amat_verify/"
---
{% raw %}
[캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""캐시 성능: 평균 접근 시간, CPI에 미치는 영향, 세 가지 실패 가르기를 확인한다.

실행: python3 41_cache-performance-amat_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def amat(hit_time, miss_rate, miss_penalty):
    return hit_time + miss_rate * miss_penalty


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


def close(a, b):
    return abs(a - b) < 1e-9


if __name__ == "__main__":
    # 예시로 보기: 적중 1사이클, 실패율 4%, 실패 손실 80사이클
    assert close(amat(1, 0.04, 80), 4.2)
    # 식이 "적중이면 적중 시간, 실패면 적중 시간 + 손실"의 평균과 같다
    for h, m, p in ((1, 0.04, 80), (2, 0.1, 50), (1.2, 0.035, 20)):
        assert close((1 - m) * h + m * (h + p), amat(h, m, p))
    # 흉내기로 잰 평균과도 같다: 접근마다 1사이클, 실패하면 80사이클 더
    tm = mixed_trace()
    _, c = run(tm, 16, 1, 16)
    measured = (len(tm) * 1 + c.misses * 80) / len(tm)
    assert close(measured, amat(1, c.miss_rate(), 80))

    # 오해 항목: 적중률 99%와 97% (손실 100사이클)
    assert close(amat(1, 0.01, 100), 2.0) and close(amat(1, 0.03, 100), 4.0)

    # CPI에 미치는 영향: 기본 CPI 1.5, 명령어 캐시 실패율 1.5%, 데이터 캐시 실패율 5%,
    # 명령어의 30%가 메모리를 읽거나 쓴다, 실패 손실 120사이클
    i_stall = 0.015 * 120
    d_stall = 0.30 * 0.05 * 120
    assert close(i_stall, 1.8) and close(d_stall, 1.8)
    cpi = 1.5 + i_stall + d_stall
    assert close(cpi, 5.1) and close(cpi / 1.5, 3.4)
    # 프로세서만 두 배 빠르게(기본 CPI 0.75) 해도 전체는 1.17배뿐
    assert round(5.1 / (0.75 + 3.6), 2) == 1.17

    # 적중 시간과 실패율 맞바꾸기 (시간 단위 ns, 손실 20 ns)
    assert close(amat(1.0, 0.05, 20), 2.0) and close(amat(1.2, 0.035, 20), 1.9)
    # 손실이 5 ns로 작으면 순서가 뒤집힌다
    assert close(amat(1.0, 0.05, 5), 1.25) and close(amat(1.2, 0.035, 5), 1.375)

    # 세 가지 실패 가르기 -----------------------------------------------------
    # 직접 사상 문서의 접근열 (8줄, 블록 4바이트)
    assert classify_misses([20, 22, 24, 84, 21, 48, 50, 84, 26, 20], 8, 1, 4) == (4, 0, 3, 7)
    # 섞인 접근열 4096번, 데이터 256바이트 직접 사상
    assert classify_misses(tm, 8, 1, 32) == (256, 0, 557, 813)
    assert classify_misses(tm, 4, 1, 64) == (128, 1988, 506, 2622)
    # 같은 크기에서 2-way, 4-way로 바꾸면 충돌 실패만 준다
    assert classify_misses(tm, 4, 2, 32) == (256, 0, 0, 256)
    assert classify_misses(tm, 2, 4, 32) == (256, 0, 0, 256)
    # 캐시를 512바이트로 키우면(16줄) 충돌이 줄지만 남는다
    assert classify_misses(tm, 16, 1, 32) == (256, 0, 269, 525)
    # 세 값의 합은 늘 실제 실패 수
    for ns, w, bb in ((8, 1, 32), (4, 1, 64), (4, 2, 32), (16, 1, 32), (2, 1, 128)):
        a, b, c, total = classify_misses(tm, ns, w, bb)
        assert a + b + c == total == run(tm, ns, w, bb)[1].misses
    # 강제 실패 = 처음 건드린 블록 수 = 아무것도 쫓아내지 않는 아주 큰 캐시의 실패 수
    for bb in (4, 16, 32, 64):
        comp = classify_misses(tm, 4, 1, bb)[0]
        assert comp == len({a // bb for a in tm}) == run(tm, 1, 1 << 16, bb)[1].misses
    # 충돌 실패가 음수로 나오는 예: 블록 9개를 차례로 도는 접근, 8줄
    nine = [b * 4 for b in range(9)] * 20
    assert classify_misses(nine, 8, 1, 4) == (9, 171, -133, 47)

    # 카드 C2
    assert close(amat(2, 0.05, 60), 5.0) and close(amat(2, 0.025, 60), 3.5)
    # 카드 C4: 기본 CPI 2, 실패율 명령어 2%, 데이터 4%, 메모리 명령 25%, 손실 100
    assert close(2 + 0.02 * 100 + 0.25 * 0.04 * 100, 5.0)
    assert 100 * 1 + 4 * 80 == 420 and round(320 / 420, 2) == 0.76   # 실패 4번이 전체 시간의 약 4분의 3
    assert close(0.95 * 2 + 0.05 * 60, 4.9)                          # C2의 흔한 오답
    print("ALL CHECKS PASSED")
```
{% endraw %}
