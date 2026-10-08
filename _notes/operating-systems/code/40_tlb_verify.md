---
layout: "note"
title: "40_tlb_verify.py"
display_title: "40_tlb_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "40"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/tlb/"
parent_title: "TLB"
description: "운영체제 · TLB 검증 코드"
permalink: "/studies/operating-systems/code/40_tlb_verify/"
---
{% raw %}
[TLB](/Hongs_Blog/studies/operating-systems/tlb/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""TLB가 있을 때의 평균 메모리 접근 시간(유효 접근 시간).
TLB 적중: TLB 검사 + 메모리 1번, 실패: TLB 검사 + 페이지 표 1번 + 메모리 1번 (1단계 표, 페이지 부재 없음)."""


def eat(hit, tlb, mem):
    return hit * (tlb + mem) + (1 - hit) * (tlb + 2 * mem)


if __name__ == "__main__":
    assert abs(eat(0.0, 0, 100) - 200) < 1e-9          # TLB 없으면 두 배
    assert abs(eat(0.98, 20, 100) - 122) < 1e-9        # 본문 예
    assert abs(eat(0.80, 20, 100) - 140) < 1e-9        # 카드 C2
    # 적중률을 99%로 올리면
    assert abs(eat(0.99, 20, 100) - 121) < 1e-9
    print("ALL CHECKS PASSED")
```
{% endraw %}
