---
layout: "note"
title: "15_rods-and-cones_verify.py"
display_title: "15_rods-and-cones_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "4-1학기"
parent_url: "/studies/human-interface-media/rods-and-cones/"
parent_title: "간상체와 추상체"
description: "휴먼 인터페이스 미디어 · 간상체와 추상체 검증 코드"
permalink: "/studies/human-interface-media/code/15_rods-and-cones_verify/"
---
{% raw %}
[간상체와 추상체](/Hongs_Blog/studies/human-interface-media/rods-and-cones/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""간상체와 추상체 검증.

문서: 15.간상체와 추상체 (예시로 보기, 카드 C2)
주장 (슬라이드 수치의 산술):
  1. 간상체 1억 2천만 개, 추상체 600만~700만 개 -> 간상체가 약 17~20배 많다.
     시세포 중 추상체 비율은 약 5%다.
  2. 추상체 종류별 비율 L 64%, M 32%, S 2%의 합은 98%로 100%가 아니다.
  3. 시신경 섬유를 약 100만 개로 보면(보충 수치), 신경절 세포 하나에 평균 약 120개 이상의 시세포 신호가 모인다.
"""
from fractions import Fraction as F


def main() -> None:
    rods = 120_000_000
    for cones in (6_000_000, 7_000_000):
        ratio = F(rods, cones)
        share = F(cones, rods + cones)
        assert 17 <= ratio <= 20 and F(4, 100) < share < F(6, 100)
        print(f"[OK] 추상체 {cones:,}: 간상체/추상체 = {float(ratio):.1f}, 추상체 비율 {float(share):.1%}")

    assert 64 + 32 + 2 == 98
    print("[OK] L+M+S 비율 합 = 98%")

    fibers = 1_000_000
    for cones in (6_000_000, 7_000_000):
        per_fiber = F(rods + cones, fibers)
        assert per_fiber > 120
        print(f"[OK] 시세포 {rods + cones:,} / 섬유 {fibers:,} = 섬유 하나당 {float(per_fiber):.0f}개")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
