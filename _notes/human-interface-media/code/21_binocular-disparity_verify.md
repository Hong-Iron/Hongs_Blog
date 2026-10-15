---
layout: "note"
title: "21_binocular-disparity_verify.py"
display_title: "21_binocular-disparity_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/binocular-disparity/"
parent_title: "양안 시차"
description: "휴먼 인터페이스 미디어 · 양안 시차 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/21_binocular-disparity_verify/"
---
{% raw %}
[양안 시차](/Hongs_Blog/studies/human-interface-media/binocular-disparity/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""양안 시차 검증.

문서: 21.양안 시차 (예시로 보기, 두 눈과 시야, 카드 C2·C3)
주장:
  1. 문서 표의 네 예: 전체 시야 = 왼눈 + 오른눈 - 겹친 양안 시야, 사각 = 360 - 전체 시야.
     사람: 한 눈을 145로 두면 145 + 145 - 120 = 170이라 사각이 190이 되어 "사각 약 170"과 맞지 않는다.
     한 눈을 155로 두면 155 + 155 - 120 = 190, 사각 170으로 맞는다.
     둘째 예: 200 + 200 - 120 = 280, 사각 80.
     셋째 예(토끼 모양): 190 + 190 - 9 - 10 = 361, 약 360이라 사각 없음.
     넷째 예: 210 + 210 - 65 = 355, 사각 5.
  2. 두 눈 사이 거리 B = 6.5 cm(보충 가정)일 때, 거리 d에 있는 점을 두 눈이 보는 방향의 각도 차는
     2 atan(B / 2d)이다. 30 cm 손가락과 3 m 물체의 차(시차)는 약 11.1도, 10 m와 11 m의 차는 약 0.034도다.
     시차는 거리가 멀수록 1/d에 비례해 빠르게 줄어든다.
"""
import math


def field(left: float, right: float, overlaps: float) -> tuple[float, float]:
    total = left + right - overlaps
    return total, 360 - total


def vergence_deg(b: float, d: float) -> float:
    return math.degrees(2 * math.atan(b / (2 * d)))


def main() -> None:
    total, blind = field(145, 145, 120)
    assert (total, blind) == (170, 190)
    print(f"[OK] 사람, 한 눈 145로 두면: 전체 {total}, 사각 {blind} (사각 약 170과 불일치)")
    total, blind = field(155, 155, 120)
    assert (total, blind) == (190, 170)
    print(f"[OK] 사람, 한 눈 155로 두면: 전체 {total}, 사각 {blind}")
    assert field(200, 200, 120) == (280, 80)
    print("[OK] 둘째 예: 전체 280, 사각 80")
    total, blind = field(190, 190, 9 + 10)
    assert total == 361 and blind == -1
    print("[OK] 셋째 예: 전체 361 (약 360, 사각 없음)")
    assert field(210, 210, 65) == (355, 5)
    print("[OK] 넷째 예: 전체 355, 사각 5")

    b = 0.065
    near = vergence_deg(b, 0.3) - vergence_deg(b, 3.0)
    far = vergence_deg(b, 10.0) - vergence_deg(b, 11.0)
    assert abs(near - 11.1) < 0.1, near
    assert abs(far - 0.034) < 0.001, far
    print(f"[OK] 시차: 0.3 m 대 3 m {near:.2f}도, 10 m 대 11 m {far:.3f}도")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
