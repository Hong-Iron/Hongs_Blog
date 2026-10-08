---
layout: "note"
title: "35_buddy-system_impl.py"
display_title: "35_buddy-system_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "35"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/buddy-system/"
parent_title: "버디 시스템"
description: "운영체제 · 버디 시스템 구현 코드"
permalink: "/studies/operating-systems/code/35_buddy-system_impl/"
---
{% raw %}
[버디 시스템](/Hongs_Blog/studies/operating-systems/buddy-system/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""버디 시스템(Stallings 7.2절, 그림 7.6). 크기는 KB 단위, 전체 1024K(1M).
요청은 2의 거듭제곱으로 올림한 크기의 블록에 들어간다. 큰 블록을 반으로 쪼개 '짝(buddy)'을 만들고,
풀려난 블록의 짝도 비어 있으면 다시 합친다."""


class Buddy:
    def __init__(self, total=1024, smallest=1):
        self.total, self.smallest = total, smallest
        self.free = {total: [0]}          # 크기 -> 빈 블록 시작 주소 목록
        self.used = {}                    # 이름 -> (시작, 크기)

    @staticmethod
    def round_up(n):
        k = 1
        while k < n:
            k *= 2
        return k

    def alloc(self, name, req):
        size = max(self.round_up(req), self.smallest)
        s = size
        while s <= self.total and not self.free.get(s):
            s *= 2                        # 맞는 크기가 없으면 더 큰 빈 블록을 찾는다
        if s > self.total:
            raise MemoryError(name)
        start = min(self.free[s]); self.free[s].remove(start)
        while s > size:                   # 반으로 쪼개 뒤쪽 반은 빈 목록에 넣는다
            s //= 2
            self.free.setdefault(s, []).append(start + s)
        self.used[name] = (start, size)
        return start, size

    def release(self, name):
        start, size = self.used.pop(name)
        while size < self.total:
            buddy = start ^ size          # 짝의 시작 주소: 크기 자리 비트만 다르다
            if buddy in self.free.get(size, []):
                self.free[size].remove(buddy)
                start, size = min(start, buddy), size * 2
            else:
                break
        self.free.setdefault(size, []).append(start)

    def layout(self):
        blocks = [(s, sz, n) for n, (s, sz) in self.used.items()]
        blocks += [(s, sz, "-") for sz, ss in self.free.items() for s in ss]
        return [(n, sz) for s, sz, n in sorted(blocks)]


if __name__ == "__main__":
    b = Buddy()
    b.alloc("A", 100)
    assert b.layout() == [("A", 128), ("-", 128), ("-", 256), ("-", 512)]
    b.alloc("B", 240)
    assert b.layout() == [("A", 128), ("-", 128), ("B", 256), ("-", 512)]
    b.alloc("C", 64)
    assert b.layout() == [("A", 128), ("C", 64), ("-", 64), ("B", 256), ("-", 512)]
    b.alloc("D", 256)
    assert b.layout() == [("A", 128), ("C", 64), ("-", 64), ("B", 256), ("D", 256), ("-", 256)]
    b.release("B")
    b.release("A")
    assert b.layout() == [("-", 128), ("C", 64), ("-", 64), ("-", 256), ("D", 256), ("-", 256)]
    b.alloc("E", 75)
    assert b.layout() == [("E", 128), ("C", 64), ("-", 64), ("-", 256), ("D", 256), ("-", 256)]
    b.release("C")
    assert b.layout() == [("E", 128), ("-", 128), ("-", 256), ("D", 256), ("-", 256)]
    b.release("E")
    assert b.layout() == [("-", 512), ("D", 256), ("-", 256)]
    b.release("D")
    assert b.layout() == [("-", 1024)]
    # 내부 단편화: A(100K)는 128K를 받아 28K가 남는다
    assert Buddy.round_up(100) - 100 == 28

    # 카드 C2: 1024K에서 70K, 35K, 80K 차례로
    c = Buddy()
    c.alloc("P", 70); c.alloc("Q", 35); c.alloc("R", 80)
    print(c.layout())
    assert c.layout() == [("P", 128), ("Q", 64), ("-", 64), ("R", 128), ("-", 128), ("-", 512)]
    assert (128 - 70) + (64 - 35) + (128 - 80) == 135
    print("ALL CHECKS PASSED")
```
{% endraw %}
