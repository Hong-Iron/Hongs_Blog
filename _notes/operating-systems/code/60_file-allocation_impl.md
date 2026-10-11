---
layout: "note"
title: "60_file-allocation_impl.py"
display_title: "60_file-allocation_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "60"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/file-allocation/"
parent_title: "파일 할당"
description: "운영체제 · 파일 할당 구현 코드"
permalink: "/studies/operating-systems/code/60_file-allocation_impl/"
---
{% raw %}
[파일 할당](/Hongs_Blog/studies/operating-systems/file-allocation/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""파일 할당 세 방식(연속, 연결, 색인)과 비트 표 (Stallings 12.6절).
블록 k번째에 접근할 때 디스크를 몇 번 읽는지 센다(파일 할당 표는 메모리에 있다고 가정)."""


class Disk:
    def __init__(self, n):
        self.bits = [0] * n                  # 비트 표: 0 = 빈 블록, 1 = 사용 중

    def free_runs(self):
        runs, i = [], 0
        while i < len(self.bits):
            if self.bits[i] == 0:
                j = i
                while j < len(self.bits) and self.bits[j] == 0:
                    j += 1
                runs.append((i, j - i)); i = j
            else:
                i += 1
        return runs

    def contiguous(self, size):
        for start, length in self.free_runs():
            if length >= size:               # 최초 적합
                for b in range(start, start + size):
                    self.bits[b] = 1
                return (start, size)
        return None                          # 빈 블록 합은 충분해도 연속 구간이 없으면 실패

    def blocks(self, size):
        got = [i for i, b in enumerate(self.bits) if b == 0][:size]
        if len(got) < size:
            return None
        for b in got:
            self.bits[b] = 1
        return got


def reads_to_access(method, k):
    """파일의 k번째(0부터) 블록을 읽는 데 필요한 디스크 읽기 수."""
    if method == "contiguous":
        return 1                             # 시작 + k를 계산해 바로 읽음
    if method == "chained":
        return k + 1                         # 앞 블록의 포인터를 차례로 따라감
    if method == "indexed":
        return 2                             # 색인 블록 1번 + 데이터 블록 1번


if __name__ == "__main__":
    d = Disk(16)
    for b in [2, 3, 7, 11, 12]:
        d.bits[b] = 1
    assert d.free_runs() == [(0, 2), (4, 3), (8, 3), (13, 3)]
    # 빈 블록은 11개지만 4블록짜리 연속 구간은 없다 -> 외부 단편화
    assert sum(1 for b in d.bits if b == 0) == 11 and d.contiguous(4) is None
    # 연결·색인 할당은 흩어진 블록으로도 4블록 파일을 만든다
    assert d.blocks(4) == [0, 1, 4, 5]
    assert reads_to_access("contiguous", 99) == 1 and reads_to_access("chained", 99) == 100 and reads_to_access("indexed", 99) == 2
    # 비트 표 크기: 블록 2^20개면 2^20 비트 = 128 KB
    assert 2 ** 20 // 8 == 128 * 1024
    # 카드 C3: 디스크 1 TB, 블록 4 KB -> 2^28 블록, 비트 표 32 MB
    assert (2 ** 40 // 2 ** 12) == 2 ** 28 and 2 ** 28 // 8 == 32 * 2 ** 20
    # 카드 C4·사다리 4: 새 디스크에서 최초 적합 3블록 두 개 -> 4~6, 8~10
    d2 = Disk(16)
    for b in [2, 3, 7, 11, 12]:
        d2.bits[b] = 1
    assert "".join(map(str, d2.bits)) == "0011000100011000"
    assert d2.contiguous(3) == (4, 3) and d2.contiguous(3) == (8, 3)
    assert "".join(map(str, d2.bits)) == "0011111111111000"
    assert (2 ** 39 // 2 ** 12) // 8 == 16 * 2 ** 20      # 512 GB -> 16 MB
    print("ALL CHECKS PASSED")
```
{% endraw %}
