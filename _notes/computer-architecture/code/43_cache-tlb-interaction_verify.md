---
layout: "note"
title: "43_cache-tlb-interaction_verify.py"
display_title: "43_cache-tlb-interaction_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "43"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/cache-tlb-interaction/"
parent_title: "캐시와 TLB와 페이지 테이블의 상호작용"
description: "컴퓨터 구조 · 캐시와 TLB와 페이지 테이블의 상호작용 검증 코드"
permalink: "/studies/computer-architecture/code/43_cache-tlb-interaction_verify/"
---
{% raw %}
[캐시와 TLB와 페이지 테이블의 상호작용](/Hongs_Blog/studies/computer-architecture/cache-tlb-interaction/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""캐시·TLB·페이지 표: 한 번의 접근이 거치는 길, 일어날 수 없는 조합, 동시에 찾기 조건을 확인한다.

실행: python3 43_cache-tlb-interaction_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


class System:
    """가상 주소 16비트, 페이지 256바이트(오프셋 8비트), 물리 주소 12비트(프레임 16개).
    TLB: 완전 연관 tlb_size칸, LRU.  캐시: 물리 주소로 찾는 직접 사상, 8줄 x 16바이트."""

    def __init__(self, page_table, on_disk, free_frames, tlb_size=2):
        self.pt = dict(page_table)      # 가상 페이지 번호 -> 프레임 번호 (메모리에 있는 것만)
        self.disk = set(on_disk)        # 디스크에 있는 가상 페이지
        self.free = list(free_frames)
        self.tlb = []                   # [(vpn, ppn)] 오래 안 쓴 순
        self.tlb_size = tlb_size
        self.cache = Cache(8, 1, 16)

    def access(self, va):
        vpn, off = va >> 8, va & 0xFF
        fault = False
        ent = next((e for e in self.tlb if e[0] == vpn), None)
        tlb_hit = ent is not None
        if tlb_hit:
            self.tlb.remove(ent)
        else:
            if vpn not in self.pt:              # 페이지 부재: 운영체제가 디스크에서 올린다
                fault = True
                assert vpn in self.disk, "잘못된 주소"
                self.disk.discard(vpn)
                self.pt[vpn] = self.free.pop(0)
            ent = (vpn, self.pt[vpn])
            if len(self.tlb) >= self.tlb_size:
                self.tlb.pop(0)
        self.tlb.append(ent)
        pa = (ent[1] << 8) | off
        cache_hit, tag, index, offset, _ = self.cache.access(pa)
        return dict(va=va, vpn=vpn, tlb=tlb_hit, fault=fault, pa=pa,
                    tag=tag, index=index, cache=cache_hit)

    def page_out(self, vpn):
        """페이지를 디스크로 내보낸다. TLB 항목과 그 프레임의 캐시 블록도 함께 지운다."""
        ppn = self.pt.pop(vpn)
        self.disk.add(vpn)
        self.free.append(ppn)
        self.tlb = [e for e in self.tlb if e[0] != vpn]
        for index, lines in enumerate(self.cache.sets):
            for l in list(lines):
                base = ((l["tag"] << 3) | index) << 4      # 이 줄에 든 블록의 물리 주소
                if base >> 8 == ppn:
                    lines.remove(l)


def vipt_ok(cache_bytes, ways, block_bytes, page_bytes):
    """캐시 줄 찾기(인덱스 + 오프셋)가 페이지 안 위치 비트만으로 되는가."""
    sets = cache_bytes // ways // block_bytes
    return int(math.log2(sets)) + int(math.log2(block_bytes)) <= int(math.log2(page_bytes))


if __name__ == "__main__":
    # 예시로 보기 ---------------------------------------------------------------
    # 페이지 표: 0x12 -> 프레임 5, 0x2A -> 3, 0x7C -> 9.  페이지 0x44는 디스크에 있다. TLB는 2칸.
    s = System({0x12: 0x5, 0x2A: 0x3, 0x7C: 0x9}, {0x44}, [0x7, 0x8], tlb_size=2)
    trace = [0x1234, 0x1238, 0x2A10, 0x1230, 0x4400, 0x7C50, 0x1234, 0x4404]
    rows = [s.access(va) for va in trace]
    assert [r["pa"] for r in rows] == [0x534, 0x538, 0x310, 0x530, 0x700, 0x950, 0x534, 0x704]
    assert [r["tlb"] for r in rows] == [False, True, False, True, False, False, False, False]
    assert [r["fault"] for r in rows] == [False, False, False, False, True, False, False, False]
    assert [r["cache"] for r in rows] == [False, True, False, True, False, False, True, True]
    assert [(r["tag"], r["index"]) for r in rows] == [(10, 3), (10, 3), (6, 1), (10, 3), (14, 0), (18, 5), (10, 3), (14, 0)]
    # 물리 주소 12비트 = 태그 5 + 인덱스 3 + 오프셋 4
    assert field_bits(12, 16, 8) == (5, 3, 4)
    assert split_address(0x534, 16, 8) == (10, 3, 4)

    # 일어날 수 없는 조합 -------------------------------------------------------
    # 무작위로 2만 번 접근하고, 가끔 페이지를 디스크로 내보낸다.
    rng = random.Random(3)
    s = System({v: v for v in range(4)}, set(range(4, 12)), list(range(4, 16)), tlb_size=3)
    seen = set()
    for _ in range(20000):
        if rng.random() < 0.05 and len(s.pt) > 2:
            s.page_out(rng.choice(sorted(s.pt)))
        v = rng.choice(sorted(s.pt) + sorted(s.disk))
        r = s.access((v << 8) | rng.randrange(0, 256, 4))
        seen.add((r["tlb"], r["fault"], r["cache"]))
        # 변환 결과는 늘 페이지 표와 같다
        assert r["pa"] >> 8 == s.pt[v]
    # (TLB 적중, 페이지 부재, 캐시 적중) 여덟 가지 중 다섯 가지만 나온다
    assert seen == {(True, False, True), (True, False, False), (False, False, True),
                    (False, False, False), (False, True, False)}
    assert (True, True, True) not in seen and (True, True, False) not in seen and (False, True, True) not in seen

    # 변환과 캐시 찾기를 동시에 하려면: 캐시 크기 / way 수 <= 페이지 크기
    assert vipt_ok(32 * 1024, 8, 64, 4096) is True       # 64집합: 6 + 6 = 12비트
    assert vipt_ok(32 * 1024, 4, 64, 4096) is False      # 128집합: 7 + 6 = 13비트
    assert vipt_ok(16 * 1024, 4, 64, 4096) is True
    for cache, ways, blk, page in ((32768, 8, 64, 4096), (32768, 4, 64, 4096), (65536, 4, 64, 16384), (8192, 1, 32, 4096)):
        assert vipt_ok(cache, ways, blk, page) == (cache // ways <= page)

    # 시간 계산 (사이클): TLB 1, 캐시 1, 메모리 100
    best = 1 + 1                                   # TLB 적중, 캐시 적중
    tlb_miss_cache_hit = 1 + 100 + 1               # 페이지 표를 메모리에서 읽는다
    both_miss = 1 + 100 + 1 + 100
    assert (best, tlb_miss_cache_hit, both_miss) == (2, 102, 202)
    # 카드 C3: 가상 주소 0x2A1C
    s = System({0x12: 0x5, 0x2A: 0x3, 0x7C: 0x9}, {0x44}, [0x7, 0x8], tlb_size=2)
    r = s.access(0x2A1C)
    assert (r["vpn"], r["pa"], r["tag"], r["index"]) == (0x2A, 0x31C, 6, 1)
    assert split_address(0x31C, 16, 8) == (6, 1, 12)
    print("ALL CHECKS PASSED")
```
{% endraw %}
