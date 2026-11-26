---
layout: "note"
title: "34_color-space_verify.py"
display_title: "34_color-space_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/color-space/"
parent_title: "색 공간"
description: "휴먼 인터페이스 미디어 · 색 공간 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/34_color-space_verify/"
---
{% raw %}
[색 공간](/Hongs_Blog/studies/human-interface-media/color-space/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""색 공간 검증.

문서: 34.색 공간 (예시로 보기, 정의, 자주 하는 오해, 카드 C2)
실행: python3 -I 34_color-space_verify.py  (표준 라이브러리만 쓴다)

반대색 좌표 (설명용 단순화, 19.반대색 과정과 같은 식):
  RG = L - M,  BY = S - (M + L)/2,  밝기 = M + L
주장:
  1. 추상체 반응 S 1.0, M 5.0, L 8.0(17.조건등색의 노랑)은 직교 좌표로 RG = 3.0, BY = -5.5, 밝기 13.0이다.
     극좌표로는 중심에서 거리 약 6.26, 각도 약 -61.4도(= 298.6도)다.
  2. 세 반응이 같으면(예: 5, 5, 5) RG = BY = 0이라 거리가 0이다. 각도(색상)가 정해지지 않는다.
  3. (a, b) = (3, 4)는 거리 5, 각도 약 53.13도다. 거꾸로 바꾸면 (3, 4)로 돌아온다. (2, 90도)는 (0, 2)다(카드 C2).
  4. 직교 좌표는 섞기와 잘 맞는다(평균을 내면 섞은 색). 극좌표 값을 그대로 평균 내면 틀린다:
     (1, 0)과 (-1, 0)을 반반 섞으면 직교 평균은 (0, 0) 회색인데, 극좌표 평균은 거리 1, 각도 90도로
     전혀 다른 색(파랑 쪽)이 나온다.
"""
import math


def opponent(s: float, m: float, l: float) -> tuple[float, float, float]:
    return l - m, s - (m + l) / 2, m + l


def to_polar(a: float, b: float) -> tuple[float, float]:
    """직교 (a, b) -> (거리, 각도[도], 0 이상 360 미만)."""
    r = math.hypot(a, b)
    h = math.degrees(math.atan2(b, a)) % 360
    return r, h


def to_cart(r: float, h: float) -> tuple[float, float]:
    return r * math.cos(math.radians(h)), r * math.sin(math.radians(h))


def main() -> None:
    # 주장 1
    rg, by, br = opponent(1.0, 5.0, 8.0)
    assert (rg, by, br) == (3.0, -5.5, 13.0)
    r, h = to_polar(rg, by)
    assert abs(r - 6.265) < 0.001 and abs(h - 298.61) < 0.01, (r, h)
    assert abs((h - 360) - (-61.39)) < 0.01

    # 주장 2
    rg0, by0, _ = opponent(5.0, 5.0, 5.0)
    assert rg0 == 0 and by0 == 0 and to_polar(rg0, by0)[0] == 0

    # 주장 3
    r3, h3 = to_polar(3, 4)
    assert abs(r3 - 5) < 1e-12 and abs(h3 - 53.130) < 0.001
    a, b = to_cart(r3, h3)
    assert abs(a - 3) < 1e-12 and abs(b - 4) < 1e-12
    # 카드 C2: (2, 90도) -> (0, 2), 흔한 오답 atan(3/4) = 36.87도
    a2, b2 = to_cart(2, 90)
    assert abs(a2) < 1e-12 and abs(b2 - 2) < 1e-12
    assert abs(math.degrees(math.atan(3 / 4)) - 36.87) < 0.01

    # 주장 4
    p, q = (1.0, 0.0), (-1.0, 0.0)
    cart_mix = ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
    assert cart_mix == (0.0, 0.0)
    (rp, hp), (rq, hq) = to_polar(*p), to_polar(*q)
    polar_avg = ((rp + rq) / 2, (hp + hq) / 2)
    assert polar_avg == (1.0, 90.0)
    wrong = to_cart(*polar_avg)
    assert abs(wrong[0]) < 1e-12 and abs(wrong[1] - 1) < 1e-12   # 회색이 아니라 BY + 쪽(파랑)

    print(f"노랑: RG {rg}, BY {by}, 밝기 {br} -> 거리 {r:.3f}, 각도 {h:.2f}도")
    print(f"(3, 4) -> 거리 {r3:.0f}, 각도 {h3:.2f}도. 극좌표 평균의 잘못된 섞기 -> {tuple(round(v, 6) for v in wrong)}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
