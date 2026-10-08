---
layout: "note"
title: "59_record-blocking_verify.py"
display_title: "59_record-blocking_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "59"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/record-blocking/"
parent_title: "레코드 블로킹"
description: "운영체제 · 레코드 블로킹 검증 코드"
permalink: "/studies/operating-systems/code/59_record-blocking_verify/"
---
{% raw %}
[레코드 블로킹](/Hongs_Blog/studies/operating-systems/record-blocking/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""레코드 블로킹 (Stallings 12.6절). 블록 B바이트, 레코드 R바이트.
고정 블로킹: 블록당 레코드 floor(B/R)개, 블록 끝에 B mod R바이트 낭비.
가변·걸치기(spanned): 낭비 없이 채우고 남는 부분은 다음 블록으로 넘긴다.
가변·안 걸치기(unspanned): 다음 레코드가 남은 공간보다 크면 그 공간을 버린다."""


def fixed(B, R, n):
    bf = B // R
    blocks = -(-n // bf)
    return bf, blocks, B - bf * R          # 블록당 레코드, 필요한 블록 수, 블록당 낭비


def spanned(B, sizes):
    return -(-sum(sizes) // B)


def unspanned(B, sizes):
    blocks, left = 0, 0
    for s in sizes:
        assert s <= B, "안 걸치기는 블록보다 큰 레코드를 담을 수 없다"
        if s > left:
            blocks += 1; left = B
        left -= s
    return blocks


if __name__ == "__main__":
    # 카드·예: 블록 1,024바이트, 레코드 100바이트, 레코드 1,000개
    assert fixed(1024, 100, 1000) == (10, 100, 24)
    # 가변 길이 레코드 300, 500, 400, 200, 600, 100 (합 2,100) 블록 1,024
    sizes = [300, 500, 400, 200, 600, 100]
    assert spanned(1024, sizes) == 3                 # 2100 / 1024 올림
    assert unspanned(1024, sizes) == 3               # [300,500] [400,200] [600,100]
    sizes2 = [600, 600, 600]
    assert spanned(1024, sizes2) == 2 and unspanned(1024, sizes2) == 3
    assert fixed(1024, 300, 1)[0] == 3 and fixed(1024, 300, 1)[2] == 124
    print("ALL CHECKS PASSED")
```
{% endraw %}
