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
track: "4-1학기"
parent_url: "/studies/human-interface-media/binocular-disparity/"
parent_title: "양안 시차"
description: "휴먼 인터페이스 미디어 · 양안 시차 검증 코드"
permalink: "/studies/human-interface-media/code/21_binocular-disparity_verify/"
---
{% raw %}
[양안 시차](/Hongs_Blog/studies/human-interface-media/binocular-disparity/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""양안 시차 검증.

문서: 21.양안 시차 (예시로 보기, 원본 오류 의심, 카드 C2·C3)
주장:
  1. 시야 그림(강의 3 p.15)의 숫자: 전체 시야 = 왼눈 + 오른눈 - 겹친 양안 시야, 사각 = 360 - 전체 시야.
     사람 그림: 145 + 145 - 120 = 170. 사각은 190이어야 하는데 그림은 "사각 약 170"이라 적었다.
     둘째 그림: 200 + 200 - 120 = 280, 사각 80 (그림과 일치).
     셋째 그림(토끼 모양): 190 + 190 - 9 - 10 = 361, 약 360이라 사각 없음 (그림과 일치).
     넷째 그림: 210 + 210 - 65 = 355, 사각 5 (그림은 약 3. "약"의 반올림 범위).
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
    print(f"[OK] 사람: 전체 {total}, 사각 {blind} (그림 표기 170과 불일치)")
    assert field(200, 200, 120) == (280, 80)
    print("[OK] 둘째 그림: 전체 280, 사각 80")
    total, blind = field(190, 190, 9 + 10)
    assert total == 361 and blind == -1
    print("[OK] 셋째 그림: 전체 361 (약 360, 사각 없음)")
    assert field(210, 210, 65) == (355, 5)
    print("[OK] 넷째 그림: 전체 355, 사각 5 (그림 약 3)")

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
