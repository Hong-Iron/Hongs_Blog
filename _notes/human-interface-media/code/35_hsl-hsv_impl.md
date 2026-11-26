---
layout: "note"
title: "35_hsl-hsv_impl.py"
display_title: "35_hsl-hsv_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "35"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/hsl-hsv/"
parent_title: "HSL과 HSV"
description: "휴먼 인터페이스 미디어 · HSL과 HSV 구현 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/35_hsl-hsv_impl/"
---
{% raw %}
[HSL과 HSV](/Hongs_Blog/studies/human-interface-media/hsl-hsv/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""HSL과 HSV 구현과 자체 테스트.

문서: 35.HSL과 HSV (정의의 변환식, 예시로 보기, 자주 하는 오해, 카드 C2·C3)
실행: python3 -I 35_hsl-hsv_impl.py  (표준 라이브러리만 쓴다)

입력 R, G, B는 0~1 실수. 색상 H는 도(0 이상 360 미만), 나머지는 0~1.
  M = max(R, G, B), m = min(R, G, B), C = M - m (크로마)
  H: C = 0이면 정하지 않음(여기서는 0). M = R이면 60 x ((G - B)/C mod 6),
     M = G이면 60 x ((B - R)/C + 2), M = B이면 60 x ((R - G)/C + 4)
  HSV: V = M, S_V = C / V (V = 0이면 0)
  HSL: L = (M + m)/2, S_L = C / (1 - |2L - 1|) (L = 0 또는 1이면 0)
검증: 파이썬 표준 라이브러리 colorsys(rgb_to_hsv, rgb_to_hls)와 0~1을 10등분한 격자 11^3 = 1331색에서 비교한다.
  colorsys는 색상을 0~1로 주므로 360을 곱해 비교하고, rgb_to_hls는 (H, L, S) 순서로 준다.
"""
import colorsys
import itertools


def hue(r: float, g: float, b: float) -> float:
    mx, mn = max(r, g, b), min(r, g, b)
    c = mx - mn
    if c == 0:
        return 0.0
    if mx == r:
        hp = ((g - b) / c) % 6
    elif mx == g:
        hp = (b - r) / c + 2
    else:
        hp = (r - g) / c + 4
    return 60.0 * hp


def rgb_to_hsv(r: float, g: float, b: float) -> tuple[float, float, float]:
    mx, mn = max(r, g, b), min(r, g, b)
    c = mx - mn
    v = mx
    s = 0.0 if v == 0 else c / v
    return hue(r, g, b), s, v


def rgb_to_hsl(r: float, g: float, b: float) -> tuple[float, float, float]:
    mx, mn = max(r, g, b), min(r, g, b)
    c = mx - mn
    l = (mx + mn) / 2
    s = 0.0 if l in (0.0, 1.0) else c / (1 - abs(2 * l - 1))
    return hue(r, g, b), s, l


def hsv_to_rgb(h: float, s: float, v: float) -> tuple[float, float, float]:
    """거꾸로: 크로마 C = V x S를 색상 육각형 위에 놓고, 모자란 만큼 m = V - C를 더한다."""
    c = v * s
    hp = (h % 360) / 60
    x = c * (1 - abs(hp % 2 - 1))
    r1, g1, b1 = [(c, x, 0), (x, c, 0), (0, c, x), (0, x, c), (x, 0, c), (c, 0, x)][int(hp) % 6]
    m = v - c
    return r1 + m, g1 + m, b1 + m


def close(a: float, b: float, tol: float = 1e-9) -> bool:
    return abs(a - b) < tol


def hue_close(a: float, b: float) -> bool:
    d = abs(a - b) % 360
    return min(d, 360 - d) < 1e-6


def main() -> None:
    # 1. colorsys와 격자 전체에서 같다
    grid = [i / 10 for i in range(11)]
    n = 0
    for r, g, b in itertools.product(grid, repeat=3):
        h, s, v = rgb_to_hsv(r, g, b)
        ch, cs, cv = colorsys.rgb_to_hsv(r, g, b)
        assert close(s, cs) and close(v, cv), (r, g, b)
        if s > 0:
            assert hue_close(h, ch * 360), (r, g, b, h, ch)
        h2, s2, l2 = rgb_to_hsl(r, g, b)
        lh, ll, ls = colorsys.rgb_to_hls(r, g, b)
        assert close(l2, ll) and close(s2, ls), (r, g, b, s2, ls)
        if s2 > 0:
            assert hue_close(h2, lh * 360)
        # 거꾸로 바꾸면 원래 색
        back = hsv_to_rgb(h, s, v)
        assert all(close(x, y) for x, y in zip(back, (r, g, b))), (r, g, b, back)
        # 원뿔 모양: 크로마는 V를 넘지 못하고(원뿔 하나), 1 - |2L - 1|을 넘지 못한다(원뿔 둘)
        c = max(r, g, b) - min(r, g, b)
        assert c <= v + 1e-12 and c <= 1 - abs(2 * l2 - 1) + 1e-12
        n += 1
    assert n == 1331

    # 2. 문서의 예시
    assert all(close(x, y) for x, y in zip(rgb_to_hsv(0.8, 0.4, 0.2), (20, 0.75, 0.8)))
    assert all(close(x, y) for x, y in zip(rgb_to_hsl(0.8, 0.4, 0.2), (20, 0.6, 0.5)))
    # 같은 주황을 HSV 채도만 절반(0.375)으로: RGB (0.8, 0.6, 0.5)
    assert all(close(x, y) for x, y in zip(hsv_to_rgb(20, 0.375, 0.8), (0.8, 0.6, 0.5)))
    # 연분홍: HSV 채도 0.2, HSL 채도 1
    assert all(close(x, y) for x, y in zip(rgb_to_hsv(1.0, 0.8, 0.8), (0, 0.2, 1.0)))
    assert all(close(x, y) for x, y in zip(rgb_to_hsl(1.0, 0.8, 0.8), (0, 1.0, 0.9)))
    # 순수한 빨강, 흰색, 검정
    assert rgb_to_hsv(1, 0, 0) == (0.0, 1.0, 1) and rgb_to_hsl(1, 0, 0) == (0.0, 1.0, 0.5)
    assert rgb_to_hsv(1, 1, 1) == (0.0, 0.0, 1) and rgb_to_hsl(1, 1, 1) == (0.0, 0.0, 1.0)
    assert rgb_to_hsv(0, 0, 0)[2] == 0 and rgb_to_hsl(0, 0, 0)[2] == 0

    # 3. 카드 C2: (0.2, 0.6, 1.0)
    h, s, v = rgb_to_hsv(0.2, 0.6, 1.0)
    assert close(h, 210) and close(s, 0.8) and close(v, 1.0)
    h, s, l = rgb_to_hsl(0.2, 0.6, 1.0)
    assert close(h, 210) and close(s, 1.0) and close(l, 0.6)

    # 4. 오해: V가 같은 노랑과 파랑의 휘도 (sRGB/BT.709 선형 값 기준 계수)
    lum = lambda r, g, b: 0.2126 * r + 0.7152 * g + 0.0722 * b
    assert rgb_to_hsv(1, 1, 0)[2] == rgb_to_hsv(0, 0, 1)[2] == 1
    assert close(lum(1, 1, 0), 0.9278) and close(lum(0, 0, 1), 0.0722)
    assert 12.8 < lum(1, 1, 0) / lum(0, 0, 1) < 12.9

    print("colorsys와 1331색 일치. (0.8, 0.4, 0.2) -> HSV (20, 0.75, 0.8), HSL (20, 0.6, 0.5)")
    print("연분홍 (1, 0.8, 0.8) -> HSV 채도 0.2, HSL 채도 1.0. 노랑/파랑 휘도 비",
          round(lum(1, 1, 0) / lum(0, 0, 1), 2))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
