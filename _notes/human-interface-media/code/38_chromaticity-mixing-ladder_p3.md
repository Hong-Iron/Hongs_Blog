---
layout: "note"
title: "38_chromaticity-mixing-ladder_p3.py"
display_title: "38_chromaticity-mixing-ladder_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "38"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/chromaticity-mixing-ladder/"
parent_title: "색도도 혼합 예제 사다리"
description: "휴먼 인터페이스 미디어 · 색도도 혼합 예제 사다리 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p3/"
---
{% raw %}
[색도도 혼합 예제 사다리](/Hongs_Blog/studies/human-interface-media/chromaticity-mixing-ladder/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""색도도 혼합 예제 사다리, 문제 3.

실행: python3 -I 38_chromaticity-mixing-ladder_p3.py  (표준 라이브러리만 쓴다)
문제 3: sRGB 원색 R(0.64, 0.33), G(0.30, 0.60), B(0.15, 0.06)로 흰색 D65 (0.3127, 0.3290)를 만드는 비율.
  답: 몫 ≈ 0.2120 : 0.3922 : 0.3959, 휘도 비 ≈ 0.2126 : 0.7152 : 0.0722.
  (휘도 비는 sRGB·BT.709의 밝기 가중치와 같다.)
"""


def bary(P, W):
    (x1, y1), (x2, y2), (x3, y3) = P
    x, y = W
    det = (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)
    a = ((x - x3) * (y2 - y3) - (x2 - x3) * (y - y3)) / det
    b = ((x1 - x3) * (y - y3) - (x - x3) * (y1 - y3)) / det
    return a, b, 1 - a - b


def main():
    R, G, B = (0.64, 0.33), (0.30, 0.60), (0.15, 0.06)
    W = (0.3127, 0.3290)
    lam = bary([R, G, B], W)
    assert all(abs(u - v) < 5e-5 for u, v in zip(lam, (0.2120, 0.3922, 0.3959))), lam
    assert min(lam) > 0
    # 손 풀이 중간 식: 0.49a + 0.15b = 0.1627, 0.27a + 0.54b = 0.2690
    a, b, _ = lam
    assert abs(0.49 * a + 0.15 * b - 0.1627) < 1e-12 and abs(0.27 * a + 0.54 * b - 0.2690) < 1e-12
    lum = [l * P[1] for l, P in zip(lam, (R, G, B))]
    assert all(abs(u - v) < 5e-5 for u, v in zip(lum, (0.0700, 0.2353, 0.0238))), lum
    share = [v / sum(lum) for v in lum]
    assert all(abs(u - v) < 1e-4 for u, v in zip(share, (0.2126, 0.7152, 0.0722))), share
    assert abs(sum(lum) - W[1]) < 1e-12
    print(f"[OK] 문제 3: 몫 {[round(v, 4) for v in lam]}, 휘도 비 {[round(v, 4) for v in share]}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
