---
layout: "note"
title: "39_page-table_verify.py"
display_title: "39_page-table_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "39"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/page-table-structure/"
parent_title: "페이지 표 구조"
description: "운영체제 · 페이지 표 구조 검증 코드"
permalink: "/studies/operating-systems/code/39_page-table_verify/"
---
{% raw %}
[페이지 표 구조](/Hongs_Blog/studies/operating-systems/page-table-structure/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""페이지 표 크기 계산 (Stallings 그림 8.4의 2단계 페이지 표, 역 페이지 표)."""
KB, MB, GB = 2 ** 10, 2 ** 20, 2 ** 30

if __name__ == "__main__":
    # 32비트 주소 공간 4GB, 페이지 4KB, 페이지 표 항목 4바이트
    pages = 4 * GB // (4 * KB)
    assert pages == 2 ** 20                      # 페이지 약 100만 개
    user_pt = pages * 4
    assert user_pt == 4 * MB                     # 사용자 페이지 표 4MB = 페이지 1024장
    root = (user_pt // (4 * KB)) * 4
    assert root == 4 * KB                        # 루트 페이지 표 4KB (항목 1024개)
    # 주소 32비트 = 루트 색인 10 + 2단계 색인 10 + 오프셋 12
    assert 10 + 10 + 12 == 32
    v = 0x00403ABC
    assert (v >> 22, (v >> 12) & 0x3FF, v & 0xFFF) == (1, 3, 0xABC)
    # 역 페이지 표: 실제 메모리 프레임마다 항목 하나. 메모리 1GB, 4KB 프레임이면 2^18 항목
    assert GB // (4 * KB) == 2 ** 18
    # 카드 C3: 64비트 주소의 1단계 표라면 2^52 항목 x 8바이트
    assert 2 ** 52 * 8 == 2 ** 55 and 2 ** 55 // (2 ** 50) == 32       # 32 PB
    print("ALL CHECKS PASSED")
```
{% endraw %}
