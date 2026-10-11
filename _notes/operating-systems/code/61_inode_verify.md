---
layout: "note"
title: "61_inode_verify.py"
display_title: "61_inode_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "61"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/unix-inode/"
parent_title: "UNIX 아이노드"
description: "운영체제 · UNIX 아이노드 검증 코드"
permalink: "/studies/operating-systems/code/61_inode_verify/"
---
{% raw %}
[UNIX 아이노드](/Hongs_Blog/studies/operating-systems/unix-inode/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""UNIX 아이노드의 직접·간접 포인터로 담을 수 있는 최대 파일 크기 (Stallings 12.7절, FreeBSD).
블록 B바이트, 포인터 p바이트 -> 블록 하나에 포인터 B/p개."""


def capacity(B, p, direct=12):
    n = B // p
    return {"direct": direct * B, "single": n * B, "double": n ** 2 * B, "triple": n ** 3 * B}


if __name__ == "__main__":
    KB, MB, GB = 2 ** 10, 2 ** 20, 2 ** 30
    c = capacity(4 * KB, 8)                       # 포인터 512개
    assert c == {"direct": 48 * KB, "single": 2 * MB, "double": 1 * GB, "triple": 512 * GB}
    total = sum(c.values())
    print("최대 크기", total / GB, "GB")
    assert 512 * GB < total < 514 * GB
    # 카드: 블록 1 KB, 포인터 4바이트, 직접 10개 -> 10K + 256K + 64M + 16G
    c2 = capacity(1 * KB, 4, direct=10)
    assert c2 == {"direct": 10 * KB, "single": 256 * KB, "double": 64 * MB, "triple": 16 * GB}
    # 파일의 5,000번째 블록(0부터)은 어디서 찾나 (4KB, 포인터 512개, 직접 12개)
    k = 5000
    assert 12 + 512 <= k < 12 + 512 + 512 ** 2       # 이중 간접
    # 사다리 문제 3: 블록 2 KB, 포인터 4바이트 -> 512개, 10 MB = 5,120블록 -> 이중 간접
    n = 2048 // 4
    assert n == 512 and 12 + n <= (10 * MB) // (2 * KB) < 12 + n + n ** 2
    print("ALL CHECKS PASSED")
```
{% endraw %}
