---
layout: "note"
title: "48_fat-file-system_verify.py"
display_title: "48_fat-file-system_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "48"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/fat-file-system/"
parent_title: "클러스터와 FAT"
description: "어셈블리어 · 클러스터와 FAT 검증 코드"
permalink: "/studies/assembly-language/code/48_fat-file-system_verify/"
---
{% raw %}
[클러스터와 FAT](/Hongs_Blog/studies/assembly-language/fat-file-system/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 48.클러스터와 FAT 문서의 계산 확인. 실행: python3 48_fat-file-system_verify.py
# 16비트 MS-DOS 디스크를 실제로 읽지 않는다. 슬라이드 그림의 숫자만 파이썬으로 다시 센다.
# 클러스터 번호는 슬라이드 그림대로 1부터 센다.
import math

EOF_MARK = "eof"


def clusters_needed(file_bytes, cluster_bytes):
    """파일이 차지하는 클러스터 수. 0바이트여도 슬라이드 규칙대로 최소 1개."""
    return max(1, math.ceil(file_bytes / cluster_bytes))


def wasted(file_bytes, cluster_bytes):
    return clusters_needed(file_bytes, cluster_bytes) * cluster_bytes - file_bytes


def follow_chain(fat, start):
    """FAT 칸에 적힌 '다음 클러스터 번호'를 eof가 나올 때까지 따라간다."""
    chain, cur, seen = [], start, set()
    while True:
        assert cur not in seen, "사슬이 돈다"
        seen.add(cur)
        chain.append(cur)
        nxt = fat[cur]
        if nxt == EOF_MARK:
            return chain
        cur = nxt


if __name__ == "__main__":
    # wk12 p.11: 8,200바이트 파일, 4K 클러스터
    assert clusters_needed(8200, 4096) == 3
    assert 8200 - 2 * 4096 == 8
    assert wasted(8200, 4096) == 4088
    # 경계: 딱 맞는 크기, 1바이트
    assert clusters_needed(8192, 4096) == 2 and wasted(8192, 4096) == 0
    assert clusters_needed(1, 4096) == 1 and wasted(1, 4096) == 4095
    # wk12 p.10: 섹터 4개가 클러스터 하나. 섹터 512바이트라면 2,048바이트
    assert 4 * 512 == 2048

    # wk12 p.14 그림: File1 (시작 1, 7개), File2 (시작 5, 5개)
    fat1 = {1: 2, 2: 3, 3: 4, 4: 8, 8: 9, 9: 10, 10: EOF_MARK}
    fat2 = {5: 6, 6: 7, 7: 11, 11: 12, 12: EOF_MARK}
    c1 = follow_chain(fat1, 1)
    c2 = follow_chain(fat2, 5)
    assert c1 == [1, 2, 3, 4, 8, 9, 10] and len(c1) == 7
    assert c2 == [5, 6, 7, 11, 12] and len(c2) == 5
    # 두 파일은 한 표를 같이 쓴다. 칸이 겹치지 않는다.
    assert not set(c1) & set(c2)
    fat = {**fat1, **fat2}
    assert follow_chain(fat, 1) == c1 and follow_chain(fat, 5) == c2
    # 16칸 가운데 빈 칸
    free = [n for n in range(1, 17) if n not in fat]
    assert free == [13, 14, 15, 16]
    # File1의 다섯 번째 클러스터는 사슬을 4번 따라가야 나온다
    assert c1[4] == 8

    # FAT-12/16/32: 칸 하나가 n비트면 적을 수 있는 번호는 2^n가지
    assert (2 ** 12, 2 ** 16, 2 ** 32) == (4096, 65536, 4294967296)

    # 카드 C2: 10,000바이트 파일, 4K 클러스터
    assert clusters_needed(10000, 4096) == 3 and wasted(10000, 4096) == 2288
    # 카드 C3: File2의 네 번째 클러스터
    assert c2[3] == 11
    print("ALL CHECKS PASSED")
```
{% endraw %}
