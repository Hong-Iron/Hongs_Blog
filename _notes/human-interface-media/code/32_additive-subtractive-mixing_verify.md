---
layout: "note"
title: "32_additive-subtractive-mixing_verify.py"
display_title: "32_additive-subtractive-mixing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "32"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/additive-subtractive-mixing/"
parent_title: "가법 혼색과 감법 혼색"
description: "휴먼 인터페이스 미디어 · 가법 혼색과 감법 혼색 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/32_additive-subtractive-mixing_verify/"
---
{% raw %}
[가법 혼색과 감법 혼색](/Hongs_Blog/studies/human-interface-media/additive-subtractive-mixing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""가법 혼색과 감법 혼색 검증.

문서: 32.가법 혼색과 감법 혼색 (예시로 보기, 정의, 자주 하는 오해, 카드 C2·C3)
실행: python3 -I 32_additive-subtractive-mixing_verify.py  (표준 라이브러리만 쓴다)

추상체 모형 (설명용 가정, 16.삼색 이론과 같음): 민감도를 봉우리 1인 가우스 곡선으로 둔다.
  봉우리 S 445, M 535, L 575 nm. 폭(표준편차) S 30, M·L 45 nm.
  스펙트럼은 400~700 nm를 5 nm 간격(61점)으로 적는다. 반응 = 합(스펙트럼 x 민감도) x 5 nm.
주장:
  1. 이상적인 잉크에서 CMY = 1 - RGB. 청록 + 노랑 잉크 = 초록, 세 잉크 = 검정. 빛은 R + G = 노랑, R + G + B = 흰색.
     카드 C2: 주황 (1, 0.5, 0)은 CMY (0, 0.5, 1), 여기에 청록 잉크를 겹치면 (0, 0.5, 0)이 남는다.
  2. 빛을 섞으면 스펙트럼이 더해지고, 추상체 반응도 정확히 더해진다(선형).
  3. 파란 물감과 노란 물감을 섞으면(반사율의 곱) 가운데 파장만 남고 M 반응이 가장 커진다(초록).
  4. 물감 섞기는 세 반응값끼리 곱해서는 맞힐 수 없다. 흰 종이 대비 반응 비율을 곱하면 M이 약 0.28,
     스펙트럼을 곱해 계산하면 약 0.21이다.
  5. 파란 빛(짧은 파장)과 노란 빛(중간+긴 파장)을 더하면 세 반응 비율이 흰빛(같은 에너지)에 가까워진다.
"""
import math

PEAK = {"S": 445.0, "M": 535.0, "L": 575.0}
WIDTH = {"S": 30.0, "M": 45.0, "L": 45.0}
LAM = [400 + 5 * i for i in range(61)]


def sens(cone: str, lam: float) -> float:
    return math.exp(-((lam - PEAK[cone]) ** 2) / (2 * WIDTH[cone] ** 2))


def response(spec: list[float]) -> list[float]:
    """같은 에너지 조명 아래에서 스펙트럼(또는 반사율) spec이 만드는 S, M, L 반응."""
    return [sum(spec[i] * sens(k, lam) for i, lam in enumerate(LAM)) * 5.0 for k in "SML"]


def logistic(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-x))


# 설명용 물감 반사율 (문서 그림과 같은 식)
BLUE_PAINT = [0.05 + 0.85 * logistic((520 - lam) / 12) for lam in LAM]     # 짧은 파장과 중간 파장 일부를 되쏜다
YELLOW_PAINT = [0.05 + 0.85 * logistic((lam - 490) / 12) for lam in LAM]   # 중간 파장과 긴 파장을 되쏜다
# 설명용 빛 스펙트럼
BLUE_LIGHT = [math.exp(-0.5 * ((lam - 450) / 20) ** 2) for lam in LAM]     # 짧은 파장
YELLOW_LIGHT = [math.exp(-0.5 * ((lam - 580) / 30) ** 2) for lam in LAM]   # 중간 + 긴 파장


def cmy_from_rgb(rgb: tuple[float, float, float]) -> tuple[float, ...]:
    return tuple(1.0 - v for v in rgb)


def main() -> None:
    # 주장 1: 이상적인 잉크와 빛 (0~1 값)
    assert cmy_from_rgb((1, 0, 0)) == (0, 1, 1)            # 빨강 = 자홍 + 노랑 잉크
    cyan_ink_reflect = (0, 1, 1)                           # 청록 잉크는 R을 먹고 G, B를 되쏜다
    yellow_ink_reflect = (1, 1, 0)                         # 노랑 잉크는 B를 먹는다
    magenta_ink_reflect = (1, 0, 1)
    mix_cy = tuple(a * b for a, b in zip(cyan_ink_reflect, yellow_ink_reflect))
    assert mix_cy == (0, 1, 0)                             # 초록
    mix_all = tuple(a * b * c for a, b, c in zip(cyan_ink_reflect, yellow_ink_reflect, magenta_ink_reflect))
    assert mix_all == (0, 0, 0)                            # 검정
    light_rg = tuple(min(1, a + b) for a, b in zip((1, 0, 0), (0, 1, 0)))
    assert light_rg == (1, 1, 0)                           # 노랑
    light_all = tuple(min(1, a + b + c) for a, b, c in zip((1, 0, 0), (0, 1, 0), (0, 0, 1)))
    assert light_all == (1, 1, 1)                          # 흰색
    # 카드 C2: 주황 (1, 0.5, 0) -> CMY (0, 0.5, 1). 청록 잉크를 겹치면 (0, 0.5, 0)
    assert cmy_from_rgb((1, 0.5, 0)) == (0, 0.5, 1)
    assert tuple(a * b for a, b in zip((1, 0.5, 0), cyan_ink_reflect)) == (0, 0.5, 0)

    # 주장 2: 빛의 덧셈은 반응의 덧셈
    added = [a + b for a, b in zip(BLUE_LIGHT, YELLOW_LIGHT)]
    rb, ry, ra = response(BLUE_LIGHT), response(YELLOW_LIGHT), response(added)
    assert all(abs(rb[i] + ry[i] - ra[i]) < 1e-9 for i in range(3))

    # 주장 3: 물감 섞기 = 반사율의 곱. 가운데 파장만 남아 M이 가장 크다
    mixed = [a * b for a, b in zip(BLUE_PAINT, YELLOW_PAINT)]
    peak_lam = LAM[max(range(61), key=lambda i: mixed[i])]
    assert 495 <= peak_lam <= 515, peak_lam
    rm = response(mixed)
    assert rm[1] > rm[0] and rm[1] > rm[2], rm

    # 주장 4: 흰 종이(반사율 1) 대비 비율끼리 곱하면 틀린다
    white = response([1.0] * 61)
    bn = [a / w for a, w in zip(response(BLUE_PAINT), white)]
    yn = [a / w for a, w in zip(response(YELLOW_PAINT), white)]
    mn = [a / w for a, w in zip(rm, white)]
    prod = [a * b for a, b in zip(bn, yn)]
    assert abs(mn[1] - 0.210) < 0.005 and abs(prod[1] - 0.278) < 0.005, (mn, prod)
    assert abs(mn[0] - 0.123) < 0.005 and abs(mn[2] - 0.120) < 0.005, mn

    # 주장 5: 파란 빛 + 노란 빛의 반응 비율은 흰빛과 가깝다
    ratio = [v / sum(ra) for v in ra]
    wratio = [v / sum(white) for v in white]
    assert all(abs(a - b) < 0.05 for a, b in zip(ratio, wratio)), (ratio, wratio)
    # 파란 빛 하나는 S가, 노란 빛 하나는 L이 가장 크다
    assert rb[0] == max(rb) and ry[2] == max(ry)

    print("섞은 물감 반사율 봉우리", peak_lam, "nm, 흰 종이 대비 반응 S M L =",
          [round(v, 3) for v in mn], " 비율끼리 곱 =", [round(v, 3) for v in prod])
    print("파란 빛 + 노란 빛 반응 비율", [round(v, 2) for v in ratio], " 흰빛", [round(v, 2) for v in wratio])
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
