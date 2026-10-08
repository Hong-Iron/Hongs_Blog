---
layout: "note"
title: "38_virtual-memory_verify.py"
display_title: "38_virtual-memory_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "38"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/virtual-memory/"
parent_title: "가상 메모리"
description: "운영체제 · 가상 메모리 검증 코드"
permalink: "/studies/operating-systems/code/38_virtual-memory_verify/"
---
{% raw %}
[가상 메모리](/Hongs_Blog/studies/operating-systems/virtual-memory/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""페이징에서 가상 주소를 (페이지 번호, 오프셋)으로 나누고 실제 주소로 바꾸는 계산을 확인한다."""


def split(vaddr, page_size):
    return divmod(vaddr, page_size)           # (페이지 번호, 페이지 안 위치)


def translate(vaddr, page_size, page_table):
    page, offset = split(vaddr, page_size)
    if page not in page_table:
        raise LookupError(f"{page}번 페이지가 메모리에 없다 (디스크에서 가져와야 함)")
    return page_table[page] * page_size + offset


if __name__ == "__main__":
    # 본문 예: 페이지 1,024워드, 가상 주소 3,000, 2번 페이지가 실제 7번 칸
    assert split(3000, 1024) == (2, 952)
    assert translate(3000, 1024, {2: 7}) == 8120
    # 카드 C1: 페이지 512워드, 가상 주소 1,300, 2번 페이지가 실제 4번 칸
    assert split(1300, 512) == (2, 276)
    assert translate(1300, 512, {2: 4}) == 2324
    # 없는 페이지는 실패해야 한다
    try:
        translate(5000, 1024, {2: 7})
        raise AssertionError("없는 페이지인데 통과함")
    except LookupError:
        pass
    print("ALL CHECKS PASSED")
```
{% endraw %}
